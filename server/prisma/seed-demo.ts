import type { PrismaClient } from '../src/db.js';
import { LessonKind, LokumReason } from '../src/generated/prisma/enums.js';
import { CITY_NAMES } from '../src/lib/city.js';
import {
  cityForLevel,
  levelFromCompleted,
  LOKUM,
  rewardsFor,
  starsFor,
  streakFrom,
} from '../src/lib/journey.js';
import { startOfDayInTimeZone } from '../src/lib/time.js';
import { hashPassword } from '../src/modules/auth/password.js';
import { seedLessonRows } from './seed-data/index.js';

/**
 * Yolculuğun farklı noktalarındaki demo kullanıcılar (yalnızca geliştirme). Her seed çalışmasında
 * oyun verileri ve okumaları silinip "bugün"e göre yeniden yazılır: ilk N ders yıldızlarıyla
 * bitirilmiş, lokumları API ile aynı kurallarla (rewardsFor) defterde, okumalar art arda günlerde.
 */

export const DEMO_PASSWORD = 'okuma123';

type DemoUser = {
  username: string;
  name: string;
  /** Bitirilmiş ders sayısı (yolculuk sırasıyla ilk N ders) */
  completed: number;
  /** Art arda okunan gün sayısı */
  streakDays: number;
  /** false: seri dün biter, bugün henüz okunmadı (seri "tehlikede") */
  readToday: boolean;
};

const DEMO_USERS: DemoUser[] = [
  { username: 'demo.istanbul', name: 'Ayşe', completed: 4, streakDays: 6, readToday: false },
  { username: 'demo.izmir', name: 'Mert', completed: 14, streakDays: 9, readToday: true },
  { username: 'demo.efes', name: 'Zeynep', completed: 22, streakDays: 14, readToday: false },
  { username: 'demo.antalya', name: 'Emir', completed: 32, streakDays: 21, readToday: true },
  { username: 'demo.kapadokya', name: 'Defne', completed: 42, streakDays: 28, readToday: true },
  { username: 'demo.van', name: 'Can', completed: 54, streakDays: 35, readToday: true },
  { username: 'demo.final', name: 'Ada', completed: 60, streakDays: 42, readToday: true },
];

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Yıldızlara çeşitlilik: çoğu ders 3 yıldız, bazıları 2 veya 1. */
function firstTryCorrectFor(index: number) {
  if (index % 11 === 6) return 1;
  if (index % 5 === 3) return 2;
  return 3;
}

/** `daysAgo` gün önceki günün (Türkiye saati) başlangıcı. */
function dayStart(now: Date, daysAgo: number) {
  const today = startOfDayInTimeZone(now);
  return startOfDayInTimeZone(new Date(today.getTime() - daysAgo * DAY + 12 * HOUR));
}

/**
 * Bir gündeki `index`. etkinliğin bitiş anı. Geçmiş günlerde 17:00'den itibaren; bugün ise gün
 * başı ile "şimdi" arasına yayılır, böylece hiçbir kayıt gelecekte kalmaz.
 */
function slotEnd(now: Date, daysAgo: number, index: number, count: number) {
  const start = dayStart(now, daysAgo).getTime();
  if (daysAgo > 0) return new Date(start + 17 * HOUR + index * 12 * MINUTE);
  const available = Math.max(0, now.getTime() - 3 * MINUTE - start);
  return new Date(start + (available * (index + 1)) / (count + 1));
}

type Question = { id: string; textId: string; correctIndex: number };

export type DemoSummary = {
  username: string;
  name: string;
  completed: number;
  level: number;
  city: string;
  lokum: number;
  streak: number;
  readToday: boolean;
};

export async function seedDemoUsers(prisma: PrismaClient, now: Date): Promise<DemoSummary[]> {
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const questions = await prisma.question.findMany({
    select: { id: true, textId: true, correctIndex: true },
    orderBy: { position: 'asc' },
  });
  const questionsByText = new Map<string, Question[]>();
  for (const question of questions) {
    questionsByText.set(question.textId, [
      ...(questionsByText.get(question.textId) ?? []),
      question,
    ]);
  }

  const summaries: DemoSummary[] = [];
  for (const demo of DEMO_USERS) {
    const data = { passwordHash, name: demo.name, grade: 3, dailyGoalMinutes: 10 };
    const { id: userId } = await prisma.user.upsert({
      where: { username: demo.username },
      create: { username: demo.username, ...data },
      update: data,
      select: { id: true },
    });
    // Demo kullanıcının tüm oyun verisi her seferinde yeniden yazılır (cevaplar okumalarla silinir).
    await prisma.lokumEntry.deleteMany({ where: { userId } });
    await prisma.lessonCompletion.deleteMany({ where: { userId } });
    await prisma.readingSession.deleteMany({ where: { userId } });

    const lessons = seedLessonRows.slice(0, demo.completed);
    const lastDaysAgo = demo.readToday ? 0 : 1;
    // Her ders bir güne düşer (gün 0 = serinin ilk günü); ders yoksa o gün tekrar okuma yapılır.
    const dayOf = (index: number) => Math.floor((index * demo.streakDays) / lessons.length);
    const perDay = new Map<number, number>();
    lessons.forEach((_, index) => perDay.set(dayOf(index), (perDay.get(dayOf(index)) ?? 0) + 1));

    const sessions: {
      id: string;
      userId: string;
      textId: string;
      startedAt: Date;
      endedAt: Date;
      durationSeconds: number;
      progress: number;
      completed: boolean;
    }[] = [];
    const attempts: {
      userId: string;
      questionId: string;
      readingSessionId: string;
      choiceIndex: number;
      correct: boolean;
      createdAt: Date;
    }[] = [];
    const completions: {
      userId: string;
      lessonId: string;
      readingSessionId: string | null;
      stars: number | null;
      bestStars: number | null;
      completedAt: Date;
    }[] = [];
    const lokum: {
      userId: string;
      lessonId: string;
      amount: number;
      reason: LokumReason;
      level: number | null;
      createdAt: Date;
    }[] = [];

    const addSession = (textId: string, endedAt: Date, durationSeconds: number) => {
      const id = `seed-${demo.username}-${String(sessions.length + 1).padStart(3, '0')}`;
      sessions.push({
        id,
        userId,
        textId,
        startedAt: new Date(endedAt.getTime() - durationSeconds * SECOND - 20 * SECOND),
        endedAt,
        durationSeconds,
        progress: 1,
        completed: true,
      });
      return id;
    };

    let slotInDay = 0;
    let previousDay = -1;
    lessons.forEach((lesson, index) => {
      const day = dayOf(index);
      slotInDay = day === previousDay ? slotInDay + 1 : 0;
      previousDay = day;
      const daysAgo = lastDaysAgo + demo.streakDays - 1 - day;
      const endedAt = slotEnd(now, daysAgo, slotInDay, perDay.get(day) ?? 1);
      const completedAt = new Date(endedAt.getTime() + 90 * SECOND);

      let readingSessionId: string | null = null;
      let stars: number | null = null;
      const firstTryCorrect = firstTryCorrectFor(index);
      if (lesson.kind === LessonKind.STORY && lesson.textId) {
        const sessionId = addSession(lesson.textId, endedAt, 100 + ((index * 37) % 160));
        readingSessionId = sessionId;
        stars = starsFor(firstTryCorrect);
        let at = endedAt.getTime();
        (questionsByText.get(lesson.textId) ?? []).forEach((question, questionIndex) => {
          const base = { userId, questionId: question.id, readingSessionId: sessionId };
          if (questionIndex >= firstTryCorrect) {
            at += 15 * SECOND;
            const wrong = (question.correctIndex + 1) % 3;
            attempts.push({ ...base, choiceIndex: wrong, correct: false, createdAt: new Date(at) });
          }
          at += 15 * SECOND;
          attempts.push({
            ...base,
            choiceIndex: question.correctIndex,
            correct: true,
            createdAt: new Date(at),
          });
        });
      }

      completions.push({
        userId,
        lessonId: lesson.id,
        readingSessionId,
        stars,
        bestStars: stars,
        completedAt,
      });

      const rewards = rewardsFor({ kind: lesson.kind, firstTryCorrect, completedBefore: index });
      const entry = { userId, lessonId: lesson.id, level: null, createdAt: completedAt };
      lokum.push({
        ...entry,
        amount: rewards.lesson,
        reason: lesson.kind === LessonKind.CHEST ? LokumReason.CHEST : LokumReason.LESSON,
      });
      for (const level of rewards.levelsGained) {
        lokum.push({ ...entry, amount: LOKUM.LEVEL_UP, reason: LokumReason.LEVEL_UP, level });
      }
      if (rewards.cityUnlocked) {
        lokum.push({ ...entry, amount: LOKUM.CITY_UNLOCK, reason: LokumReason.CITY_UNLOCK });
      }
    });

    // Ders düşmeyen (ya da yalnızca sandık düşen) seri günlerinde son hikâye yeniden okunur.
    const storyDays = new Set(
      lessons.flatMap((lesson, index) => (lesson.kind === LessonKind.STORY ? [dayOf(index)] : [])),
    );
    for (let day = 0; day < demo.streakDays; day++) {
      if (storyDays.has(day)) continue;
      const textId = lessons
        .filter((lesson, index) => dayOf(index) <= day && lesson.textId)
        .at(-1)?.textId;
      if (!textId) continue;
      const daysAgo = lastDaysAgo + demo.streakDays - 1 - day;
      const lessonsThatDay = perDay.get(day) ?? 0;
      addSession(textId, slotEnd(now, daysAgo, lessonsThatDay, lessonsThatDay + 1), 150);
    }

    await prisma.readingSession.createMany({ data: sessions });
    await prisma.questionAttempt.createMany({ data: attempts });
    await prisma.lessonCompletion.createMany({ data: completions });
    await prisma.lokumEntry.createMany({ data: lokum });

    const level = levelFromCompleted(demo.completed);
    summaries.push({
      username: demo.username,
      name: demo.name,
      completed: demo.completed,
      level,
      city: CITY_NAMES[cityForLevel(level)],
      lokum: lokum.reduce((sum, row) => sum + row.amount, 0),
      streak: streakFrom(
        sessions.map((session) => session.endedAt),
        now,
      ).streak,
      readToday: demo.readToday,
    });
  }
  return summaries;
}
