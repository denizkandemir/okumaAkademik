export const APP_TIME_ZONE = 'Europe/Istanbul';

/** Verilen saat diliminin `date` anındaki UTC farkı (dakika). Ör. İstanbul için +180. */
function timeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60_000);
}

/** `now` anının içinde bulunduğu günün, verilen saat dilimine göre başlangıcı (UTC Date). */
export function startOfDayInTimeZone(now: Date, timeZone: string = APP_TIME_ZONE): Date {
  const offset = timeZoneOffsetMinutes(now, timeZone);
  const local = new Date(now.getTime() + offset * 60_000);
  const localMidnightAsUtc = Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate(),
  );
  // Gece yarısındaki fark, şimdiki farktan farklı olabilir (yaz saati geçişi olan bölgeler).
  const guess = new Date(localMidnightAsUtc - offset * 60_000);
  const midnightOffset = timeZoneOffsetMinutes(guess, timeZone);
  return new Date(localMidnightAsUtc - midnightOffset * 60_000);
}
