import { describe, expect, it } from 'vitest';

import { City, LessonKind } from '../src/generated/prisma/enums.js';
import { fromApiCity, toApiCity } from '../src/lib/city.js';
import {
  achievementsFor,
  bestStreakFrom,
  cityForLevel,
  cityLevelRange,
  cityStatus,
  firstTryCorrectCount,
  lessonLokum,
  lessonStatuses,
  levelFromCompleted,
  maxLessonLokum,
  rewardsFor,
  starsFor,
  streakFrom,
  weekFrom,
} from '../src/lib/journey.js';
import { dayNumberInTimeZone } from '../src/lib/time.js';

/** İstanbul saatiyle verilen an (UTC+3). */
const tr = (local: string) => new Date(`${local}+03:00`);

describe('seviye ve şehir', () => {
  it('seviye = 1 + ⌊tamamlanan / 2⌋, en fazla 30', () => {
    expect([0, 1, 2, 3, 4, 9, 10, 14, 58, 59, 60].map(levelFromCompleted)).toEqual([
      1, 1, 2, 2, 3, 5, 6, 8, 30, 30, 30,
    ]);
  });

  it('her şehir 5 seviyedir', () => {
    expect([1, 5, 6, 10, 11, 16, 21, 25, 26, 30].map(cityForLevel)).toEqual([
      City.ISTANBUL,
      City.ISTANBUL,
      City.IZMIR,
      City.IZMIR,
      City.EFES,
      City.ANTALYA,
      City.KAPADOKYA,
      City.KAPADOKYA,
      City.VAN,
      City.VAN,
    ]);
    expect(cityLevelRange(City.EFES)).toEqual({ levelFrom: 11, levelTo: 15 });
    expect(cityLevelRange(City.VAN)).toEqual({ levelFrom: 26, levelTo: 30 });
  });

  it('şehir kimlikleri API için küçük harfe çevrilir', () => {
    expect(toApiCity(City.KAPADOKYA)).toBe('kapadokya');
    expect(fromApiCity('izmir')).toBe(City.IZMIR);
  });
});

describe('yıldız ve lokum', () => {
  it('ilk denemede doğru cevap sayısına göre yıldız', () => {
    expect([0, 1, 2, 3].map(starsFor)).toEqual([1, 1, 2, 3]);
  });

  it('hikâye lokumu 5 + 5 × ilk denemede doğru (en fazla 20), sandık 30', () => {
    expect([0, 1, 2, 3].map(lessonLokum)).toEqual([5, 10, 15, 20]);
    expect(maxLessonLokum(LessonKind.STORY)).toBe(20);
    expect(maxLessonLokum(LessonKind.CHEST)).toBe(30);
  });

  it('her sorunun yalnızca ilk cevabı sayılır', () => {
    expect(
      firstTryCorrectCount([
        { questionId: 'a', correct: false },
        { questionId: 'a', correct: true },
        { questionId: 'b', correct: true },
        { questionId: 'b', correct: true },
        { questionId: 'c', correct: true },
      ]),
    ).toBe(2);
  });
});

describe('ödüller (ilk tamamlama)', () => {
  it('seviye atlatmayan hikâye yalnızca ders lokumu verir', () => {
    expect(
      rewardsFor({ kind: LessonKind.STORY, firstTryCorrect: 3, completedBefore: 0 }),
    ).toMatchObject({
      lesson: 20,
      levelsGained: [],
      levelUp: 0,
      cityUnlocked: null,
      total: 20,
      levelBefore: 1,
      levelAfter: 1,
      finished: false,
    });
  });

  it('ikinci ders seviye atlatır (+50)', () => {
    expect(
      rewardsFor({ kind: LessonKind.STORY, firstTryCorrect: 1, completedBefore: 1 }),
    ).toMatchObject({ lesson: 10, levelsGained: [2], levelUp: 50, total: 60 });
  });

  it('şehrin 10. dersi (sandık) seviye atlatır ve yeni şehri açar', () => {
    expect(
      rewardsFor({ kind: LessonKind.CHEST, firstTryCorrect: 0, completedBefore: 9 }),
    ).toMatchObject({
      lesson: 30,
      levelsGained: [6],
      levelUp: 50,
      cityUnlocked: City.IZMIR,
      cityUnlock: 100,
      total: 180,
    });
    expect(
      rewardsFor({ kind: LessonKind.CHEST, firstTryCorrect: 0, completedBefore: 49 }).cityUnlocked,
    ).toBe(City.VAN);
  });

  it('son ders (60.) yolculuğu bitirir; seviye 30 sınırında kalır', () => {
    expect(
      rewardsFor({ kind: LessonKind.CHEST, firstTryCorrect: 0, completedBefore: 59 }),
    ).toMatchObject({
      levelsGained: [],
      cityUnlocked: null,
      total: 30,
      levelBefore: 30,
      levelAfter: 30,
      finished: true,
    });
  });
});

describe('ders ve şehir durumları', () => {
  const lessons = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];

  it('ilk ders açıktır; sonraki ders öncekine bağlıdır', () => {
    expect([...lessonStatuses(lessons, new Set()).values()]).toEqual([
      'current',
      'locked',
      'locked',
      'locked',
    ]);
    expect([...lessonStatuses(lessons, new Set(['a', 'b'])).values()]).toEqual([
      'done',
      'done',
      'current',
      'locked',
    ]);
  });

  it('şehir: 10 dersi bittiyse tamamlandı, kullanıcının şehriyse şu anki, değilse kilitli', () => {
    expect(cityStatus(City.ISTANBUL, 10, City.IZMIR)).toBe('completed');
    expect(cityStatus(City.IZMIR, 4, City.IZMIR)).toBe('current');
    expect(cityStatus(City.EFES, 0, City.IZMIR)).toBe('locked');
    expect(cityStatus(City.VAN, 10, City.VAN)).toBe('completed');
  });
});

describe('seri (Türkiye saati)', () => {
  const today = tr('2026-10-15T20:00:00');

  it('bugün okunduysa bugünden geriye art arda günleri sayar', () => {
    const dates = [
      tr('2026-10-15T08:00:00'),
      tr('2026-10-14T19:00:00'),
      tr('2026-10-14T21:00:00'),
      tr('2026-10-13T10:00:00'),
      tr('2026-10-11T10:00:00'),
    ];
    expect(streakFrom(dates, today)).toEqual({ streak: 3, readToday: true, streakAtRisk: false });
  });

  it('bugün okunmadıysa seri dünden sayılır ve tehlikededir', () => {
    const dates = [tr('2026-10-14T19:00:00'), tr('2026-10-13T10:00:00')];
    expect(streakFrom(dates, today)).toEqual({ streak: 2, readToday: false, streakAtRisk: true });
  });

  it('dün de okunmadıysa seri 0dır (tehlikede değil, kaybedilecek seri yok)', () => {
    expect(streakFrom([tr('2026-10-13T10:00:00')], today)).toEqual({
      streak: 0,
      readToday: false,
      streakAtRisk: false,
    });
  });

  it("gün sınırı İstanbul'da gece yarısıdır (UTC 21:00)", () => {
    // 15 Ekim 23:59 ve 16 Ekim 00:01 (İstanbul) farklı günlerdir; UTC'de ikisi de 15 Ekim.
    const beforeMidnight = new Date('2026-10-15T20:59:00Z');
    const afterMidnight = new Date('2026-10-15T21:01:00Z');
    expect(dayNumberInTimeZone(afterMidnight) - dayNumberInTimeZone(beforeMidnight)).toBe(1);

    // 16 Ekim 00:30'da (İstanbul): 23:59'daki okuma "dün", 00:01'deki "bugün" sayılır.
    const justAfter = new Date('2026-10-15T21:30:00Z');
    expect(streakFrom([beforeMidnight], justAfter)).toEqual({
      streak: 1,
      readToday: false,
      streakAtRisk: true,
    });
    expect(streakFrom([beforeMidnight, afterMidnight], justAfter)).toEqual({
      streak: 2,
      readToday: true,
      streakAtRisk: false,
    });
  });

  it('en uzun seri ve son 7 gün', () => {
    const dates = [
      tr('2026-10-01T10:00:00'),
      tr('2026-10-02T10:00:00'),
      tr('2026-10-03T10:00:00'),
      tr('2026-10-14T10:00:00'),
      tr('2026-10-15T10:00:00'),
    ];
    expect(bestStreakFrom(dates)).toBe(3);
    expect(bestStreakFrom([])).toBe(0);
    // 15 Ekim 2026 perşembedir.
    expect(weekFrom(dates, today)).toEqual([
      { day: 'Cum', done: false },
      { day: 'Cmt', done: false },
      { day: 'Paz', done: false },
      { day: 'Pzt', done: false },
      { day: 'Sal', done: false },
      { day: 'Çar', done: true },
      { day: 'Per', done: true },
    ]);
  });
});

describe('başarılar', () => {
  it('istatistiklerden hesaplanır', () => {
    const earned = (stats: Parameters<typeof achievementsFor>[0]) =>
      achievementsFor(stats)
        .filter((achievement) => achievement.earned)
        .map((achievement) => achievement.id);

    expect(
      earned({ storiesDone: 0, bestStreak: 0, threeStarLessons: 0, completedLessons: 0 }),
    ).toEqual([]);
    expect(
      earned({ storiesDone: 1, bestStreak: 6, threeStarLessons: 4, completedLessons: 9 }),
    ).toEqual(['ilk-hikaye']);
    expect(
      earned({ storiesDone: 10, bestStreak: 7, threeStarLessons: 5, completedLessons: 12 }),
    ).toEqual(['ilk-hikaye', 'seri-7', 'hikaye-10', 'uc-yildiz-5', 'yeni-sehir']);
  });
});
