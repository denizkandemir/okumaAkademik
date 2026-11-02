import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { toApiCity } from '../../lib/city.js';
import { Errors } from '../../lib/errors.js';
import { withApiLevel } from '../../lib/reading-level.js';
import { withApiTheme } from '../../lib/text-theme.js';
import { parse } from '../../lib/validation.js';
import { requireAuth } from '../../plugins/auth.js';
import { loadJourneyState, lockedTextIds } from '../journey/journey-state.js';

const textSummarySelect = {
  id: true,
  title: true,
  level: true,
  estimatedMinutes: true,
  theme: true,
} as const;

const textParamsSchema = z.object({ id: z.string().min(1).max(100) });

export async function textsRoutes(app: FastifyInstance) {
  const { prisma } = app;

  app.addHook('preHandler', app.authenticate);

  /**
   * Kullanıcının sınıfına uygun metinler (paragraflar hariç). Yolculukta henüz kilitli olan
   * derslerin metinleri listelenmez. `city`: metni okutan dersin şehri (dersi yoksa `null`);
   * `read`: kullanıcının bu metinde tamamlanmış bir okuması var mı.
   */
  app.get('/texts', async (request) => {
    const { user } = requireAuth(request);
    const locked = lockedTextIds(await loadJourneyState(prisma, user.id));
    const texts = await prisma.text.findMany({
      where: {
        minGrade: { lte: user.grade },
        maxGrade: { gte: user.grade },
        id: { notIn: [...locked] },
      },
      select: { ...textSummarySelect, lesson: { select: { city: true } } },
      orderBy: [{ level: 'asc' }, { estimatedMinutes: 'asc' }, { title: 'asc' }],
    });
    const readRows = await prisma.readingSession.findMany({
      where: { userId: user.id, completed: true },
      select: { textId: true },
      distinct: ['textId'],
    });
    const read = new Set(readRows.map((row) => row.textId));
    return {
      texts: texts.map(({ lesson, ...text }) => ({
        ...withApiTheme(withApiLevel(text)),
        city: lesson ? toApiCity(lesson.city) : null,
        read: read.has(text.id),
      })),
    };
  });

  /** Metnin tamamı. `city`: metni okutan yolculuk dersinin şehri (dersi yoksa `null`). */
  app.get('/texts/:id', async (request) => {
    const { user } = requireAuth(request);
    const { id } = parse(textParamsSchema, request.params);
    const row = await prisma.text.findUnique({
      where: { id },
      select: { ...textSummarySelect, paragraphs: true, lesson: { select: { city: true } } },
    });
    if (!row) throw Errors.notFound('Bu metni bulamadık.');
    if (lockedTextIds(await loadJourneyState(prisma, user.id)).has(id)) {
      throw Errors.lessonLocked();
    }
    const { lesson, ...text } = row;
    return {
      text: { ...withApiTheme(withApiLevel(text)), city: lesson ? toApiCity(lesson.city) : null },
    };
  });
}
