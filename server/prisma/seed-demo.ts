import type { PrismaClient } from '../src/db.js';
import { LessonKind, LokumReason, QuestionType } from '../src/generated/prisma/enums.js';
import { CITY_NAMES } from '../src/lib/city.js';
import { gradeBandOf, RUSHED_WPM_CEILING } from '../src/lib/grade-band.js';
import {
  cityForLevel,
  levelFromCompleted,
  LOKUM,
  rewardsFor,
  starsFor,
  streakFrom,
} from '../src/lib/journey.js';
import { readingMetricValues } from '../src/lib/reading-metrics.js';
import { startOfDayInTimeZone } from '../src/lib/time.js';
import { hashPassword } from '../src/modules/auth/password.js';
import { seedLessonRows, seedLessonTextRows, seedTexts } from './seed-data/index.js';

/**
 * Yolculuğun farklı noktalarındaki demo kullanıcılar (yalnızca geliştirme). Her seed çalışmasında
 * oyun verileri ve okumaları silinip "bugün"e göre yeniden yazılır: ilk N ders yıldızlarıyla
 * bitirilmiş, lokumları API ile aynı kurallarla (rewardsFor) defterde.
 *
 * Okuma geçmişi son 6 haftaya yayılır (A0 ölçümleri): seriden önceki haftalarda seyrek günler
 * (art arda iki gün yok; serinin bir gün öncesi boş, böylece seri ve en iyi seri değişmez), sonra
 * seri günleri. Dersler bu günlere sırayla düşer; ders düşmeyen günlerde son hikâye sorularıyla
 * yeniden okunur. Süreler kullanıcının dakikadaki kelime eğrisinden (gürültülü artış) hesaplanır;
 * yanlış ilk cevaplar çoğunlukla kullanıcının zayıf türündeki sorulara düşer. Her biten okumanın
 * reading_metrics satırı API ile aynı kuralla (readingMetricValues) yazılır. Her demo kullanıcının bir
 * seviye belirleme sonucu (user_baselines) vardır; uygulamada seviye belirleme önerilmez.
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
  /** Son okumanın kaç gün önce olduğu (varsayılan: bugün okuduysa 0, değilse 1). */
  awayDays?: number;
  /** Raporlarda belirgin zayıf soru türü */
  weakType: QuestionType;
  /** 6 hafta önceki ve bugünkü dakikadaki kelime (G2, 3. sınıf) */
  wpm: { from: number; to: number };
  /** Acele okuma örneği (çok hızlı + anlama düşük) olacak tekrar okuma sayısı */
  rushed?: number;
};

const DEMO_USERS: DemoUser[] = [
  {
    username: 'demo.istanbul',
    name: 'Ayşe',
    completed: 4,
    streakDays: 6,
    readToday: false,
    weakType: QuestionType.NEDEN_SONUC,
    wpm: { from: 58, to: 74 },
  },
  // İstanbul'un 9 dersi bitmiş: 10. ders (sandık) seviye atlatır ve İzmir'i açar (ödül akışı).
  {
    username: 'demo.sehir',
    name: 'Selin',
    completed: 9,
    streakDays: 5,
    readToday: false,
    weakType: QuestionType.SOZCUK_ANLAMI,
    wpm: { from: 66, to: 80 },
  },
  // Son okuması 3 gün önce: açılışta "Yeniden merhaba" ekranı (T04).
  {
    username: 'demo.donus',
    name: 'Elif',
    completed: 6,
    streakDays: 4,
    readToday: false,
    awayDays: 3,
    weakType: QuestionType.DUYGU_KARAKTER,
    wpm: { from: 62, to: 70 },
  },
  {
    username: 'demo.izmir',
    name: 'Mert',
    completed: 14,
    streakDays: 9,
    readToday: true,
    weakType: QuestionType.ANA_FIKIR,
    wpm: { from: 70, to: 92 },
    rushed: 1,
  },
  {
    username: 'demo.efes',
    name: 'Zeynep',
    completed: 22,
    streakDays: 14,
    readToday: false,
    weakType: QuestionType.CUMLEDE_ANLAM,
    wpm: { from: 75, to: 98 },
    rushed: 3,
  },
  {
    username: 'demo.antalya',
    name: 'Emir',
    completed: 32,
    streakDays: 21,
    readToday: true,
    weakType: QuestionType.NEDEN_SONUC,
    wpm: { from: 72, to: 96 },
  },
  {
    username: 'demo.kapadokya',
    name: 'Defne',
    completed: 42,
    streakDays: 28,
    readToday: true,
    weakType: QuestionType.SOZCUK_ANLAMI,
    wpm: { from: 80, to: 104 },
  },
  {
    username: 'demo.van',
    name: 'Can',
    completed: 54,
    streakDays: 35,
    readToday: true,
    weakType: QuestionType.ANA_FIKIR,
    wpm: { from: 78, to: 108 },
    rushed: 1,
  },
  {
    username: 'demo.final',
    name: 'Ada',
    completed: 60,
    streakDays: 42,
    readToday: true,
    weakType: QuestionType.DUYGU_KARAKTER,
    wpm: { from: 82, to: 112 },
  },
];

/** Geçmişin başladığı gün (6 hafta önce). */
const HISTORY_DAYS = 42;
/** Demo kullanıcılar 3. sınıf (G2). */
const DEMO_GRADE = 3;

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

/** Seed her çalışmada aynı sonucu versin diye kullanıcı adı ve sayılarla belirlenen 0-1 sayı. */
function noise(...parts: (string | number)[]) {
  let hash = 2166136261;
  for (const char of parts.join('|')) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10_000) / 10_000;
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

/**
 * Okunan günler (kaç gün önce), eskiden yeniye: serinin öncesinde haftada üç seyrek gün
 * (art arda gelmez, serinin bir gün öncesi boş kalır), sonra seri günleri.
 */
function activityDays(demo: DemoUser, lastDaysAgo: number): number[] {
  const streakStart = lastDaysAgo + demo.streakDays - 1;
  const days: number[] = [];
  for (let daysAgo = HISTORY_DAYS; daysAgo >= streakStart + 2; daysAgo--) {
    if (daysAgo % 7 === 0 || daysAgo % 7 === 2 || daysAgo % 7 === 4) days.push(daysAgo);
  }
  for (let daysAgo = streakStart; daysAgo >= lastDaysAgo; daysAgo--) days.push(daysAgo);
  return days;
}

type Question = {
  id: string;
  textId: string;
  correctIndex: number;
  options: string[];
  type: QuestionType;
};

export type DemoSummary = {
  username: string;
  name: string;
  completed: number;
  level: number;
  city: string;
  lokum: number;
  streak: number;
  readToday: boolean;
  readings: number;
};

export async function seedDemoUsers(prisma: PrismaClient, now: Date): Promise<DemoSummary[]> {
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const questions = await prisma.question.findMany({
    select: { id: true, textId: true, correctIndex: true, options: true, type: true },
    orderBy: { position: 'asc' },
  });
  const questionsByText = new Map<string, Question[]>();
  for (const question of questions) {
    questionsByText.set(question.textId, [
      ...(questionsByText.get(question.textId) ?? []),
      question,
    ]);
  }
  const gradeBand = gradeBandOf(DEMO_GRADE);
  const textOfLesson = new Map(
    seedLessonTextRows
      .filter((row) => row.gradeBand === gradeBand)
      .map((row) => [row.lessonId, row.textId]),
  );
  const wordsOfText = new Map(seedTexts.map((text) => [text.id, text.wordCount]));

  const summaries: DemoSummary[] = [];
  for (const demo of DEMO_USERS) {
    const data = { passwordHash, name: demo.name, grade: DEMO_GRADE, dailyGoalMinutes: 10 };
    const { id: userId } = await prisma.user.upsert({
      where: { username: demo.username },
      create: { username: demo.username, ...data },
      update: data,
      select: { id: true },
    });
    // Demo kullanıcının tüm oyun verisi her seferinde yeniden yazılır (cevaplar ve ölçümler
    // okumalarla birlikte silinir).
    await prisma.lokumEntry.deleteMany({ where: { userId } });
    await prisma.lessonCompletion.deleteMany({ where: { userId } });
    await prisma.readingSession.deleteMany({ where: { userId } });

    const lessons = seedLessonRows.slice(0, demo.completed);
    const lastDaysAgo = demo.awayDays ?? (demo.readToday ? 0 : 1);
    const days = activityDays(demo, lastDaysAgo);
    // Her ders bir güne düşer (yolculuk sırasıyla, günlere eşit yayılır).
    const dayOf = (index: number) => days[Math.floor((index * days.length) / lessons.length)] ?? 0;
    const perDay = new Map<number, number>();
    for (const [index] of lessons.entries()) {
      perDay.set(dayOf(index), (perDay.get(dayOf(index)) ?? 0) + 1);
    }

    /** O günkü hedef hız: 6 hafta boyunca doğrusal artış, ±%8 gürültü. */
    const wpmOn = (daysAgo: number, key: number) => {
      const progress = 1 - daysAgo / HISTORY_DAYS;
      const trend = demo.wpm.from + (demo.wpm.to - demo.wpm.from) * progress;
      return trend * (0.92 + 0.16 * noise(demo.username, 'wpm', key));
    };

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
    const metrics: ({ readingSessionId: string } & ReturnType<typeof readingMetricValues>)[] = [];
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

    /**
     * Bir hikâyenin okunması ve soruları: `wrong` sorunun ilk cevabı yanlış, sonra doğru. Okuma
     * ölçümü ilk denemede doğru sayısıyla birlikte yazılır.
     */
    const addReading = (
      textId: string,
      endedAt: Date,
      wpm: number,
      wrong: (question: Question, index: number) => boolean,
    ) => {
      const wordCount = wordsOfText.get(textId) ?? 0;
      const durationSeconds = Math.max(30, Math.round((wordCount * 60) / wpm));
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

      const textQuestions = questionsByText.get(textId) ?? [];
      let at = endedAt.getTime();
      let firstTryCorrect = 0;
      textQuestions.forEach((question, index) => {
        const base = { userId, questionId: question.id, readingSessionId: id };
        if (wrong(question, index)) {
          at += 15 * SECOND;
          const choiceIndex = (question.correctIndex + 1) % question.options.length;
          attempts.push({ ...base, choiceIndex, correct: false, createdAt: new Date(at) });
        } else {
          firstTryCorrect++;
        }
        at += 15 * SECOND;
        attempts.push({
          ...base,
          choiceIndex: question.correctIndex,
          correct: true,
          createdAt: new Date(at),
        });
      });
      metrics.push({
        readingSessionId: id,
        ...readingMetricValues({
          gradeBand,
          wordCount,
          durationSeconds,
          questions: { total: textQuestions.length, firstTryCorrect },
        }),
      });
      return id;
    };

    let slotInDay = 0;
    let previousDay = -1;
    lessons.forEach((lesson, index) => {
      const daysAgo = dayOf(index);
      slotInDay = daysAgo === previousDay ? slotInDay + 1 : 0;
      previousDay = daysAgo;
      const endedAt = slotEnd(now, daysAgo, slotInDay, perDay.get(daysAgo) ?? 1);
      const completedAt = new Date(endedAt.getTime() + 90 * SECOND);

      let readingSessionId: string | null = null;
      let stars: number | null = null;
      const firstTryCorrect = firstTryCorrectFor(index);
      const textId = textOfLesson.get(lesson.id);
      if (lesson.kind === LessonKind.STORY && textId) {
        // Yanlış ilk cevaplar önce zayıf türdeki sorulara düşer; yıldız sayısı değişmez.
        const textQuestions = questionsByText.get(textId) ?? [];
        const wrongIds = new Set(
          [...textQuestions]
            .sort((a, b) => Number(b.type === demo.weakType) - Number(a.type === demo.weakType))
            .slice(0, textQuestions.length - firstTryCorrect)
            .map((question) => question.id),
        );
        readingSessionId = addReading(textId, endedAt, wpmOn(daysAgo, index), (question) =>
          wrongIds.has(question.id),
        );
        stars = starsFor(firstTryCorrect);
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

    // Ders düşmeyen (ya da yalnızca sandık düşen) günlerde son hikâye sorularıyla yeniden okunur:
    // zayıf türde ilk cevap çoğunlukla yanlış, diğerlerinde arada bir. İlk `rushed` tekrar okuma
    // aceleye gelir: tavanın üstünde hız ve en fazla bir doğru.
    const storyDays = new Set(
      lessons.flatMap((lesson, index) => (lesson.kind === LessonKind.STORY ? [dayOf(index)] : [])),
    );
    let rushedLeft = demo.rushed ?? 0;
    for (const daysAgo of days) {
      if (storyDays.has(daysAgo)) continue;
      const lastStory = lessons
        .filter((lesson, index) => dayOf(index) >= daysAgo && textOfLesson.has(lesson.id))
        .at(-1);
      const textId = lastStory ? textOfLesson.get(lastStory.id) : undefined;
      if (!textId) continue;
      const lessonsThatDay = perDay.get(daysAgo) ?? 0;
      const endedAt = slotEnd(now, daysAgo, lessonsThatDay, lessonsThatDay + 1);
      if (rushedLeft > 0 && daysAgo > lastDaysAgo) {
        rushedLeft--;
        const wpm = RUSHED_WPM_CEILING[gradeBand] * (1.25 + 0.2 * noise(demo.username, daysAgo));
        addReading(textId, endedAt, wpm, (_, index) => index > 0);
        continue;
      }
      addReading(textId, endedAt, wpmOn(daysAgo, 1000 + daysAgo), (question, index) => {
        const chance = question.type === demo.weakType ? 0.7 : 0.1;
        return noise(demo.username, daysAgo, index) < chance;
      });
    }

    await prisma.readingSession.createMany({ data: sessions });
    await prisma.questionAttempt.createMany({ data: attempts });
    await prisma.readingMetric.createMany({ data: metrics });
    await prisma.lessonCompletion.createMany({ data: completions });
    await prisma.lokumEntry.createMany({ data: lokum });

    // Seviye belirleme, geçmişin başlangıcından bir gün önce: hız 6 hafta önceki eğrinin biraz
    // altında, anlama 6 sorudan 4 ya da 5 doğru. Böylece raporlarda başlangıca göre gelişim görünür.
    await prisma.userBaseline.deleteMany({ where: { userId } });
    await prisma.userBaseline.create({
      data: {
        userId,
        grade: DEMO_GRADE,
        gradeBand,
        wordsPerMinute:
          Math.round(demo.wpm.from * (0.9 + 0.08 * noise(demo.username, 'baseline')) * 10) / 10,
        comprehension: noise(demo.username, 'baseline-comprehension') < 0.5 ? 0.67 : 0.83,
        measuredAt: slotEnd(now, HISTORY_DAYS + 1, 0, 1),
      },
    });

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
      readings: sessions.length,
    });
  }
  return summaries;
}
