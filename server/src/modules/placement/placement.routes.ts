import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { PrismaClient } from '../../db.js';
import type { GradeBand } from '../../generated/prisma/enums.js';
import { Errors } from '../../lib/errors.js';
import { gradeBandOf } from '../../lib/grade-band.js';
import { firstTryCorrectCount } from '../../lib/journey.js';
import { measureText } from '../../lib/readability.js';
import { readingMetricValues } from '../../lib/reading-metrics.js';
import { withApiLevel } from '../../lib/reading-level.js';
import { toApiTheme } from '../../lib/text-theme.js';
import { parse } from '../../lib/validation.js';
import { requireAuth } from '../../plugins/auth.js';
import { answerSchema, readingSessionIdSchema } from '../journey/lessons.routes.js';
import { writeReadingMetric } from '../progress/reading-metrics.js';

const completeSchema = z.object({
  readingSessionIds: z
    .array(readingSessionIdSchema, { error: 'Okuma kayıtları eksik.' })
    .min(1, { error: 'Okuma kayıtları eksik.' })
    .max(10),
});

/** İstemciye dönen başlangıç ölçümü (GET /me/metrics `baseline` ile aynı şekil). */
export type ApiBaseline = {
  gradeBand: GradeBand;
  wordsPerMinute: number;
  comprehension: number;
  /** ISO zaman */
  measuredAt: string;
};

const baselineSelect = {
  gradeBand: true,
  wordsPerMinute: true,
  comprehension: true,
  measuredAt: true,
} as const;

function toApiBaseline(row: {
  gradeBand: GradeBand;
  wordsPerMinute: number;
  comprehension: number;
  measuredAt: Date;
}): ApiBaseline {
  return { ...row, measuredAt: row.measuredAt.toISOString() };
}

/** Kullanıcının en son seviye belirleme sonucu; hiç yapmadıysa `null`. */
export async function latestBaseline(
  prisma: PrismaClient,
  userId: string,
): Promise<ApiBaseline | null> {
  const row = await prisma.userBaseline.findFirst({
    where: { userId },
    orderBy: { measuredAt: 'desc' },
    select: baselineSelect,
  });
  return row ? toApiBaseline(row) : null;
}

/**
 * Seviye belirleme gerekli mi: kullanıcının hiç sonucu yoksa ve grubunun metinleri varsa. Uygulama
 * bunu bir kez sorar; çocuk "Sonra yapalım" diyebilir, yolculuk hiçbir zaman beklemez.
 */
export async function needsPlacement(prisma: PrismaClient, userId: string, grade: number) {
  const [baselines, texts] = await Promise.all([
    prisma.userBaseline.count({ where: { userId } }),
    prisma.placementText.count({ where: { gradeBand: gradeBandOf(grade) } }),
  ]);
  return baselines === 0 && texts > 0;
}

/** Grubun seviye belirleme metinlerinin kimlikleri, okuma sırasıyla. */
async function placementTextIds(prisma: PrismaClient, gradeBand: GradeBand) {
  const rows = await prisma.placementText.findMany({
    where: { gradeBand },
    orderBy: { position: 'asc' },
    select: { textId: true },
  });
  return rows.map((row) => row.textId);
}

export async function placementRoutes(app: FastifyInstance) {
  const { prisma } = app;

  app.addHook('preHandler', app.authenticate);

  /**
   * "Pırıl seni tanımak istiyor!": kullanıcının sınıf grubundaki 2 kısa metin, okuma sırasıyla,
   * soruları ile (cevapsız). Metin şekli GET /lessons/:id `text` alanıyla aynıdır.
   */
  app.get('/placement', async (request) => {
    const { user } = requireAuth(request);
    const gradeBand = gradeBandOf(user.grade);
    const rows = await prisma.placementText.findMany({
      where: { gradeBand },
      orderBy: { position: 'asc' },
      select: {
        text: {
          select: {
            id: true,
            title: true,
            level: true,
            estimatedMinutes: true,
            theme: true,
            paragraphs: true,
            questions: {
              select: { id: true, position: true, prompt: true, options: true },
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });
    return {
      gradeBand,
      texts: rows.map(({ text: { questions, ...text } }) => ({
        text: withApiLevel({ ...text, theme: toApiTheme(text.theme), gradeBand }),
        questions,
      })),
    };
  });

  /**
   * Bir şıkka dokunuş (POST /lessons/:id/answers ile aynı gövde ve yanıt). Okuma kullanıcının ve
   * grubunun seviye belirleme metnine ait olmalı. Lokum verilmez.
   */
  app.post('/placement/answers', async (request) => {
    const { user } = requireAuth(request);
    const input = parse(answerSchema, request.body);
    const textIds = await placementTextIds(prisma, gradeBandOf(user.grade));

    const session = await prisma.readingSession.findFirst({
      where: { id: input.readingSessionId, userId: user.id },
      select: { textId: true },
    });
    if (!session) throw Errors.notFound('Bu okuma kaydını bulamadık.');
    if (!textIds.includes(session.textId)) {
      throw Errors.validation({ readingSessionId: 'Bu okuma seviye belirlemeye ait değil.' });
    }
    const question = await prisma.question.findFirst({
      where: { id: input.questionId, textId: session.textId },
      select: { id: true, correctIndex: true, hint: true, explanation: true, options: true },
    });
    if (!question) throw Errors.validation({ questionId: 'Bu soru bu metne ait değil.' });
    if (input.choiceIndex >= question.options.length) {
      throw Errors.validation({ choiceIndex: 'Bir şık seç.' });
    }

    const correct = input.choiceIndex === question.correctIndex;
    await prisma.questionAttempt.create({
      data: {
        userId: user.id,
        questionId: question.id,
        readingSessionId: input.readingSessionId,
        choiceIndex: input.choiceIndex,
        correct,
      },
    });
    return correct
      ? { correct, explanation: question.explanation, lokum: 0 }
      : { correct, hint: question.hint, lokum: 0 };
  });

  /**
   * Seviye belirlemeyi bitirir: grubun her metni için biten bir okuma ve her sorusuna bu okumada
   * verilmiş bir cevap gerekir. Hız iki metnin toplam kelimesi / toplam süresi, anlama ilk
   * denemede doğru / soru sayısıdır. Her okumanın reading_metrics satırı sorularla yeniden yazılır;
   * user_baselines'a yeni bir satır eklenir (tekrar yapılabilir, geçmiş kalır). Yanıtı kaybolan
   * istek yeniden gelirse aynı sonuç döner, ikinci satır yazılmaz.
   */
  app.post('/placement/complete', async (request) => {
    const { user } = requireAuth(request);
    const input = parse(completeSchema, request.body);
    const gradeBand = gradeBandOf(user.grade);
    const textIds = await placementTextIds(prisma, gradeBand);
    if (textIds.length === 0) throw Errors.notFound('Seviye belirleme metinleri bulunamadı.');

    const sessions = await prisma.readingSession.findMany({
      where: { id: { in: input.readingSessionIds }, userId: user.id },
      select: {
        id: true,
        textId: true,
        completed: true,
        endedAt: true,
        durationSeconds: true,
        text: {
          select: { wordCount: true, paragraphs: true, questions: { select: { id: true } } },
        },
        questionAttempts: {
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          select: { questionId: true, correct: true },
        },
      },
    });
    // Her metin için tam bir okuma: eksik, fazla ya da aynı metnin iki okuması kabul edilmez.
    const readTexts = sessions.map((session) => session.textId);
    if (
      sessions.length !== input.readingSessionIds.length ||
      readTexts.length !== textIds.length ||
      textIds.some((id) => !readTexts.includes(id))
    ) {
      throw Errors.validation({
        readingSessionIds: 'Seviye belirlemenin iki metni de okunmalı.',
      });
    }
    if (sessions.some((session) => !session.completed)) throw Errors.readingNotFinished();
    for (const session of sessions) {
      const answered = new Set(session.questionAttempts.map((attempt) => attempt.questionId));
      if (session.text.questions.some((question) => !answered.has(question.id))) {
        throw Errors.questionsNotAnswered();
      }
    }

    // Yeni bir seviye belirleme yeni okumalarla yapılır; okumalardan sonra yazılmış bir sonuç
    // varsa bu istek onun tekrarıdır.
    const lastEnded = Math.max(...sessions.map((session) => session.endedAt?.getTime() ?? 0));
    const existing = await prisma.userBaseline.findFirst({
      where: { userId: user.id, measuredAt: { gte: new Date(lastEnded) } },
      orderBy: { measuredAt: 'desc' },
      select: baselineSelect,
    });
    if (existing) return { baseline: toApiBaseline(existing) };

    let words = 0;
    let seconds = 0;
    let questions = 0;
    let firstTryCorrect = 0;
    for (const session of sessions) {
      const sessionCorrect = firstTryCorrectCount(session.questionAttempts);
      await writeReadingMetric(prisma, {
        readingSessionId: session.id,
        gradeBand,
        questions: { total: session.text.questions.length, firstTryCorrect: sessionCorrect },
        onlyIfMissing: false,
      });
      words += session.text.wordCount ?? measureText(session.text.paragraphs).wordCount;
      seconds += session.durationSeconds;
      questions += session.text.questions.length;
      firstTryCorrect += sessionCorrect;
    }

    // Hız ve anlama, okuma ölçümüyle aynı kuralla (yuvarlama dahil) hesaplanır.
    const values = readingMetricValues({
      gradeBand,
      wordCount: words,
      durationSeconds: seconds,
      questions: { total: questions, firstTryCorrect },
    });
    if (values.wordsPerMinute === null || values.comprehension === null) {
      throw Errors.validation({ readingSessionIds: 'Okuma süresi kaydedilemedi.' });
    }
    const baseline = await prisma.userBaseline.create({
      data: {
        userId: user.id,
        grade: user.grade,
        gradeBand,
        wordsPerMinute: values.wordsPerMinute,
        comprehension: values.comprehension,
      },
      select: baselineSelect,
    });
    return { baseline: toApiBaseline(baseline) };
  });
}
