import { describe, expect, it } from 'vitest';

import { startOfDayInTimeZone } from '../src/lib/time.js';

describe('startOfDayInTimeZone', () => {
  it('Türkiye saatiyle gece yarısını (UTC 21:00) gün başı sayar', () => {
    // İstanbul 2 Ekim 00:30 → gün başı 1 Ekim 21:00 UTC
    expect(startOfDayInTimeZone(new Date('2026-10-01T21:30:00Z')).toISOString()).toBe(
      '2026-10-01T21:00:00.000Z',
    );
    // İstanbul 1 Ekim 23:59:59 → gün başı 30 Eylül 21:00 UTC
    expect(startOfDayInTimeZone(new Date('2026-10-01T20:59:59Z')).toISOString()).toBe(
      '2026-09-30T21:00:00.000Z',
    );
  });

  it('yaz saati uygulanan saat dilimlerinde de doğru çalışır', () => {
    // Berlin, yaz saatine geçiş günü (29 Mart 2026): gece yarısı hâlâ UTC+1
    expect(
      startOfDayInTimeZone(new Date('2026-03-29T12:00:00Z'), 'Europe/Berlin').toISOString(),
    ).toBe('2026-03-28T23:00:00.000Z');
  });
});
