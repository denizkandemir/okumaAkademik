import { describe, expect, it } from 'vitest';

import { seedExerciseItemRows, seedQuestionRows } from '../prisma/seed-data/index.js';
import { bearer, registerUser, useTestContext } from './helpers.js';

const ctx = useTestContext();

const E1 = 'e1-g2-istanbul-01-vapurda-simit';
const E1_LOCKED = 'e1-g2-istanbul-02-bahcedeki-domatesler';
const E4 = 'e4-g2-istanbul-01-vapurda-simit';
const E5 = 'e5-g2-istanbul-01-vapurda-simit';
const E6 = 'e6-g2-istanbul-01-vapurda-simit';
/** İstanbul'un ilk dersinin G1 sürümünden E11 örneği (yeni kullanıcıya açık). */
const E11 = seedExerciseItemRows.find(
  (item) => item.type === 'HECE_TOPU' && item.id.includes('istanbul-01-'),
)?.id as string;

type StartResponse = {
  sessionId: string;
  item: { id: string; type: string; params: Record<string, unknown>; data: unknown };
  text: { id: string; wordCount: number } | null;
  questions: { id: string; position: number; prompt: string; options: string[] }[];
};

type FinishResponse = {
  sessionId: string;
  durationSeconds: number;
  wpmFirst: number | null;
  wpmLast: number | null;
  score: number | null;
  comprehension: number | null;
  questionsTotal: number | null;
  firstTryCorrect: number | null;
  wordsTotal: number | null;
  wordsCorrect: number | null;
  lokum: { earned: number; balance: number };
  streak: number;
};

function correctIndexOf(textId: string, position: number) {
  const question = seedQuestionRows.find((q) => q.textId === textId && q.position === position);
  if (!question) throw new Error('soru yok');
  return question.correctIndex;
}

async function start(token: string, itemId: string) {
  return ctx.app.inject({
    method: 'POST',
    url: `/exercises/${itemId}/sessions`,
    headers: bearer(token),
  });
}

async function answer(token: string, sessionId: string, questionId: string, choiceIndex: number) {
  return ctx.app.inject({
    method: 'POST',
    url: `/exercise-sessions/${sessionId}/answers`,
    headers: bearer(token),
    payload: { questionId, choiceIndex },
  });
}

/** Bütün soruları doğru cevaplar; `wrongFirst` sıradaki soruda önce yanlış şık seçilir. */
async function answerAll(token: string, started: StartResponse, wrongFirst: number[] = []) {
  for (const question of started.questions) {
    const correct = correctIndexOf(started.text?.id ?? '', question.position);
    if (wrongFirst.includes(question.position)) {
      const wrong = await answer(token, started.sessionId, question.id, (correct + 1) % 3);
      expect(wrong.json()).toMatchObject({ correct: false, lokum: 0 });
    }
    const right = await answer(token, started.sessionId, question.id, correct);
    expect(right.json()).toMatchObject({ correct: true, lokum: 0 });
  }
}

/** Oturumun başlangıcını geriye alır (süre kırpmasına takılmasın). */
async function backdate(sessionId: string, minutes: number) {
  await ctx.prisma.exerciseSession.update({
    where: { id: sessionId },
    data: { startedAt: new Date(Date.now() - minutes * 60 * 1000) },
  });
}

async function finish(token: string, sessionId: string, payload: Record<string, unknown>) {
  return ctx.app.inject({
    method: 'PATCH',
    url: `/exercise-sessions/${sessionId}`,
    headers: bearer(token),
    payload,
  });
}

/** E1'i baştan sona oynar. */
async function playE1(token: string) {
  const started = (await start(token, E1)).json<StartResponse>();
  await answerAll(token, started);
  await backdate(started.sessionId, 10);
  const response = await finish(token, started.sessionId, {
    durationSeconds: 300,
    result: { reads: [{ durationSeconds: 90 }, { durationSeconds: 80 }, { durationSeconds: 75 }] },
  });
  expect(response.statusCode).toBe(200);
  return response.json<FinishResponse>();
}

describe('günlük antrenman', () => {
  it('yeni kullanıcıya grubunun oynatılabilen, kilitsiz egzersizleri önerilir', async () => {
    const { token } = await registerUser(ctx.app, { grade: 3 });
    const response = await ctx.app.inject({
      method: 'GET',
      url: '/me/training/today',
      headers: bearer(token),
    });
    expect(response.statusCode).toBe(200);
    const body = response.json<{
      items: { itemId: string; type: string; code: string; minutes: number; done: boolean }[];
      done: boolean;
    }>();
    expect(body.items.length).toBeGreaterThanOrEqual(1);
    expect(body.done).toBe(false);
    for (const item of body.items) {
      expect(['TEKRARLI_OKUMA', 'OBEK_OKUMA', 'HIZLI_KELIME', 'PIRIL_ISIGI']).toContain(item.type);
      expect(item.itemId).toMatch(/^e[1456]-g2-istanbul-01-/);
      expect(item.minutes).toBeGreaterThan(0);
    }
    expect(new Set(body.items.map((item) => item.type)).size).toBe(body.items.length);
  });

  it('G1 kullanıcısına E6 önerilmez', async () => {
    const { token } = await registerUser(ctx.app, { grade: 2 });
    const body = (
      await ctx.app.inject({ method: 'GET', url: '/me/training/today', headers: bearer(token) })
    ).json<{ items: { itemId: string; type: string }[] }>();
    expect(body.items.length).toBeGreaterThan(0);
    for (const item of body.items) {
      expect(item.type).not.toBe('PIRIL_ISIGI');
      expect(item.itemId).toMatch(/-g1-/);
    }
  });

  it('bitirilen örnek bugün "bitti" görünür', async () => {
    const { token } = await registerUser(ctx.app, { grade: 3 });
    const before = (
      await ctx.app.inject({ method: 'GET', url: '/me/training/today', headers: bearer(token) })
    ).json<{ items: { itemId: string; done: boolean }[] }>();
    await playE1(token);
    const after = (
      await ctx.app.inject({ method: 'GET', url: '/me/training/today', headers: bearer(token) })
    ).json<{ items: { itemId: string; done: boolean }[] }>();
    // Plan gün içinde değişmez; yalnızca biten işaretlenir.
    expect(after.items.map((item) => item.itemId)).toEqual(before.items.map((item) => item.itemId));
    for (const item of after.items) expect(item.done).toBe(item.itemId === E1);
  });
});

describe('egzersiz oturumu', () => {
  it('başlatınca etkin ayarlar, metin ve cevapsız sorular döner', async () => {
    const { token } = await registerUser(ctx.app);
    const response = await start(token, E1);
    expect(response.statusCode).toBe(201);
    const body = response.json<StartResponse>();
    expect(body.item).toMatchObject({
      id: E1,
      type: 'TEKRARLI_OKUMA',
      params: { repeatCount: 3, goalPercent: 15 },
    });
    expect(body.text?.id).toBe('vapurda-simit');
    expect(body.questions.map((q) => q.position)).toEqual([1, 2, 3]);
    expect(JSON.stringify(body.questions)).not.toContain('correctIndex');
  });

  it('kilitli metnin egzersizi açılmaz; olmayan egzersiz 404', async () => {
    const { token } = await registerUser(ctx.app);
    expect((await start(token, E1_LOCKED)).statusCode).toBe(403);
    expect((await start(token, 'yok-boyle-bir-egzersiz')).statusCode).toBe(404);
  });

  it('sorular cevaplanmadan bitirilemez', async () => {
    const { token } = await registerUser(ctx.app);
    const started = (await start(token, E1)).json<StartResponse>();
    const response = await finish(token, started.sessionId, {
      durationSeconds: 30,
      result: { reads: [{ durationSeconds: 10 }] },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ code: 'QUESTIONS_NOT_ANSWERED' });
  });

  it('E1: hız sunucuda hesaplanır, anlama ilk denemelerden; +3 lokum ve seri', async () => {
    const { token } = await registerUser(ctx.app);
    const started = (await start(token, E1)).json<StartResponse>();
    await answerAll(token, started, [1]);
    await backdate(started.sessionId, 10);
    const response = await finish(token, started.sessionId, {
      durationSeconds: 300,
      result: {
        reads: [{ durationSeconds: 100 }, { durationSeconds: 90 }, { durationSeconds: 80 }],
      },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json<FinishResponse>();
    const words = started.text?.wordCount ?? 0;
    const wpm = (seconds: number) => Math.round(((words * 60) / seconds) * 10) / 10;
    expect(body).toMatchObject({
      durationSeconds: 300,
      wpmFirst: wpm(100),
      wpmLast: wpm(80),
      comprehension: 0.67,
      questionsTotal: 3,
      firstTryCorrect: 2,
      lokum: { earned: 3, balance: 3 },
      streak: 1,
    });
    expect(body.score).toBeCloseTo(((wpm(80) - wpm(100)) / wpm(100)) * 100, 0);

    // Yanıtı kaybolan istek: aynı sonuç, ikinci lokum yok.
    const again = (
      await finish(token, started.sessionId, {
        durationSeconds: 999,
        result: { reads: [{ durationSeconds: 5 }] },
      })
    ).json<FinishResponse>();
    expect(again).toMatchObject({
      durationSeconds: 300,
      wpmFirst: body.wpmFirst,
      lokum: { earned: 3, balance: 3 },
    });
    expect(await ctx.prisma.lokumEntry.count({ where: { reason: 'EXERCISE' } })).toBe(1);
  });

  it('E4: tek okuma; süre gerçekte geçen süreyle kırpılır', async () => {
    const { token } = await registerUser(ctx.app);
    const started = (await start(token, E4)).json<StartResponse>();
    expect(started.questions.map((q) => q.position)).toEqual([1, 2]);
    await answerAll(token, started);
    const body = (
      await finish(token, started.sessionId, {
        durationSeconds: 5000,
        result: { readSeconds: 4000 },
      })
    ).json<FinishResponse>();
    // Oturum az önce başladı: en fazla geçen süre + 60 sn.
    expect(body.durationSeconds).toBeLessThanOrEqual(61);
    expect(body.wpmFirst).toBe(body.wpmLast);
    expect(body.comprehension).toBe(1);
  });

  it('E5: sorusuz; kartlar örneğin kelimeleriyle sayılır, okuma hızı metinden', async () => {
    const { token } = await registerUser(ctx.app);
    const started = (await start(token, E5)).json<StartResponse>();
    expect(started.questions).toEqual([]);
    const words = (started.item.data as { words: { word: string }[] }).words;
    await backdate(started.sessionId, 5);
    const body = (
      await finish(token, started.sessionId, {
        durationSeconds: 200,
        result: {
          cards: [
            ...words.map((entry, index) => ({
              word: entry.word,
              correct: index !== 0,
              flashMs: 900,
            })),
            // Örnekte olmayan kelime sayılmaz.
            { word: 'uydurma', correct: true, flashMs: 900 },
          ],
          readSeconds: 60,
        },
      })
    ).json<FinishResponse>();
    expect(body).toMatchObject({
      comprehension: null,
      questionsTotal: 0,
      wordsTotal: words.length,
      wordsCorrect: words.length - 1,
      lokum: { earned: 3, balance: 3 },
    });
    expect(body.wpmFirst).toBeCloseTo((started.text?.wordCount ?? 0) as number, 0);
    expect(body.score).toBe(Math.round(((words.length - 1) / words.length) * 100));
  });

  it('E6: temel hız ve ışıklı hız; çarpan anlamaya göre ±0,03, 1,05-1,20 arasında', async () => {
    const { token } = await registerUser(ctx.app);
    const playE6 = async (wrongFirst: number[]) => {
      const started = (await start(token, E6)).json<StartResponse>();
      await answerAll(token, started, wrongFirst);
      await backdate(started.sessionId, 10);
      const response = await finish(token, started.sessionId, {
        durationSeconds: 200,
        result: { baselineWords: 30, baselineSeconds: 30, lightSeconds: 60, pauses: 1 },
      });
      expect(response.statusCode).toBe(200);
      return { started, body: response.json<FinishResponse>() };
    };

    const first = await playE6([]);
    expect(first.started.item.params).toMatchObject({ speedFactor: 1.1 });
    const words = first.started.text?.wordCount ?? 0;
    expect(first.body.wpmFirst).toBe(60);
    expect(first.body.wpmLast).toBeCloseTo(words - 30, 0);
    expect(first.body.comprehension).toBe(1);

    // İyi anlama → bir sonraki oturumda 1,13; kötü anlama → 1,10.
    const second = await playE6([1, 2]);
    expect(second.started.item.params).toMatchObject({ speedFactor: 1.13 });
    const third = await playE6([]);
    expect(third.started.item.params).toMatchObject({ speedFactor: 1.1 });
    const session = await ctx.prisma.exerciseSession.findFirstOrThrow({
      where: { id: third.started.sessionId },
    });
    expect(session.paramsUsed).toMatchObject({ speedFactor: 1.1 });
    expect(session.details).toMatchObject({ speedFactor: 1.1, nextSpeedFactor: 1.13 });

    // Üst sınır: 1,20'nin üstüne çıkmaz.
    await ctx.prisma.exerciseSession.update({
      where: { id: third.started.sessionId },
      data: { details: { nextSpeedFactor: 1.2 } },
    });
    const fourth = await playE6([]);
    expect(fourth.started.item.params).toMatchObject({ speedFactor: 1.2 });
    const stored = await ctx.prisma.exerciseSession.findFirstOrThrow({
      where: { id: fourth.started.sessionId },
    });
    expect(stored.details).toMatchObject({ nextSpeedFactor: 1.2 });
  });

  it('E11: hız seviye belirlemeden; sonra en fazla ±%5, yalnız iyi anlamada artar', async () => {
    const { token, user } = await registerUser(ctx.app, { grade: 1 });
    const playE11 = async (wrongFirst: number[], slowUsed: boolean) => {
      const started = (await start(token, E11)).json<StartResponse>();
      expect(started.questions.length).toBeGreaterThanOrEqual(1);
      expect(started.questions.length).toBeLessThanOrEqual(2);
      await answerAll(token, started, wrongFirst);
      await backdate(started.sessionId, 5);
      const response = await finish(token, started.sessionId, {
        durationSeconds: 120,
        result: { readSeconds: 90, slowUsed, restarts: 2 },
      });
      expect(response.statusCode).toBe(200);
      return started;
    };

    // Seviye belirleme yokken sakin G1 hızı.
    const calm = await playE11([], true);
    expect(calm.item.params).toMatchObject({ syllablesPerSecond: 1.5 });

    const round2 = (value: number) => Math.round(value * 100) / 100;
    // Sonraki oturum: "Yavaş" kullanıldı → ×0,95.
    const slowPace = round2(1.5 * 0.95);
    const slower = await playE11([], false);
    expect(slower.item.params).toMatchObject({ syllablesPerSecond: slowPace });
    // İyi anlama ve "Yavaş" yok → ×1,05.
    const fastPace = round2(slowPace * 1.05);
    const faster = await playE11([1], false);
    expect(faster.item.params).toMatchObject({ syllablesPerSecond: fastPace });
    // Düşük anlama (ilk soruda yanlış) → ×0,95.
    const after = await start(token, E11);
    expect(after.json<StartResponse>().item.params).toMatchObject({
      syllablesPerSecond: round2(fastPace * 0.95),
    });

    // Geçmiş yoksa seviye belirleme hızından: kelime/dk × ort. hece/kelime ÷ 60 × 0,95.
    await ctx.prisma.exerciseSession.deleteMany({ where: { userId: user.id } });
    await ctx.prisma.userBaseline.create({
      data: { userId: user.id, grade: 1, gradeBand: 'G1', wordsPerMinute: 40, comprehension: 0.8 },
    });
    const words = (calm.item.data as { words: string[][][] }).words.flat();
    const average = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const fromBaseline = (await start(token, E11)).json<StartResponse>();
    expect(fromBaseline.item.params.syllablesPerSecond).toBeCloseTo(
      ((40 * average) / 60) * 0.95,
      2,
    );
  });

  it('günde en fazla 3 egzersiz lokum kazandırır', async () => {
    const { token } = await registerUser(ctx.app);
    const earned = [];
    for (let i = 0; i < 4; i++) earned.push((await playE1(token)).lokum.earned);
    expect(earned).toEqual([3, 3, 3, 0]);
  });

  it('egzersiz seriye ve günlük hedefe sayılır; seviyeyi ve okuma ölçümlerini değiştirmez', async () => {
    const { token } = await registerUser(ctx.app);
    await playE1(token);

    const journey = (
      await ctx.app.inject({ method: 'GET', url: '/me/journey', headers: bearer(token) })
    ).json<{ level: number; stats: { streak: number; readToday: boolean } }>();
    expect(journey.level).toBe(1);
    expect(journey.stats).toMatchObject({ streak: 1, readToday: true });

    const progress = (
      await ctx.app.inject({ method: 'GET', url: '/me/progress', headers: bearer(token) })
    ).json<{ dailyGoal: { readMinutes: number } }>();
    expect(progress.dailyGoal.readMinutes).toBe(5);

    const stats = (
      await ctx.app.inject({ method: 'GET', url: '/me/stats', headers: bearer(token) })
    ).json<{ todayMinutes: number; storiesDone: number }>();
    expect(stats).toMatchObject({ todayMinutes: 5, storiesDone: 0 });

    // Hız ve anlama ölçümleri yalnızca okumalardandır.
    expect(await ctx.prisma.readingMetric.count()).toBe(0);
    const metrics = (
      await ctx.app.inject({ method: 'GET', url: '/me/metrics?period=day', headers: bearer(token) })
    ).json<{
      current: { readingCount: number; medianWpm: number | null; comprehension: number | null };
    }>();
    expect(metrics.current).toMatchObject({
      readingCount: 0,
      medianWpm: null,
      comprehension: null,
    });
  });

  it('başka kullanıcının egzersizi bulunamaz', async () => {
    const owner = await registerUser(ctx.app, { username: 'ayse' });
    const other = await registerUser(ctx.app, { username: 'mert' });
    const started = (await start(owner.token, E1)).json<StartResponse>();
    const question = started.questions[0];
    expect((await answer(other.token, started.sessionId, question?.id ?? '', 0)).statusCode).toBe(
      404,
    );
    expect(
      (
        await finish(other.token, started.sessionId, {
          durationSeconds: 10,
          result: { reads: [{ durationSeconds: 10 }] },
        })
      ).statusCode,
    ).toBe(404);
  });

  it('başka metnin sorusu bu egzersize ait değildir', async () => {
    const { token } = await registerUser(ctx.app);
    const started = (await start(token, E1)).json<StartResponse>();
    const foreign = await ctx.prisma.question.findFirstOrThrow({
      where: { textId: { not: 'vapurda-simit' } },
    });
    const response = await answer(token, started.sessionId, foreign.id, 0);
    expect(response.statusCode).toBe(400);
  });
});
