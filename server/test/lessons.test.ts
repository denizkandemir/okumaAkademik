import { describe, expect, it } from 'vitest';

import { bearer, completeLessonsDirectly, registerUser, useTestContext } from './helpers.js';

const ctx = useTestContext();
const MINUTE = 60 * 1000;

async function register(completed = 0, username = 'ayse') {
  const { token, user } = await registerUser(ctx.app, { username });
  await completeLessonsDirectly(ctx.prisma, user.id, completed);
  return { token, userId: user.id };
}

function getLesson(token: string, id: string) {
  return ctx.app.inject({ method: 'GET', url: `/lessons/${id}`, headers: bearer(token) });
}

function answer(
  token: string,
  lessonId: string,
  payload: { readingSessionId: string; questionId: string; choiceIndex: number },
) {
  return ctx.app.inject({
    method: 'POST',
    url: `/lessons/${lessonId}/answers`,
    headers: bearer(token),
    payload,
  });
}

function complete(token: string, lessonId: string, readingSessionId?: string) {
  return ctx.app.inject({
    method: 'POST',
    url: `/lessons/${lessonId}/complete`,
    headers: bearer(token),
    ...(readingSessionId ? { payload: { readingSessionId } } : {}),
  });
}

/** Okumayı başlatır; `finish` ise 2 dakika önce başlamış ve bitmiş gibi kaydeder. */
async function read(token: string, textId: string, finish = true) {
  const start = await ctx.app.inject({
    method: 'POST',
    url: '/reading-sessions',
    headers: bearer(token),
    payload: { textId },
  });
  expect(start.statusCode).toBe(201);
  const { id } = start.json<{ id: string }>();
  if (finish) {
    await ctx.prisma.readingSession.update({
      where: { id },
      data: { startedAt: new Date(Date.now() - 2 * MINUTE) },
    });
    await ctx.app.inject({
      method: 'PATCH',
      url: `/reading-sessions/${id}`,
      headers: bearer(token),
      payload: { progress: 1, durationSeconds: 134, completed: true },
    });
  }
  return id;
}

function questionsOf(textId: string) {
  return ctx.prisma.question.findMany({
    where: { textId },
    orderBy: { position: 'asc' },
    select: { id: true, correctIndex: true },
  });
}

/** Hikâyeyi okur ve soruları cevaplar; ilk `wrongFirst` soruda önce yanlış şıkka basılır. */
async function playStory(token: string, lessonId: string, textId: string, wrongFirst = 0) {
  const readingSessionId = await read(token, textId);
  const questions = await questionsOf(textId);
  for (const [index, question] of questions.entries()) {
    if (index < wrongFirst) {
      await answer(token, lessonId, {
        readingSessionId,
        questionId: question.id,
        choiceIndex: (question.correctIndex + 1) % 3,
      });
    }
    await answer(token, lessonId, {
      readingSessionId,
      questionId: question.id,
      choiceIndex: question.correctIndex,
    });
  }
  return readingSessionId;
}

describe('GET /lessons/:id', () => {
  it('yeni kullanıcıda yalnızca İstanbul’un ilk dersi açıktır', async () => {
    const { token } = await register();

    const first = await getLesson(token, 'istanbul-01-hikaye');
    expect(first.statusCode).toBe(200);
    expect(first.json().lesson).toMatchObject({ status: 'current', maxLokum: 20 });

    const second = await getLesson(token, 'istanbul-02-bahcedeki-domatesler');
    expect(second.statusCode).toBe(403);
    expect(second.json()).toEqual({
      code: 'LESSON_LOCKED',
      message: 'Bu ders henüz kilitli. Önceki dersleri bitirince açılacak.',
    });

    expect((await getLesson(token, 'olmayan-ders')).statusCode).toBe(404);
  });

  it('ders kartı: ders, metin, kelime anlamları ve cevabı olmayan sorular', async () => {
    const { token } = await register(2);
    const response = await getLesson(token, 'istanbul-03-minik-serce');
    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.lesson).toEqual({
      id: 'istanbul-03-minik-serce',
      city: 'istanbul',
      position: 3,
      kind: 'story',
      title: 'Minik Serçe',
      summary:
        'Rüzgârda yuvası düşen minik serçe Pıtır’ın, arkadaşlarıyla yeni bir yuva kurma hikâyesi.',
      status: 'current',
      bestStars: null,
      maxLokum: 20,
    });
    expect(body.text).toMatchObject({
      id: 'minik-serce',
      title: 'Minik Serçe',
      level: 1,
      estimatedMinutes: 2,
    });
    expect(body.text.paragraphs).toHaveLength(5);
    expect(body.glossary).toContainEqual({
      word: 'yuvası',
      meaning: 'Kuşların dallardan ve otlardan yaptığı küçük evi.',
    });
    expect(body.questions).toHaveLength(3);
    for (const question of body.questions) {
      expect(Object.keys(question).sort()).toEqual(['id', 'options', 'position', 'prompt']);
      expect(question.options).toHaveLength(3);
    }
  });

  it('sandıkta metin ve soru yoktur; en fazla 30 lokum', async () => {
    const { token } = await register(4);
    const body = (await getLesson(token, 'istanbul-05-sandik')).json();
    expect(body.lesson).toMatchObject({ kind: 'chest', title: 'Hazine Sandığı', maxLokum: 30 });
    expect(body.text).toBeNull();
    expect(body.questions).toEqual([]);
  });
});

describe('POST /lessons/:id/answers', () => {
  it('yanlışta ipucu, doğruda açıklama; lokum yalnızca ilk denemede doğruysa', async () => {
    const { token } = await register();
    const readingSessionId = await read(token, 'istanbul-01-hikaye');
    const [q1, q2] = await questionsOf('istanbul-01-hikaye');
    if (!q1 || !q2) throw new Error('soru yok');

    const wrong = await answer(token, 'istanbul-01-hikaye', {
      readingSessionId,
      questionId: q1.id,
      choiceIndex: (q1.correctIndex + 1) % 3,
    });
    expect(wrong.statusCode).toBe(200);
    expect(wrong.json()).toEqual({ correct: false, hint: expect.any(String), lokum: 0 });

    const rightAfterWrong = await answer(token, 'istanbul-01-hikaye', {
      readingSessionId,
      questionId: q1.id,
      choiceIndex: q1.correctIndex,
    });
    expect(rightAfterWrong.json()).toEqual({
      correct: true,
      explanation: expect.any(String),
      lokum: 0,
    });

    const firstTry = await answer(token, 'istanbul-01-hikaye', {
      readingSessionId,
      questionId: q2.id,
      choiceIndex: q2.correctIndex,
    });
    expect(firstTry.json()).toMatchObject({ correct: true, lokum: 5 });

    const again = await answer(token, 'istanbul-01-hikaye', {
      readingSessionId,
      questionId: q2.id,
      choiceIndex: q2.correctIndex,
    });
    expect(again.json()).toMatchObject({ correct: true, lokum: 0 });

    expect(await ctx.prisma.questionAttempt.count({ where: { readingSessionId } })).toBe(4);
  });

  it('girdiyi doğrular: şık aralığı, okumanın ve sorunun derse ait olması', async () => {
    const { token } = await register(2);
    const readingSessionId = await read(token, 'minik-serce');
    const [question] = await questionsOf('minik-serce');
    const [otherQuestion] = await questionsOf('bahcedeki-domatesler');
    if (!question || !otherQuestion) throw new Error('soru yok');

    const outOfRange = await answer(token, 'istanbul-03-minik-serce', {
      readingSessionId,
      questionId: question.id,
      choiceIndex: 3,
    });
    expect(outOfRange.statusCode).toBe(400);
    expect(outOfRange.json().fieldErrors).toEqual({ choiceIndex: 'Bir şık seç.' });

    const otherText = await read(token, 'bahcedeki-domatesler');
    const wrongSession = await answer(token, 'istanbul-03-minik-serce', {
      readingSessionId: otherText,
      questionId: question.id,
      choiceIndex: 0,
    });
    expect(wrongSession.statusCode).toBe(400);
    expect(wrongSession.json().fieldErrors).toEqual({
      readingSessionId: 'Bu okuma bu derse ait değil.',
    });

    const wrongQuestion = await answer(token, 'istanbul-03-minik-serce', {
      readingSessionId,
      questionId: otherQuestion.id,
      choiceIndex: 0,
    });
    expect(wrongQuestion.statusCode).toBe(400);
    expect(wrongQuestion.json().fieldErrors).toEqual({ questionId: 'Bu soru bu derse ait değil.' });

    const missing = await answer(token, 'istanbul-03-minik-serce', {
      readingSessionId: 'olmayan',
      questionId: question.id,
      choiceIndex: 0,
    });
    expect(missing.statusCode).toBe(404);
  });

  it('başka kullanıcının okuması kullanılamaz', async () => {
    const ayse = await register(0, 'ayse');
    const ali = await register(0, 'ali');
    const readingSessionId = await read(ayse.token, 'istanbul-01-hikaye');
    const [question] = await questionsOf('istanbul-01-hikaye');

    const response = await answer(ali.token, 'istanbul-01-hikaye', {
      readingSessionId,
      questionId: question?.id ?? '',
      choiceIndex: 0,
    });
    expect(response.statusCode).toBe(404);
  });

  it('kilitli derste 403, sandıkta 400 döner', async () => {
    const { token } = await register(4);
    const readingSessionId = await read(token, 'istanbul-01-hikaye');
    const payload = { readingSessionId, questionId: 'x', choiceIndex: 0 };

    const locked = await answer(token, 'istanbul-06-hikaye', payload);
    expect(locked.statusCode).toBe(403);

    const chest = await answer(token, 'istanbul-05-sandik', payload);
    expect(chest.statusCode).toBe(400);
    expect(chest.json().code).toBe('NO_QUESTIONS');
  });
});

describe('POST /lessons/:id/complete', () => {
  it('ön koşullar: okuma kaydı, bitmiş okuma ve doğru cevaplanmış tüm sorular', async () => {
    const { token } = await register();
    const lessonId = 'istanbul-01-hikaye';

    const noSession = await complete(token, lessonId);
    expect(noSession.statusCode).toBe(400);
    expect(noSession.json().fieldErrors).toEqual({ readingSessionId: 'Okuma kaydı eksik.' });

    const unfinished = await read(token, lessonId, false);
    expect((await complete(token, lessonId, unfinished)).json().code).toBe('READING_NOT_FINISHED');

    const readingSessionId = await read(token, lessonId);
    const [q1, q2] = await questionsOf(lessonId);
    if (!q1 || !q2) throw new Error('soru yok');
    await answer(token, lessonId, {
      readingSessionId,
      questionId: q1.id,
      choiceIndex: q1.correctIndex,
    });
    // İkinci soruya yalnızca yanlış cevap: yetmez.
    await answer(token, lessonId, {
      readingSessionId,
      questionId: q2.id,
      choiceIndex: (q2.correctIndex + 1) % 3,
    });
    const notAnswered = await complete(token, lessonId, readingSessionId);
    expect(notAnswered.statusCode).toBe(400);
    expect(notAnswered.json().code).toBe('QUESTIONS_NOT_ANSWERED');
    expect(await ctx.prisma.lessonCompletion.count()).toBe(0);
  });

  it('ilk tamamlama: yıldız, lokum, süre, seri ve sonraki ders', async () => {
    const { token, userId } = await register();
    const readingSessionId = await playStory(token, 'istanbul-01-hikaye', 'istanbul-01-hikaye');

    const response = await complete(token, 'istanbul-01-hikaye', readingSessionId);
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      firstTime: true,
      stars: 3,
      firstTryCorrect: 3,
      durationSeconds: 134,
      lokum: { lesson: 20, levelUp: 0, cityUnlock: 0, total: 20, balance: 20 },
      level: { before: 1, after: 1, leveledUp: false },
      cityUnlocked: null,
      finished: false,
      nextLessonId: 'istanbul-02-bahcedeki-domatesler',
      nextLessonTitle: 'Bahçedeki Domatesler',
      streak: 1,
    });

    const entries = await ctx.prisma.lokumEntry.findMany({ where: { userId } });
    expect(entries).toEqual([
      expect.objectContaining({ amount: 20, reason: 'LESSON', lessonId: 'istanbul-01-hikaye' }),
    ]);
    // Sonraki ders artık açık.
    expect((await getLesson(token, 'istanbul-02-bahcedeki-domatesler')).statusCode).toBe(200);
  });

  it('ikinci ders seviye atlatır (+50); yıldız ilk denemelere göre hesaplanır', async () => {
    const { token, userId } = await register(1);
    const lessonId = 'istanbul-02-bahcedeki-domatesler';
    const readingSessionId = await playStory(token, lessonId, 'bahcedeki-domatesler', 2);

    const body = (await complete(token, lessonId, readingSessionId)).json();
    expect(body).toMatchObject({
      firstTime: true,
      stars: 1,
      firstTryCorrect: 1,
      lokum: { lesson: 10, levelUp: 50, cityUnlock: 0, total: 60, balance: 60 },
      level: { before: 1, after: 2, leveledUp: true },
    });
    const levelUp = await ctx.prisma.lokumEntry.findFirst({
      where: { userId, reason: 'LEVEL_UP' },
    });
    expect(levelUp).toMatchObject({ amount: 50, level: 2 });
  });

  it('tekrar oynama: ödül yok, en iyi yıldız yükselir ama düşmez', async () => {
    const { token, userId } = await register();
    const lessonId = 'istanbul-01-hikaye';
    const first = await playStory(token, lessonId, lessonId, 1);
    expect((await complete(token, lessonId, first)).json()).toMatchObject({ stars: 2 });

    expect((await getLesson(token, lessonId)).json().lesson).toMatchObject({
      status: 'done',
      bestStars: 2,
      maxLokum: 0,
    });

    // Tekrarda ilk denemede doğru cevap da lokum göstermez.
    const replay = await read(token, lessonId);
    const [question] = await questionsOf(lessonId);
    const firstAnswer = await answer(token, lessonId, {
      readingSessionId: replay,
      questionId: question?.id ?? '',
      choiceIndex: question?.correctIndex ?? 0,
    });
    expect(firstAnswer.json()).toMatchObject({ correct: true, lokum: 0 });
    const better = await playStory(token, lessonId, lessonId);
    const replayed = (await complete(token, lessonId, better)).json();
    expect(replayed).toMatchObject({
      firstTime: false,
      stars: 3,
      lokum: { lesson: 0, levelUp: 0, cityUnlock: 0, total: 0, balance: 15 },
      level: { before: 1, after: 1, leveledUp: false },
      cityUnlocked: null,
    });

    const worse = await playStory(token, lessonId, lessonId, 3);
    expect((await complete(token, lessonId, worse)).json()).toMatchObject({
      firstTime: false,
      stars: 1,
    });

    const completion = await ctx.prisma.lessonCompletion.findFirstOrThrow({ where: { userId } });
    expect(completion).toMatchObject({ stars: 2, bestStars: 3, readingSessionId: first });
    expect(await ctx.prisma.lokumEntry.count({ where: { userId } })).toBe(1);
  });

  it('sandık: gövde gerekmez, 30 lokum verir', async () => {
    const { token } = await register(4);
    const response = await complete(token, 'istanbul-05-sandik');
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      firstTime: true,
      stars: null,
      firstTryCorrect: null,
      durationSeconds: null,
      lokum: { lesson: 30, levelUp: 0, cityUnlock: 0, total: 30, balance: 30 },
      level: { before: 3, after: 3, leveledUp: false },
      nextLessonId: 'istanbul-06-hikaye',
    });
  });

  it('şehrin 10. dersi seviye atlatır ve yeni şehri açar', async () => {
    const { token, userId } = await register(9);
    const body = (await complete(token, 'istanbul-10-sandik')).json();
    expect(body).toMatchObject({
      firstTime: true,
      lokum: { lesson: 30, levelUp: 50, cityUnlock: 100, total: 180, balance: 180 },
      level: { before: 5, after: 6, leveledUp: true },
      cityUnlocked: 'izmir',
      finished: false,
      nextLessonId: 'izmir-01-hikaye',
    });
    const reasons = await ctx.prisma.lokumEntry.findMany({
      where: { userId },
      select: { reason: true },
      orderBy: { amount: 'asc' },
    });
    expect(reasons.map(({ reason }) => reason)).toEqual(['CHEST', 'LEVEL_UP', 'CITY_UNLOCK']);
    expect((await getLesson(token, 'izmir-01-hikaye')).statusCode).toBe(200);
  });

  it('son ders yolculuğu bitirir', async () => {
    const { token } = await register(59);
    expect((await complete(token, 'van-10-sandik')).json()).toMatchObject({
      firstTime: true,
      lokum: { total: 30 },
      level: { before: 30, after: 30, leveledUp: false },
      cityUnlocked: null,
      finished: true,
      nextLessonId: null,
      nextLessonTitle: null,
    });
  });

  it('kilitli ders bitirilemez (403)', async () => {
    const { token } = await register();
    const response = await complete(token, 'istanbul-05-sandik');
    expect(response.statusCode).toBe(403);
    expect(await ctx.prisma.lessonCompletion.count()).toBe(0);
  });

  it('aynı anda gelen iki istekte ödül bir kez yazılır', async () => {
    const { token, userId } = await register(4);
    const responses = await Promise.all([
      complete(token, 'istanbul-05-sandik'),
      complete(token, 'istanbul-05-sandik'),
    ]);
    expect(responses.map((response) => response.statusCode)).toEqual([200, 200]);
    expect(responses.map((response) => response.json().firstTime).sort()).toEqual([false, true]);
    expect(await ctx.prisma.lokumEntry.count({ where: { userId } })).toBe(1);
  });
});
