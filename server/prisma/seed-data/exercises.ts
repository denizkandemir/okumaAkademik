import {
  CognitiveLevel,
  ContentSource,
  ContentStatus,
  ExerciseType,
  GradeBand,
  LessonKind,
  type City,
} from '../../src/generated/prisma/enums.js';
import type { Prisma } from '../../src/generated/prisma/client.js';
import { chunkParagraphs } from '../../src/lib/chunker.js';
import { syllableCountOf, syllabifyParagraphs } from '../../src/lib/syllables.js';
import type { SeedCity, SeedGlossary, SeedQuestion, SeedStoryLesson, SeedText } from './types.js';

/**
 * Mevcut metinlerden üretilen egzersiz örnekleri (`source = SEED`, `status = APPROVED`). Üretim
 * belirlenimcidir: aynı içerik aynı örnekleri verir. Örnekler İstanbul'un ilk hikâyelerinden başlar,
 * böylece yolculuğa yeni başlayan çocuk da (kilitli metinler önerilmez) antrenman görür.
 */

export type SeedExerciseItem = {
  id: string;
  type: ExerciseType;
  gradeBand: GradeBand;
  textId: string;
  params: Prisma.InputJsonObject;
  data: Prisma.InputJsonObject;
  status: ContentStatus;
  source: ContentSource;
};

/** Bir hikâyenin bir sınıf grubundaki metni ve soruları. */
type Variant = {
  lessonId: string;
  city: City;
  gradeBand: GradeBand;
  text: SeedText;
  questions: SeedQuestion[];
  glossary: SeedGlossary[];
};

/** E1 metni 60-200 kelime (katalog). */
export const E1_WORDS = { min: 60, max: 200 };
/** E11 metni 40-100 kelime (G1 sürümleri). */
export const E11_WORDS = { min: 40, max: 100 };

const COGNITIVE_ORDER: CognitiveLevel[] = [
  CognitiveLevel.HATIRLAMA,
  CognitiveLevel.ANLAMA,
  CognitiveLevel.CIKARIM,
  CognitiveLevel.DEGERLENDIRME,
];

const LOCALE = 'tr-TR';
const EDGE_PUNCTUATION = /^[^\p{L}]+|[^\p{L}]+$/gu;

function variantsOf(cities: readonly SeedCity[]): Variant[] {
  return cities.flatMap(({ city, lessons }) =>
    lessons
      .filter((lesson): lesson is SeedStoryLesson => lesson.kind === LessonKind.STORY)
      .flatMap((story) => [
        {
          lessonId: story.id,
          city,
          gradeBand: GradeBand.G2 as GradeBand,
          text: story.text,
          questions: story.questions,
          glossary: story.glossary,
        },
        ...story.versions.map((version) => ({ lessonId: story.id, city, ...version })),
      ]),
  );
}

function item(
  code: string,
  type: ExerciseType,
  gradeBand: GradeBand,
  variant: Variant,
  params: Record<string, unknown>,
  data: Record<string, unknown>,
): SeedExerciseItem {
  return {
    id: `${code}-${gradeBand.toLowerCase()}-${variant.lessonId}`,
    type,
    gradeBand,
    textId: variant.text.id,
    params: params as Prisma.InputJsonObject,
    data: data as Prisma.InputJsonObject,
    status: ContentStatus.APPROVED,
    source: ContentSource.SEED,
  };
}

/** Bir kelimenin baştaki ve sondaki noktalamasız hâli. */
function bareWord(word: string): string {
  return word.replace(EDGE_PUNCTUATION, '');
}

/** Çeldiriciye uygun kelime: küçük harfle başlar, kesme işareti ve rakam yok. */
function plainWord(word: string): boolean {
  return /^[a-zçğıöşüâîû]+$/.test(word) && word === word.toLocaleLowerCase(LOCALE);
}

/** E5 çeldiricisinde kelimeyle uzunluk farkı en fazla bu kadar. */
export const E5_MAX_LENGTH_GAP = 2;
/** E5 çeldiricisinin kelimeyle en az bu oranda ortak harfi olmalı. */
export const E5_MIN_SIMILARITY = 0.6;
/** E5 çeldiricisi kelimeyle aynı ilk bu kadar harfle başlar (tr-TR küçük harfle). */
export const E5_SAME_PREFIX = 2;

/**
 * İki kelimenin ortak harf oranı (0-1): ortak harfler (tekrarlar dahil, sırasız) / uzun olanın
 * harf sayısı. "kuşlar" ile "kuşkular" → 6/8.
 */
export function letterSimilarity(a: string, b: string): number {
  const left = Array.from(a.toLocaleLowerCase(LOCALE));
  const right = Array.from(b.toLocaleLowerCase(LOCALE));
  const counts = new Map<string, number>();
  for (const char of right) counts.set(char, (counts.get(char) ?? 0) + 1);
  let shared = 0;
  for (const char of left) {
    const count = counts.get(char) ?? 0;
    if (count > 0) {
      shared++;
      counts.set(char, count - 1);
    }
  }
  return shared / Math.max(left.length, right.length, 1);
}

/** Görsel olarak benzer mi: ilk iki harfi aynı, uzunluğu yakın, harflerinin çoğu ortak. */
export function looksSimilar(word: string, other: string): boolean {
  const a = word.toLocaleLowerCase(LOCALE);
  const b = other.toLocaleLowerCase(LOCALE);
  return (
    a !== b &&
    Array.from(a).slice(0, E5_SAME_PREFIX).join('') ===
      Array.from(b).slice(0, E5_SAME_PREFIX).join('') &&
    Math.abs(Array.from(a).length - Array.from(b).length) <= E5_MAX_LENGTH_GAP &&
    letterSimilarity(a, b) >= E5_MIN_SIMILARITY
  );
}

/**
 * E5 kelimeleri: önce sözlük kelimeleri, sonra 3 ve daha fazla heceli kelimeler (en uzundan),
 * en fazla 6. Yalnızca metinde küçük harfle geçen düz kelimeler (seçenekler hep küçük harfle
 * görünür). Çeldiriciler aynı grubun başka metinlerinden ve kelimeye görsel olarak benzer:
 * ilk iki harfi aynı, uzunluğu yakın, harflerinin çoğu ortak (en benzer 3). En az 2 benzer
 * çeldiricisi bulunmayan kelime atlanır.
 */
function quickWords(variant: Variant, pool: readonly string[]) {
  const textWords = variant.text.paragraphs.join(' ').split(' ').map(bareWord).filter(plainWord);
  const candidates = [
    ...variant.glossary.map((entry) => entry.word).filter((word) => textWords.includes(word)),
    ...[...textWords]
      .filter((word) => syllableCountOf(word) >= 3)
      .sort((a, b) => b.length - a.length || a.localeCompare(b, LOCALE)),
  ];
  const seen = new Set<string>();
  return candidates
    .filter((word) => {
      if (seen.has(word)) return false;
      seen.add(word);
      return true;
    })
    .map((word) => {
      const syllables = syllableCountOf(word);
      const length = Array.from(word).length;
      const distractors = pool
        .filter((other) => looksSimilar(word, other))
        .sort(
          (a, b) =>
            letterSimilarity(word, b) - letterSimilarity(word, a) ||
            Math.abs(Array.from(a).length - length) - Math.abs(Array.from(b).length - length) ||
            Number(syllableCountOf(b) === syllables) - Number(syllableCountOf(a) === syllables) ||
            a.localeCompare(b, LOCALE),
        )
        .slice(0, 3);
      return { word, syllables, distractors };
    })
    .filter((entry) => entry.distractors.length >= 2)
    .slice(0, 6);
}

/** E11 soruları: en kolay 2 soru (bilişsel düzeyi en düşük), metindeki sırasıyla. */
function easiestPositions(questions: readonly SeedQuestion[]): number[] {
  return questions
    .map((question, index) => ({ position: index + 1, level: question.cognitiveLevel }))
    .sort(
      (a, b) =>
        COGNITIVE_ORDER.indexOf(a.level) - COGNITIVE_ORDER.indexOf(b.level) ||
        a.position - b.position,
    )
    .slice(0, 2)
    .map((entry) => entry.position)
    .sort((a, b) => a - b);
}

export function buildExerciseItems(cities: readonly SeedCity[]): SeedExerciseItem[] {
  const variants = variantsOf(cities);
  const istanbulOf = (band: GradeBand) =>
    variants.filter((v) => v.city === cities[0]?.city && v.gradeBand === band);
  const items: SeedExerciseItem[] = [];

  // E1 Tekrarlı okuma: her grupta 2. G4 sürümleri 60-200 kelimeden uzun (≈ 255); G4'e aynı
  // derslerin G3 metinleri (≈ 185-190 kelime) verilir.
  for (const band of [GradeBand.G1, GradeBand.G2, GradeBand.G3, GradeBand.G4]) {
    const source = istanbulOf(band === GradeBand.G4 ? GradeBand.G3 : band);
    for (const variant of source
      .filter((v) => v.text.wordCount >= E1_WORDS.min && v.text.wordCount <= E1_WORDS.max)
      .slice(0, 2)) {
      items.push(
        item(
          'e1',
          ExerciseType.TEKRARLI_OKUMA,
          band,
          variant,
          {
            repeatCount: band === GradeBand.G1 ? 2 : 3,
            goalPercent: band === GradeBand.G1 ? 10 : 15,
          },
          { questionPositions: [1, 2, 3] },
        ),
      );
    }
  }

  // E4 Öbek öbek oku: G1-G3'te 2 (biri tam, biri yarı ipucu).
  for (const band of [GradeBand.G1, GradeBand.G2, GradeBand.G3]) {
    const source = istanbulOf(band);
    [source[0], source[2]].forEach((variant, index) => {
      if (!variant) return;
      items.push(
        item(
          'e4',
          ExerciseType.OBEK_OKUMA,
          band,
          variant,
          { cueLevel: index === 0 ? 'full' : 'half' },
          { chunks: chunkParagraphs(variant.text.paragraphs), questionPositions: [1, 2] },
        ),
      );
    });
  }

  // E5 Hızlı kelime: G1-G2'de 2.
  for (const band of [GradeBand.G1, GradeBand.G2]) {
    const source = istanbulOf(band);
    for (const variant of [source[1], source[0]]) {
      if (!variant) continue;
      const pool = [
        ...new Set(
          variants
            .filter((v) => v.gradeBand === band && v.text.id !== variant.text.id)
            .flatMap((v) => v.text.paragraphs.join(' ').split(' ').map(bareWord))
            .filter(plainWord),
        ),
      ].sort((a, b) => a.localeCompare(b, LOCALE));
      items.push(
        item(
          'e5',
          ExerciseType.HIZLI_KELIME,
          band,
          variant,
          band === GradeBand.G1
            ? { flashMs: 1200, minFlashMs: 500 }
            : { flashMs: 900, minFlashMs: 350 },
          { words: quickWords(variant, pool) },
        ),
      );
    }
  }

  // E6 Pırıl'ın ışığı: G2-G4'te 2, bütün metin ve soruları.
  for (const band of [GradeBand.G2, GradeBand.G3, GradeBand.G4]) {
    for (const variant of istanbulOf(band).slice(0, 2)) {
      items.push(
        item(
          'e6',
          ExerciseType.PIRIL_ISIGI,
          band,
          variant,
          {
            speedFactor: 1.1,
            segmentWords: band === GradeBand.G2 ? 30 : band === GradeBand.G3 ? 40 : 50,
            fadeUnit: 'line',
          },
          { questionPositions: [1, 2, 3] },
        ),
      );
    }
  }

  // E11 Hece hece oku: yalnızca G1, her şehirde ilk iki uygun G1 sürümü.
  for (const { city } of cities) {
    const source = variants
      .filter(
        (v) =>
          v.city === city &&
          v.gradeBand === GradeBand.G1 &&
          v.text.wordCount >= E11_WORDS.min &&
          v.text.wordCount <= E11_WORDS.max,
      )
      .slice(0, 2);
    for (const variant of source) {
      items.push(
        item(
          'e11',
          ExerciseType.HECE_TOPU,
          GradeBand.G1,
          variant,
          { marker: 'both', pointer: 'ball' },
          {
            words: syllabifyParagraphs(variant.text.paragraphs),
            questionPositions: easiestPositions(variant.questions),
          },
        ),
      );
    }
  }

  return items;
}
