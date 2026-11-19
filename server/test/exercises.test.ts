import { describe, expect, it } from 'vitest';

import { seedQuestionRows } from '../prisma/seed-data/index.js';
import { bearer, registerUser, useTestContext } from './helpers.js';

const ctx = useTestContext();

const E1 = 'e1-g2-istanbul-01-vapurda-simit';
const E1_LOCKED = 'e1-g2-istanbul-02-bahcedeki-domatesler';
const E4 = 'e4-g2-istanbul-01-vapurda-simit';
const E5 = 'e5-g2-istanbul-01-vapurda-simit';

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
      expect(['TEKRARLI_OKUMA', 'OBEK_OKUMA']).toContain(item.type);
      expect(item.itemId).toMatch(/^e[14]-g2-istanbul-01-/);
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

  it('kilitli metnin egzersizi açılmaz; henüz oynatılamayan tür 404', async () => {
    const { token } = await registerUser(ctx.app);
    expect((await start(token, E1_LOCKED)).statusCode).toBe(403);
    expect((await start(token, E5)).statusCode).toBe(404);
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
