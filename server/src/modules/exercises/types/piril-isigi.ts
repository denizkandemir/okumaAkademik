import { z } from 'zod';

import { ExerciseType } from '../../../generated/prisma/enums.js';
import {
  CALM_WPM,
  clampRound,
  fitDurations,
  questionPositionsSchema,
  wholeMinutes,
  wordsPerMinute,
  type ExerciseTypeModule,
} from './common.js';

/**
 * E6 Pırıl'ın ışığı (okuma temposu): çocuk ilk bölümü kendi hızında okur; sonra yumuşak bir ışık
 * okunmuş satırları arkadan soldurur (temel hız × `speedFactor`). Sonunda sorular.
 */

/** Hız çarpanının sınırları ve oturumdan oturuma adımı. */
export const SPEED_FACTOR = { min: 1.05, max: 1.2, step: 0.03 };
/** Anlama bunun altındaysa ışık bir sonraki oturumda yavaşlar, üstündeyse çok az hızlanır. */
export const E6_GOOD_COMPREHENSION = 0.8;

const paramsSchema = z.object({
  /** Temel hıza göre çarpan (1,05-1,20) */
  speedFactor: z.number().min(SPEED_FACTOR.min).max(SPEED_FACTOR.max),
  /** Temel hızın ölçüldüğü ilk bölümün kelime sayısı */
  segmentWords: z.number().int().min(15).max(80),
  /** Soldurma birimi */
  fadeUnit: z.enum(['line', 'word']),
});

const dataSchema = z.object({ questionPositions: questionPositionsSchema(3) });

/** Bitirme gövdesi: ilk bölüm (temel hız) ve ışıklı bölüm. */
const resultSchema = z.object({
  /** İlk bölümün kelime sayısı (uygulama cümle sonuna tamamlar) */
  baselineWords: z.number().int().min(1),
  baselineSeconds: z.number().int().min(1),
  /** Işıklı bölümün okuma süresi (duraklatmalar hariç) */
  lightSeconds: z.number().int().min(1),
  pauses: z.number().int().min(0).max(100),
});

type Params = z.infer<typeof paramsSchema>;
type Data = z.infer<typeof dataSchema>;
type Result = z.infer<typeof resultSchema>;

/** Bir sonraki oturumun çarpanı: anlama ≥ 0,8 ise +0,03, altındaysa −0,03; anlama yoksa aynı. */
export function nextSpeedFactor(speedFactor: number, comprehension: number | null): number {
  if (comprehension === null) return clampRound(speedFactor, SPEED_FACTOR.min, SPEED_FACTOR.max);
  const step = comprehension >= E6_GOOD_COMPREHENSION ? SPEED_FACTOR.step : -SPEED_FACTOR.step;
  return clampRound(speedFactor + step, SPEED_FACTOR.min, SPEED_FACTOR.max);
}

export const pirilIsigi: ExerciseTypeModule<Params, Data, Result> = {
  type: ExerciseType.PIRIL_ISIGI,
  code: 'E6',
  paramsSchema,
  dataSchema,
  minutes: ({ params, gradeBand, wordCount }) =>
    wholeMinutes(wordCount / (CALM_WPM[gradeBand] * params.speedFactor) + 1),
  questionPositions: (data) => data.questionPositions,
  // Önceki E6 oturumunun belirlediği çarpan; yoksa örneğin kendi çarpanı.
  effectiveParams: ({ params, lastDetails }) => {
    const next = z
      .number()
      .min(SPEED_FACTOR.min)
      .max(SPEED_FACTOR.max)
      .safeParse(lastDetails?.nextSpeedFactor);
    return next.success ? { ...params, speedFactor: next.data } : params;
  },
  finish: {
    resultSchema,
    metrics: ({ params, result, wordCount, durationSeconds, comprehension }) => {
      // İlk bölüm metnin en az 1 kelimesini dışarıda bırakır.
      const baselineWords = Math.max(1, Math.min(result.baselineWords, wordCount - 1));
      const lightWords = Math.max(0, wordCount - baselineWords);
      const [baselineSeconds = 1, lightSeconds = 1] = fitDurations(
        [result.baselineSeconds, result.lightSeconds],
        durationSeconds,
      );
      const baselineWpm = wordsPerMinute(baselineWords, baselineSeconds);
      const lightWpm = wordsPerMinute(lightWords, lightSeconds);
      return {
        wpmFirst: baselineWpm,
        wpmLast: lightWpm,
        score: null,
        details: {
          speedFactor: params.speedFactor,
          nextSpeedFactor: nextSpeedFactor(params.speedFactor, comprehension),
          fadeUnit: params.fadeUnit,
          baselineWords,
          baselineSeconds,
          baselineWpm,
          lightSeconds,
          lightWpm,
          pauses: result.pauses,
        },
      };
    },
  },
};
