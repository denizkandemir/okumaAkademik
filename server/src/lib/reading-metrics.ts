import type { GradeBand } from '../generated/prisma/enums.js';
import { RUSHED_COMPREHENSION_BELOW, RUSHED_WPM_CEILING } from './grade-band.js';

export type ReadingMetricInput = {
  gradeBand: GradeBand;
  wordCount: number;
  durationSeconds: number;
  /** Ders okumasında soru sayısı ve ilk denemede doğru; kitaplık okumasında ikisi de yok. */
  questions?: { total: number; firstTryCorrect: number };
};

export type ReadingMetricValues = {
  gradeBand: GradeBand;
  wordCount: number;
  durationSeconds: number;
  wordsPerMinute: number | null;
  questionsTotal: number | null;
  firstTryCorrect: number | null;
  comprehension: number | null;
  rushed: boolean;
};

/**
 * Biten bir okumanın ölçümü (reading_metrics satırı). Dakikadaki kelime 1, anlama 2 ondalığa
 * yuvarlanır. Acele okuma: hız grubun tavanının üstünde **ve** anlama %60'ın altında; anlama
 * ölçülmediyse (kitaplık) acele sayılmaz. Hız hiçbir zaman tek başına değerlendirilmez.
 */
export function readingMetricValues(input: ReadingMetricInput): ReadingMetricValues {
  const wordsPerMinute =
    input.durationSeconds > 0
      ? Math.round(((input.wordCount * 60) / input.durationSeconds) * 10) / 10
      : null;
  const questions = input.questions && input.questions.total > 0 ? input.questions : null;
  const comprehension = questions
    ? Math.round((questions.firstTryCorrect / questions.total) * 100) / 100
    : null;
  const rushed =
    wordsPerMinute !== null &&
    comprehension !== null &&
    wordsPerMinute > RUSHED_WPM_CEILING[input.gradeBand] &&
    comprehension < RUSHED_COMPREHENSION_BELOW;
  return {
    gradeBand: input.gradeBand,
    wordCount: input.wordCount,
    durationSeconds: input.durationSeconds,
    wordsPerMinute,
    questionsTotal: questions?.total ?? null,
    firstTryCorrect: questions?.firstTryCorrect ?? null,
    comprehension,
    rushed,
  };
}
