export type ReadingLevel = 1 | 2 | 3;

export const LevelLabels: Record<ReadingLevel, string> = {
  1: 'Başlangıç',
  2: 'Orta',
  3: 'İleri',
};

/** GET /texts listesindeki öğe (paragraflar hariç). */
export type TextSummary = {
  id: string;
  title: string;
  level: ReadingLevel;
  /** Dakika cinsinden tahmini okuma süresi. */
  estimatedMinutes: number;
};

/** GET /texts/:id */
export type ReadingText = TextSummary & {
  paragraphs: string[];
};

/** PATCH /reading-sessions/:id yanıtı. */
export type ReadingSessionResult = {
  id: string;
  progress: number;
  durationSeconds: number;
  completed: boolean;
  /** Kazanılan lokum. Backend henüz göndermiyor; gönderdiğinde bitiş ekranında gösterilir. */
  lokum?: number;
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
