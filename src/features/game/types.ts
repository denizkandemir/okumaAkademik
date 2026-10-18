/**
 * Oyun API'sinin yanıt tipleri. Sunucudaki kodla birebir aynıdır:
 * - `server/src/modules/journey/journey.routes.ts` (GET /me/journey)
 * - `server/src/modules/journey/lessons.routes.ts` (GET /lessons/:id, POST /lessons/:id/complete)
 * - durumlar `server/src/lib/journey.ts`, seviye `server/src/lib/reading-level.ts`
 * Sunucu değişirse burayı da güncelleyin.
 */
import type { CityId } from './theme';

/** Sunucudaki `LessonStatus`. */
export type LessonStatus = 'done' | 'current' | 'locked';
/** Sunucudaki `CityStatus`. */
export type CityStatus = 'completed' | 'current' | 'locked';
export type LessonKind = 'story' | 'chest';
/** Sunucudaki `ApiReadingLevel`: 1 Başlangıç, 2 Orta, 3 İleri. */
export type ApiReadingLevel = 1 | 2 | 3;

export type JourneyLesson = {
  id: string;
  position: number;
  kind: LessonKind;
  title: string;
  status: LessonStatus;
  /** En iyi yıldız (1-3); sandıkta ve bitmemiş derste `null`. */
  stars: number | null;
};

/** GET /me/journey?city=<id> */
export type JourneyResponse = {
  level: number;
  maxLevel: number;
  finished: boolean;
  currentCity: CityId;
  city: {
    id: CityId;
    no: number;
    levelFrom: number;
    levelTo: number;
    lessonsDone: number;
    lessonsTotal: number;
  };
  lessons: JourneyLesson[];
  cities: { id: CityId; status: CityStatus; lessonsDone: number }[];
  stats: { lokum: number; streak: number; readToday: boolean; streakAtRisk: boolean };
};

/** GET /lessons/:id */
export type LessonDetailResponse = {
  lesson: {
    id: string;
    city: CityId;
    position: number;
    kind: LessonKind;
    title: string;
    summary: string;
    status: LessonStatus;
    bestStars: number | null;
    /** Bu oynayışta kazanılabilecek en fazla lokum; bitmiş derste 0. */
    maxLokum: number;
  };
  /** Sandıkta `null`. */
  text: {
    id: string;
    title: string;
    level: ApiReadingLevel;
    estimatedMinutes: number;
    paragraphs: string[];
  } | null;
  glossary: { word: string; meaning: string }[];
  /** Doğru cevap, ipucu ve açıklama gönderilmez. */
  questions: { id: string; position: number; prompt: string; options: string[] }[];
};

/** POST /lessons/:id/complete */
export type CompleteLessonResponse = {
  firstTime: boolean;
  /** Sandıkta `null`. */
  stars: number | null;
  firstTryCorrect: number | null;
  durationSeconds: number | null;
  lokum: { lesson: number; levelUp: number; cityUnlock: number; total: number; balance: number };
  level: { before: number; after: number; leveledUp: boolean };
  cityUnlocked: CityId | null;
  finished: boolean;
  nextLessonId: string | null;
  nextLessonTitle: string | null;
  streak: number;
};
