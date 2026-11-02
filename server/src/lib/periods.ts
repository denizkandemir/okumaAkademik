import { dayNumberInTimeZone } from './time.js';

/** Rapor dönemi: Türkiye günü, pazartesi başlayan hafta ya da takvim ayı. */
export type Period = 'day' | 'week' | 'month';

export const PERIODS = ['day', 'week', 'month'] as const satisfies readonly Period[];

const DAY_MS = 86_400_000;

/** Gün numarasının (1970-01-01 = 0) tarihi, ör. "2026-11-02". */
function dateKey(dayNumber: number): string {
  return new Date(dayNumber * DAY_MS).toISOString().slice(0, 10);
}

/**
 * `now` anını içeren dönemin ve bir önceki dönemin ilk günü (Türkiye saatiyle), "YYYY-MM-DD".
 * Görünümlerdeki `reading_date`, `week_start` (date_trunc('week'), pazartesi) ve `month_start`
 * ile aynı tarihlerdir.
 */
export function periodStarts(period: Period, now: Date): { current: string; previous: string } {
  const today = dayNumberInTimeZone(now);
  if (period === 'day') return { current: dateKey(today), previous: dateKey(today - 1) };
  if (period === 'week') {
    // 1970-01-01 perşembedir: (gün + 3) % 7, pazartesiden bu yana geçen gün sayısı.
    const monday = today - ((today + 3) % 7);
    return { current: dateKey(monday), previous: dateKey(monday - 7) };
  }
  const date = new Date(today * DAY_MS);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  return {
    current: new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10),
    previous: new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 10),
  };
}
