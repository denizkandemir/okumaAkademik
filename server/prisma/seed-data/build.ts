import {
  GradeBand,
  LessonKind,
  ReadingLevel,
  type City,
  type TextTheme,
} from '../../src/generated/prisma/enums.js';
import { toApiCity } from '../../src/lib/city.js';
import { textMetrics } from '../../src/lib/readability.js';
import type {
  SeedChestLesson,
  SeedGlossary,
  SeedQuestion,
  SeedStoryLesson,
  SeedStoryVersion,
} from './types.js';

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

/** Sınıf grubunun en küçük ve en büyük sınıfı (src/lib/grade-band.ts ile aynı eşleme). */
export const GRADES: Record<GradeBand, [number, number]> = {
  G1: [1, 2],
  G2: [3, 4],
  G3: [5, 6],
  G4: [7, 8],
};

/** Sürümün metin seviyesi (seviye belirleme metinleriyle aynı). */
const VERSION_LEVELS = {
  G1: ReadingLevel.BASLANGIC,
  G3: ReadingLevel.ORTA,
  G4: ReadingLevel.ILERI,
};

type VersionBand = keyof typeof VERSION_LEVELS;

type StoryVersionInput = {
  paragraphs: string[];
  questions: SeedQuestion[];
  glossary: SeedGlossary[];
};

/**
 * Yolculuk hikâyesi. Metin kimliği `slug`, ders kimliği `<şehir>-<sıra>-<slug>` olur. Bu metin G2
 * sürümüdür ve 1-8. sınıfların hepsine açıktır (grubun sürümü yoksa o okutulur). `versions`:
 * aynı hikâyenin G1, G3 ve G4 sürümleri; kimlikleri `<slug>-g1`, sınıf aralıkları kendi grubu.
 */
export function story(
  city: City,
  input: {
    position: number;
    slug: string;
    title: string;
    summary: string;
    level: ReadingLevel;
    /** Hikâyenin teması (hikâye okunarak seçilir). */
    theme: TextTheme;
    paragraphs: string[];
    questions: SeedQuestion[];
    glossary: SeedGlossary[];
    versions?: Record<VersionBand, StoryVersionInput>;
  },
): SeedStoryLesson {
  const versions = (Object.keys(VERSION_LEVELS) as VersionBand[]).flatMap(
    (gradeBand): SeedStoryVersion[] => {
      const version = input.versions?.[gradeBand];
      if (!version) return [];
      const [minGrade, maxGrade] = GRADES[gradeBand];
      return [
        {
          gradeBand,
          text: {
            id: `${input.slug}-${gradeBand.toLowerCase()}`,
            title: input.title,
            level: VERSION_LEVELS[gradeBand],
            estimatedMinutes: readingMinutes(version.paragraphs),
            theme: input.theme,
            minGrade,
            maxGrade,
            paragraphs: version.paragraphs,
            ...textMetrics(version.paragraphs),
          },
          questions: version.questions,
          glossary: version.glossary,
        },
      ];
    },
  );
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
      theme: input.theme,
      minGrade: 1,
      maxGrade: 8,
      paragraphs: input.paragraphs,
      ...textMetrics(input.paragraphs),
    },
    questions: input.questions,
    glossary: input.glossary,
    versions,
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
