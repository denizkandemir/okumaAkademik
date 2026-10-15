import { describe, expect, it } from 'vitest';

import { seedCities, seedLessonRows, seedTexts } from '../prisma/seed-data/index.js';
import { LessonKind } from '../src/generated/prisma/enums.js';
import { toApiCity } from '../src/lib/city.js';
import { CHEST_POSITIONS, LESSONS_PER_CITY, TOTAL_LESSONS } from '../src/lib/journey.js';

/** Seed içeriği oyun kurallarına uyuyor mu (P03 gerçek içeriği eklerken de korunur). */
describe('seed içeriği', () => {
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
        expect(lesson.summary.length, lesson.id).toBeGreaterThan(0);
      }
    }
  });

  it('kimlikler tekildir', () => {
    const lessonIds = seedLessonRows.map((lesson) => lesson.id);
    const textIds = seedTexts.map((text) => text.id);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
    expect(new Set(textIds).size).toBe(textIds.length);
  });

  it('her hikâyede 3 soru, her soruda 3 şık; kelimeler metinde geçer', () => {
    for (const { lessons } of seedCities) {
      for (const lesson of lessons) {
        if (lesson.kind !== LessonKind.STORY) continue;
        expect(lesson.questions, lesson.id).toHaveLength(3);
        for (const question of lesson.questions) {
          expect(question.options, lesson.id).toHaveLength(3);
          expect([0, 1, 2]).toContain(question.correctIndex);
        }
        const fullText = lesson.text.paragraphs.join(' ');
        expect(lesson.glossary.length, lesson.id).toBeGreaterThan(0);
        for (const { word } of lesson.glossary) {
          expect(fullText, `${lesson.id}: "${word}"`).toContain(word);
        }
      }
    }
  });

  it('mevcut metinler yolculuktaki yerlerinde', () => {
    const lessonOf = (textId: string) => seedLessonRows.find((lesson) => lesson.textId === textId);
    expect(lessonOf('minik-serce')).toMatchObject({ city: 'ISTANBUL', position: 3 });
    expect(lessonOf('bahcedeki-domatesler')).toMatchObject({ city: 'ISTANBUL' });
    expect(lessonOf('kayip-anahtar')).toMatchObject({ city: 'EFES', position: 3 });
    expect(lessonOf('deniz-feneri')).toMatchObject({ city: 'ANTALYA' });
    expect(lessonOf('gokyuzundeki-haritalar')).toMatchObject({ city: 'KAPADOKYA' });
  });
});
