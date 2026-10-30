import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

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
   * derslerin metinleri listelenmez.
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
      select: textSummarySelect,
      orderBy: [{ level: 'asc' }, { estimatedMinutes: 'asc' }, { title: 'asc' }],
    });
    return { texts: texts.map((text) => withApiTheme(withApiLevel(text))) };
  });

  app.get('/texts/:id', async (request) => {
    const { user } = requireAuth(request);
    const { id } = parse(textParamsSchema, request.params);
    const text = await prisma.text.findUnique({
      where: { id },
      select: { ...textSummarySelect, paragraphs: true },
    });
    if (!text) throw Errors.notFound('Bu metni bulamadık.');
    if (lockedTextIds(await loadJourneyState(prisma, user.id)).has(id)) {
      throw Errors.lessonLocked();
    }
    return { text: withApiTheme(withApiLevel(text)) };
  });
}
