import { readdirSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { readingMinutes, wordCount } from '../prisma/seed-data/build.js';
import {
  seedCities,
  seedLessonRows,
  seedLessonTextRows,
  seedPlacementQuestionRows,
  seedPlacementRows,
  seedPlacementTexts,
  seedQuestionRows,
  seedTexts,
  type SeedStoryLesson,
} from '../prisma/seed-data/index.js';
import {
  City,
  CognitiveLevel,
  GradeBand,
  LessonKind,
  QuestionType,
  ReadingLevel,
  TextTheme,
} from '../src/generated/prisma/enums.js';
import { toApiCity } from '../src/lib/city.js';
import { ATESMAN_TARGET, gradeBandOf } from '../src/lib/grade-band.js';
import { textMetrics } from '../src/lib/readability.js';
import { CHEST_POSITIONS, LESSONS_PER_CITY, TOTAL_LESSONS } from '../src/lib/journey.js';

/**
 * Seed içeriğinin doğrulaması (48 hikâye ve 144 soru; docs/tasarim/README.md, karar 9). İçerik
 * değiştiğinde bu test kurallara uymayan hikâyeyi adıyla gösterir.
 */

/** Yolculuk metinlerinin G2 sürümleri: migration'lar yalnızca bunları bilir; yeni sürümler seed'den gelir. */
const g2TextIds = new Set(
  seedLessonTextRows.filter((row) => row.gradeBand === GradeBand.G2).map((row) => row.textId),
);

const stories = seedCities.flatMap(({ city, lessons }) =>
  lessons
    .filter((lesson): lesson is SeedStoryLesson => lesson.kind === LessonKind.STORY)
    .map((lesson) => ({ city, lesson })),
);

/** Şehre göre izin verilen metin seviyeleri: İstanbul'dan Van'a doğru zenginleşir. */
const LEVELS: Record<City, ReadingLevel[]> = {
  [City.ISTANBUL]: [ReadingLevel.BASLANGIC],
  [City.IZMIR]: [ReadingLevel.BASLANGIC],
  [City.EFES]: [ReadingLevel.ORTA],
  [City.ANTALYA]: [ReadingLevel.ORTA],
  [City.KAPADOKYA]: [ReadingLevel.ORTA, ReadingLevel.ILERI],
  [City.VAN]: [ReadingLevel.ORTA, ReadingLevel.ILERI],
};

/** Tasarımda görünen, değişmemesi gereken başlıklar. */
const FIXED_TITLES: [City, number, string][] = [
  [City.ISTANBUL, 3, 'Minik Serçe'],
  [City.IZMIR, 3, 'Kordon’da Bisiklet'],
  [City.EFES, 3, 'Kayıp Anahtar'],
  [City.ANTALYA, 4, 'Portakal Bahçesi'],
  [City.KAPADOKYA, 2, 'Uçan Balon'],
  [City.VAN, 9, 'Eve Dönüş'],
];

/** Kelime metinde tek başına (başka bir kelimenin parçası olarak değil) geçiyor mu. */
function containsWord(text: string, word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'u').test(text);
}

describe('seed içeriği: yolculuk', () => {
  it('48 hikâye ve 144 soru; İstanbul’dan Van’a metinler uzar', () => {
    expect(stories).toHaveLength(48);
    expect(stories.flatMap(({ lesson }) => lesson.questions)).toHaveLength(144);
    const averageWords = seedCities.map(({ city }) => {
      const inCity = stories.filter((story) => story.city === city);
      const total = inCity.reduce((sum, { lesson }) => sum + wordCount(lesson.text.paragraphs), 0);
      return total / inCity.length;
    });
    expect(averageWords).toEqual([...averageWords].sort((a, b) => a - b));
  });

  it('6 şehir × 10 ders; 5. ve 10. ders sandık, diğerleri hikâye', () => {
    expect(seedLessonRows).toHaveLength(TOTAL_LESSONS);
    for (const { city, lessons } of seedCities) {
      expect(lessons.map((lesson) => lesson.position)).toEqual(
        Array.from({ length: LESSONS_PER_CITY }, (_, index) => index + 1),
      );
      for (const lesson of lessons) {
        const expectedKind = CHEST_POSITIONS.includes(lesson.position)
          ? LessonKind.CHEST
          : LessonKind.STORY;
        expect(lesson.kind, lesson.id).toBe(expectedKind);
        expect(lesson.id).toMatch(
          new RegExp(`^${toApiCity(city)}-${String(lesson.position).padStart(2, '0')}-[a-z0-9-]+$`),
        );
        expect(lesson.summary.trim().length, lesson.id).toBeGreaterThan(0);
        if (lesson.kind === LessonKind.CHEST) expect(lesson.title).toBe('Hazine Sandığı');
      }
    }
  });

  it('ders, metin ve sandık özetleri tekildir', () => {
    const lessonIds = seedLessonRows.map((lesson) => lesson.id);
    const textIds = seedTexts.map((text) => text.id);
    const titles = stories.map(({ lesson }) => lesson.title);
    const chestSummaries = seedLessonRows
      .filter((lesson) => lesson.kind === LessonKind.CHEST)
      .map((lesson) => lesson.summary);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
    expect(new Set(textIds).size).toBe(textIds.length);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(chestSummaries).size).toBe(chestSummaries.length);
  });

  it('sabit başlıklar ve mevcut metinler yerinde', () => {
    for (const [city, position, title] of FIXED_TITLES) {
      const lesson = seedLessonRows.find((row) => row.city === city && row.position === position);
      expect(lesson?.title, `${city} ${position}`).toBe(title);
    }
    const lessonOf = (textId: string) => {
      const variant = seedLessonTextRows.find((row) => row.textId === textId);
      return seedLessonRows.find((lesson) => lesson.id === variant?.lessonId);
    };
    expect(lessonOf('minik-serce')).toMatchObject({ city: City.ISTANBUL, position: 3 });
    expect(lessonOf('bahcedeki-domatesler')).toMatchObject({ city: City.ISTANBUL });
    expect(lessonOf('kayip-anahtar')).toMatchObject({ city: City.EFES, position: 3 });
    expect(lessonOf('deniz-feneri')).toMatchObject({ city: City.ANTALYA });
    expect(lessonOf('gokyuzundeki-haritalar')).toMatchObject({ city: City.KAPADOKYA });
  });
});

describe('seed içeriği: hikâyeler', () => {
  it.each(stories.map(({ city, lesson }) => [lesson.id, city, lesson] as const))(
    '%s',
    (_, city, lesson) => {
      const { text } = lesson;

      // Metin: 4-6 paragraf, 90-180 kelime, tüm sınıflara açık, şehre uygun seviye.
      expect(text.paragraphs.length).toBeGreaterThanOrEqual(4);
      expect(text.paragraphs.length).toBeLessThanOrEqual(6);
      const words = wordCount(text.paragraphs);
      expect(words).toBeGreaterThanOrEqual(90);
      expect(words).toBeLessThanOrEqual(180);
      expect(text.estimatedMinutes).toBe(readingMinutes(text.paragraphs));
      expect(text).toMatchObject({ minGrade: 1, maxGrade: 8, title: lesson.title });
      expect(LEVELS[city]).toContain(text.level);
      // Tema: hikâye okunarak seçilir; her hikâyenin geçerli bir teması olmalı.
      expect(Object.values(TextTheme)).toContain(text.theme);

      // Metin ölçüleri okunabilirlik aracıyla aynı (seed-data hesaplar).
      expect({
        wordCount: text.wordCount,
        sentenceCount: text.sentenceCount,
        avgSentenceLength: text.avgSentenceLength,
        atesmanScore: text.atesmanScore,
      }).toEqual(textMetrics(text.paragraphs));

      // Sorular: tam 3; G2 metninde (G1-G2 biçimi) 3 farklı şık, doğru cevap şıklardan biri.
      // Her soru okunarak tür ve bilişsel düzeyle etiketlenmiş.
      expect(lesson.questions).toHaveLength(3);
      for (const question of lesson.questions) {
        expect(question.options).toHaveLength(3);
        expect(new Set(question.options).size).toBe(3);
        expect(question.correctIndex).toBeLessThan(question.options.length);
        expect(Object.values(QuestionType)).toContain(question.type);
        expect(Object.values(CognitiveLevel)).toContain(question.cognitiveLevel);
        expect(question.hint).toMatch(/^İpucu: /);
        expect(question.prompt.trim().length).toBeGreaterThan(0);
        expect(question.explanation.trim().length).toBeGreaterThan(0);
      }
      // Doğru cevap her soruda aynı yerde olmasın.
      expect(new Set(lesson.questions.map((q) => q.correctIndex)).size).toBeGreaterThan(1);

      // Kelime anlamları: 2-3 kelime, tekil, metinde yazıldığı gibi geçer.
      expect(lesson.glossary.length).toBeGreaterThanOrEqual(2);
      expect(lesson.glossary.length).toBeLessThanOrEqual(3);
      const glossaryWords = lesson.glossary.map((entry) => entry.word);
      expect(new Set(glossaryWords).size).toBe(glossaryWords.length);
      const fullText = text.paragraphs.join(' ');
      for (const { word, meaning } of lesson.glossary) {
        expect(containsWord(fullText, word), `"${word}" metinde yok`).toBe(true);
        expect(meaning.trim().length).toBeGreaterThan(0);
      }
    },
  );
});

describe('seed içeriği: hikâye temaları', () => {
  it("migration'daki tema eşlemesi seed verisiyle aynıdır", () => {
    // Mevcut veritabanlarındaki metinler bu migration'la doldurulur; seed ise yeni kurulumları
    // doldurur. İkisi ayrışırsa aynı hikâye ortama göre farklı tema gösterir.
    const migrationsDir = new URL('../prisma/migrations/', import.meta.url);
    const dir = readdirSync(migrationsDir).find((name) => name.endsWith('_text_theme'));
    expect(dir).toBeDefined();
    const sql = readFileSync(new URL(`${dir}/migration.sql`, migrationsDir), 'utf8');

    const fromMigration = new Map<string, string>();
    for (const [, theme = '', ids = ''] of sql.matchAll(
      /UPDATE "texts" SET "theme" = '(\w+)' WHERE "id" IN \(([^)]*)\)/g,
    )) {
      for (const [, id = ''] of ids.matchAll(/'([^']+)'/g)) fromMigration.set(id, theme);
    }

    expect(Object.fromEntries(fromMigration)).toEqual(
      Object.fromEntries(
        seedTexts.filter((text) => g2TextIds.has(text.id)).map((text) => [text.id, text.theme]),
      ),
    );
  });
});

describe('seed içeriği: sınıf grubu metinleri', () => {
  it('her hikâyenin G2 metni var, sandıkların metni yok, bir metin tek bir derse ait', () => {
    const storyIds = seedLessonRows.filter((l) => l.kind === LessonKind.STORY).map((l) => l.id);
    const g2 = seedLessonTextRows.filter((row) => row.gradeBand === GradeBand.G2);
    expect(g2.map((row) => row.lessonId).sort()).toEqual([...storyIds].sort());
    const textIds = seedLessonTextRows.map((row) => row.textId);
    expect(new Set(textIds).size).toBe(textIds.length);
  });
});

/** G1, G3 ve G4 sürümleri yazılmış şehirler; her şehir yazıldıkça eklenir (A3s). */
const CITIES_WITH_VERSIONS: City[] = [City.ISTANBUL, City.IZMIR, City.EFES];

const VERSION_BANDS = [GradeBand.G1, GradeBand.G3, GradeBand.G4];

const VERSION_RULES: Partial<
  Record<GradeBand, { minWords: number; maxWords: number; options: number; minGlossary: number }>
> = {
  G1: { minWords: 60, maxWords: 120, options: 3, minGlossary: 1 },
  G3: { minWords: 180, maxWords: 280, options: 4, minGlossary: 2 },
  G4: { minWords: 250, maxWords: 380, options: 4, minGlossary: 2 },
};

const G1_TYPES: QuestionType[] = [
  QuestionType.BILGI,
  QuestionType.NEDEN_SONUC,
  QuestionType.DUYGU_KARAKTER,
  QuestionType.SOZCUK_ANLAMI,
];
const G3_REQUIRED_TYPES: QuestionType[] = [
  QuestionType.ANA_FIKIR,
  QuestionType.BASLIK,
  QuestionType.YARDIMCI_FIKIR,
  QuestionType.CUMLEDE_ANLAM,
];
const G4_REQUIRED_TYPES: QuestionType[] = [
  QuestionType.ANA_FIKIR,
  QuestionType.YARDIMCI_FIKIR,
  QuestionType.BASLIK,
];

const versionedStories = stories.filter(({ city }) => CITIES_WITH_VERSIONS.includes(city));

describe.each(VERSION_BANDS)('seed içeriği: %s sürümleri', (band) => {
  const rules = VERSION_RULES[band]!;
  const target = ATESMAN_TARGET[band];

  it.each(versionedStories.map(({ lesson }) => [lesson.id, lesson] as const))('%s', (_, lesson) => {
    const version = lesson.versions.find((entry) => entry.gradeBand === band);
    expect(version, `${band} sürümü yok`).toBeDefined();
    const { text, questions, glossary } = version!;

    // Aynı hikâye: başlık ve tema G2 metniyle aynı; kimlik ve sınıf aralığı gruba göre.
    expect(text.id).toBe(`${lesson.text.id}-${band.toLowerCase()}`);
    expect(text).toMatchObject({ title: lesson.title, theme: lesson.text.theme });
    expect(gradeBandOf(text.minGrade)).toBe(band);
    expect(gradeBandOf(text.maxGrade)).toBe(band);
    expect(text.estimatedMinutes).toBe(readingMinutes(text.paragraphs));

    // Uzunluk ve okunabilirlik gruba uygun; ölçüler araçla aynı.
    const metrics = textMetrics(text.paragraphs);
    expect({
      wordCount: text.wordCount,
      sentenceCount: text.sentenceCount,
      avgSentenceLength: text.avgSentenceLength,
      atesmanScore: text.atesmanScore,
    }).toEqual(metrics);
    expect(metrics.wordCount).toBeGreaterThanOrEqual(rules.minWords);
    expect(metrics.wordCount).toBeLessThanOrEqual(rules.maxWords);
    expect(metrics.atesmanScore).toBeGreaterThanOrEqual(target.min);
    expect(metrics.atesmanScore).toBeLessThanOrEqual(target.max);

    // Sorular: tam 3; şık sayısı gruba göre, şıklar farklı, doğru cevap hep aynı yerde değil.
    expect(questions).toHaveLength(3);
    for (const question of questions) {
      expect(question.options).toHaveLength(rules.options);
      expect(new Set(question.options).size).toBe(rules.options);
      expect(question.correctIndex).toBeLessThan(rules.options);
      expect(Object.values(CognitiveLevel)).toContain(question.cognitiveLevel);
      expect(question.prompt.trim().length).toBeGreaterThan(0);
      expect(question.hint).toMatch(/^İpucu: /);
      expect(question.explanation.trim().length).toBeGreaterThan(0);
    }
    expect(new Set(questions.map((q) => q.correctIndex)).size).toBeGreaterThan(1);

    // Soru türleri (A3s): BILGI sınırlı, grubun zorunlu türleri var.
    const types = questions.map((q) => q.type);
    const bilgi = types.filter((type) => type === QuestionType.BILGI).length;
    if (band === GradeBand.G1) {
      expect(bilgi).toBeLessThanOrEqual(1);
      for (const type of types) expect(G1_TYPES).toContain(type);
    } else if (band === GradeBand.G3) {
      expect(bilgi).toBeLessThanOrEqual(1);
      expect(
        questions.some(
          (q) =>
            G3_REQUIRED_TYPES.includes(q.type) ||
            (q.type === QuestionType.NEDEN_SONUC && q.cognitiveLevel === CognitiveLevel.CIKARIM),
        ),
      ).toBe(true);
    } else {
      expect(bilgi).toBe(0);
      expect(types.some((type) => G4_REQUIRED_TYPES.includes(type))).toBe(true);
    }

    // Kelime anlamları: tekil, metinde yazıldığı gibi geçer.
    expect(glossary.length).toBeGreaterThanOrEqual(rules.minGlossary);
    expect(glossary.length).toBeLessThanOrEqual(4);
    const words = glossary.map((entry) => entry.word);
    expect(new Set(words).size).toBe(words.length);
    const fullText = text.paragraphs.join(' ');
    for (const { word, meaning } of glossary) {
      expect(containsWord(fullText, word), `"${word}" metinde yok`).toBe(true);
      expect(meaning.trim().length).toBeGreaterThan(0);
    }
  });

  it.each(CITIES_WITH_VERSIONS)('%s: en az 4 farklı soru türü', (city) => {
    const types = stories
      .filter((story) => story.city === city)
      .flatMap(({ lesson }) => lesson.versions.filter((v) => v.gradeBand === band))
      .flatMap((version) => version.questions.map((q) => q.type));
    expect(new Set(types).size).toBeGreaterThanOrEqual(4);
  });
});

describe('seed içeriği: soru etiketleri', () => {
  const g2Questions = seedQuestionRows.filter((q) => g2TextIds.has(q.textId));

  it("migration'daki etiketler seed verisiyle aynıdır", () => {
    const migrationsDir = new URL('../prisma/migrations/', import.meta.url);
    const dir = readdirSync(migrationsDir).find((name) => name.endsWith('_question_labels'));
    expect(dir).toBeDefined();
    const sql = readFileSync(new URL(`${dir}/migration.sql`, migrationsDir), 'utf8');

    const fromMigration = new Map<string, string>();
    for (const [, textId, position, type, level] of sql.matchAll(
      /\('([a-z0-9-]+)', (\d), '(\w+)', '(\w+)'\)/g,
    )) {
      fromMigration.set(`${textId}#${position}`, `${type}/${level}`);
    }

    expect(Object.fromEntries(fromMigration)).toEqual(
      Object.fromEntries(
        g2Questions.map((q) => [`${q.textId}#${q.position}`, `${q.type}/${q.cognitiveLevel}`]),
      ),
    );
  });

  it('144 soru etiketli; ana fikir soruları zayıf tür olarak raporlanabilecek kadar çok', () => {
    expect(g2Questions).toHaveLength(144);
    const count = (type: QuestionType) => g2Questions.filter((q) => q.type === type).length;
    expect(count(QuestionType.ANA_FIKIR)).toBeGreaterThanOrEqual(10);
    expect(count(QuestionType.BILGI)).toBeGreaterThan(0);
  });
});

describe('seed içeriği: seviye belirleme', () => {
  it('her sınıf grubunda sırayla 2 metin; metinler yolculukta yok', () => {
    for (const band of Object.values(GradeBand)) {
      const rows = seedPlacementRows.filter((row) => row.gradeBand === band);
      expect(rows.map((row) => row.position).sort()).toEqual([1, 2]);
    }
    const ids = seedPlacementTexts.map((text) => text.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.some((id) => seedTexts.some((text) => text.id === id))).toBe(false);
  });

  it.each(seedPlacementRows.map((row) => [row.textId, row] as const))('%s', (textId, row) => {
    const text = seedPlacementTexts.find((entry) => entry.id === textId)!;
    const questions = seedPlacementQuestionRows.filter((q) => q.textId === textId);

    // Metin: 60-120 kelime, grubun sınıflarına açık, ölçüler araçla aynı, Ateşman hedef aralıkta.
    expect(text.wordCount).toBeGreaterThanOrEqual(60);
    expect(text.wordCount).toBeLessThanOrEqual(120);
    expect(gradeBandOf(text.minGrade)).toBe(row.gradeBand);
    expect(gradeBandOf(text.maxGrade)).toBe(row.gradeBand);
    expect({
      wordCount: text.wordCount,
      sentenceCount: text.sentenceCount,
      avgSentenceLength: text.avgSentenceLength,
      atesmanScore: text.atesmanScore,
    }).toEqual(textMetrics(text.paragraphs));
    const target = ATESMAN_TARGET[row.gradeBand];
    expect(text.atesmanScore).toBeGreaterThanOrEqual(target.min);
    expect(text.atesmanScore).toBeLessThanOrEqual(target.max);

    // Sorular: 3 etiketli soru; G1-G2'de 3, G3-G4'te 4 farklı şık; doğru cevap hep aynı yerde değil.
    const optionCount = row.gradeBand === GradeBand.G1 || row.gradeBand === GradeBand.G2 ? 3 : 4;
    expect(questions.map((q) => q.position)).toEqual([1, 2, 3]);
    for (const question of questions) {
      expect(question.options).toHaveLength(optionCount);
      expect(new Set(question.options).size).toBe(optionCount);
      expect(question.correctIndex).toBeLessThan(optionCount);
      expect(Object.values(QuestionType)).toContain(question.type);
      expect(Object.values(CognitiveLevel)).toContain(question.cognitiveLevel);
      expect(question.hint).toMatch(/^İpucu: /);
      expect(question.explanation.trim().length).toBeGreaterThan(0);
    }
    expect(new Set(questions.map((q) => q.correctIndex)).size).toBeGreaterThan(1);
  });
});
