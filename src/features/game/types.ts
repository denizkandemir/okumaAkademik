/**
 * Oyun API'sinin yanıt tipleri. Sunucudaki kodla birebir aynıdır:
 * - `server/src/modules/journey/journey.routes.ts` (GET /me/journey)
 * - `server/src/modules/journey/lessons.routes.ts` (GET /lessons/:id, POST /lessons/:id/answers,
 *   POST /lessons/:id/complete)
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

/** GET /me/stats (server/src/modules/journey/journey.routes.ts). */
export type StatsResponse = {
  level: number;
  lokum: number;
  streak: number;
  readToday: boolean;
  streakAtRisk: boolean;
  bestStreak: number;
  todayMinutes: number;
  dailyGoalMinutes: number;
  storiesDone: number;
  minutesTotal: number;
  /** Bugün dahil son 7 gün, eskiden yeniye; `day` ör. "Pzt". */
  week: { day: string; done: boolean }[];
  cities: { id: CityId; status: CityStatus }[];
  achievements: { id: string; title: string; description: string; earned: boolean }[];
  /** ISO zaman; hiç okumadıysa `null`. */
  lastReadAt: string | null;
  finished: boolean;
};

/** POST /lessons/:id/answers gövdesi (`answerSchema`; `choiceIndex` 0-2). */
export type AnswerRequest = {
  readingSessionId: string;
  questionId: string;
  choiceIndex: number;
};

/**
 * POST /lessons/:id/answers yanıtı. Doğruysa `explanation`, yanlışsa `hint` gelir. `lokum` yalnızca
 * gösterim içindir: bu okumada ilk denemede doğru ve ders daha önce bitmemişse 5, yoksa 0.
 */
export type AnswerResponse =
  | { correct: true; explanation: string; lokum: number }
  | { correct: false; hint: string; lokum: number };

/** POST /lessons/:id/complete gövdesi (`completeSchema`): hikâyede zorunlu, sandıkta yok. */
export type CompleteLessonRequest = { readingSessionId?: string };

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
