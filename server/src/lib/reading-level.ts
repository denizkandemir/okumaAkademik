import { ReadingLevel } from '../generated/prisma/enums.js';

/**
 * Veritabanında metin seviyesi `reading_level` enum'u olarak saklanır; API sözleşmesinde ise
 * sayıdır (1: Başlangıç, 2: Orta, 3: İleri). Dönüşüm yalnızca burada yapılır.
 */
export type ApiReadingLevel = 1 | 2 | 3;

const LEVEL_NUMBERS = {
  [ReadingLevel.BASLANGIC]: 1,
  [ReadingLevel.ORTA]: 2,
  [ReadingLevel.ILERI]: 3,
} as const satisfies Record<ReadingLevel, ApiReadingLevel>;

export function toApiLevel(level: ReadingLevel): ApiReadingLevel {
  return LEVEL_NUMBERS[level];
}

/** Sorgu sonucundaki `level` alanını API'nin beklediği sayıya çevirir. */
export function withApiLevel<T extends { level: ReadingLevel }>(
  row: T,
): Omit<T, 'level'> & { level: ApiReadingLevel } {
  return { ...row, level: toApiLevel(row.level) };
}
