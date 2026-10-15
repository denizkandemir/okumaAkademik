import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { PrismaClient } from '../../db.js';
import { Prisma } from '../../generated/prisma/client.js';
import { LessonKind, LokumReason } from '../../generated/prisma/enums.js';
import { toApiCity } from '../../lib/city.js';
import { Errors } from '../../lib/errors.js';
import {
  firstTryCorrectCount,
  LOKUM,
  maxLessonLokum,
  rewardsFor,
  starsFor,
  streakFrom,
  type LessonRewards,
} from '../../lib/journey.js';
import { withApiLevel } from '../../lib/reading-level.js';
import { parse } from '../../lib/validation.js';
import { requireAuth } from '../../plugins/auth.js';
import {
  loadJourneyState,
  loadReadingDates,
  lokumBalance,
  type JourneyLesson,
  type JourneyState,
} from './journey-state.js';

const lessonParamsSchema = z.object({ id: z.string().min(1).max(100) });

const readingSessionIdSchema = z
  .string({ error: 'Okuma kaydı eksik.' })
  .min(1, { error: 'Okuma kaydı eksik.' })
  .max(100);

const answerSchema = z.object({
  readingSessionId: readingSessionIdSchema,
  questionId: z.string({ error: 'Soru seçilmedi.' }).min(1, { error: 'Soru seçilmedi.' }).max(100),
  choiceIndex: z
    .number({ error: 'Bir şık seç.' })
    .int({ error: 'Bir şık seç.' })
    .min(0, { error: 'Bir şık seç.' })
    .max(2, { error: 'Bir şık seç.' }),
});

const completeSchema = z.object({ readingSessionId: readingSessionIdSchema.optional() });

/** Ders kimliğine göre dersi bulur; yoksa 404, kilitliyse 403. */
function findOpenLesson(state: JourneyState, id: string): JourneyLesson {
  const lesson = state.lessons.find((entry) => entry.id === id);
  if (!lesson) throw Errors.notFound('Bu dersi bulamadık.');
  if (lesson.status === 'locked') throw Errors.lessonLocked();
  return lesson;
}

/** Okuma kaydı kullanıcıya ve dersin metnine ait olmalı. */
async function findLessonReading(
  prisma: PrismaClient,
  userId: string,
  lesson: JourneyLesson,
  readingSessionId: string,
) {
  const session = await prisma.readingSession.findFirst({
    where: { id: readingSessionId, userId },
    select: { id: true, textId: true, completed: true, durationSeconds: true },
  });
  if (!session) throw Errors.notFound('Bu okuma kaydını bulamadık.');
  if (session.textId !== lesson.textId) {
    throw Errors.validation({ readingSessionId: 'Bu okuma bu derse ait değil.' });
  }
  return session;
}

function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

export async function lessonsRoutes(app: FastifyInstance) {
  const { prisma } = app;

  app.addHook('preHandler', app.authenticate);

  /** Ders kartı ve okuma ekranı: ders, metin, kelime anlamları ve sorular (cevapsız). */
  app.get('/lessons/:id', async (request) => {
    const { user } = requireAuth(request);
    const { id } = parse(lessonParamsSchema, request.params);
    const state = await loadJourneyState(prisma, user.id);
    const lesson = findOpenLesson(state, id);

    const details = await prisma.lesson.findUniqueOrThrow({
      where: { id },
      select: {
        summary: true,
        text: {
          select: {
            id: true,
            title: true,
            level: true,
            estimatedMinutes: true,
            paragraphs: true,
            glossaryEntries: { select: { word: true, meaning: true }, orderBy: { word: 'asc' } },
            questions: {
              select: { id: true, position: true, prompt: true, options: true },
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });
    const text = details.text;

    return {
      lesson: {
        id: lesson.id,
        city: toApiCity(lesson.city),
        position: lesson.position,
        kind: lesson.kind === LessonKind.CHEST ? 'chest' : 'story',
        title: lesson.title,
        summary: details.summary,
        status: lesson.status,
        bestStars: lesson.bestStars,
        // Ödül yalnızca ilk tamamlanışta verilir; bitmiş derste kazanılacak lokum yoktur.
        maxLokum: lesson.status === 'done' ? 0 : maxLessonLokum(lesson.kind),
      },
      text: text
        ? withApiLevel({
            id: text.id,
            title: text.title,
            level: text.level,
            estimatedMinutes: text.estimatedMinutes,
            paragraphs: text.paragraphs,
          })
        : null,
      glossary: text?.glossaryEntries ?? [],
      questions: text?.questions ?? [],
    };
  });

  /** Bir şıkka dokunuş: kaydedilir, doğru mu yanlış mı döner. */
  app.post('/lessons/:id/answers', async (request) => {
    const { user } = requireAuth(request);
    const { id } = parse(lessonParamsSchema, request.params);
    const input = parse(answerSchema, request.body);
    const state = await loadJourneyState(prisma, user.id);
    const lesson = findOpenLesson(state, id);
    if (lesson.kind !== LessonKind.STORY || !lesson.textId) throw Errors.noQuestions();

    await findLessonReading(prisma, user.id, lesson, input.readingSessionId);
    const question = await prisma.question.findFirst({
      where: { id: input.questionId, textId: lesson.textId },
      select: { id: true, correctIndex: true, hint: true, explanation: true },
    });
    if (!question) throw Errors.validation({ questionId: 'Bu soru bu derse ait değil.' });

    const earlierAttempts = await prisma.questionAttempt.count({
      where: { readingSessionId: input.readingSessionId, questionId: question.id },
    });
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

    // Yalnızca gösterim içindir; lokum dersin ilk tamamlanışında yazılır.
    const lokum =
      correct && earlierAttempts === 0 && lesson.status !== 'done' ? LOKUM.PER_FIRST_TRY : 0;
    return correct
      ? { correct, explanation: question.explanation, lokum }
      : { correct, hint: question.hint, lokum };
  });

  /** Dersi bitirir; ilk tamamlanışta lokum, seviye ve şehir ödüllerini tek işlemde yazar. */
  app.post('/lessons/:id/complete', async (request) => {
    const { user } = requireAuth(request);
    const { id } = parse(lessonParamsSchema, request.params);
    const input = parse(completeSchema, request.body);
    const state = await loadJourneyState(prisma, user.id);
    const lesson = findOpenLesson(state, id);

    let story: {
      readingSessionId: string;
      stars: number;
      firstTryCorrect: number;
      durationSeconds: number;
    } | null = null;

    if (lesson.kind === LessonKind.STORY) {
      if (!input.readingSessionId) {
        throw Errors.validation({ readingSessionId: 'Okuma kaydı eksik.' });
      }
      const session = await findLessonReading(prisma, user.id, lesson, input.readingSessionId);
      if (!session.completed) throw Errors.readingNotFinished();

      const [questions, attempts] = await Promise.all([
        prisma.question.findMany({ where: { textId: session.textId }, select: { id: true } }),
        prisma.questionAttempt.findMany({
          where: { readingSessionId: session.id },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          select: { questionId: true, correct: true },
        }),
      ]);
      const answered = new Set(attempts.filter((a) => a.correct).map((a) => a.questionId));
      if (questions.length === 0 || questions.some((question) => !answered.has(question.id))) {
        throw Errors.questionsNotAnswered();
      }

      const firstTryCorrect = firstTryCorrectCount(attempts);
      story = {
        readingSessionId: session.id,
        stars: starsFor(firstTryCorrect),
        firstTryCorrect,
        durationSeconds: session.durationSeconds,
      };
    }

    /** İlk tamamlamada ödülleri döner; ders zaten bitmişse yalnızca en iyi yıldızı yükseltir. */
    const persist = () =>
      prisma.$transaction(async (tx): Promise<LessonRewards | null> => {
        const where = { userId_lessonId: { userId: user.id, lessonId: lesson.id } };
        const existing = await tx.lessonCompletion.findUnique({ where });
        if (existing) {
          if (story && story.stars > (existing.bestStars ?? 0)) {
            await tx.lessonCompletion.update({ where, data: { bestStars: story.stars } });
          }
          return null;
        }

        const completedBefore = await tx.lessonCompletion.count({ where: { userId: user.id } });
        const rewards = rewardsFor({
          kind: lesson.kind,
          firstTryCorrect: story?.firstTryCorrect ?? 0,
          completedBefore,
        });
        await tx.lessonCompletion.create({
          data: {
            userId: user.id,
            lessonId: lesson.id,
            readingSessionId: story?.readingSessionId ?? null,
            stars: story?.stars ?? null,
            bestStars: story?.stars ?? null,
          },
        });

        const base = { userId: user.id, lessonId: lesson.id };
        await tx.lokumEntry.createMany({
          data: [
            {
              ...base,
              amount: rewards.lesson,
              reason: lesson.kind === LessonKind.CHEST ? LokumReason.CHEST : LokumReason.LESSON,
            },
            ...rewards.levelsGained.map((level) => ({
              ...base,
              amount: LOKUM.LEVEL_UP,
              reason: LokumReason.LEVEL_UP,
              level,
            })),
            ...(rewards.cityUnlocked
              ? [{ ...base, amount: LOKUM.CITY_UNLOCK, reason: LokumReason.CITY_UNLOCK }]
              : []),
          ],
        });
        return rewards;
      });

    let rewards: LessonRewards | null;
    try {
      rewards = await persist();
    } catch (error) {
      // Aynı anda gelen ikinci istek (çift dokunuş): ilk istek dersi bitirdi, bu bir tekrar sayılır.
      if (!isUniqueViolation(error)) throw error;
      rewards = await persist();
    }

    const [after, dates, balance] = await Promise.all([
      loadJourneyState(prisma, user.id),
      loadReadingDates(prisma, user.id),
      lokumBalance(prisma, user.id),
    ]);

    return {
      firstTime: rewards !== null,
      stars: story?.stars ?? null,
      firstTryCorrect: story?.firstTryCorrect ?? null,
      durationSeconds: story?.durationSeconds ?? null,
      lokum: {
        lesson: rewards?.lesson ?? 0,
        levelUp: rewards?.levelUp ?? 0,
        cityUnlock: rewards?.cityUnlock ?? 0,
        total: rewards?.total ?? 0,
        balance,
      },
      level: {
        before: rewards?.levelBefore ?? after.level,
        after: rewards?.levelAfter ?? after.level,
        leveledUp: (rewards?.levelsGained.length ?? 0) > 0,
      },
      cityUnlocked: rewards?.cityUnlocked ? toApiCity(rewards.cityUnlocked) : null,
      finished: after.finished,
      nextLessonId: after.nextLesson?.id ?? null,
      nextLessonTitle: after.nextLesson?.title ?? null,
      streak: streakFrom(dates, new Date()).streak,
    };
  });
}
