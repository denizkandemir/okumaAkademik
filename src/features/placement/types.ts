/**
 * Seviye belirleme API'sinin tipleri (server/src/modules/placement/placement.routes.ts). Sunucu
 * değişirse burayı da güncelleyin.
 */
import type { User } from '@/features/auth/types';
import type { QuizQuestion } from '@/features/game/quiz/quiz-view';
import type { StoryText } from '@/features/reading/reading-view';

/** Sınıf grubu: G1 = 1-2, G2 = 3-4, G3 = 5-6, G4 = 7-8. sınıf. */
export type GradeBand = 'G1' | 'G2' | 'G3' | 'G4';

/** GET /me */
export type MeResponse = {
  user: User;
  /** Seviye belirleme henüz yapılmadı. */
  needsPlacement: boolean;
};

/** GET /placement: grubun 2 metni, okuma sırasıyla; sorular cevapsız. */
export type PlacementResponse = {
  gradeBand: GradeBand;
  texts: { text: StoryText & { gradeBand: GradeBand }; questions: QuizQuestion[] }[];
};

/** POST /placement/complete gövdesi: her metnin okuma kaydı. */
export type CompletePlacementRequest = { readingSessionIds: string[] };

/** POST /placement/complete yanıtı. Hız yalnızca anlamayla birlikte gösterilir. */
export type CompletePlacementResponse = {
  baseline: {
    gradeBand: GradeBand;
    wordsPerMinute: number;
    comprehension: number;
    /** ISO zaman */
    measuredAt: string;
  };
};
