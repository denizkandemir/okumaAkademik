import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { PrismaClient } from '../../db.js';
import { Prisma } from '../../generated/prisma/client.js';
import { PERIODS, periodStarts, type Period } from '../../lib/periods.js';
import { parse } from '../../lib/validation.js';
import { requireAuth } from '../../plugins/auth.js';
import { latestBaseline } from '../placement/placement.routes.js';

const metricsQuerySchema = z.object({
  period: z.enum(PERIODS, { error: 'Dönem day, week ya da month olmalı.' }).default('week'),
});

/** Bir dönemin özeti; dönemde biten okuma yoksa sayılar 0, ortalamalar null. */
export type PeriodSummary = {
  /** Dönemin ilk günü (Türkiye saati), ör. "2026-10-26" */
  start: string;
  readMinutes: number;
  textCount: number;
  readingCount: number;
  medianWpm: number | null;
  comprehension: number | null;
  rushedCount: number;
};

type Row = {
  period_start: Date;
  read_minutes: number;
  text_count: number;
  reading_count: number;
  median_wpm: number | null;
  comprehension: number | null;
  rushed_count: number;
};

/** Dönemin görünümü ve dönem başı kolonu (sabit adlar; kullanıcı girdisi değil). */
const VIEWS = {
  day: { view: 'v_student_daily', column: 'reading_date' },
  week: { view: 'v_student_weekly', column: 'week_start' },
  month: { view: 'v_student_monthly', column: 'month_start' },
} as const satisfies Record<Period, { view: string; column: string }>;

/** Görünümler (v_student_daily/weekly/monthly) tek hesap yeridir; uç onları okur. */
function loadRows(prisma: PrismaClient, period: Period, username: string, starts: string[]) {
  const view = Prisma.raw(`"${VIEWS[period].view}"`);
  const column = Prisma.raw(`"${VIEWS[period].column}"`);
  return prisma.$queryRaw<Row[]>`
    SELECT ${column} AS period_start, read_minutes::float8 AS read_minutes, text_count,
      reading_count, median_wpm::float8 AS median_wpm, comprehension::float8 AS comprehension,
      rushed_count
    FROM ${view}
    WHERE username = ${username} AND ${column} = ANY(${starts}::date[])`;
}

function summaryOf(start: string, row: Row | undefined): PeriodSummary {
  return {
    start,
    readMinutes: row?.read_minutes ?? 0,
    textCount: row?.text_count ?? 0,
    readingCount: row?.reading_count ?? 0,
    medianWpm: row?.median_wpm ?? null,
    comprehension: row?.comprehension ?? null,
    rushedCount: row?.rushed_count ?? 0,
  };
}

export async function metricsRoutes(app: FastifyInstance) {
  const { prisma } = app;

  app.addHook('preHandler', app.authenticate);

  /**
   * Okuma ölçümlerinin özeti (A5 raporları için): şu anki ve önceki dönem. Yalnızca biten
   * okumalar sayılır; hız her zaman anlamayla birlikte döner. `baseline`: en son seviye belirleme
   * sonucu (user_baselines); hiç yapılmadıysa null.
   */
  app.get('/me/metrics', async (request) => {
    const { user } = requireAuth(request);
    const { period } = parse(metricsQuerySchema, request.query);
    const starts = periodStarts(period, new Date());

    const [rows, baseline] = await Promise.all([
      loadRows(prisma, period, user.username, [starts.current, starts.previous]),
      latestBaseline(prisma, user.id),
    ]);
    const byStart = new Map(rows.map((row) => [row.period_start.toISOString().slice(0, 10), row]));

    return {
      period,
      current: summaryOf(starts.current, byStart.get(starts.current)),
      previous: summaryOf(starts.previous, byStart.get(starts.previous)),
      baseline,
    };
  });
}
