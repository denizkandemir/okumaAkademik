import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { Errors } from '../../lib/errors.js';
import { toApiLevel } from '../../lib/reading-level.js';
import { startOfDayInTimeZone } from '../../lib/time.js';
import { parse } from '../../lib/validation.js';
import { requireAuth } from '../../plugins/auth.js';
import { loadJourneyState, lockedTextIds } from '../journey/journey-state.js';

/** İstemcinin bildirdiği süre, oturum başlangıcından bu yana geçen süreyi en fazla bu kadar aşabilir. */
const DURATION_SLACK_SECONDS = 60;
/** Tek bir okuma oturumu için üst sınır (4 saat). */
const MAX_DURATION_SECONDS = 4 * 60 * 60;
/** "Okumaya devam et" için bakılacak son oturum sayısı. */
const RECENT_SESSIONS_LIMIT = 20;

const startSchema = z.object({
  textId: z.string({ error: 'Metin seçilmedi.' }).min(1, { error: 'Metin seçilmedi.' }).max(100),
});

const sessionParamsSchema = z.object({ id: z.string().min(1).max(100) });

// Süre üstten reddedilmez, kırpılır: ekranı saatlerce açık kalan okuma da bitirilebilsin.
const updateSchema = z.object({
  progress: z.number().min(0).max(1),
  durationSeconds: z.number().int().min(0),
  completed: z.boolean(),
});

export async function progressRoutes(app: FastifyInstance) {
  const { prisma } = app;

  app.addHook('preHandler', app.authenticate);

  app.post('/reading-sessions', async (request, reply) => {
    const { user } = requireAuth(request);
    const { textId } = parse(startSchema, request.body);

    const text = await prisma.text.findUnique({ where: { id: textId }, select: { id: true } });
    if (!text) throw Errors.notFound('Bu metni bulamadık.');
    if (lockedTextIds(await loadJourneyState(prisma, user.id)).has(textId)) {
      throw Errors.lessonLocked();
    }

    const session = await prisma.readingSession.create({
      data: { userId: user.id, textId },
      select: { id: true },
    });
    return reply.status(201).send({ id: session.id });
  });

  app.patch('/reading-sessions/:id', async (request) => {
    const { user } = requireAuth(request);
    const { id } = parse(sessionParamsSchema, request.params);
    const input = parse(updateSchema, request.body);

    // Aynı oturuma eşzamanlı gelen kayıtlar (ör. arka plan ara kaydı ve BİTİRDİM) sırayla işlenir;
    // yoksa eski satırı okuyan istek, yenisinin yazdığını geri alabilir.
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT 1 FROM reading_sessions WHERE id = ${id} FOR UPDATE`;
      const existing = await tx.readingSession.findFirst({
        where: { id, userId: user.id },
      });
      if (!existing) throw Errors.notFound('Bu okuma kaydını bulamadık.');

      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - existing.startedAt.getTime()) / 1000);
      // Süre, gerçekte geçen zamandan fazla olamaz; günlük hedef şişirilemez. Geç gelen eski bir
      // kayıt süreyi geri götürmez (kayıtlı süre hiçbir zaman negatif değildir).
      const durationSeconds = Math.max(
        existing.durationSeconds,
        Math.min(
          input.durationSeconds,
          elapsedSeconds + DURATION_SLACK_SECONDS,
          MAX_DURATION_SECONDS,
        ),
      );
      // Bir kez bitirilen metin "bitmemiş" sayılmaz; ilerleme geri gitmez. Bitiş anı (seri günü)
      // da sonradan gelen kayıtlarla kaymaz.
      const completed = existing.completed || input.completed;
      const progress = completed ? 1 : Math.max(existing.progress, input.progress);
      const endedAt = existing.completed ? existing.endedAt : now;

      return tx.readingSession.update({
        where: { id: existing.id },
        data: { durationSeconds, progress, completed, endedAt },
        select: { id: true, progress: true, durationSeconds: true, completed: true },
      });
    });
  });

  app.get('/me/progress', async (request) => {
    const { user } = requireAuth(request);
    const dayStart = startOfDayInTimeZone(new Date());

    const [today, recent] = await Promise.all([
      prisma.readingSession.aggregate({
        where: { userId: user.id, startedAt: { gte: dayStart } },
        _sum: { durationSeconds: true },
      }),
      prisma.readingSession.findMany({
        where: { userId: user.id },
        orderBy: { startedAt: 'desc' },
        take: RECENT_SESSIONS_LIMIT,
        select: {
          textId: true,
          progress: true,
          completed: true,
          text: { select: { title: true, level: true } },
        },
      }),
    ]);

    // Her metnin en son oturumuna bakılır; en yeni yarım kalan metin "devam et" olur.
    const seen = new Set<string>();
    let continueReading = null;
    for (const session of recent) {
      if (seen.has(session.textId)) continue;
      seen.add(session.textId);
      if (!session.completed) {
        continueReading = {
          textId: session.textId,
          title: session.text.title,
          level: toApiLevel(session.text.level),
          progress: session.progress,
        };
        break;
      }
    }

    return {
      dailyGoal: {
        goalMinutes: user.dailyGoalMinutes,
        readMinutes: Math.floor((today._sum.durationSeconds ?? 0) / 60),
      },
      continueReading,
    };
  });
}
