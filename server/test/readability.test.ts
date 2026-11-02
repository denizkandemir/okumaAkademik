import { describe, expect, it } from 'vitest';

import {
  atesmanScore,
  measureText,
  readabilityBand,
  syllableCount,
  textMetrics,
  words,
} from '../src/lib/readability.js';

describe('readability', () => {
  it('heceyi ünlü sayısıyla sayar; büyük İ ve I Türkçe küçülür', () => {
    expect(syllableCount('kedi')).toBe(2);
    expect(syllableCount('ISIRGAN')).toBe(3);
    expect(syllableCount('İSTANBUL')).toBe(3);
    expect(syllableCount('Iğdır')).toBe(2);
    expect(syllableCount('kâğıt')).toBe(2);
    expect(syllableCount('2024')).toBe(0);
  });

  it('noktalama işaretlerini kelime saymaz', () => {
    expect(words('Ece — dedesiyle “vapura” bindi, sonra güldü!')).toEqual([
      'Ece',
      'dedesiyle',
      '“vapura”',
      'bindi,',
      'sonra',
      'güldü!',
    ]);
  });

  it('cümleleri sayar: tırnak içindeki ünlem cümleyi bitirmez, noktasız paragraf da cümledir', () => {
    expect(measureText(['Kedi uyudu. Köpek havladı.']).sentenceCount).toBe(2);
    expect(measureText(['“Haftaya geleceğiz!” dedi dedesine.']).sentenceCount).toBe(1);
    expect(measureText(['Bekle... Sonra koş!']).sentenceCount).toBe(2);
    expect(measureText(['Başlıksız bir satır', 'İkinci paragraf.']).sentenceCount).toBe(2);
    expect(measureText(['', '   ']).sentenceCount).toBe(0);
  });

  it('Ateşman puanını elle hesaplanan örneklerle aynı bulur', () => {
    // 3 kelime, 1 cümle, 5 hece (A-li to-pu at): 198,825 − 40,175 × 5/3 − 2,610 × 3
    const short = measureText(['Ali topu at.']);
    expect(short).toMatchObject({ wordCount: 3, sentenceCount: 1, syllableCount: 5 });
    expect(atesmanScore(short)).toBeCloseTo(124.0367, 3);

    // 4 kelime, 2 cümle, 10 hece: 198,825 − 40,175 × 2,5 − 2,610 × 2
    const two = measureText(['Kedi uyudu. Köpek havladı.']);
    expect(two).toMatchObject({ wordCount: 4, sentenceCount: 2, syllableCount: 10 });
    expect(atesmanScore(two)).toBeCloseTo(93.1675, 3);

    // 6 kelime, 1 cümle, 22 hece: 198,825 − 40,175 × 22/6 − 2,610 × 6
    const long = measureText(['Öğretmenimiz kütüphaneden ansiklopedi getirdi bugün sabah.']);
    expect(long).toMatchObject({ wordCount: 6, sentenceCount: 1, syllableCount: 22 });
    expect(atesmanScore(long)).toBeCloseTo(35.8567, 3);
  });

  it('kelime ya da cümle yoksa puan yok', () => {
    expect(atesmanScore(measureText([]))).toBeNull();
  });

  it('puanı Ateşman aralığına yerleştirir', () => {
    expect(readabilityBand(124)).toBe('COK_KOLAY');
    expect(readabilityBand(90)).toBe('COK_KOLAY');
    expect(readabilityBand(89.9)).toBe('KOLAY');
    expect(readabilityBand(70)).toBe('KOLAY');
    expect(readabilityBand(69.5)).toBe('ORTA');
    expect(readabilityBand(50)).toBe('ORTA');
    expect(readabilityBand(49)).toBe('ZOR');
    expect(readabilityBand(30)).toBe('ZOR');
    expect(readabilityBand(29.9)).toBe('COK_ZOR');
    expect(readabilityBand(-5)).toBe('COK_ZOR');
  });

  it('veritabanı ölçülerini yuvarlar', () => {
    expect(textMetrics(['Kedi uyudu. Köpek havladı.'])).toEqual({
      wordCount: 4,
      sentenceCount: 2,
      avgSentenceLength: 2,
      atesmanScore: 93.2,
    });
  });
});
