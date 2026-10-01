import { describe, expect, it } from 'vitest';

import { startOfDayInTimeZone } from '../src/lib/time.js';
import { bearer, registerUser, useTestContext } from './helpers.js';

const ctx = useTestContext();
const MINUTE = 60 * 1000;

async function startReading(token: string, textId: string) {
  const response = await ctx.app.inject({
    method: 'POST',
    url: '/reading-sessions',
    headers: bearer(token),
    payload: { textId },
  });
  expect(response.statusCode).toBe(201);
  return response.json<{ id: string }>().id;
}

function updateReading(
  token: string,
  id: string,
  payload: { progress: number; durationSeconds: number; completed: boolean },
) {
  return ctx.app.inject({
    method: 'PATCH',
    url: `/reading-sessions/${id}`,
    headers: bearer(token),
    payload,
  });
}

async function getProgress(token: string) {
  const response = await ctx.app.inject({
    method: 'GET',
    url: '/me/progress',
    headers: bearer(token),
  });
  expect(response.statusCode).toBe(200);
  return response.json();
}

/** Oturumu geçmişte başlamış gibi gösterir (süre sınırı gerçek geçen zamana bağlı). */
async function backdate(id: string, startedAt: Date) {
  await ctx.prisma.readingSession.update({ where: { id }, data: { startedAt } });
}

describe('okuma oturumu', () => {
  it('başlatılır, ilerleme ve bitiş kaydedilir', async () => {
    const { token } = await registerUser(ctx.app);
    const id = await startReading(token, 'minik-serce');
    await backdate(id, new Date(Date.now() - 10 * MINUTE));

    const partial = await updateReading(token, id, {
      progress: 0.5,
      durationSeconds: 120,
      completed: false,
    });
    expect(partial.statusCode).toBe(200);
    expect(partial.json()).toEqual({ id, progress: 0.5, durationSeconds: 120, completed: false });

    const done = await updateReading(token, id, {
      progress: 0.9,
      durationSeconds: 240,
      completed: true,
    });
    expect(done.json()).toEqual({ id, progress: 1, durationSeconds: 240, completed: true });

    const stored = await ctx.prisma.readingSession.findUniqueOrThrow({ where: { id } });
    expect(stored.endedAt).toBeInstanceOf(Date);
  });

  it('ilerleme geri gitmez, bitmiş oturum bitmemiş olmaz', async () => {
    const { token } = await registerUser(ctx.app);
    const id = await startReading(token, 'minik-serce');

    await updateReading(token, id, { progress: 0.8, durationSeconds: 5, completed: true });
    const later = await updateReading(token, id, {
      progress: 0.2,
      durationSeconds: 10,
      completed: false,
    });
    expect(later.json()).toMatchObject({ progress: 1, completed: true });
  });

  it('süre, gerçekte geçen zamanı aşamaz', async () => {
    const { token } = await registerUser(ctx.app);
    const id = await startReading(token, 'minik-serce');

    const response = await updateReading(token, id, {
      progress: 0.1,
      durationSeconds: 3600,
      completed: false,
    });
    expect(response.json().durationSeconds).toBeLessThanOrEqual(61);
  });

  it('olmayan metin için 404, geçersiz gövde için 400 döner', async () => {
    const { token } = await registerUser(ctx.app);
    const missing = await ctx.app.inject({
      method: 'POST',
      url: '/reading-sessions',
      headers: bearer(token),
      payload: { textId: 'olmayan' },
    });
    expect(missing.statusCode).toBe(404);

    const id = await startReading(token, 'minik-serce');
    const invalid = await updateReading(token, id, {
      progress: 2,
      durationSeconds: -1,
      completed: false,
    });
    expect(invalid.statusCode).toBe(400);
    expect(Object.keys(invalid.json().fieldErrors)).toEqual(['progress', 'durationSeconds']);
  });

  it('başka bir kullanıcının oturumu güncellenemez', async () => {
    const ayse = await registerUser(ctx.app, { username: 'ayse' });
    const ali = await registerUser(ctx.app, { username: 'ali' });
    const id = await startReading(ayse.token, 'minik-serce');

    const response = await updateReading(ali.token, id, {
      progress: 1,
      durationSeconds: 1,
      completed: true,
    });
    expect(response.statusCode).toBe(404);
  });
});

describe('GET /me/progress', () => {
  it('yeni kullanıcı için boş ilerleme döner', async () => {
    const { token } = await registerUser(ctx.app);
    expect(await getProgress(token)).toEqual({
      dailyGoal: { goalMinutes: 10, readMinutes: 0 },
      continueReading: null,
    });
  });

  it('yalnızca bugün (Türkiye saatiyle) okunan dakikaları toplar', async () => {
    const { token } = await registerUser(ctx.app);
    const dayStart = startOfDayInTimeZone(new Date());

    // Bugün: 3 dk + 2,5 dk = 5,5 dk → 5
    const today1 = await startReading(token, 'minik-serce');
    await backdate(today1, new Date(Math.max(dayStart.getTime(), Date.now() - 20 * MINUTE)));
    await updateReading(token, today1, { progress: 1, durationSeconds: 180, completed: true });

    const today2 = await startReading(token, 'kayip-anahtar');
    await updateReading(token, today2, { progress: 0.3, durationSeconds: 150, completed: false });
    await backdate(today2, new Date(Math.max(dayStart.getTime(), Date.now() - 10 * MINUTE)));
    await updateReading(token, today2, { progress: 0.4, durationSeconds: 150, completed: false });

    // Dün (gün sınırından hemen önce) başlayan oturum sayılmaz.
    const yesterday = await startReading(token, 'deniz-feneri');
    await backdate(yesterday, new Date(dayStart.getTime() - 60 * MINUTE));
    await updateReading(token, yesterday, {
      progress: 0.5,
      durationSeconds: 600,
      completed: false,
    });

    const progress = await getProgress(token);
    expect(progress.dailyGoal).toEqual({ goalMinutes: 10, readMinutes: 5 });
  });

  it('en son yarım bırakılan metni "devam et" olarak döner', async () => {
    const { token } = await registerUser(ctx.app);

    const first = await startReading(token, 'minik-serce');
    await updateReading(token, first, { progress: 0.3, durationSeconds: 10, completed: false });
    await backdate(first, new Date(Date.now() - 30 * MINUTE));

    const second = await startReading(token, 'kayip-anahtar');
    await updateReading(token, second, { progress: 0.6, durationSeconds: 10, completed: false });
    await backdate(second, new Date(Date.now() - 20 * MINUTE));

    expect((await getProgress(token)).continueReading).toEqual({
      textId: 'kayip-anahtar',
      title: 'Kayıp Anahtar',
      level: 2,
      progress: 0.6,
    });

    // Kayıp Anahtar yeniden açılıp bitirilince bir önceki yarım metne geçer.
    const again = await startReading(token, 'kayip-anahtar');
    await updateReading(token, again, { progress: 1, durationSeconds: 10, completed: true });

    expect((await getProgress(token)).continueReading).toMatchObject({
      textId: 'minik-serce',
      progress: 0.3,
    });
  });

  it('başka kullanıcıların okumalarını saymaz', async () => {
    const ayse = await registerUser(ctx.app, { username: 'ayse' });
    const ali = await registerUser(ctx.app, { username: 'ali' });
    const id = await startReading(ayse.token, 'minik-serce');
    await backdate(id, new Date(Date.now() - 5 * MINUTE));
    await updateReading(ayse.token, id, { progress: 0.5, durationSeconds: 240, completed: false });

    expect(await getProgress(ali.token)).toEqual({
      dailyGoal: { goalMinutes: 10, readMinutes: 0 },
      continueReading: null,
    });
  });
});
