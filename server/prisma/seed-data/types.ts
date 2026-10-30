import type {
  City,
  LessonKind,
  ReadingLevel,
  TextTheme,
} from '../../src/generated/prisma/enums.js';

/** Okuma metni. Sınıf aralıkları (minGrade-maxGrade) metnin zorluğuna göre seçilir. */
export type SeedText = {
  id: string;
  title: string;
  level: ReadingLevel;
  estimatedMinutes: number;
  /** Hikâye okunarak seçilen tema; migration'daki eşlemeyle aynı olmalı. */
  theme: TextTheme;
  minGrade: number;
  maxGrade: number;
  paragraphs: string[];
};

/** Anlama sorusu: tam 3 şık, `correctIndex` doğru şıkkın sırası (0-2). */
export type SeedQuestion = {
  prompt: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  /** Yanlış cevaptan sonra; cevabı söylemeden metnin ilgili yerine yönlendirir. */
  hint: string;
  /** Doğru cevaptan sonra; över ve tek cümleyle açıklar. */
  explanation: string;
};

/** Metindeki bir kelime (metinde yazıldığı gibi) ve çocuk diliyle anlamı. */
export type SeedGlossary = { word: string; meaning: string };

type SeedLessonBase = {
  /** Okunabilir kimlik: `<şehir>-<sıra iki hane>-<slug>`, ör. "istanbul-03-minik-serce" */
  id: string;
  /** Şehir içindeki sıra (1-10) */
  position: number;
  title: string;
  /** Ders kartındaki tek cümlelik özet */
  summary: string;
};

export type SeedStoryLesson = SeedLessonBase & {
  kind: typeof LessonKind.STORY;
  text: SeedText;
  /** Tam 3 soru, sırasıyla */
  questions: SeedQuestion[];
  glossary: SeedGlossary[];
};

export type SeedChestLesson = SeedLessonBase & { kind: typeof LessonKind.CHEST };

export type SeedLesson = SeedStoryLesson | SeedChestLesson;

/** Bir şehrin 10 dersi (5. ve 10. sandık), sırasıyla. */
export type SeedCity = { city: City; lessons: SeedLesson[] };
