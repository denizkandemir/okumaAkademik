import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { Errors } from '../../lib/errors.js';
import { withApiLevel } from '../../lib/reading-level.js';
import { parse } from '../../lib/validation.js';
import { requireAuth } from '../../plugins/auth.js';

const textSummarySelect = {
  id: true,
  title: true,
  level: true,
  estimatedMinutes: true,
} as const;

const textParamsSchema = z.object({ id: z.string().min(1).max(100) });

export async function textsRoutes(app: FastifyInstance) {
  const { prisma } = app;

  app.addHook('preHandler', app.authenticate);

  /** Kullanıcının sınıfına uygun metinler (paragraflar hariç). */
  app.get('/texts', async (request) => {
    const { grade } = requireAuth(request).user;
    const texts = await prisma.text.findMany({
      where: { minGrade: { lte: grade }, maxGrade: { gte: grade } },
      select: textSummarySelect,
      orderBy: [{ level: 'asc' }, { estimatedMinutes: 'asc' }, { title: 'asc' }],
    });
    return { texts: texts.map(withApiLevel) };
  });

  app.get('/texts/:id', async (request) => {
    const { id } = parse(textParamsSchema, request.params);
    const text = await prisma.text.findUnique({
      where: { id },
      select: { ...textSummarySelect, paragraphs: true },
    });
    if (!text) throw Errors.notFound('Bu metni bulamadık.');
    return { text: withApiLevel(text) };
  });
}
