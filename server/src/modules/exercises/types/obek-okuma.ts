import { z } from 'zod';

import { ExerciseType } from '../../../generated/prisma/enums.js';
import { MAX_CHUNK_WORDS } from '../../../lib/chunker.js';
import {
  CALM_WPM,
  questionPositionsSchema,
  wholeMinutes,
  wordsPerMinute,
  type ExerciseTypeModule,
} from './common.js';

/**
 * E4 Öbek öbek oku: metin anlamlı öbeklere bölünmüş gösterilir (ince boşluk ve soluk "/"). İpucu
 * yoğunluğu: full (her öbek), half (yalnız uzun cümleler), none (işaret yok). Sonra 1-2 soru.
 */
const paramsSchema = z.object({ cueLevel: z.enum(['full', 'half', 'none']) });

const dataSchema = z.object({
  /** Paragraf başına öbekler; tek boşlukla birleşince paragrafın aynısı. */
  chunks: z
    .array(
      z
        .array(
          z
            .string()
            .min(1)
            .refine((chunk) => chunk.split(' ').length <= MAX_CHUNK_WORDS, {
              error: `Öbek en fazla ${MAX_CHUNK_WORDS} kelime olmalı.`,
            }),
        )
        .min(1),
    )
    .min(1),
  questionPositions: questionPositionsSchema(2),
});

const resultSchema = z.object({ readSeconds: z.number().int().min(1) });

type Params = z.infer<typeof paramsSchema>;
type Data = z.infer<typeof dataSchema>;
type Result = z.infer<typeof resultSchema>;

export const obekOkuma: ExerciseTypeModule<Params, Data, Result> = {
  type: ExerciseType.OBEK_OKUMA,
  code: 'E4',
  paramsSchema,
  dataSchema,
  minutes: ({ gradeBand, wordCount }) => wholeMinutes(wordCount / CALM_WPM[gradeBand] + 1),
  questionPositions: (data) => data.questionPositions,
  finish: {
    resultSchema,
    metrics: ({ params, result, wordCount, durationSeconds }) => {
      const readSeconds = Math.max(1, Math.min(result.readSeconds, durationSeconds));
      const wpm = wordsPerMinute(wordCount, readSeconds);
      return {
        wpmFirst: wpm,
        wpmLast: wpm,
        score: null,
        details: { cueLevel: params.cueLevel, readSeconds },
      };
    },
  },
};
