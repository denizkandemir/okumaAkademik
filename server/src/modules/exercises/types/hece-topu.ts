import { z } from 'zod';

import { ExerciseType } from '../../../generated/prisma/enums.js';
import {
  clampRound,
  questionPositionsSchema,
  wholeMinutes,
  wordsPerMinute,
  type ExerciseTypeModule,
} from './common.js';

/**
 * E11 Hece hece oku (zıplayan top): heceleri belli metinde küçük bir top heceden heceye zıplar,
 * çocuk sesli okur. Hız çocuğun kendi temposudur ve onu zorlamaz. Yalnızca G1.
 */

/** Hece hızının sınırları (hece/saniye). */
export const SYLLABLE_PACE = { min: 0.6, max: 3 };
/** Hız ölçümü yokken G1 için sakin hece hızı (hece/saniye). */
export const CALM_SYLLABLES_PER_SECOND = 1.5;
/** Başlangıç hızı: çocuğun ölçülen hızının %95'i (katalog: %90-100). */
export const START_PACE_RATIO = 0.95;
/** Oturumdan oturuma en fazla ±%5. */
export const PACE_STEP = 0.05;
/** Hız yalnızca anlama bu değer ve üstündeyse artar. */
export const E11_GOOD_COMPREHENSION = 0.8;

const paceSchema = z.number().min(SYLLABLE_PACE.min).max(SYLLABLE_PACE.max);

const paramsSchema = z.object({
  /** Hece ayrımı biçimi: ince boşluk, renk ya da ikisi */
  marker: z.enum(['gap', 'color', 'both']),
  /** Zıplayan işaret: top ya da Pırıl'ın patisi */
  pointer: z.enum(['ball', 'paw']),
  /** Topun hızı (hece/saniye); örnekte yok, oturum başlarken çocuğa göre hesaplanır */
  syllablesPerSecond: paceSchema.optional(),
});

/** Bir kelimenin heceleri (birleşince kelimenin aynısı). */
const wordSchema = z.array(z.string().min(1)).min(1);

const dataSchema = z.object({
  /** Paragraf → kelime → hece; uygulama hiçbir bölme yapmaz. */
  words: z.array(z.array(wordSchema).min(1)).min(1),
  questionPositions: questionPositionsSchema(2),
});

/** Bitirme gövdesi. */
const resultSchema = z.object({
  /** Topla okuma süresi (duraklatmalar hariç) */
  readSeconds: z.number().int().min(1),
  /** Çocuk "Yavaş"ı kullandı mı */
  slowUsed: z.boolean(),
  /** Bir kelimeye dokunup topu yeniden başlatma sayısı */
  restarts: z.number().int().min(0).max(500),
});

type Params = z.infer<typeof paramsSchema>;
type Data = z.infer<typeof dataSchema>;
type Result = z.infer<typeof resultSchema>;

function syllableTotal(data: Data): number {
  return data.words.flat().reduce((sum, word) => sum + word.length, 0);
}

/**
 * Bir sonraki oturumun hızı: anlama ≥ 0,8 ve "Yavaş" kullanılmadıysa ×1,05; anlama düşükse ya da
 * "Yavaş" kullanıldıysa ×0,95. Anlama yoksa aynı.
 */
export function nextSyllablesPerSecond(
  pace: number,
  comprehension: number | null,
  slowUsed: boolean,
): number {
  if (comprehension === null && !slowUsed) {
    return clampRound(pace, SYLLABLE_PACE.min, SYLLABLE_PACE.max);
  }
  const up = comprehension !== null && comprehension >= E11_GOOD_COMPREHENSION && !slowUsed;
  return clampRound(
    pace * (up ? 1 + PACE_STEP : 1 - PACE_STEP),
    SYLLABLE_PACE.min,
    SYLLABLE_PACE.max,
  );
}

export const heceTopu: ExerciseTypeModule<Params, Data, Result> = {
  type: ExerciseType.HECE_TOPU,
  code: 'E11',
  paramsSchema,
  dataSchema,
  minutes: ({ data }) => wholeMinutes(syllableTotal(data) / CALM_SYLLABLES_PER_SECOND / 60 + 1),
  questionPositions: (data) => data.questionPositions,
  /**
   * Önceki E11 oturumunun belirlediği hız; yoksa seviye belirleme hızından (kelime/dk × metnin
   * ortalama hece/kelime ÷ 60 × %95); o da yoksa sakin G1 hızı.
   */
  effectiveParams: ({ params, data, lastDetails, baselineWpm }) => {
    const last = paceSchema.safeParse(lastDetails?.nextSyllablesPerSecond);
    if (last.success) return { ...params, syllablesPerSecond: last.data };
    const words = data.words.flat().length;
    const pace =
      baselineWpm !== null && baselineWpm > 0 && words > 0
        ? ((baselineWpm * (syllableTotal(data) / words)) / 60) * START_PACE_RATIO
        : CALM_SYLLABLES_PER_SECOND;
    return {
      ...params,
      syllablesPerSecond: clampRound(pace, SYLLABLE_PACE.min, SYLLABLE_PACE.max),
    };
  },
  finish: {
    resultSchema,
    metrics: ({ params, result, wordCount, durationSeconds, comprehension }) => {
      const readSeconds = Math.max(1, Math.min(result.readSeconds, durationSeconds));
      const wpm = wordsPerMinute(wordCount, readSeconds);
      const pace = params.syllablesPerSecond ?? CALM_SYLLABLES_PER_SECOND;
      return {
        wpmFirst: wpm,
        wpmLast: wpm,
        score: null,
        details: {
          syllablesPerSecond: pace,
          nextSyllablesPerSecond: nextSyllablesPerSecond(pace, comprehension, result.slowUsed),
          slowUsed: result.slowUsed,
          restarts: result.restarts,
          readSeconds,
        },
      };
    },
  },
};
