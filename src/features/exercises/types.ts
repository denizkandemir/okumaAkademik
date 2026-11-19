import type { QuizQuestion } from '@/features/game/quiz/quiz-view';

/** Sunucudaki `exercise_type` değerleri (02-egzersiz-katalogu.md, E1-E11). */
export type ExerciseType =
  | 'TEKRARLI_OKUMA'
  | 'DINLE_SONRA_OKU'
  | 'DINLERKEN_OKU'
  | 'OBEK_OKUMA'
  | 'HIZLI_KELIME'
  | 'PIRIL_ISIGI'
  | 'KOK_EK'
  | 'ANLAMA_STRATEJI'
  | 'LGS_PARAGRAF'
  | 'GORSEL_OKUMA'
  | 'HECE_TOPU';

/** GET /me/training/today */
export type TrainingResponse = {
  items: {
    itemId: string;
    type: ExerciseType;
    /** Katalog kodu, ör. "E1" */
    code: string;
    /** Tahmini süre (dakika) */
    minutes: number;
    /** Bugün bitirildi mi */
    done: boolean;
  }[];
  totalMinutes: number;
  /** Plandaki egzersizlerin hepsi bugün bitti mi */
  done: boolean;
};

export type TrainingItem = TrainingResponse['items'][number];

/** POST /exercises/:itemId/sessions */
export type StartExerciseResponse<P = unknown, D = unknown> = {
  sessionId: string;
  item: { id: string; type: ExerciseType; code: string; gradeBand: string; params: P; data: D };
  text: {
    id: string;
    title: string;
    theme: string;
    paragraphs: string[];
    wordCount: number;
  } | null;
  /** Cevapsız sorular, sırasıyla. */
  questions: QuizQuestion[];
};

/** E1 Tekrarlı okuma */
export type RepeatedReadingParams = { repeatCount: number; goalPercent: number };
export type RepeatedReadingResult = { reads: { durationSeconds: number }[] };

/** E4 Öbek öbek oku */
export type CueLevel = 'full' | 'half' | 'none';
export type ChunkReadingParams = { cueLevel: CueLevel };
export type ChunkReadingData = { chunks: string[][]; questionPositions: number[] };
export type ChunkReadingResult = { readSeconds: number };

/** PATCH /exercise-sessions/:id gövdesi. */
export type FinishExerciseRequest<R> = { durationSeconds: number; result: R };

/** PATCH /exercise-sessions/:id yanıtı (ölçüler sunucuda hesaplanır). */
export type FinishExerciseResponse = {
  sessionId: string;
  durationSeconds: number;
  wpmFirst: number | null;
  wpmLast: number | null;
  /** E1: ilk okumaya göre hız değişimi (yüzde) */
  score: number | null;
  comprehension: number | null;
  questionsTotal: number | null;
  firstTryCorrect: number | null;
  lokum: { earned: number; balance: number };
  streak: number;
};
