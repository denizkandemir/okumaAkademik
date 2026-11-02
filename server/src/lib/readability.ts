/**
 * Türkçe metin ölçüleri ve Ateşman okunabilirlik puanı. Saf fonksiyonlardır; seed metin ölçülerini
 * (texts.word_count, sentence_count, avg_sentence_length, atesman_score) bununla hesaplar.
 *
 * Ateşman formülü (Flesch'in Türkçeye uyarlaması):
 *   Okunabilirlik = 198,825 − 40,175 × x1 − 2,610 × x2
 *   x1 = ortalama kelime uzunluğu (hece / kelime), x2 = ortalama cümle uzunluğu (kelime / cümle)
 * Kaynak: Ateşman, E. (1997). Türkçede okunabilirliğin ölçülmesi. A.Ü. TÖMER Dil Dergisi, 58.
 * (Sayfa numarası aktaran kaynaklarda 71-74 ya da 171-174 olarak geçiyor.) Orijinal makaleye
 * erişilemedi; katsayılar ve puan aralıkları onu aktaran hakemli çalışmalarla doğrulandı, ör.
 * Oğur, E. (2022). 2021-2022 öğretim yılında okutulan 6. sınıf Türkçe ders kitaplarındaki
 * metinlerin okunabilirlik yönünden incelenmesi. TEKE Dergisi, 11(4).
 */

const LOCALE = 'tr-TR';

/** Türkçede hece sayısı ünlü sayısına eşittir (şapkalı ünlüler dahil). */
const VOWELS = /[aeıioöuüâîû]/g;

/** Harf ya da rakam içeren her boşlukla ayrılmış parça bir kelimedir ("—" gibi işaretler değil). */
const WORD_CHAR = /[\p{L}\p{N}]/u;

/**
 * Cümle sonu: nokta, ünlem, soru işareti ya da üç nokta (art arda gelenler tek sayılır), ardından
 * isteğe bağlı kapanış tırnağı/parantez; sonra paragraf sonu ya da boşluk + büyük harf / açılış
 * tırnağı / tire. Böylece `“Geleceğiz!” dedi.` tek cümle sayılır.
 */
const SENTENCE_END = /[.!?…]+[”"’'»)]*(?=\s+[\p{Lu}“"‘'«(—–-]|\s*$)/gu;

export type TextMeasures = {
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  /** Ortalama cümle uzunluğu (kelime / cümle) */
  avgSentenceLength: number;
  /** Ortalama kelime uzunluğu (hece / kelime) */
  avgSyllablesPerWord: number;
};

export function words(text: string): string[] {
  return text.split(/\s+/).filter((token) => WORD_CHAR.test(token));
}

export function syllableCount(word: string): number {
  return word.toLocaleLowerCase(LOCALE).match(VOWELS)?.length ?? 0;
}

/** Paragraf içindeki cümle sayısı; sonu noktasız biten paragraf da bir cümledir. */
function sentencesIn(paragraph: string): number {
  const trimmed = paragraph.trim();
  if (words(trimmed).length === 0) return 0;
  const ends = trimmed.match(SENTENCE_END)?.length ?? 0;
  const endsWithMark = /[.!?…][”"’'»)]*$/.test(trimmed);
  return ends + (endsWithMark ? 0 : 1);
}

/** Paragraflar ayrı ayrı sayılır: her paragraf en az bir cümledir. */
export function measureText(paragraphs: readonly string[]): TextMeasures {
  const allWords = paragraphs.flatMap(words);
  const wordCount = allWords.length;
  const sentenceCount = paragraphs.reduce((total, p) => total + sentencesIn(p), 0);
  const syllables = allWords.reduce((total, word) => total + syllableCount(word), 0);
  return {
    wordCount,
    sentenceCount,
    syllableCount: syllables,
    avgSentenceLength: sentenceCount > 0 ? wordCount / sentenceCount : 0,
    avgSyllablesPerWord: wordCount > 0 ? syllables / wordCount : 0,
  };
}

/** Ateşman puanı (yukarıdaki kaynak). Kelime ya da cümle yoksa `null`. */
export function atesmanScore(measures: TextMeasures): number | null {
  if (measures.wordCount === 0 || measures.sentenceCount === 0) return null;
  return 198.825 - 40.175 * measures.avgSyllablesPerWord - 2.61 * measures.avgSentenceLength;
}

export type ReadabilityBand = 'COK_KOLAY' | 'KOLAY' | 'ORTA' | 'ZOR' | 'COK_ZOR';

export const READABILITY_BAND_LABELS: Record<ReadabilityBand, string> = {
  COK_KOLAY: 'Çok kolay',
  KOLAY: 'Kolay',
  ORTA: 'Orta güçlükte',
  ZOR: 'Zor',
  COK_ZOR: 'Çok zor',
};

/** Ateşman aralıkları: 90-100 çok kolay, 70-89 kolay, 50-69 orta, 30-49 zor, 1-29 çok zor. */
export function readabilityBand(score: number): ReadabilityBand {
  if (score >= 90) return 'COK_KOLAY';
  if (score >= 70) return 'KOLAY';
  if (score >= 50) return 'ORTA';
  if (score >= 30) return 'ZOR';
  return 'COK_ZOR';
}

/** `texts` tablosuna yazılan ölçüler (veritabanındaki yuvarlamayla). */
export function textMetrics(paragraphs: readonly string[]) {
  const measures = measureText(paragraphs);
  const score = atesmanScore(measures);
  return {
    wordCount: measures.wordCount,
    sentenceCount: measures.sentenceCount,
    avgSentenceLength: round(measures.avgSentenceLength, 2),
    atesmanScore: score === null ? null : round(score, 1),
  };
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
