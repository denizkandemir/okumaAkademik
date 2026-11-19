import { z } from 'zod';

import { ExerciseType } from '../../../generated/prisma/enums.js';
import { wholeMinutes, type ExerciseTypeModule } from './common.js';

/**
 * E5 Hızlı kelime: metinden seçilen kelime kısa süre görünür, çocuk onu 3-4 benzer seçenek arasından
 * bulur; süre başarıyla kısalır. Ardından kelimelerin geldiği metin okunur. (Ekranı A1a-2.)
 */
const paramsSchema = z.object({
  /** Başlangıçta kelimenin görünme süresi (ms) */
  flashMs: z.number().int().min(300).max(2000),
  /** En kısa görünme süresi (ms) */
  minFlashMs: z.number().int().min(150).max(1000),
});

const dataSchema = z.object({
  words: z
    .array(
      z.object({
        /** Metinde yazıldığı gibi */
        word: z.string().min(1),
        /** Hece sayısı */
        syllables: z.number().int().min(1),
        /** Benzer uzunlukta 2-3 çeldirici (aynı grubun başka metinlerinden) */
        distractors: z.array(z.string().min(1)).min(2).max(3),
      }),
    )
    .min(3)
    .max(10),
});

type Params = z.infer<typeof paramsSchema>;
type Data = z.infer<typeof dataSchema>;

export const hizliKelime: ExerciseTypeModule<Params, Data> = {
  type: ExerciseType.HIZLI_KELIME,
  code: 'E5',
  paramsSchema,
  dataSchema,
  // Kartlar 1-2 dakika; ardından metin okunur (okuma ayrı sayılmaz).
  minutes: () => wholeMinutes(2),
  questionPositions: () => [],
};
