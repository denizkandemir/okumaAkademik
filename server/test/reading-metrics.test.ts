import { describe, expect, it } from 'vitest';

import { seedTexts } from '../prisma/seed-data/index.js';
import { GradeBand, QuestionType } from '../src/generated/prisma/enums.js';
import { periodStarts } from '../src/lib/periods.js';
import {
  completeLessonsDirectly,
  bearer,
  registerUser,
  storyAt,
  useTestContext,
} from './helpers.js';

/**
 * A0 ölçümleri: sınıf grubu varyantları, reading_metrics yazımı, görünümler ve GET /me/metrics.
 */

const ctx = useTestContext();
const MINUTE = 60 * 1000;
const FIRST = storyAt('istanbul', 1);
const SECOND_STORY = storyAt('istanbul', 2);
const FIRST_WORDS = seedTexts.find((text) => text.id === FIRST.textId)?.wordCount ?? 0;

async function register(grade = 3, username = 'ayse') {
  const { token, user } = await registerUser(ctx.app, { username, grade });
  return { token, userId: user.id };
}

function inject(token: string, method: 'GET' | 'POST' | 'PATCH', url: string, payload?: object) {
  return ctx.app.inject({ method, url, headers: bearer(token), ...(payload ? { payload } : {}) });
}

/** Okumayı başlatır ve 2 dakika önce başlamış, `durationSeconds` sürmüş ve bitmiş gibi kaydeder. */
async function read(token: string, textId: string, durationSeconds = 120) {
  const start = await inject(token, 'POST', '/reading-sessions', { textId });
  expect(start.statusCode).toBe(201);
  const { id } = start.json<{ id: string }>();
  await ctx.prisma.readingSession.update({
    where: { id },
    data: { startedAt: new Date(Date.now() - 2 * MINUTE) },
  });
  const done = await inject(token, 'PATCH', `/reading-sessions/${id}`, {
    progress: 1,
    durationSeconds,
    completed: true,
  });
  expect(done.statusCode).toBe(200);
  return id;
}

/** Soruları cevaplar; ilk `wrongFirst` soruda önce yanlış şıkka basılır. */
async function answerAll(
  token: string,
  lessonId: string,
  textId: string,
  readingSessionId: string,
  wrongFirst = 0,
) {
  const questions = await ctx.prisma.question.findMany({
    where: { textId },
    orderBy: { position: 'asc' },
    select: { id: true, correctIndex: true, options: true },
  });
  for (const [index, question] of questions.entries()) {
    const url = `/lessons/${lessonId}/answers`;
    if (index < wrongFirst) {
      const choiceIndex = (question.correctIndex + 1) % question.options.length;
      await inject(token, 'POST', url, { readingSessionId, questionId: question.id, choiceIndex });
    }
    const choiceIndex = question.correctIndex;
    await inject(token, 'POST', url, { readingSessionId, questionId: question.id, choiceIndex });
  }
}

async function completeLesson(token: string, lessonId: string, readingSessionId: string) {
  const response = await inject(token, 'POST', `/lessons/${lessonId}/complete`, {
    readingSessionId,
  });
  expect(response.statusCode).toBe(200);
  return response.json<{ firstTime: boolean; firstTryCorrect: number }>();
}

/** İlk dersin seed sürümlerini kaldırıp G1 varyantı ekler (3 sorulu, 4 şıklı bir soruyla). */
async function addVariant(lessonId: string, gradeBand: GradeBand, textId: string) {
  await ctx.prisma.lessonText.deleteMany({ where: { lessonId, gradeBand: { not: GradeBand.G2 } } });
  await ctx.prisma.text.create({
    data: {
      id: textId,
      title: 'Kısa Vapur',
      level: 'BASLANGIC',
      estimatedMinutes: 4,
      theme: 'MERAK',
      minGrade: 1,
      maxGrade: 2,
      paragraphs: ['Ece vapura bindi. Martılar uçtu.', 'Ece simit paylaştı. Çok güldü.'],
    },
  });
  await ctx.prisma.lessonText.create({ data: { lessonId, gradeBand, textId } });
  await ctx.prisma.question.createMany({
    data: [1, 2, 3].map((position) => ({
      textId,
      position,
      prompt: `Soru ${position}?`,
      options: position === 1 ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C'],
      correctIndex: position === 1 ? 3 : 0,
      hint: 'İpucu: metne bak.',
      explanation: 'Doğru!',
      type: QuestionType.BILGI,
      cognitiveLevel: 'HATIRLAMA',
    })),
  });
}

describe('sınıf grubu varyantları', () => {
  it('kullanıcının grubunun metni okutulur, yoksa G2 metni', async () => {
    await addVariant(FIRST.id, GradeBand.G1, 'kisa-vapur');

    const first = await register(1, 'birinci');
    const third = await register(3, 'ucuncu');
    const fifth = await register(5, 'besinci');

    const textOf = async (token: string) =>
      (await inject(token, 'GET', `/lessons/${FIRST.id}`)).json<{
        text: { id: string; gradeBand: string };
        questions: { options: string[] }[];
      }>();

    const g1 = await textOf(first.token);
    expect(g1.text).toMatchObject({ id: 'kisa-vapur', gradeBand: 'G1' });
    expect(g1.questions[0]?.options).toHaveLength(4);
    expect((await textOf(third.token)).text).toMatchObject({ id: FIRST.textId, gradeBand: 'G2' });
    // G3 metni yok: G2'ye düşer.
    expect((await textOf(fifth.token)).text).toMatchObject({ id: FIRST.textId, gradeBand: 'G2' });

    // Haritadaki süre ve tema da kullanıcının metninden.
    const journey = await inject(first.token, 'GET', '/me/journey');
    expect(journey.json().lessons[0]).toMatchObject({ theme: 'Merak', estimatedMinutes: 4 });
  });

  it('varyantla ders bitirilir; 4. şık (indeks 3) yalnızca 4 şıklı soruda geçerli', async () => {
    await addVariant(FIRST.id, GradeBand.G1, 'kisa-vapur');
    const { token } = await register(1);

    const sessionId = await read(token, 'kisa-vapur', 30);
    const questions = await ctx.prisma.question.findMany({
      where: { textId: 'kisa-vapur' },
      orderBy: { position: 'asc' },
    });
    const url = `/lessons/${FIRST.id}/answers`;
    const four = await inject(token, 'POST', url, {
      readingSessionId: sessionId,
      questionId: questions[0]?.id,
      choiceIndex: 3,
    });
    expect(four.json()).toMatchObject({ correct: true });
    const outOfRange = await inject(token, 'POST', url, {
      readingSessionId: sessionId,
      questionId: questions[1]?.id,
      choiceIndex: 3,
    });
    expect(outOfRange.statusCode).toBe(400);

    await answerAll(token, FIRST.id, 'kisa-vapur', sessionId);
    const result = await completeLesson(token, FIRST.id, sessionId);
    expect(result).toMatchObject({ firstTime: true, firstTryCorrect: 3 });

    const metric = await ctx.prisma.readingMetric.findUniqueOrThrow({
      where: { readingSessionId: sessionId },
    });
    expect(metric).toMatchObject({ gradeBand: GradeBand.G1, questionsTotal: 3, comprehension: 1 });
  });

  it('başka bir dersin metniyle yapılan okuma kabul edilmez', async () => {
    const { token, userId } = await register();
    await completeLessonsDirectly(ctx.prisma, userId, 1);
    const sessionId = await read(token, FIRST.textId);
    const response = await inject(token, 'POST', `/lessons/${SECOND_STORY.id}/complete`, {
      readingSessionId: sessionId,
    });
    expect(response.statusCode).toBe(400);
  });

  it('kilitli dersin bütün grup metinleri kitaplıkta görünmez ve açılamaz', async () => {
    await addVariant(SECOND_STORY.id, GradeBand.G1, 'kisa-domates');
    const { token } = await register(1);

    const texts = (await inject(token, 'GET', '/texts')).json<{ texts: { id: string }[] }>();
    const ids = texts.texts.map((text) => text.id);
    expect(ids).not.toContain('kisa-domates');
    expect(ids).not.toContain(SECOND_STORY.textId);

    const start = await inject(token, 'POST', '/reading-sessions', { textId: 'kisa-domates' });
    expect(start.statusCode).toBe(403);
  });
});

describe('reading_metrics', () => {
  it('ders bitince hız ve ilk denemeye göre anlama yazılır', async () => {
    const { token } = await register();
    const sessionId = await read(token, FIRST.textId, 90);
    await answerAll(token, FIRST.id, FIRST.textId, sessionId, 1);
    await completeLesson(token, FIRST.id, sessionId);

    const metric = await ctx.prisma.readingMetric.findUniqueOrThrow({
      where: { readingSessionId: sessionId },
    });
    expect(metric).toMatchObject({
      gradeBand: GradeBand.G2,
      wordCount: FIRST_WORDS,
      durationSeconds: 90,
      wordsPerMinute: Math.round(((FIRST_WORDS * 60) / 90) * 10) / 10,
      questionsTotal: 3,
      firstTryCorrect: 2,
      comprehension: 0.67,
      rushed: false,
    });
  });

  it('kitaplık okuması bitince anlamasız satır yazılır; ders tamamlama sorularla günceller', async () => {
    const { token } = await register();
    const sessionId = await read(token, FIRST.textId, 100);

    const library = await ctx.prisma.readingMetric.findUniqueOrThrow({
      where: { readingSessionId: sessionId },
    });
    expect(library).toMatchObject({
      questionsTotal: null,
      firstTryCorrect: null,
      comprehension: null,
      rushed: false,
    });

    await answerAll(token, FIRST.id, FIRST.textId, sessionId);
    await completeLesson(token, FIRST.id, sessionId);

    // Sonradan gelen geç bir kayıt soruları silmez.
    await inject(token, 'PATCH', `/reading-sessions/${sessionId}`, {
      progress: 1,
      durationSeconds: 100,
      completed: true,
    });
    const lesson = await ctx.prisma.readingMetric.findUniqueOrThrow({
      where: { readingSessionId: sessionId },
    });
    expect(lesson).toMatchObject({ questionsTotal: 3, firstTryCorrect: 3, comprehension: 1 });
  });

  it('acele okuma: tavanın üstünde hız ve %60 altı anlama', async () => {
    const { token } = await register();
    // ~120 kelime 30 sn'de: G2 tavanı (160) üstünde.
    const sessionId = await read(token, FIRST.textId, 30);
    await answerAll(token, FIRST.id, FIRST.textId, sessionId, 2);
    await completeLesson(token, FIRST.id, sessionId);

    const metric = await ctx.prisma.readingMetric.findUniqueOrThrow({
      where: { readingSessionId: sessionId },
    });
    expect(metric.wordsPerMinute).toBeGreaterThan(160);
    expect(metric).toMatchObject({ comprehension: 0.33, rushed: true });
  });

  it('yanıtı kaybolan tamamlama yeniden gelince aynı tek satır kalır', async () => {
    const { token } = await register();
    const sessionId = await read(token, FIRST.textId, 90);
    await answerAll(token, FIRST.id, FIRST.textId, sessionId, 1);
    await completeLesson(token, FIRST.id, sessionId);
    const again = await completeLesson(token, FIRST.id, sessionId);
    expect(again).toMatchObject({ firstTime: true, firstTryCorrect: 2 });

    const rows = await ctx.prisma.readingMetric.findMany();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ firstTryCorrect: 2, comprehension: 0.67 });
  });

  it('bitmemiş okuma ölçülmez', async () => {
    const { token } = await register();
    const start = await inject(token, 'POST', '/reading-sessions', { textId: FIRST.textId });
    const { id } = start.json<{ id: string }>();
    await inject(token, 'PATCH', `/reading-sessions/${id}`, {
      progress: 0.4,
      durationSeconds: 10,
      completed: false,
    });
    expect(await ctx.prisma.readingMetric.count()).toBe(0);
  });
});

describe('görünümler', () => {
  it('v_reading_results_by_type: tür başına ilk denemede doğru ve yanlış cevap', async () => {
    const { token } = await register();
    const sessionId = await read(token, FIRST.textId);
    await answerAll(token, FIRST.id, FIRST.textId, sessionId, 1);

    const rows = await ctx.prisma.$queryRaw<
      {
        question_type: string;
        questions_answered: number;
        first_try_correct: number;
        wrong_attempts: number;
      }[]
    >`SELECT question_type::text, questions_answered, first_try_correct, wrong_attempts
      FROM v_reading_results_by_type WHERE reading_session_id = ${sessionId}
      ORDER BY question_type`;
    // Vapurda Simit: 1. soru bilgi (önce yanlış), 2. sözcük anlamı, 3. duygu-karakter
    // (sıralama metin olarak).
    expect(rows).toEqual([
      { question_type: 'BILGI', questions_answered: 1, first_try_correct: 0, wrong_attempts: 1 },
      {
        question_type: 'DUYGU_KARAKTER',
        questions_answered: 1,
        first_try_correct: 1,
        wrong_attempts: 0,
      },
      {
        question_type: 'SOZCUK_ANLAMI',
        questions_answered: 1,
        first_try_correct: 1,
        wrong_attempts: 0,
      },
    ]);
  });

  it('v_student_weekly ve GET /me/metrics: şu anki ve önceki dönem, değişim', async () => {
    const { token, userId } = await register();
    const { current, previous } = periodStarts('week', new Date());
    // Haftaların pazartesi öğlesi (Türkiye 12:00 = 09:00 UTC): bu hafta 80, geçen hafta 60 kelime/dk.
    const readings = [
      { id: 'olcum-1', day: current, wpm: 80, firstTryCorrect: 3 },
      { id: 'olcum-2', day: current, wpm: 100, firstTryCorrect: 1 },
      { id: 'olcum-3', day: previous, wpm: 60, firstTryCorrect: 2 },
    ];
    for (const reading of readings) {
      const startedAt = new Date(`${reading.day}T09:00:00Z`);
      const durationSeconds = Math.round((FIRST_WORDS * 60) / reading.wpm);
      await ctx.prisma.readingSession.create({
        data: {
          id: reading.id,
          userId,
          textId: FIRST.textId,
          startedAt,
          endedAt: new Date(startedAt.getTime() + durationSeconds * 1000),
          durationSeconds,
          progress: 1,
          completed: true,
        },
      });
      await ctx.prisma.readingMetric.create({
        data: {
          readingSessionId: reading.id,
          gradeBand: GradeBand.G2,
          wordCount: FIRST_WORDS,
          durationSeconds,
          wordsPerMinute: reading.wpm,
          questionsTotal: 3,
          firstTryCorrect: reading.firstTryCorrect,
          comprehension: Math.round((reading.firstTryCorrect / 3) * 100) / 100,
        },
      });
    }

    const [week] = await ctx.prisma.$queryRaw<
      {
        median_wpm: number;
        comprehension: number;
        prev_median_wpm: number;
        median_wpm_change: number;
      }[]
    >`SELECT median_wpm::float8, comprehension::float8, prev_median_wpm::float8,
        median_wpm_change::float8
      FROM v_student_weekly WHERE username = 'ayse' AND week_start = ${current}::date`;
    expect(week).toEqual({
      median_wpm: 90,
      comprehension: 0.67,
      prev_median_wpm: 60,
      median_wpm_change: 30,
    });

    const response = await inject(token, 'GET', '/me/metrics?period=week');
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      period: 'week',
      current: {
        start: current,
        readMinutes: expect.any(Number),
        textCount: 1,
        readingCount: 2,
        medianWpm: 90,
        comprehension: 0.67,
        rushedCount: 0,
      },
      previous: {
        start: previous,
        readMinutes: expect.any(Number),
        textCount: 1,
        readingCount: 1,
        medianWpm: 60,
        comprehension: 0.67,
        rushedCount: 0,
      },
      baseline: null,
    });
  });

  it('GET /me/metrics: okuma yoksa sıfırlar; varsayılan hafta; geçersiz dönem 400', async () => {
    const { token } = await register();
    const response = await inject(token, 'GET', '/me/metrics');
    expect(response.json()).toMatchObject({
      period: 'week',
      current: { readingCount: 0, readMinutes: 0, medianWpm: null, comprehension: null },
      baseline: null,
    });
    const day = await inject(token, 'GET', '/me/metrics?period=day');
    expect(day.json().current.start).toBe(periodStarts('day', new Date()).current);
    expect((await inject(token, 'GET', '/me/metrics?period=year')).statusCode).toBe(400);
    expect((await ctx.app.inject({ method: 'GET', url: '/me/metrics' })).statusCode).toBe(401);
  });

  it('GET /me/metrics başka kullanıcının okumalarını saymaz', async () => {
    const other = await register(3, 'mehmet');
    const sessionId = await read(other.token, FIRST.textId, 90);
    await answerAll(other.token, FIRST.id, FIRST.textId, sessionId);
    await completeLesson(other.token, FIRST.id, sessionId);

    const { token } = await register();
    const response = await inject(token, 'GET', '/me/metrics?period=day');
    expect(response.json().current.readingCount).toBe(0);
  });
});
