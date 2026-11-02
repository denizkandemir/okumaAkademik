import { describe, expect, it } from 'vitest';

import { GradeBand } from '../src/generated/prisma/enums.js';
import { gradeBandOf } from '../src/lib/grade-band.js';
import { periodStarts } from '../src/lib/periods.js';
import { readingMetricValues } from '../src/lib/reading-metrics.js';

describe('sınıf grubu', () => {
  it('1-2 G1, 3-4 G2, 5-6 G3, 7-8 G4', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8].map(gradeBandOf)).toEqual([
      GradeBand.G1,
      GradeBand.G1,
      GradeBand.G2,
      GradeBand.G2,
      GradeBand.G3,
      GradeBand.G3,
      GradeBand.G4,
      GradeBand.G4,
    ]);
  });
});

describe('okuma ölçümü', () => {
  it('dakikadaki kelimeyi ve ilk denemeye göre anlamayı hesaplar', () => {
    expect(
      readingMetricValues({
        gradeBand: GradeBand.G2,
        wordCount: 120,
        durationSeconds: 90,
        questions: { total: 3, firstTryCorrect: 2 },
      }),
    ).toEqual({
      gradeBand: GradeBand.G2,
      wordCount: 120,
      durationSeconds: 90,
      wordsPerMinute: 80,
      questionsTotal: 3,
      firstTryCorrect: 2,
      comprehension: 0.67,
      rushed: false,
    });
  });

  it('kitaplık okumasında anlama yok ve acele sayılmaz; süre 0 ise hız boş', () => {
    const library = readingMetricValues({
      gradeBand: GradeBand.G2,
      wordCount: 120,
      durationSeconds: 20,
    });
    expect(library).toMatchObject({
      wordsPerMinute: 360,
      questionsTotal: null,
      firstTryCorrect: null,
      comprehension: null,
      rushed: false,
    });
    expect(
      readingMetricValues({ gradeBand: GradeBand.G2, wordCount: 120, durationSeconds: 0 }),
    ).toMatchObject({ wordsPerMinute: null, rushed: false });
  });

  it('acele: hız grubun tavanının üstünde VE anlama %60 altında', () => {
    const rushed = (gradeBand: GradeBand, wpmSeconds: number, firstTryCorrect: number) =>
      readingMetricValues({
        gradeBand,
        wordCount: 120,
        durationSeconds: wpmSeconds,
        questions: { total: 3, firstTryCorrect },
      }).rushed;

    // G2 tavanı 160: 120 kelime 40 sn'de = 180 kelime/dk.
    expect(rushed(GradeBand.G2, 40, 1)).toBe(true);
    // Hızlı ama anladı (2/3 = 0,67).
    expect(rushed(GradeBand.G2, 40, 2)).toBe(false);
    // Yavaş ve anlamadı: acele değil.
    expect(rushed(GradeBand.G2, 90, 0)).toBe(false);
    // Tam tavanda (45 sn = 160) acele değil; tavanın üstü gerekir.
    expect(rushed(GradeBand.G2, 45, 0)).toBe(false);
    // Aynı hız G4 tavanının (240) altında.
    expect(rushed(GradeBand.G4, 40, 0)).toBe(false);
  });
});

describe('rapor dönemleri', () => {
  // 2026-11-04 çarşamba 23:30 Türkiye saati = 20:30 UTC.
  const wednesdayNight = new Date('2026-11-04T20:30:00Z');

  it('gün, pazartesi başlayan hafta ve ay; Türkiye saatine göre', () => {
    expect(periodStarts('day', wednesdayNight)).toEqual({
      current: '2026-11-04',
      previous: '2026-11-03',
    });
    expect(periodStarts('week', wednesdayNight)).toEqual({
      current: '2026-11-02',
      previous: '2026-10-26',
    });
    expect(periodStarts('month', wednesdayNight)).toEqual({
      current: '2026-11-01',
      previous: '2026-10-01',
    });
  });

  it('gece yarısından sonra (UTC hâlâ önceki gün) yeni güne geçer; pazar haftanın son günü', () => {
    // 2026-11-09 pazartesi 00:30 Türkiye = 2026-11-08 21:30 UTC.
    expect(periodStarts('week', new Date('2026-11-08T21:30:00Z')).current).toBe('2026-11-09');
    // 2026-11-08 pazar 23:00 Türkiye.
    expect(periodStarts('week', new Date('2026-11-08T20:00:00Z')).current).toBe('2026-11-02');
    // Ocak ayında önceki ay geçen yılın aralığı.
    expect(periodStarts('month', new Date('2027-01-15T09:00:00Z'))).toEqual({
      current: '2027-01-01',
      previous: '2026-12-01',
    });
  });
});
