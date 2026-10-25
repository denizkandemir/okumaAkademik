import { City, LessonKind } from '../generated/prisma/enums.js';
import { CITY_ORDER } from './city.js';
import { dayNumberInTimeZone } from './time.js';

/**
 * Oyun kuralları (docs/tasarim/README.md → "Oyun kuralları (v1)"). Seviye, şehir ve seri
 * veritabanında saklanmaz; buradaki saf fonksiyonlarla tamamlanan derslerden ve okumalardan
 * türetilir. `v_user_journey` görünümü aynı kuralları SQL ile uygular; birini değiştirirsen
 * diğerini de güncelle.
 */

export const LESSONS_PER_CITY = 10;
export const LESSONS_PER_LEVEL = 2;
export const LEVELS_PER_CITY = 5;
export const MAX_LEVEL = 30;
export const TOTAL_LESSONS = CITY_ORDER.length * LESSONS_PER_CITY;
export const QUESTIONS_PER_STORY = 3;
/** Sandık olan ders sıraları; diğerleri hikâyedir. */
export const CHEST_POSITIONS: readonly number[] = [5, 10];

export const LOKUM = {
  /** Hikâye bitince */
  STORY_BASE: 5,
  /** İlk denemede doğru cevaplanan her soru için (hikâye başına en fazla 3) */
  PER_FIRST_TRY: 5,
  /** Sandık */
  CHEST: 30,
  /** Kazanılan her seviye için */
  LEVEL_UP: 50,
  /** Yeni şehir açılınca */
  CITY_UNLOCK: 100,
} as const;

/** Seviye = 1 + ⌊tamamlanan ders / 2⌋, en fazla 30. */
export function levelFromCompleted(completedLessons: number): number {
  return Math.min(MAX_LEVEL, 1 + Math.floor(Math.max(0, completedLessons) / LESSONS_PER_LEVEL));
}

/** Seviyenin ait olduğu şehir: 1-5 İstanbul, 6-10 İzmir, … 26-30 Van. */
export function cityForLevel(level: number): City {
  const clamped = Math.min(MAX_LEVEL, Math.max(1, level));
  return CITY_ORDER[Math.floor((clamped - 1) / LEVELS_PER_CITY)] as City;
}

export function cityLevelRange(city: City): { levelFrom: number; levelTo: number } {
  const index = CITY_ORDER.indexOf(city);
  return { levelFrom: index * LEVELS_PER_CITY + 1, levelTo: (index + 1) * LEVELS_PER_CITY };
}

/** Hikâye yıldızı: 3 soru da ilk denemede doğru → 3; 2'si → 2; diğer → 1. */
export function starsFor(firstTryCorrect: number): 1 | 2 | 3 {
  if (firstTryCorrect >= 3) return 3;
  if (firstTryCorrect === 2) return 2;
  return 1;
}

/** Hikâye lokumu: 5 + ilk denemede doğru her soru için 5 (en fazla 20). */
export function lessonLokum(firstTryCorrect: number): number {
  const counted = Math.min(QUESTIONS_PER_STORY, Math.max(0, firstTryCorrect));
  return LOKUM.STORY_BASE + LOKUM.PER_FIRST_TRY * counted;
}

/** Dersin ilk tamamlanışında kazanılabilecek en fazla lokum (seviye ve şehir ödülleri hariç). */
export function maxLessonLokum(kind: LessonKind): number {
  return kind === LessonKind.CHEST ? LOKUM.CHEST : lessonLokum(QUESTIONS_PER_STORY);
}

/**
 * Cevaplardan, ilk denemesi doğru olan soru sayısı. `attempts` zaman sırasıyla verilmelidir; her
 * sorunun yalnızca ilk cevabına bakılır. İlk tamamlamada kullanıcının o metne verdiği tüm cevaplar
 * (okumadan bağımsız), tekrar oynamada yalnızca o okumanın cevapları verilir.
 */
export function firstTryCorrectCount(
  attempts: readonly { questionId: string; correct: boolean }[],
): number {
  const seen = new Set<string>();
  let count = 0;
  for (const attempt of attempts) {
    if (seen.has(attempt.questionId)) continue;
    seen.add(attempt.questionId);
    if (attempt.correct) count++;
  }
  return count;
}

export type StreakInfo = { streak: number; readToday: boolean; streakAtRisk: boolean };

/**
 * Seri: Türkiye saatine göre art arda, en az bir okumanın bitirildiği gün sayısı. `dates`
 * bitirilen okumaların anlarıdır. Bugün henüz okunmadıysa seri dünden sayılır ve "tehlikede"dir.
 */
export function streakFrom(dates: readonly Date[], today: Date): StreakInfo {
  const days = new Set(dates.map((date) => dayNumberInTimeZone(date)));
  const todayNo = dayNumberInTimeZone(today);
  const readToday = days.has(todayNo);

  let streak = 0;
  for (let day = readToday ? todayNo : todayNo - 1; days.has(day); day--) streak++;

  return { streak, readToday, streakAtRisk: !readToday && streak > 0 };
}

/** Tüm zamanların en uzun serisi (gün). */
export function bestStreakFrom(dates: readonly Date[]): number {
  const days = [...new Set(dates.map((date) => dayNumberInTimeZone(date)))].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  days.forEach((day, index) => {
    run = index > 0 && day === (days[index - 1] as number) + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  });
  return best;
}

const WEEKDAY_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'] as const;

/** Bugün dahil son 7 gün (eskiden yeniye) ve her gün en az bir okuma bitirilip bitirilmediği. */
export function weekFrom(dates: readonly Date[], today: Date): { day: string; done: boolean }[] {
  const days = new Set(dates.map((date) => dayNumberInTimeZone(date)));
  const todayNo = dayNumberInTimeZone(today);
  return Array.from({ length: 7 }, (_, index) => {
    const day = todayNo - 6 + index;
    // 1 Ocak 1970 (gün 0) perşembedir.
    return { day: WEEKDAY_SHORT[(day + 4) % 7] as string, done: days.has(day) };
  });
}

export type LessonStatus = 'done' | 'current' | 'locked';
export type CityStatus = 'completed' | 'current' | 'locked';

/** Dersleri yolculuk sırasına (şehir sırası, sonra ders sırası) dizer. */
export function compareLessons(
  a: { city: City; position: number },
  b: { city: City; position: number },
): number {
  return CITY_ORDER.indexOf(a.city) - CITY_ORDER.indexOf(b.city) || a.position - b.position;
}

/**
 * Ders durumları. Bir ders, İstanbul'un ilk dersiyse ya da yolculuk sırasındaki önceki ders
 * bitirildiyse açıktır. `ordered` yolculuk sırasıyla verilmelidir.
 */
export function lessonStatuses(
  ordered: readonly { id: string }[],
  completedIds: ReadonlySet<string>,
): Map<string, LessonStatus> {
  const statuses = new Map<string, LessonStatus>();
  ordered.forEach((lesson, index) => {
    const previous = ordered[index - 1];
    const unlocked = !previous || completedIds.has(previous.id);
    statuses.set(lesson.id, completedIds.has(lesson.id) ? 'done' : unlocked ? 'current' : 'locked');
  });
  return statuses;
}

/** Şehrin durumu: 10 dersi bittiyse tamamlandı, kullanıcının şehriyse şu anki, değilse kilitli. */
export function cityStatus(city: City, lessonsDone: number, currentCity: City): CityStatus {
  if (lessonsDone >= LESSONS_PER_CITY) return 'completed';
  return city === currentCity ? 'current' : 'locked';
}

export type LessonRewards = {
  /** Dersin kendisi: hikâye lokumu ya da sandık */
  lesson: number;
  /** Kazanılan her seviye (ör. [4]); her biri 50 lokum */
  levelsGained: number[];
  levelUp: number;
  /** Bu tamamlamayla açılan şehir, yoksa null */
  cityUnlocked: City | null;
  cityUnlock: number;
  total: number;
  levelBefore: number;
  levelAfter: number;
  /** Bu tamamlamayla tüm yolculuk bitti mi */
  finished: boolean;
};

/** Seviye `levelBefore`'dan `levelAfter`'a çıkınca açılan şehir; şehir değişmediyse null. */
export function unlockedCity(levelBefore: number, levelAfter: number): City | null {
  const cityAfter = cityForLevel(levelAfter);
  return cityAfter !== cityForLevel(levelBefore) ? cityAfter : null;
}

/** Bir dersin **ilk** tamamlanışında verilecek ödüller. */
export function rewardsFor(input: {
  kind: LessonKind;
  firstTryCorrect: number;
  completedBefore: number;
}): LessonRewards {
  const levelBefore = levelFromCompleted(input.completedBefore);
  const levelAfter = levelFromCompleted(input.completedBefore + 1);
  const levelsGained = Array.from(
    { length: levelAfter - levelBefore },
    (_, index) => levelBefore + index + 1,
  );
  const cityUnlocked = unlockedCity(levelBefore, levelAfter);

  const lesson = input.kind === LessonKind.CHEST ? LOKUM.CHEST : lessonLokum(input.firstTryCorrect);
  const levelUp = levelsGained.length * LOKUM.LEVEL_UP;
  const cityUnlock = cityUnlocked ? LOKUM.CITY_UNLOCK : 0;

  return {
    lesson,
    levelsGained,
    levelUp,
    cityUnlocked,
    cityUnlock,
    total: lesson + levelUp + cityUnlock,
    levelBefore,
    levelAfter,
    finished: input.completedBefore + 1 >= TOTAL_LESSONS,
  };
}

export type Achievement = { id: string; title: string; description: string; earned: boolean };

/** Başarılar (v1): tabloda saklanmaz, istatistiklerden hesaplanır. */
export function achievementsFor(stats: {
  storiesDone: number;
  bestStreak: number;
  threeStarLessons: number;
  completedLessons: number;
}): Achievement[] {
  return [
    {
      id: 'ilk-hikaye',
      title: 'İlk hikâye',
      description: 'İlk hikâyeni oku',
      earned: stats.storiesDone >= 1,
    },
    {
      id: 'seri-7',
      title: '7 gün seri',
      description: '7 gün art arda oku',
      earned: stats.bestStreak >= 7,
    },
    {
      id: 'hikaye-10',
      title: '10 hikâye',
      description: '10 hikâye oku',
      earned: stats.storiesDone >= 10,
    },
    {
      id: 'uc-yildiz-5',
      title: '5 kez 3 yıldız',
      description: '5 hikâyede 3 yıldız topla',
      earned: stats.threeStarLessons >= 5,
    },
    {
      id: 'yeni-sehir',
      title: 'İlk yeni şehir',
      description: "İzmir'e ulaş",
      earned: stats.completedLessons >= LESSONS_PER_CITY,
    },
  ];
}
