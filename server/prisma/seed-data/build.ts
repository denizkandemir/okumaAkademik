import { LessonKind, type City, type ReadingLevel } from '../../src/generated/prisma/enums.js';
import { toApiCity } from '../../src/lib/city.js';
import type { SeedChestLesson, SeedGlossary, SeedQuestion, SeedStoryLesson } from './types.js';

/** Çocukların ortalama okuma hızı varsayımı: yaklaşık 45 kelime ≈ 1 dakika. */
const WORDS_PER_MINUTE = 45;

export function wordCount(paragraphs: readonly string[]): number {
  return paragraphs.join(' ').split(/\s+/).filter(Boolean).length;
}

/** Tahmini okuma süresi (dakika), 2-5 arası; tüm metinlerde aynı kural. */
export function readingMinutes(paragraphs: readonly string[]): number {
  return Math.min(5, Math.max(2, Math.round(wordCount(paragraphs) / WORDS_PER_MINUTE)));
}

function lessonId(city: City, position: number, slug: string) {
  return `${toApiCity(city)}-${String(position).padStart(2, '0')}-${slug}`;
}

/**
 * Yolculuk hikâyesi. Metin kimliği `slug`, ders kimliği `<şehir>-<sıra>-<slug>` olur. Yolculuk
 * tüm sınıflar için ortaktır; metinler 1-8. sınıfların hepsine açıktır.
 */
export function story(
  city: City,
  input: {
    position: number;
    slug: string;
    title: string;
    summary: string;
    level: ReadingLevel;
    paragraphs: string[];
    questions: SeedQuestion[];
    glossary: SeedGlossary[];
  },
): SeedStoryLesson {
  return {
    id: lessonId(city, input.position, input.slug),
    position: input.position,
    kind: LessonKind.STORY,
    title: input.title,
    summary: input.summary,
    text: {
      id: input.slug,
      title: input.title,
      level: input.level,
      estimatedMinutes: readingMinutes(input.paragraphs),
      minGrade: 1,
      maxGrade: 8,
      paragraphs: input.paragraphs,
    },
    questions: input.questions,
    glossary: input.glossary,
  };
}

/** Hazine sandığı (5. ve 10. ders). */
export function chest(city: City, position: number, summary: string): SeedChestLesson {
  return {
    id: lessonId(city, position, 'sandik'),
    position,
    kind: LessonKind.CHEST,
    title: 'Hazine Sandığı',
    summary,
  };
}
