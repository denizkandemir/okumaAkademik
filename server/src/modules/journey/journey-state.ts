import type { PrismaClient } from '../../db.js';
import type { Prisma } from '../../generated/prisma/client.js';
import type { City, LessonKind } from '../../generated/prisma/enums.js';
import { CITY_ORDER, toApiCity } from '../../lib/city.js';
import {
  cityForLevel,
  cityStatus,
  compareLessons,
  levelFromCompleted,
  lessonStatuses,
  TOTAL_LESSONS,
  type LessonStatus,
} from '../../lib/journey.js';

type Db = PrismaClient | Prisma.TransactionClient;

export type JourneyLesson = {
  id: string;
  city: City;
  position: number;
  kind: LessonKind;
  title: string;
  textId: string | null;
  status: LessonStatus;
  bestStars: number | null;
};

export type JourneyState = {
  /** Tüm dersler, yolculuk sırasıyla */
  lessons: JourneyLesson[];
  completedCount: number;
  level: number;
  currentCity: City;
  finished: boolean;
  /** Sıradaki bitmemiş ders; yolculuk bittiyse null */
  nextLesson: JourneyLesson | null;
};

/** Kullanıcının yolculuktaki durumu: dersler, tamamlananlar ve bunlardan türetilen seviye/şehir. */
export async function loadJourneyState(db: Db, userId: string): Promise<JourneyState> {
  const [rows, completions] = await Promise.all([
    db.lesson.findMany({
      select: { id: true, city: true, position: true, kind: true, title: true, textId: true },
    }),
    db.lessonCompletion.findMany({
      where: { userId },
      select: { lessonId: true, bestStars: true },
    }),
  ]);

  const ordered = rows.sort(compareLessons);
  const bestStars = new Map(completions.map((c) => [c.lessonId, c.bestStars]));
  const statuses = lessonStatuses(ordered, new Set(bestStars.keys()));
  const lessons = ordered.map((lesson) => ({
    ...lesson,
    status: statuses.get(lesson.id) ?? 'locked',
    bestStars: bestStars.get(lesson.id) ?? null,
  }));

  const completedCount = completions.length;
  const level = levelFromCompleted(completedCount);
  return {
    lessons,
    completedCount,
    level,
    currentCity: cityForLevel(level),
    finished: completedCount >= TOTAL_LESSONS,
    nextLesson: lessons.find((lesson) => lesson.status !== 'done') ?? null,
  };
}

/** Kilitli derslerin metinleri; kitaplıkta görünmez ve açılamaz. */
export function lockedTextIds(state: JourneyState): Set<string> {
  return new Set(
    state.lessons.flatMap((lesson) =>
      lesson.status === 'locked' && lesson.textId ? [lesson.textId] : [],
    ),
  );
}

/** Şehirlerin durumu ve her şehirde bitirilen ders sayısı, yolculuk sırasıyla. */
export function citiesOf(state: JourneyState) {
  return CITY_ORDER.map((city) => {
    const lessonsDone = state.lessons.filter(
      (lesson) => lesson.city === city && lesson.status === 'done',
    ).length;
    return {
      city,
      id: toApiCity(city),
      status: cityStatus(city, lessonsDone, state.currentCity),
      lessonsDone,
    };
  });
}

/** Bitirilen okumaların anları (seri bu anların Türkiye saatindeki günleriyle hesaplanır). */
export async function loadReadingDates(db: Db, userId: string): Promise<Date[]> {
  const sessions = await db.readingSession.findMany({
    where: { userId, completed: true },
    select: { startedAt: true, endedAt: true },
  });
  return sessions.map((session) => session.endedAt ?? session.startedAt);
}

/** Lokum bakiyesi: defterdeki satırların toplamı. */
export async function lokumBalance(db: Db, userId: string): Promise<number> {
  const result = await db.lokumEntry.aggregate({ where: { userId }, _sum: { amount: true } });
  return result._sum.amount ?? 0;
}
