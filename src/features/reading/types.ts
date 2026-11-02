import type { CityId } from '@/features/game/theme';

export type ReadingLevel = 1 | 2 | 3;

/** GET /texts listesindeki öğe (paragraflar hariç). */
export type TextSummary = {
  id: string;
  title: string;
  level: ReadingLevel;
  /** Dakika cinsinden tahmini okuma süresi. */
  estimatedMinutes: number;
  /** Hikâyenin teması, Türkçe adıyla (ör. "Arkadaşlık"). */
  theme: string;
};

/** GET /texts listesindeki öğe (server/src/modules/texts/texts.routes.ts). */
export type LibraryText = TextSummary & {
  /** Metni okutan yolculuk dersinin şehri; dersi olmayan metinde `null`. */
  city: CityId | null;
  /** Kullanıcının bu metinde tamamlanmış bir okuması var mı. */
  read: boolean;
};

/** GET /texts/:id */
export type ReadingText = TextSummary & {
  paragraphs: string[];
  /** Metni okutan yolculuk dersinin şehri; dersi olmayan metinde `null`. */
  city: CityId | null;
};

/** POST /reading-sessions yanıtı (201; server/src/modules/progress/progress.routes.ts). */
export type ReadingSessionStart = { id: string };

/** PATCH /reading-sessions/:id yanıtı (server/src/modules/progress/progress.routes.ts). */
export type ReadingSessionResult = {
  id: string;
  progress: number;
  durationSeconds: number;
  completed: boolean;
};

/** GET /me/progress */
export type ProgressSummary = {
  dailyGoal: {
    goalMinutes: number;
    readMinutes: number;
  };
  continueReading: {
    textId: string;
    title: string;
    level: ReadingLevel;
    /** 0 ile 1 arası */
    progress: number;
  } | null;
};
