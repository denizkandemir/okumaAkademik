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

/** Hikâyelerin bütün sınıf grubu metinleri: G2 metni ve (yazıldıysa) G1, G3, G4 sürümleri. */
const storyVariants = stories.flatMap((story) => [
  {
    lessonId: story.id,
    gradeBand: GradeBand.G2 as GradeBand,
    text: story.text,
    questions: story.questions,
    glossary: story.glossary,
  },
  ...story.versions.map((version) => ({ lessonId: story.id, ...version })),
]);

export const seedTexts: SeedText[] = [...storyVariants.map(({ text }) => text), ...libraryTexts];

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

/** Hikâye derslerinin sınıf grubu metinleri. */
export const seedLessonTextRows = storyVariants.map(({ lessonId, gradeBand, text }) => ({
  lessonId,
  gradeBand,
  textId: text.id,
}));

export const seedQuestionRows = storyVariants.flatMap(({ text, questions }) =>
  questions.map((question, index) => ({
    textId: text.id,
    position: index + 1,
    ...question,
  })),
);

export const seedGlossaryRows = storyVariants.flatMap(({ text, glossary }) =>
  glossary.map((entry) => ({ textId: text.id, ...entry })),
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
