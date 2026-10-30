import { describe, expect, it } from 'vitest';

import { seedTexts } from '../prisma/seed-data/index.js';
import { APP_TIME_ZONE, startOfDayInTimeZone } from '../src/lib/time.js';
import {
  bearer,
  completeLessonsDirectly,
  registerUser,
  storyAt,
  useTestContext,
} from './helpers.js';

const ctx = useTestContext();
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

async function register(completed = 0) {
  const { token, user } = await registerUser(ctx.app);
  await completeLessonsDirectly(ctx.prisma, user.id, completed);
  return { token, userId: user.id };
}

function get(token: string, url: string) {
  return ctx.app.inject({ method: 'GET', url, headers: bearer(token) });
}

/** Bitmiş bir okuma kaydı ekler (seri, okumanın bitiş anının gününe göre sayılır). */
async function addReading(
  userId: string,
  startedAt: Date,
  endedAt: Date,
  options: { completed?: boolean; durationSeconds?: number } = {},
) {
  await ctx.prisma.readingSession.create({
    data: {
      userId,
      textId: storyAt('istanbul', 1).textId,
      startedAt,
      endedAt,
      durationSeconds: options.durationSeconds ?? 120,
      progress: options.completed === false ? 0.5 : 1,
      completed: options.completed ?? true,
    },
  });
}

/** Türkiye saatiyle `daysAgo` gün önceki öğle vakti (bugün için: birkaç dakika önce). */
function dayAt(daysAgo: number) {
  if (daysAgo === 0) return new Date(Date.now() - 2 * MINUTE);
  return new Date(startOfDayInTimeZone(new Date()).getTime() - daysAgo * DAY + 12 * HOUR);
}

describe('GET /me/journey', () => {
  it('yeni kullanıcı: İstanbul, yalnızca ilk ders açık', async () => {
    const { token } = await register();
    const response = await get(token, '/me/journey');
    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body).toMatchObject({
      level: 1,
      maxLevel: 30,
      finished: false,
      currentCity: 'istanbul',
      city: { id: 'istanbul', no: 1, levelFrom: 1, levelTo: 5, lessonsDone: 0, lessonsTotal: 10 },
      stats: { lokum: 0, streak: 0, streakAtRisk: false, readToday: false },
    });
    expect(body.lessons).toHaveLength(10);
    expect(body.lessons[0]).toEqual({
      id: storyAt('istanbul', 1).id,
      position: 1,
      kind: 'story',
      title: storyAt('istanbul', 1).title,
      status: 'current',
      stars: null,
      theme: 'Paylaşmak',
      estimatedMinutes: seedTexts.find((text) => text.id === storyAt('istanbul', 1).textId)
        ?.estimatedMinutes,
    });
    // Sandıkta metin yok: tema ve süre null.
    expect(body.lessons[4]).toMatchObject({ kind: 'chest', theme: null, estimatedMinutes: null });
    expect(
      body.lessons.slice(1).every((lesson: { status: string }) => lesson.status === 'locked'),
    ).toBe(true);
    expect(body.lessons.map((lesson: { kind: string }) => lesson.kind)).toEqual([
      'story',
      'story',
      'story',
      'story',
      'chest',
      'story',
      'story',
      'story',
      'story',
      'chest',
    ]);
    expect(body.cities).toEqual([
      { id: 'istanbul', status: 'current', lessonsDone: 0 },
      { id: 'izmir', status: 'locked', lessonsDone: 0 },
      { id: 'efes', status: 'locked', lessonsDone: 0 },
      { id: 'antalya', status: 'locked', lessonsDone: 0 },
      { id: 'kapadokya', status: 'locked', lessonsDone: 0 },
      { id: 'van', status: 'locked', lessonsDone: 0 },
    ]);
  });

  it('varsayılan şehir şu anki şehirdir; bitmiş şehir görüntülenebilir', async () => {
    const { token, userId } = await register(14);
    await ctx.prisma.lokumEntry.create({ data: { userId, amount: 320, reason: 'LESSON' } });

    const body = (await get(token, '/me/journey')).json();
    expect(body).toMatchObject({
      level: 8,
      currentCity: 'izmir',
      city: { id: 'izmir', no: 2, levelFrom: 6, levelTo: 10, lessonsDone: 4, lessonsTotal: 10 },
      stats: { lokum: 320 },
    });
    expect(body.lessons.map((lesson: { status: string }) => lesson.status)).toEqual([
      'done',
      'done',
      'done',
      'done',
      'current',
      'locked',
      'locked',
      'locked',
      'locked',
      'locked',
    ]);
    expect(body.lessons[0].stars).toBe(3);
    expect(body.lessons[4].stars).toBeNull();
    expect(body.cities.slice(0, 3)).toEqual([
      { id: 'istanbul', status: 'completed', lessonsDone: 10 },
      { id: 'izmir', status: 'current', lessonsDone: 4 },
      { id: 'efes', status: 'locked', lessonsDone: 0 },
    ]);

    const istanbul = (await get(token, '/me/journey?city=istanbul')).json();
    expect(istanbul.city).toMatchObject({ id: 'istanbul', lessonsDone: 10 });
    expect(istanbul.currentCity).toBe('izmir');
  });

  it('kilitli şehir 403, bilinmeyen şehir 400 döner', async () => {
    const { token } = await register(14);

    const locked = await get(token, '/me/journey?city=efes');
    expect(locked.statusCode).toBe(403);
    expect(locked.json()).toEqual({
      code: 'CITY_LOCKED',
      message: 'Efes henüz kilitli. Yolculuğa devam edince oraya da varacağız!',
    });

    const unknown = await get(token, '/me/journey?city=paris');
    expect(unknown.statusCode).toBe(400);
    expect(unknown.json().fieldErrors).toEqual({ city: 'Böyle bir şehir yok.' });
  });

  it('yolculuğu bitiren kullanıcı Van’da kalır', async () => {
    const { token } = await register(60);
    const body = (await get(token, '/me/journey')).json();
    expect(body).toMatchObject({ level: 30, finished: true, currentCity: 'van' });
    expect(body.cities.every((city: { status: string }) => city.status === 'completed')).toBe(true);
  });

  it('token olmadan 401 döner', async () => {
    expect((await ctx.app.inject({ method: 'GET', url: '/me/journey' })).statusCode).toBe(401);
  });
});

describe('GET /me/stats', () => {
  it('profil, rozet ve hatırlatıcı bilgilerini döner', async () => {
    const { token, userId } = await register(9);
    await ctx.prisma.lokumEntry.create({ data: { userId, amount: 560, reason: 'LESSON' } });
    // Son 7 gün her gün bir okuma (bugün dahil) → seri 7.
    for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
      const endedAt = dayAt(daysAgo);
      await addReading(userId, new Date(endedAt.getTime() - MINUTE), endedAt);
    }
    // Bugün yarım kalan bir okuma: süresi sayılır ama seriye katkısı yok.
    await addReading(userId, new Date(Date.now() - MINUTE), new Date(), {
      completed: false,
      durationSeconds: 45,
    });

    const response = await get(token, '/me/stats');
    expect(response.statusCode).toBe(200);
    const body = response.json();

    expect(body).toMatchObject({
      level: 5,
      lokum: 560,
      streak: 7,
      streakAtRisk: false,
      readToday: true,
      bestStreak: 7,
      todayMinutes: 2, // 120 + 45 saniye
      dailyGoalMinutes: 10,
      storiesDone: 8,
      minutesTotal: 14, // 7 × 120 + 45 saniye
      finished: false,
    });
    expect(typeof body.lastReadAt).toBe('string');

    const todayName = new Intl.DateTimeFormat('tr-TR', {
      weekday: 'short',
      timeZone: APP_TIME_ZONE,
    }).format(new Date());
    expect(body.week).toHaveLength(7);
    expect(body.week.at(-1)).toEqual({ day: todayName, done: true });
    expect(body.week.every((day: { done: boolean }) => day.done)).toBe(true);

    expect(body.cities[0]).toEqual({ id: 'istanbul', status: 'current' });
    expect(body.achievements).toEqual([
      { id: 'ilk-hikaye', title: 'İlk hikâye', description: 'İlk hikâyeni oku', earned: true },
      { id: 'seri-7', title: '7 gün seri', description: '7 gün art arda oku', earned: true },
      { id: 'hikaye-10', title: '10 hikâye', description: '10 hikâye oku', earned: false },
      {
        id: 'uc-yildiz-5',
        title: '5 kez 3 yıldız',
        description: '5 hikâyede 3 yıldız topla',
        earned: true,
      },
      { id: 'yeni-sehir', title: 'İlk yeni şehir', description: "İzmir'e ulaş", earned: false },
    ]);
  });

  it('bugün okunmadıysa seri dünden sayılır ve tehlikededir', async () => {
    const { token, userId } = await register();
    for (const daysAgo of [3, 2, 1]) {
      const endedAt = dayAt(daysAgo);
      await addReading(userId, new Date(endedAt.getTime() - MINUTE), endedAt);
    }
    // Daha eski, araya boşluk giren okumalar en iyi seriyi değiştirmez.
    await addReading(userId, dayAt(9), dayAt(9));

    const body = (await get(token, '/me/stats')).json();
    expect(body).toMatchObject({
      streak: 3,
      readToday: false,
      streakAtRisk: true,
      bestStreak: 3,
      todayMinutes: 0,
    });
    expect(body.week.map((day: { done: boolean }) => day.done)).toEqual([
      false,
      false,
      false,
      true,
      true,
      true,
      false,
    ]);
  });

  it('gece yarısını geçen okuma bitirildiği güne (Türkiye saati) sayılır', async () => {
    const { token, userId } = await register();
    const todayStart = startOfDayInTimeZone(new Date()).getTime();
    // Dün 23:55'te başlayıp bugün 00:00:30'da biten okuma: seri için "bugün".
    const endedAt = new Date(Math.min(todayStart + 30 * 1000, Date.now()));
    await addReading(userId, new Date(todayStart - 5 * MINUTE), endedAt, { durationSeconds: 300 });

    const body = (await get(token, '/me/stats')).json();
    expect(body).toMatchObject({ streak: 1, readToday: true, streakAtRisk: false });
    // Günlük hedef okumanın başladığı güne sayıldığı için bugünkü dakikaya girmez.
    expect(body.todayMinutes).toBe(0);
  });

  it('yeni kullanıcı için boş istatistik döner', async () => {
    const { token } = await register();
    const body = (await get(token, '/me/stats')).json();
    expect(body).toMatchObject({
      level: 1,
      lokum: 0,
      streak: 0,
      streakAtRisk: false,
      readToday: false,
      bestStreak: 0,
      storiesDone: 0,
      minutesTotal: 0,
      lastReadAt: null,
      finished: false,
    });
    expect(body.achievements.every((a: { earned: boolean }) => !a.earned)).toBe(true);
  });
});
