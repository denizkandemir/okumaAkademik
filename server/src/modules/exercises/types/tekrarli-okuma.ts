import { z } from 'zod';

import { ExerciseType } from '../../../generated/prisma/enums.js';
import {
  CALM_WPM,
  fitDurations,
  questionPositionsSchema,
  wholeMinutes,
  wordsPerMinute,
  type ExerciseTypeModule,
} from './common.js';

/**
 * E1 Tekrarlı okuma ve hedef grafiği: aynı kısa metin 2-4 kez okunur, her okumanın hızı grafikte
 * görünür; hedef çizgisi ilk okumanın %10-20 üstündedir. Son okumadan sonra sorular.
 */
const paramsSchema = z.object({
  /** Okuma sayısı (2-4) */
  repeatCount: z.number().int().min(2).max(4),
  /** Hedef: ilk okumaya göre hız artışı (yüzde, 10-20) */
  goalPercent: z.number().int().min(10).max(20),
});

const dataSchema = z.object({ questionPositions: questionPositionsSchema(3) });

const resultSchema = z.object({
  reads: z
    .array(z.object({ durationSeconds: z.number().int().min(1) }))
    .min(1)
    .max(4),
});

type Params = z.infer<typeof paramsSchema>;
type Data = z.infer<typeof dataSchema>;
type Result = z.infer<typeof resultSchema>;

export const tekrarliOkuma: ExerciseTypeModule<Params, Data, Result> = {
  type: ExerciseType.TEKRARLI_OKUMA,
  code: 'E1',
  paramsSchema,
  dataSchema,
  minutes: ({ params, gradeBand, wordCount }) =>
    // Okumalar sakin hızda; her okuma biraz hızlanır. Sorular ve grafik ≈ 1 dakika.
    wholeMinutes((wordCount * params.repeatCount * 0.9) / CALM_WPM[gradeBand] + 1),
  questionPositions: (data) => data.questionPositions,
  finish: {
    resultSchema,
    metrics: ({ params, result, wordCount, durationSeconds }) => {
      const reads = fitDurations(
        result.reads.slice(0, params.repeatCount).map((read) => read.durationSeconds),
        durationSeconds,
      );
      const speeds = reads.map((seconds) => wordsPerMinute(wordCount, seconds));
      const first = speeds[0] ?? null;
      const last = speeds.at(-1) ?? null;
      const change =
        first !== null && last !== null ? Math.round(((last - first) / first) * 1000) / 10 : null;
      return {
        wpmFirst: first,
        wpmLast: last,
        score: change,
        details: {
          goalPercent: params.goalPercent,
          reads: reads.map((seconds, index) => ({
            durationSeconds: seconds,
            wordsPerMinute: speeds[index],
          })),
        },
      };
    },
  },
};
