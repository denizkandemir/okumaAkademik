import type {
  City,
  CognitiveLevel,
  GradeBand,
  LessonKind,
  QuestionType,
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
  /** Metin ölçüleri; paragraflardan src/lib/readability.ts ile hesaplanır. */
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  atesmanScore: number | null;
};

/** Anlama sorusu: 3-4 şık, `correctIndex` doğru şıkkın sırası (0'dan başlar). */
export type SeedQuestion = {
  /** Soru türü (Q1-Q13); soru okunarak seçilir, migration'daki eşlemeyle aynı olmalı. */
  type: QuestionType;
  cognitiveLevel: CognitiveLevel;
  /** MEB kazanım kodu (varsa) */
  mebOutcomeCode?: string;
  prompt: string;
  options: [string, string, string] | [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
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

/** Hikâyenin G2 dışındaki sınıf grubu sürümü: aynı hikâye, grubun dil düzeyinde. */
export type SeedStoryVersion = {
  gradeBand: GradeBand;
  text: SeedText;
  /** Tam 3 soru, sırasıyla */
  questions: SeedQuestion[];
  glossary: SeedGlossary[];
};

export type SeedStoryLesson = SeedLessonBase & {
  kind: typeof LessonKind.STORY;
  /** G2 (3-4. sınıf) metni; grubun sürümü yoksa bu okutulur. */
  text: SeedText;
  /** Tam 3 soru, sırasıyla */
  questions: SeedQuestion[];
  glossary: SeedGlossary[];
  /** G1, G3 ve G4 sürümleri; henüz yazılmadıysa boş. */
  versions: SeedStoryVersion[];
};

export type SeedChestLesson = SeedLessonBase & { kind: typeof LessonKind.CHEST };

export type SeedLesson = SeedStoryLesson | SeedChestLesson;

/** Bir şehrin 10 dersi (5. ve 10. sandık), sırasıyla. */
export type SeedCity = { city: City; lessons: SeedLesson[] };
