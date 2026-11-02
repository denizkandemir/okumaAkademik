import 'dotenv/config';

import { createPrismaClient } from '../src/db.js';
import { gradeBandOf } from '../src/lib/grade-band.js';
import { startOfDayInTimeZone } from '../src/lib/time.js';
import { hashPassword } from '../src/modules/auth/password.js';
import { writeReadingMetric } from '../src/modules/progress/reading-metrics.js';
import {
  seedGlossaryRows,
  seedLessonRows,
  seedLessonTextRows,
  seedPlacementQuestionRows,
  seedPlacementRows,
  seedPlacementTexts,
  seedQuestionRows,
  seedTexts,
} from './seed-data/index.js';
import { DEMO_PASSWORD, seedDemoUsers } from './seed-demo.js';
import { sampleUsersAllowed } from './seed-guard.js';

/**
 * Geliştirme verisi. Üretimde çalıştırılmamalı. Tekrar çalıştırılabilir (upsert): içerik
 * (metinler, dersler, sorular, kelime anlamları) seed-data/ ile eşitlenir, kullanıcılar
 * güncellenir, okuma geçmişi sabit kimliklerle (seed-<kullanıcı>-NN) yeniden yazılır ve
 * tarihleri her çalıştırmada "bugün"e göre taşınır. Demo kullanıcılar: seed-demo.ts.
 * Kullanıcılar yalnızca yerel veritabanında ya da `SEED_DEMO=1` ile yazılır (seed-guard.ts);
 * içerik her zaman eşitlenir.
 */

type SeedUser = {
  username: string;
  password: string;
  name: string;
  grade: number;
  dailyGoalMinutes: number;
};

/** Bir okuma kaydı. Zaman, Türkiye saatiyle `daysAgo` gün önceki `time` (SS:DD). */
type SeedReading = {
  daysAgo: number;
  time: string;
  textId: string;
  durationSeconds: number;
  progress: number;
  completed: boolean;
  /** Metin açılıp hiç ilerleme kaydedilmediyse ended_at boş kalır. */
  neverSaved?: boolean;
};

/** Seviye belirleme sonucu, Türkiye saatiyle `daysAgo` gün önce 17:00'de. */
type SeedBaseline = { daysAgo: number; wordsPerMinute: number; comprehension: number };

/** Örnek okumaların süresi metnin kelime sayısından hesaplanır (bkz. `r`). */
const wordsOfText = new Map(seedTexts.map((text) => [text.id, text.wordCount]));

/** Mobil uygulamada elle denemek için; okuma geçmişine dokunulmaz. */
const TEST_USER: SeedUser = {
  username: 'deneme',
  password: '1234',
  name: 'Deneme',
  grade: 3,
  dailyGoalMinutes: 10,
};

/**
 * Rapor görünümlerinde (v_*) örnek veri olsun diye farklı sınıflardan kullanıcılar. Okuma süreleri
 * sınıfa uygun dakikadaki kelimeden hesaplanır (01-arastirma.md §4: 2. sınıf ≈ 45-100, ortaokul
 * ortalaması ≈ 100); yarım kalan okumada okunan kısım kadar. `baseline`: seviye belirleme sonucu;
 * elif'te yok, böylece girişte seviye belirleme (G1) denenebilir.
 */
const SAMPLE_USERS: { user: SeedUser; baseline?: SeedBaseline; readings: SeedReading[] }[] = [
  {
    user: { username: 'elif', password: '1234', name: 'Elif', grade: 2, dailyGoalMinutes: 10 },
    readings: [
      r(6, '18:30', 'minik-serce', 54, 1, true),
      r(5, '19:10', 'bahcedeki-domatesler', 50, 0.55, false),
      r(5, '19:25', 'bahcedeki-domatesler', 57, 1, true),
      r(3, '17:45', 'kayip-anahtar', 48, 0.4, false),
      r(1, '18:05', 'kayip-anahtar', 55, 1, true),
      r(1, '18:20', 'minik-serce', 63, 1, true),
      r(0, '08:15', 'bahcedeki-domatesler', 60, 0.35, false),
    ],
  },
  {
    user: { username: 'kerem', password: '1234', name: 'Kerem', grade: 5, dailyGoalMinutes: 15 },
    baseline: { daysAgo: 8, wordsPerMinute: 92.5, comprehension: 0.67 },
    readings: [
      r(6, '20:00', 'kayip-anahtar', 96, 1, true),
      r(5, '20:15', 'deniz-feneri', 90, 0.5, false),
      r(4, '19:40', 'deniz-feneri', 101, 1, true),
      { ...r(3, '18:00', 'gokyuzundeki-haritalar', 100, 0, false), neverSaved: true },
      r(2, '21:00', 'gokyuzundeki-haritalar', 94, 0.45, false),
      r(1, '20:30', 'gokyuzundeki-haritalar', 104, 1, true),
      r(1, '20:45', 'kayip-anahtar', 110, 1, true),
      r(0, '10:30', 'deniz-feneri', 106, 0.3, false),
    ],
  },
  {
    user: { username: 'zeynep', password: '1234', name: 'Zeynep', grade: 7, dailyGoalMinutes: 20 },
    baseline: { daysAgo: 8, wordsPerMinute: 116.8, comprehension: 0.83 },
    readings: [
      r(6, '16:00', 'gokyuzundeki-haritalar', 118, 1, true),
      r(4, '16:30', 'deniz-feneri', 124, 1, true),
      r(4, '16:45', 'gokyuzundeki-haritalar', 121, 1, true),
      r(3, '17:10', 'deniz-feneri', 115, 0.6, false),
      r(2, '15:20', 'deniz-feneri', 131, 1, true),
      r(0, '09:40', 'gokyuzundeki-haritalar', 127, 0.25, false),
    ],
  },
];

/** `wordsPerMinute` hızla metnin `progress` kadarını okumanın süresi (saniye). */
function r(
  daysAgo: number,
  time: string,
  textId: string,
  wordsPerMinute: number,
  progress: number,
  completed: boolean,
): SeedReading {
  const words = wordsOfText.get(textId);
  if (words === undefined) throw new Error(`Örnek okuma: "${textId}" metni yok`);
  const durationSeconds = Math.round((words * progress * 60) / wordsPerMinute);
  return { daysAgo, time, textId, durationSeconds, progress, completed };
}

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** Okumanın başlangıç ve bitiş zamanı. Gelecekte kalacaksa şu andan geriye çekilir. */
function readingTimes(reading: SeedReading, now: Date) {
  const todayStart = startOfDayInTimeZone(now);
  const dayStart = startOfDayInTimeZone(
    new Date(todayStart.getTime() - reading.daysAgo * DAY_MS + 12 * HOUR_MS),
  );
  const [hours = 0, minutes = 0] = reading.time.split(':').map(Number);
  const durationMs = reading.durationSeconds * 1000;

  let startedAt = new Date(dayStart.getTime() + hours * HOUR_MS + minutes * MINUTE_MS);
  if (startedAt.getTime() + durationMs + MINUTE_MS > now.getTime()) {
    startedAt = new Date(now.getTime() - durationMs - 2 * MINUTE_MS);
  }
  // Son kayıt, okuma bittikten birkaç saniye sonra gelir.
  const endedAt = reading.neverSaved ? null : new Date(startedAt.getTime() + durationMs + 20_000);
  return { startedAt, endedAt };
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL tanımlı değil');
if (process.env.NODE_ENV === 'production') throw new Error('Seed üretimde çalıştırılamaz');

const prisma = createPrismaClient(databaseUrl);

async function upsertUser(user: SeedUser) {
  const passwordHash = await hashPassword(user.password);
  const data = {
    passwordHash,
    name: user.name,
    grade: user.grade,
    dailyGoalMinutes: user.dailyGoalMinutes,
  };
  return prisma.user.upsert({
    where: { username: user.username },
    create: { username: user.username, ...data },
    update: data,
    select: { id: true },
  });
}

/**
 * İçeriği seed-data/ ile eşitler: eksikler eklenir, değişenler güncellenir, fazlalar silinir.
 * Metin ölçüleri (kelime, cümle, Ateşman) seed-data'da src/lib/readability.ts ile hesaplanır.
 */
async function syncContent() {
  const texts = [...seedTexts, ...seedPlacementTexts];
  const questions = [...seedQuestionRows, ...seedPlacementQuestionRows];
  const textIds = texts.map(({ id }) => id);
  const lessonIds = seedLessonRows.map(({ id }) => id);

  for (const text of texts) {
    const { id, ...data } = text;
    await prisma.text.upsert({ where: { id }, create: text, update: data });
  }

  // Ders kimliği şehri ve sırayı içerir; artık olmayan dersler (bitirme kayıtlarıyla birlikte)
  // önce silinir ki yeni dersler (city, position) tekil kısıtına takılmasın.
  await prisma.lesson.deleteMany({ where: { id: { notIn: lessonIds } } });
  for (const lesson of seedLessonRows) {
    const { id, ...data } = lesson;
    await prisma.lesson.upsert({ where: { id }, create: lesson, update: data });
  }
  // Dersin sınıf grubu metinleri: artık olmayan (ders, grup) çiftleri silinir, diğerleri eşitlenir.
  const variantKeys = new Set(seedLessonTextRows.map((row) => `${row.lessonId}|${row.gradeBand}`));
  const existingVariants = await prisma.lessonText.findMany({
    select: { lessonId: true, gradeBand: true },
  });
  for (const variant of existingVariants) {
    if (variantKeys.has(`${variant.lessonId}|${variant.gradeBand}`)) continue;
    await prisma.lessonText.delete({ where: { lessonId_gradeBand: variant } });
  }
  for (const row of seedLessonTextRows) {
    const { lessonId, gradeBand, textId } = row;
    await prisma.lessonText.upsert({
      where: { lessonId_gradeBand: { lessonId, gradeBand } },
      create: row,
      update: { textId },
    });
  }
  // Seviye belirleme metinleri: değişen ya da artık olmayan satırlar silinip yeniden yazılır (bir
  // metnin sırası değişince text_id tekil kısıtına takılmasın).
  const placementKeys = new Set(
    seedPlacementRows.map((row) => `${row.gradeBand}|${row.position}|${row.textId}`),
  );
  for (const row of await prisma.placementText.findMany()) {
    if (placementKeys.has(`${row.gradeBand}|${row.position}|${row.textId}`)) continue;
    await prisma.placementText.delete({
      where: { gradeBand_position: { gradeBand: row.gradeBand, position: row.position } },
    });
  }
  await prisma.placementText.createMany({ data: seedPlacementRows, skipDuplicates: true });
  await prisma.text.deleteMany({ where: { id: { notIn: textIds } } });

  for (const question of questions) {
    const { textId, position, ...data } = question;
    await prisma.question.upsert({
      where: { textId_position: { textId, position } },
      create: question,
      update: data,
    });
  }
  for (const textId of textIds) {
    const positions = questions.filter((q) => q.textId === textId).map((q) => q.position);
    const words = seedGlossaryRows.filter((g) => g.textId === textId).map((g) => g.word);
    await prisma.question.deleteMany({ where: { textId, position: { notIn: positions } } });
    await prisma.glossaryEntry.deleteMany({ where: { textId, word: { notIn: words } } });
  }
  for (const entry of seedGlossaryRows) {
    const { textId, word, meaning } = entry;
    await prisma.glossaryEntry.upsert({
      where: { textId_word: { textId, word } },
      create: entry,
      update: { meaning },
    });
  }
}

/** Test, örnek ve demo kullanıcılar: şifreleri sıfırlanır, okumaları ve oyun verileri yeniden yazılır. */
async function seedUsers(contentSummary: string) {
  await upsertUser(TEST_USER);

  const now = new Date();
  let readingCount = 0;
  for (const { user, baseline, readings } of SAMPLE_USERS) {
    const { id: userId } = await upsertUser(user);
    const planned = readings.map((reading, index) => ({
      id: `seed-${user.username}-${String(index + 1).padStart(2, '0')}`,
      reading,
    }));

    // Plan kısaldıysa eskiden kalan seed kayıtlarını temizle (elle oluşturulanlara dokunma).
    await prisma.readingSession.deleteMany({
      where: { userId, id: { startsWith: 'seed-', notIn: planned.map(({ id }) => id) } },
    });

    for (const { id, reading } of planned) {
      const { startedAt, endedAt } = readingTimes(reading, now);
      const data = {
        userId,
        textId: reading.textId,
        startedAt,
        endedAt,
        durationSeconds: reading.durationSeconds,
        progress: reading.progress,
        completed: reading.completed,
      };
      await prisma.readingSession.upsert({ where: { id }, create: { id, ...data }, update: data });
      // Biten okumanın hız ölçümü (soru yok: kitaplık okuması gibi, anlama boş).
      if (reading.completed) {
        await writeReadingMetric(prisma, {
          readingSessionId: id,
          gradeBand: gradeBandOf(user.grade),
          onlyIfMissing: false,
        });
      } else {
        await prisma.readingMetric.deleteMany({ where: { readingSessionId: id } });
      }
      readingCount++;
    }

    // Seviye belirleme sonucu yeniden yazılır; uygulamadan yapılanlar da silinir (elif yeniden
    // seviye belirlemeyi görsün).
    await prisma.userBaseline.deleteMany({ where: { userId } });
    if (baseline) {
      const day = startOfDayInTimeZone(
        new Date(startOfDayInTimeZone(now).getTime() - baseline.daysAgo * DAY_MS + 12 * HOUR_MS),
      );
      await prisma.userBaseline.create({
        data: {
          userId,
          grade: user.grade,
          gradeBand: gradeBandOf(user.grade),
          wordsPerMinute: baseline.wordsPerMinute,
          comprehension: baseline.comprehension,
          measuredAt: new Date(day.getTime() + 17 * HOUR_MS),
        },
      });
    }
  }

  const demoUsers = await seedDemoUsers(prisma, now);

  const sampleUsernames = SAMPLE_USERS.map(({ user }) => user.username).join(', ');
  console.log(
    `Seed tamam: ${contentSummary}, ` +
      `test kullanıcısı "${TEST_USER.username}" / "${TEST_USER.password}", ` +
      `örnek kullanıcılar (şifre 1234): ${sampleUsernames}, ${readingCount} okuma kaydı`,
  );
  console.log(`\nDemo kullanıcılar (şifre: ${DEMO_PASSWORD}):`);
  console.table(
    demoUsers.map((demo) => ({
      'kullanıcı adı': demo.username,
      ad: demo.name,
      ders: demo.completed,
      seviye: demo.level,
      şehir: demo.city,
      lokum: demo.lokum,
      seri: demo.streak,
      okuma: demo.readings,
      'bugün okudu': demo.readToday ? 'evet' : demo.streak > 0 ? 'hayır (seri tehlikede)' : 'hayır',
    })),
  );
}

try {
  await syncContent();
  const contentSummary =
    `${seedLessonRows.length} ders, ${seedTexts.length} metin, ${seedQuestionRows.length} soru, ` +
    `${seedPlacementTexts.length} seviye belirleme metni`;

  if (sampleUsersAllowed(databaseUrl, process.env)) {
    await seedUsers(contentSummary);
  } else {
    console.log(
      `Seed tamam: ${contentSummary}. Test, örnek ve demo kullanıcılar ATLANDI: veritabanı yerel ` +
        'değil (localhost, 127.0.0.1, ::1). Bu kullanıcıların şifreleri sıfırlanır ve okumaları ' +
        'yeniden yazılır; paylaşılan bir veritabanında aynı adlı gerçek hesaplar ezilmesin. ' +
        'Yine de oluşturmak için SEED_DEMO=1 ile çalıştırın.',
    );
  }
} finally {
  await prisma.$disconnect();
}
