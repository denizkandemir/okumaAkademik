import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { PrismaClient } from '../../db.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { ContentStatus, LokumReason, type GradeBand } from '../../generated/prisma/enums.js';
import { Errors } from '../../lib/errors.js';
import { gradeBandOf } from '../../lib/grade-band.js';
import { exerciseLokum, firstTryCorrectCount, streakFrom } from '../../lib/journey.js';
import { measureText } from '../../lib/readability.js';
import { toApiTheme } from '../../lib/text-theme.js';
import { dayNumberInTimeZone, startOfDayInTimeZone } from '../../lib/time.js';
import { parse } from '../../lib/validation.js';
import { requireAuth } from '../../plugins/auth.js';
import {
  loadJourneyState,
  loadReadingDates,
  lockedTextIds,
  lokumBalance,
} from '../journey/journey-state.js';
import { DURATION_SLACK_SECONDS, MAX_DURATION_SECONDS } from '../progress/progress.routes.js';
import { pickTraining, seedFrom, type TrainingCandidate } from './training-picker.js';
import { EXERCISE_MODULES, PLAYABLE_TYPES, exerciseModule } from './types/index.js';

type Db = PrismaClient | Prisma.TransactionClient;

const itemParamsSchema = z.object({ itemId: z.string().min(1).max(100) });
const sessionParamsSchema = z.object({ id: z.string().min(1).max(100) });

const answerSchema = z.object({
  questionId: z.string({ error: 'Soru seçilmedi.' }).min(1, { error: 'Soru seçilmedi.' }).max(100),
  choiceIndex: z
    .number({ error: 'Bir şık seç.' })
    .int({ error: 'Bir şık seç.' })
    .min(0, { error: 'Bir şık seç.' })
    .max(3, { error: 'Bir şık seç.' }),
});

// Süre üstten reddedilmez, kırpılır (okuma oturumlarıyla aynı kural).
const finishSchema = z.object({
  durationSeconds: z.number().int().min(0),
  result: z.unknown(),
});

/** `details.answers`: şıkka her dokunuş, zaman sırasıyla. */
const answersSchema = z
  .array(z.object({ questionId: z.string(), choiceIndex: z.number(), correct: z.boolean() }))
  .catch([]);

type StoredAnswer = z.infer<typeof answersSchema>[number];

function detailsOf(value: Prisma.JsonValue): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function answersOf(details: Record<string, unknown>): StoredAnswer[] {
  return answersSchema.parse(details.answers ?? []);
}

/** Metnin kelime sayısı (seed'de hesaplanmamışsa burada). */
function wordCountOf(text: { wordCount: number | null; paragraphs: string[] } | null): number {
  if (!text) return 0;
  return text.wordCount ?? measureText(text.paragraphs).wordCount;
}

/** Örneğin sorulacak soruları (cevapsız), sırasıyla. */
async function questionsFor(db: Db, textId: string | null, positions: number[]) {
  if (!textId || positions.length === 0) return [];
  return db.question.findMany({
    where: { textId, position: { in: positions } },
    select: { id: true, position: true, prompt: true, options: true },
    orderBy: { position: 'asc' },
  });
}

/**
 * Son anlama oranları (en yeniden, en fazla 5): `before` anından önce biten ölçülü okumalar ve
 * egzersizler. Seçici E6 kuralı için kullanır.
 */
async function recentComprehension(db: Db, userId: string, before: Date): Promise<number[]> {
  const [readings, exercises] = await Promise.all([
    db.readingMetric.findMany({
      where: {
        comprehension: { not: null },
        readingSession: { userId, startedAt: { lt: before } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { comprehension: true, createdAt: true },
    }),
    db.exerciseSession.findMany({
      where: { userId, comprehension: { not: null }, finishedAt: { lt: before } },
      orderBy: { finishedAt: 'desc' },
      take: 5,
      select: { comprehension: true, finishedAt: true },
    }),
  ]);
  return [
    ...readings.map((row) => ({ at: row.createdAt, value: row.comprehension })),
    ...exercises.map((row) => ({ at: row.finishedAt as Date, value: row.comprehension })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 5)
    .flatMap((row) => (row.value === null ? [] : [row.value]));
}

type SessionRow = {
  id: string;
  durationSeconds: number;
  wpmFirst: number | null;
  wpmLast: number | null;
  comprehension: number | null;
  score: number | null;
  details: Prisma.JsonValue;
};

/** Bitmiş egzersizin sonucu (yanıtı kaybolan istek aynı sonucu alır). */
function resultOf(session: SessionRow, lokumEarned: number) {
  const details = detailsOf(session.details);
  const number = (value: unknown) => (typeof value === 'number' ? value : null);
  return {
    sessionId: session.id,
    durationSeconds: session.durationSeconds,
    wpmFirst: session.wpmFirst,
    wpmLast: session.wpmLast,
    /** E1: ilk okumaya göre hız değişimi (yüzde) */
    score: session.score,
    comprehension: session.comprehension,
    questionsTotal: number(details.questionsTotal),
    firstTryCorrect: number(details.firstTryCorrect),
    /** E5: kart sayısı ve doğru tanınanlar */
    wordsTotal: number(details.wordsTotal),
    wordsCorrect: number(details.wordsCorrect),
    reads: Array.isArray(details.reads) ? details.reads : null,
    lokumEarned,
  };
}

export async function exercisesRoutes(app: FastifyInstance) {
  const { prisma } = app;

  app.addHook('preHandler', app.authenticate);

  /** Ana sayfadaki "Bugünün antrenmanı": 1-3 onaylı egzersiz ve bugün bitenler. */
  app.get('/me/training/today', async (request) => {
    const { user } = requireAuth(request);
    const now = new Date();
    const dayStart = startOfDayInTimeZone(now);
    const gradeBand: GradeBand = gradeBandOf(user.grade);

    const [state, items, last, comprehension, finishedToday] = await Promise.all([
      loadJourneyState(prisma, user.id, gradeBand),
      prisma.exerciseItem.findMany({
        where: { status: ContentStatus.APPROVED, gradeBand, type: { in: [...PLAYABLE_TYPES] } },
        select: {
          id: true,
          type: true,
          gradeBand: true,
          textId: true,
          params: true,
          data: true,
          text: { select: { wordCount: true, paragraphs: true } },
        },
      }),
      // Plan gün içinde değişmesin: yalnızca bugünden önceki egzersizlere bakılır.
      prisma.exerciseSession.findFirst({
        where: { userId: user.id, finishedAt: { lt: dayStart } },
        orderBy: { finishedAt: 'desc' },
        select: { item: { select: { type: true } } },
      }),
      recentComprehension(prisma, user.id, dayStart),
      prisma.exerciseSession.findMany({
        where: { userId: user.id, finishedAt: { gte: dayStart } },
        select: { itemId: true },
      }),
    ]);

    const candidates = items.flatMap((item): TrainingCandidate[] => {
      const module = EXERCISE_MODULES[item.type];
      const params = module?.paramsSchema.safeParse(item.params);
      const data = module?.dataSchema.safeParse(item.data);
      if (!module || !params?.success || !data?.success) return [];
      const minutes = module.minutes({
        params: params.data,
        data: data.data,
        gradeBand: item.gradeBand,
        wordCount: wordCountOf(item.text),
      });
      return [
        { id: item.id, type: item.type, gradeBand: item.gradeBand, textId: item.textId, minutes },
      ];
    });

    const plan = pickTraining({
      gradeBand,
      candidates,
      playableTypes: PLAYABLE_TYPES,
      lockedTextIds: lockedTextIds(state),
      lastType: last?.item.type ?? null,
      recentComprehension: comprehension,
      seed: seedFrom(`${user.id}|${dayNumberInTimeZone(now)}`),
    });
    const done = new Set(finishedToday.map((session) => session.itemId));

    return {
      items: plan.map((item) => ({
        itemId: item.id,
        type: item.type,
        code: exerciseModule(item.type).code,
        minutes: item.minutes,
        done: done.has(item.id),
      })),
      totalMinutes: plan.reduce((sum, item) => sum + item.minutes, 0),
      done: plan.length > 0 && plan.every((item) => done.has(item.id)),
    };
  });

  /** Egzersizi başlatır: oturum, etkin ayarlar, metin ve sorular (cevapsız). */
  app.post('/exercises/:itemId/sessions', async (request, reply) => {
    const { user } = requireAuth(request);
    const { itemId } = parse(itemParamsSchema, request.params);

    const item = await prisma.exerciseItem.findFirst({
      where: { id: itemId, status: ContentStatus.APPROVED },
      select: {
        id: true,
        type: true,
        gradeBand: true,
        params: true,
        data: true,
        text: {
          select: { id: true, title: true, theme: true, paragraphs: true, wordCount: true },
        },
      },
    });
    if (!item) throw Errors.notFound('Bu egzersizi bulamadık.');
    const module = EXERCISE_MODULES[item.type];
    if (!module?.finish) throw Errors.notFound('Bu egzersiz henüz hazır değil.');
    if (
      item.text &&
      lockedTextIds(await loadJourneyState(prisma, user.id, gradeBandOf(user.grade))).has(
        item.text.id,
      )
    ) {
      throw Errors.lessonLocked();
    }

    // Etkin ayarlar: örneğin ayarları, türün uyarlaması varsa çocuğun geçmişine göre (E6, E11).
    const itemParams = module.paramsSchema.parse(item.params);
    const data = module.dataSchema.parse(item.data);
    let params = itemParams;
    if (module.effectiveParams) {
      const [last, baseline] = await Promise.all([
        prisma.exerciseSession.findFirst({
          where: { userId: user.id, finishedAt: { not: null }, item: { type: item.type } },
          orderBy: { finishedAt: 'desc' },
          select: { details: true },
        }),
        prisma.userBaseline.findFirst({
          where: { userId: user.id },
          orderBy: { measuredAt: 'desc' },
          select: { wordsPerMinute: true },
        }),
      ]);
      params = module.paramsSchema.parse(
        module.effectiveParams({
          params: itemParams,
          data,
          gradeBand: item.gradeBand,
          wordCount: wordCountOf(item.text),
          lastDetails: last ? detailsOf(last.details) : null,
          baselineWpm: baseline?.wordsPerMinute ?? null,
        }),
      );
    }
    const [session, questions] = await Promise.all([
      prisma.exerciseSession.create({
        data: { userId: user.id, itemId: item.id, paramsUsed: params as Prisma.InputJsonValue },
        select: { id: true },
      }),
      questionsFor(prisma, item.text?.id ?? null, module.questionPositions(data)),
    ]);

    return reply.status(201).send({
      sessionId: session.id,
      item: {
        id: item.id,
        type: item.type,
        code: module.code,
        gradeBand: item.gradeBand,
        params,
        data,
      },
      text: item.text
        ? {
            id: item.text.id,
            title: item.text.title,
            theme: toApiTheme(item.text.theme),
            paragraphs: item.text.paragraphs,
            wordCount: wordCountOf(item.text),
          }
        : null,
      questions,
    });
  });

  /** Egzersizdeki bir soruya cevap: kaydedilir, doğru mu yanlış mı döner (ders cevabıyla aynı). */
  app.post('/exercise-sessions/:id/answers', async (request) => {
    const { user } = requireAuth(request);
    const { id } = parse(sessionParamsSchema, request.params);
    const input = parse(answerSchema, request.body);

    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT 1 FROM exercise_sessions WHERE id = ${id} FOR UPDATE`;
      const session = await tx.exerciseSession.findFirst({
        where: { id, userId: user.id },
        select: {
          finishedAt: true,
          details: true,
          item: { select: { type: true, data: true, textId: true } },
        },
      });
      if (!session) throw Errors.notFound('Bu egzersizi bulamadık.');

      const module = exerciseModule(session.item.type);
      const positions = module.questionPositions(module.dataSchema.parse(session.item.data));
      const question = session.item.textId
        ? await tx.question.findFirst({
            where: {
              id: input.questionId,
              textId: session.item.textId,
              position: { in: positions },
            },
            select: { id: true, correctIndex: true, hint: true, explanation: true, options: true },
          })
        : null;
      if (!question) throw Errors.validation({ questionId: 'Bu soru bu egzersize ait değil.' });
      if (input.choiceIndex >= question.options.length) {
        throw Errors.validation({ choiceIndex: 'Bir şık seç.' });
      }

      const correct = input.choiceIndex === question.correctIndex;
      // Bitmiş egzersizde cevap kaydedilmez (anlama değişmez).
      if (!session.finishedAt) {
        const details = detailsOf(session.details);
        const answers: StoredAnswer[] = [
          ...answersOf(details),
          { questionId: question.id, choiceIndex: input.choiceIndex, correct },
        ];
        await tx.exerciseSession.update({
          where: { id },
          data: { details: { ...details, answers } as Prisma.InputJsonValue },
        });
      }
      return correct
        ? { correct, explanation: question.explanation, lokum: 0 }
        : { correct, hint: question.hint, lokum: 0 };
    });
  });

  /**
   * Egzersizi bitirir. Sunucu süreyi kırpar, hızı metnin kelime sayısından, anlamayı kayıtlı ilk
   * cevaplardan hesaplar; ilk bitişte (günde en fazla 3 egzersiz) +3 lokum yazar. Yanıtı kaybolan
   * istek yeniden gelirse aynı sonuç döner.
   */
  app.patch('/exercise-sessions/:id', async (request) => {
    const { user } = requireAuth(request);
    const { id } = parse(sessionParamsSchema, request.params);
    const input = parse(finishSchema, request.body);

    const result = await prisma.$transaction(async (tx) => {
      // Aynı kullanıcının eşzamanlı bitişleri sırayla işlenir (günlük lokum sınırı aşılmasın).
      await tx.$queryRaw`SELECT 1 FROM users WHERE id = ${user.id} FOR UPDATE`;
      await tx.$queryRaw`SELECT 1 FROM exercise_sessions WHERE id = ${id} FOR UPDATE`;
      const session = await tx.exerciseSession.findFirst({
        where: { id, userId: user.id },
        include: {
          lokumEntry: { select: { amount: true } },
          item: {
            select: {
              type: true,
              data: true,
              textId: true,
              text: { select: { wordCount: true, paragraphs: true } },
            },
          },
        },
      });
      if (!session) throw Errors.notFound('Bu egzersizi bulamadık.');
      if (session.finishedAt) return resultOf(session, session.lokumEntry?.amount ?? 0);

      const module = exerciseModule(session.item.type);
      if (!module.finish) throw Errors.notFound('Bu egzersiz henüz hazır değil.');
      const outcome = parse(module.finish.resultSchema, input.result);
      const params = module.paramsSchema.parse(session.paramsUsed);
      const data = module.dataSchema.parse(session.item.data);

      // Sorular: hepsi doğru cevaplanmış olmalı; anlama her sorunun ilk cevabından.
      const details = detailsOf(session.details);
      const answers = answersOf(details);
      const questions = await questionsFor(tx, session.item.textId, module.questionPositions(data));
      const questionIds = new Set(questions.map((question) => question.id));
      const relevant = answers.filter((answer) => questionIds.has(answer.questionId));
      const answered = new Set(relevant.filter((a) => a.correct).map((a) => a.questionId));
      if (questions.some((question) => !answered.has(question.id))) {
        throw Errors.questionsNotAnswered();
      }
      const firstTryCorrect = firstTryCorrectCount(relevant);
      const comprehension =
        questions.length > 0 ? Math.round((firstTryCorrect / questions.length) * 100) / 100 : null;

      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);
      const durationSeconds = Math.min(
        input.durationSeconds,
        elapsedSeconds + DURATION_SLACK_SECONDS,
        MAX_DURATION_SECONDS,
      );
      const metrics = module.finish.metrics({
        params,
        data,
        result: outcome,
        wordCount: wordCountOf(session.item.text),
        durationSeconds,
        comprehension,
      });

      const updated = await tx.exerciseSession.update({
        where: { id },
        data: {
          finishedAt: now,
          durationSeconds,
          wpmFirst: metrics.wpmFirst,
          wpmLast: metrics.wpmLast,
          comprehension,
          score: metrics.score,
          details: {
            ...details,
            ...metrics.details,
            questionsTotal: questions.length,
            firstTryCorrect,
          } as Prisma.InputJsonValue,
        },
      });

      const rewardedToday = await tx.lokumEntry.count({
        where: {
          userId: user.id,
          reason: LokumReason.EXERCISE,
          createdAt: { gte: startOfDayInTimeZone(now) },
        },
      });
      const lokum = exerciseLokum(rewardedToday);
      if (lokum > 0) {
        await tx.lokumEntry.create({
          data: {
            userId: user.id,
            amount: lokum,
            reason: LokumReason.EXERCISE,
            exerciseSessionId: id,
          },
        });
      }
      return resultOf(updated, lokum);
    });

    const [dates, balance] = await Promise.all([
      loadReadingDates(prisma, user.id),
      lokumBalance(prisma, user.id),
    ]);
    const { lokumEarned, ...rest } = result;
    return {
      ...rest,
      lokum: { earned: lokumEarned, balance },
      streak: streakFrom(dates, new Date()).streak,
    };
  });
}
