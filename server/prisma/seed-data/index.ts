import { GradeBand, LessonKind } from '../../src/generated/prisma/enums.js';
import { antalya } from './antalya.js';
import { efes } from './efes.js';
import { istanbul } from './istanbul.js';
import { izmir } from './izmir.js';
import { kapadokya } from './kapadokya.js';
import { placementReadings } from './placement.js';
import type { SeedCity, SeedStoryLesson, SeedText } from './types.js';
import { van } from './van.js';

export type * from './types.js';

/** Yolculuğun içeriği, şehir sırasıyla. Her şehir kendi dosyasında 10 ders tanımlar. */
export const seedCities: SeedCity[] = [istanbul, izmir, efes, antalya, kapadokya, van];

/** Yolculukta yer almayan, yalnızca kitaplıkta okunan metinler (şu an yok). */
const libraryTexts: SeedText[] = [];

const stories = seedCities.flatMap(({ lessons }) =>
  lessons.filter((lesson): lesson is SeedStoryLesson => lesson.kind === LessonKind.STORY),
);

export const seedTexts: SeedText[] = [...stories.map((story) => story.text), ...libraryTexts];

/** Veritabanına yazılacak düz satırlar (`createMany` / `upsert` için). */
export const seedLessonRows = seedCities.flatMap(({ city, lessons }) =>
  lessons.map((lesson) => ({
    id: lesson.id,
    city,
    position: lesson.position,
    kind: lesson.kind,
    title: lesson.title,
    summary: lesson.summary,
  })),
);

/** Hikâye derslerinin metinleri; mevcut hikâyeler G2 (3-4. sınıf) varyantıdır. */
export const seedLessonTextRows = seedCities.flatMap(({ lessons }) =>
  lessons.flatMap((lesson) =>
    lesson.kind === LessonKind.STORY
      ? [{ lessonId: lesson.id, gradeBand: GradeBand.G2, textId: lesson.text.id }]
      : [],
  ),
);

export const seedQuestionRows = stories.flatMap((story) =>
  story.questions.map((question, index) => ({
    textId: story.text.id,
    position: index + 1,
    ...question,
  })),
);

export const seedGlossaryRows = stories.flatMap((story) =>
  story.glossary.map((entry) => ({ textId: story.text.id, ...entry })),
);

/** Seviye belirleme metinleri (yolculukta ve kitaplıkta yok); ayrıntı placement.ts. */
export const seedPlacementTexts: SeedText[] = placementReadings.map(({ text }) => text);

export const seedPlacementRows = placementReadings.map(({ gradeBand, position, text }) => ({
  gradeBand,
  position,
  textId: text.id,
}));

export const seedPlacementQuestionRows = placementReadings.flatMap(({ text, questions }) =>
  questions.map((question, index) => ({ textId: text.id, position: index + 1, ...question })),
);
