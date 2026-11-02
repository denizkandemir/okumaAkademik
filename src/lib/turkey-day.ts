/**
 * Türkiye günü (Europe/Istanbul). Türkiye 2016'dan beri yaz saati uygulamıyor, saat dilimi sabit
 * UTC+3; cihazın saat diliminden bağımsız hesaplanır (sunucudaki `APP_TIME_ZONE` ile aynı gün).
 */
const OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** 1 Ocak 1970'ten bu yana geçen Türkiye günü sayısı. */
export function turkeyDayNumber(date: Date): number {
  return Math.floor((date.getTime() + OFFSET_MS) / DAY_MS);
}

/** Türkiye günü, ör. "2026-11-02". */
export function turkeyDayKey(date: Date): string {
  return new Date(turkeyDayNumber(date) * DAY_MS).toISOString().slice(0, 10);
}
