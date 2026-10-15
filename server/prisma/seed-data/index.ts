import { LessonKind } from '../../src/generated/prisma/enums.js';
import { antalya } from './antalya.js';
import { efes } from './efes.js';
import { istanbul } from './istanbul.js';
import { izmir } from './izmir.js';
import { kapadokya } from './kapadokya.js';
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
    textId: lesson.kind === LessonKind.STORY ? lesson.text.id : null,
  })),
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
