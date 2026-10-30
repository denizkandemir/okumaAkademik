import { readdirSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { readingMinutes, wordCount } from '../prisma/seed-data/build.js';
import {
  seedCities,
  seedLessonRows,
  seedTexts,
  type SeedStoryLesson,
} from '../prisma/seed-data/index.js';
import { City, LessonKind, ReadingLevel, TextTheme } from '../src/generated/prisma/enums.js';
import { toApiCity } from '../src/lib/city.js';
import { CHEST_POSITIONS, LESSONS_PER_CITY, TOTAL_LESSONS } from '../src/lib/journey.js';

/**
 * Seed içeriğinin doğrulaması (docs/tasarim/promptlar/P03-icerik-hikayeler.md). İçerik
 * değiştiğinde bu test kurallara uymayan hikâyeyi adıyla gösterir.
 */

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
    const lessonOf = (textId: string) => seedLessonRows.find((lesson) => lesson.textId === textId);
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

      // Sorular: tam 3; her birinde 3 farklı şık ve 0-2 arası doğru cevap.
      expect(lesson.questions).toHaveLength(3);
      for (const question of lesson.questions) {
        expect(question.options).toHaveLength(3);
        expect(new Set(question.options).size).toBe(3);
        expect([0, 1, 2]).toContain(question.correctIndex);
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
      Object.fromEntries(seedTexts.map((text) => [text.id, text.theme])),
    );
  });
});
