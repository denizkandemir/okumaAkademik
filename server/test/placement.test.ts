import { describe, expect, it } from 'vitest';

import { seedPlacementRows, seedPlacementTexts } from '../prisma/seed-data/index.js';
import { GradeBand } from '../src/generated/prisma/enums.js';
import { bearer, registerUser, storyAt, useTestContext } from './helpers.js';

/** Seviye belirleme okuması: GET /placement, cevaplar, POST /placement/complete, needsPlacement. */

const ctx = useTestContext();
const MINUTE = 60 * 1000;

function inject(token: string, method: 'GET' | 'POST' | 'PATCH', url: string, payload?: object) {
  return ctx.app.inject({ method, url, headers: bearer(token), ...(payload ? { payload } : {}) });
}

/** Grubun metinleri, okuma sırasıyla. */
function bandTexts(gradeBand: GradeBand) {
  return seedPlacementRows
    .filter((row) => row.gradeBand === gradeBand)
    .sort((a, b) => a.position - b.position)
    .map((row) => seedPlacementTexts.find((text) => text.id === row.textId)!);
}

/** Metni `durationSeconds` sürede okuyup bitirir. */
async function read(token: string, textId: string, durationSeconds: number) {
  const start = await inject(token, 'POST', '/reading-sessions', { textId });
  expect(start.statusCode).toBe(201);
  const { id } = start.json<{ id: string }>();
  await ctx.prisma.readingSession.update({
    where: { id },
    data: { startedAt: new Date(Date.now() - 5 * MINUTE) },
  });
  const done = await inject(token, 'PATCH', `/reading-sessions/${id}`, {
    progress: 1,
    durationSeconds,
    completed: true,
  });
  expect(done.statusCode).toBe(200);
  return id;
}

/** Metnin sorularını cevaplar; ilk `wrongFirst` soruda önce yanlış şıkka basılır. */
async function answerAll(token: string, textId: string, readingSessionId: string, wrongFirst = 0) {
  const questions = await ctx.prisma.question.findMany({
    where: { textId },
    orderBy: { position: 'asc' },
    select: { id: true, correctIndex: true, options: true },
  });
  for (const [index, question] of questions.entries()) {
    if (index < wrongFirst) {
      const choiceIndex = (question.correctIndex + 1) % question.options.length;
      const wrong = await inject(token, 'POST', '/placement/answers', {
        readingSessionId,
        questionId: question.id,
        choiceIndex,
      });
      expect(wrong.json()).toMatchObject({ correct: false, lokum: 0 });
    }
    const right = await inject(token, 'POST', '/placement/answers', {
      readingSessionId,
      questionId: question.id,
      choiceIndex: question.correctIndex,
    });
    expect(right.json()).toMatchObject({ correct: true, lokum: 0 });
  }
}

/** Grubun iki metnini okuyup cevaplar; okuma kimliklerini döner. */
async function takePlacement(token: string, gradeBand: GradeBand, wrongFirst = [1, 0]) {
  const ids: string[] = [];
  for (const [index, text] of bandTexts(gradeBand).entries()) {
    const id = await read(token, text.id, 60);
    await answerAll(token, text.id, id, wrongFirst[index]);
    ids.push(id);
  }
  return ids;
}

describe('GET /placement', () => {
  it('kullanıcının sınıf grubundaki 2 metni sırayla, cevapsız sorularla döner', async () => {
    const { token } = await registerUser(ctx.app, { grade: 1 });
    const response = await inject(token, 'GET', '/placement');
    expect(response.statusCode).toBe(200);
    const body = response.json<{
      gradeBand: string;
      texts: { text: { id: string; theme: string; level: number }; questions: object[] }[];
    }>();
    expect(body.gradeBand).toBe('G1');
    expect(body.texts.map(({ text }) => text.id)).toEqual(
      bandTexts(GradeBand.G1).map((text) => text.id),
    );
    for (const { text, questions } of body.texts) {
      expect(typeof text.theme).toBe('string');
      expect([1, 2, 3]).toContain(text.level);
      expect(questions).toHaveLength(3);
      for (const question of questions) {
        expect(Object.keys(question).sort()).toEqual(['id', 'options', 'position', 'prompt']);
      }
    }
  });

  it('seviye belirleme metinleri kitaplıkta ve "devam et"te görünmez', async () => {
    const { token } = await registerUser(ctx.app, { grade: 3 });
    const [first] = bandTexts(GradeBand.G2);
    const start = await inject(token, 'POST', '/reading-sessions', { textId: first!.id });
    expect(start.statusCode).toBe(201);

    const library = await inject(token, 'GET', '/texts');
    const listed = library.json<{ texts: { id: string }[] }>().texts.map((text) => text.id);
    expect(listed.some((id) => id.startsWith('seviye-'))).toBe(false);
    expect(listed.length).toBeGreaterThan(0);

    const progress = await inject(token, 'GET', '/me/progress');
    expect(progress.json<{ continueReading: unknown }>().continueReading).toBeNull();
  });
});

describe('POST /placement/complete', () => {
  it('hızı iki metnin toplamından, anlamayı ilk denemeden hesaplar ve sonucu yazar', async () => {
    const { token, user } = await registerUser(ctx.app, { grade: 3 });
    const me = await inject(token, 'GET', '/me');
    expect(me.json()).toMatchObject({ user: { id: user.id }, needsPlacement: true });

    const ids = await takePlacement(token, GradeBand.G2, [1, 0]);
    const response = await inject(token, 'POST', '/placement/complete', { readingSessionIds: ids });
    expect(response.statusCode).toBe(200);

    const words = bandTexts(GradeBand.G2).reduce((sum, text) => sum + text.wordCount, 0);
    const baseline = response.json<{ baseline: Record<string, unknown> }>().baseline;
    expect(baseline).toMatchObject({
      gradeBand: 'G2',
      wordsPerMinute: Math.round(((words * 60) / 120) * 10) / 10,
      comprehension: 0.83,
    });
    expect(typeof baseline.measuredAt).toBe('string');

    // Her okumanın ölçümü sorularla yazıldı.
    const metrics = await ctx.prisma.readingMetric.findMany({
      where: { readingSessionId: { in: ids } },
      orderBy: { firstTryCorrect: 'asc' },
      select: { questionsTotal: true, firstTryCorrect: true, comprehension: true },
    });
    expect(metrics).toEqual([
      { questionsTotal: 3, firstTryCorrect: 2, comprehension: 0.67 },
      { questionsTotal: 3, firstTryCorrect: 3, comprehension: 1 },
    ]);

    const after = await inject(token, 'GET', '/me');
    expect(after.json()).toMatchObject({ needsPlacement: false });
    const rows = await ctx.prisma.userBaseline.findMany({ where: { userId: user.id } });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ grade: 3, gradeBand: GradeBand.G2 });
  });

  it('yanıtı kaybolan istek aynı sonucu döner; yeniden yapılınca geçmiş korunur', async () => {
    const { token, user } = await registerUser(ctx.app, { grade: 6 });
    const ids = await takePlacement(token, GradeBand.G3, [0, 0]);
    const first = await inject(token, 'POST', '/placement/complete', { readingSessionIds: ids });
    const again = await inject(token, 'POST', '/placement/complete', { readingSessionIds: ids });
    expect(again.statusCode).toBe(200);
    expect(again.json()).toEqual(first.json());
    expect(await ctx.prisma.userBaseline.count({ where: { userId: user.id } })).toBe(1);

    // Yeni okumalarla tekrar: yeni satır; en yenisi /me/metrics'te.
    const retake = await takePlacement(token, GradeBand.G3, [1, 1]);
    const second = await inject(token, 'POST', '/placement/complete', {
      readingSessionIds: retake,
    });
    expect(second.json()).toMatchObject({ baseline: { comprehension: 0.67 } });
    expect(await ctx.prisma.userBaseline.count({ where: { userId: user.id } })).toBe(2);

    const metrics = await inject(token, 'GET', '/me/metrics?period=week');
    expect(metrics.json<{ baseline: unknown }>().baseline).toEqual(
      second.json<{ baseline: unknown }>().baseline,
    );
  });

  it('iki metin de okunup tüm sorular cevaplanmadan bitmez', async () => {
    const { token } = await registerUser(ctx.app, { grade: 8 });
    const [first, second] = bandTexts(GradeBand.G4);
    const firstId = await read(token, first!.id, 60);
    await answerAll(token, first!.id, firstId);

    const onlyOne = await inject(token, 'POST', '/placement/complete', {
      readingSessionIds: [firstId],
    });
    expect(onlyOne.statusCode).toBe(400);
    expect(onlyOne.json()).toMatchObject({ code: 'VALIDATION_ERROR' });

    // Aynı metnin iki okuması da yetmez.
    const repeatId = await read(token, first!.id, 60);
    const twice = await inject(token, 'POST', '/placement/complete', {
      readingSessionIds: [firstId, repeatId],
    });
    expect(twice.statusCode).toBe(400);

    const secondId = await read(token, second!.id, 60);
    const unanswered = await inject(token, 'POST', '/placement/complete', {
      readingSessionIds: [firstId, secondId],
    });
    expect(unanswered.json()).toMatchObject({ code: 'QUESTIONS_NOT_ANSWERED' });

    const unfinished = await inject(token, 'POST', '/reading-sessions', { textId: second!.id });
    const notRead = await inject(token, 'POST', '/placement/complete', {
      readingSessionIds: [firstId, unfinished.json<{ id: string }>().id],
    });
    expect(notRead.json()).toMatchObject({ code: 'READING_NOT_FINISHED' });
  });

  it('başka grubun ya da yolculuğun metnine cevap kabul edilmez', async () => {
    const { token } = await registerUser(ctx.app, { grade: 3 });
    const [otherBand] = bandTexts(GradeBand.G4);
    const id = await read(token, otherBand!.id, 60);
    const question = await ctx.prisma.question.findFirstOrThrow({
      where: { textId: otherBand!.id },
    });
    const response = await inject(token, 'POST', '/placement/answers', {
      readingSessionId: id,
      questionId: question.id,
      choiceIndex: question.correctIndex,
    });
    expect(response.statusCode).toBe(400);
    expect(await ctx.prisma.questionAttempt.count()).toBe(0);
  });
});

describe('başlangıca göre değişim', () => {
  it('v_student_weekly hafta sonuna kadarki son seviye belirlemeyi ve farkı gösterir', async () => {
    const { token } = await registerUser(ctx.app, { grade: 3 });
    const ids = await takePlacement(token, GradeBand.G2, [0, 0]);
    const { baseline } = (
      await inject(token, 'POST', '/placement/complete', { readingSessionIds: ids })
    ).json<{ baseline: { wordsPerMinute: number } }>();
    await read(token, storyAt('istanbul', 1).textId, 90);

    const [week] = await ctx.prisma.$queryRaw<Record<string, number | null>[]>`
      SELECT median_wpm::float8 AS median_wpm, baseline_wpm::float8 AS baseline_wpm,
        baseline_comprehension::float8 AS baseline_comprehension,
        median_wpm_vs_baseline::float8 AS wpm_vs_baseline
      FROM v_student_weekly WHERE username = 'ayse'`;
    expect(week).toMatchObject({
      baseline_wpm: baseline.wordsPerMinute,
      baseline_comprehension: 1,
    });
    expect(week!.wpm_vs_baseline).toBeCloseTo((week!.median_wpm ?? 0) - baseline.wordsPerMinute);
  });

  it('seviye belirleme okumaları özetlerin hız, anlama ve sayılarına girmez; süreye ve seriye girer', async () => {
    const { token } = await registerUser(ctx.app, { grade: 3 });
    // Seviye belirleme hızlı (60 sn) ve tam doğru; yolculuk okuması yavaş (240 sn) ve kitaplık gibi.
    const ids = await takePlacement(token, GradeBand.G2, [0, 0]);
    await inject(token, 'POST', '/placement/complete', { readingSessionIds: ids });
    const story = storyAt('istanbul', 1);
    await read(token, story.textId, 240);
    const storyWords = (await ctx.prisma.text.findUniqueOrThrow({ where: { id: story.textId } }))
      .wordCount!;
    const storyWpm = Math.round(((storyWords * 60) / 240) * 10) / 10;

    const flagged = await ctx.prisma.$queryRaw<{ is_placement: boolean }[]>`
      SELECT is_placement FROM v_reading_metrics ORDER BY is_placement`;
    expect(flagged.map((row) => row.is_placement)).toEqual([false, true, true]);

    for (const view of ['v_student_daily', 'v_student_weekly', 'v_student_monthly']) {
      const [row] = await ctx.prisma.$queryRawUnsafe<Record<string, number | null>[]>(
        `SELECT read_minutes::float8 AS read_minutes, text_count, reading_count,
           median_wpm::float8 AS median_wpm, comprehension::float8 AS comprehension, rushed_count
         FROM ${view} WHERE username = 'ayse'`,
      );
      expect(row, view).toEqual({
        read_minutes: 6, // 60 + 60 + 240 saniye: seviye belirleme süresi dahil
        text_count: 1,
        reading_count: 1,
        median_wpm: storyWpm,
        comprehension: null,
        rushed_count: 0,
      });
    }

    const metrics = await inject(token, 'GET', '/me/metrics?period=day');
    expect(metrics.json()).toMatchObject({
      current: { readingCount: 1, medianWpm: storyWpm, comprehension: null },
    });
    // Günlük hedef ve seri okuma kayıtlarından: seviye belirleme dahil.
    const progress = await inject(token, 'GET', '/me/progress');
    expect(progress.json()).toMatchObject({ dailyGoal: { readMinutes: 6 } });
    const stats = await inject(token, 'GET', '/me/stats');
    expect(stats.json()).toMatchObject({ readToday: true, streak: 1 });
  });

  it('seviye belirlemesi olmayan kullanıcıda başlangıç kolonları boştur', async () => {
    const { token } = await registerUser(ctx.app, { grade: 3 });
    await read(token, storyAt('istanbul', 1).textId, 90);
    const [week] = await ctx.prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT baseline_wpm, median_wpm_vs_baseline FROM v_student_weekly`;
    expect(week).toEqual({ baseline_wpm: null, median_wpm_vs_baseline: null });
    const metrics = await inject(token, 'GET', '/me/metrics?period=week');
    expect(metrics.json<{ baseline: unknown }>().baseline).toBeNull();
  });
});
