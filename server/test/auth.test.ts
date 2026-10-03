import { describe, expect, it } from 'vitest';

import { hashToken } from '../src/modules/auth/auth-session.js';
import { bearer, registerUser, useTestContext } from './helpers.js';

const ctx = useTestContext();

describe('POST /auth/register', () => {
  it('kullanıcı oluşturur, token ve kullanıcıyı döner', async () => {
    const response = await ctx.app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { username: 'Ayse.K', password: '1234', name: ' Ayşe ', grade: 3 },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.token).toEqual(expect.any(String));
    expect(body.user).toEqual({
      id: expect.any(String),
      username: 'ayse.k',
      name: 'Ayşe',
      grade: 3,
    });
    expect(response.body).not.toContain('passwordHash');

    const stored = await ctx.prisma.user.findUniqueOrThrow({ where: { username: 'ayse.k' } });
    expect(stored.passwordHash).toMatch(/^\$argon2id\$/);
    expect(stored.dailyGoalMinutes).toBe(10);
  });

  it('veritabanında token yerine yalnızca SHA-256 hash saklar', async () => {
    const { token } = await registerUser(ctx.app);
    const sessions = await ctx.prisma.authSession.findMany();
    expect(sessions).toHaveLength(1);
    expect(sessions[0]?.tokenHash).toBe(hashToken(token));
    expect(sessions[0]?.tokenHash).not.toBe(token);
    // 32 byte base64url
    expect(Buffer.from(token, 'base64url')).toHaveLength(32);
  });

  it('geçersiz alanlar için alan bazlı Türkçe hatalar döner', async () => {
    const response = await ctx.app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { username: 'a!', password: '12', name: '', grade: 9 },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Bazı bilgiler eksik ya da hatalı.',
      fieldErrors: {
        username: 'En az 3 karakter olmalı. Harf, rakam, nokta ve alt çizgi kullanabilirsin.',
        password: 'Şifren en az 4 karakter olmalı.',
        name: 'Adını yaz.',
        grade: 'Sınıfını seç.',
      },
    });
  });

  it('aynı kullanıcı adıyla (büyük/küçük harf farkı olsa da) 409 döner', async () => {
    await registerUser(ctx.app, { username: 'ayse' });
    const response = await ctx.app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { username: 'AYSE', password: '5678', name: 'Başka', grade: 4 },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      code: 'USERNAME_TAKEN',
      message: 'Bu kullanıcı adı alınmış.',
      fieldErrors: { username: 'Bu kullanıcı adı alınmış. Başka bir tane dene.' },
    });
  });
});

describe('POST /auth/login', () => {
  it('doğru bilgilerle giriş yapar', async () => {
    await registerUser(ctx.app, { username: 'ayse', password: '1234' });
    const response = await ctx.app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { username: 'Ayse', password: '1234' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().user).toMatchObject({ username: 'ayse', name: 'Ayşe', grade: 3 });
    expect(response.json().token).toEqual(expect.any(String));
  });

  it('hatalı şifre ve olmayan kullanıcı için aynı 401 cevabını döner', async () => {
    await registerUser(ctx.app, { username: 'ayse', password: '1234' });
    const wrongPassword = await ctx.app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { username: 'ayse', password: 'yanlis' },
    });
    const unknownUser = await ctx.app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { username: 'olmayan', password: 'yanlis' },
    });

    const expected = { code: 'INVALID_CREDENTIALS', message: 'Kullanıcı adı veya şifre hatalı.' };
    expect(wrongPassword.statusCode).toBe(401);
    expect(wrongPassword.json()).toEqual(expected);
    expect(unknownUser.statusCode).toBe(401);
    expect(unknownUser.json()).toEqual(expected);
  });

  it('aynı IP + kullanıcı adı için 5 dakikada 10 denemeden sonra 429 döner', async () => {
    const attempt = (username: string) =>
      ctx.app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { username, password: 'yanlis' },
      });

    for (let i = 0; i < 10; i++) {
      expect((await attempt('ayse')).statusCode).toBe(401);
    }
    const limited = await attempt('AYSE');
    expect(limited.statusCode).toBe(429);
    expect(limited.json()).toEqual({
      code: 'RATE_LIMITED',
      message: 'Çok fazla deneme yaptın. Biraz bekleyip tekrar dene.',
    });

    // Başka bir kullanıcı adı ayrı sayılır.
    expect((await attempt('baska')).statusCode).toBe(401);
  });

  it('kayıt ucunda da rate limit vardır', async () => {
    const attempt = () =>
      ctx.app.inject({ method: 'POST', url: '/auth/register', payload: { username: 'zz' } });
    for (let i = 0; i < 10; i++) {
      expect((await attempt()).statusCode).toBe(400);
    }
    expect((await attempt()).statusCode).toBe(429);
  });
});

describe('GET /me ve oturum', () => {
  it('token ile kullanıcıyı döner', async () => {
    const { token } = await registerUser(ctx.app);
    const response = await ctx.app.inject({ method: 'GET', url: '/me', headers: bearer(token) });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      user: { id: expect.any(String), username: 'ayse', name: 'Ayşe', grade: 3 },
    });
  });

  it('token yoksa veya geçersizse 401 döner', async () => {
    const missing = await ctx.app.inject({ method: 'GET', url: '/me' });
    const invalid = await ctx.app.inject({
      method: 'GET',
      url: '/me',
      headers: bearer('gecersiz-token'),
    });

    for (const response of [missing, invalid]) {
      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({
        code: 'UNAUTHORIZED',
        message: 'Oturumun sona erdi. Lütfen yeniden giriş yap.',
      });
    }
  });

  it('çıkıştan sonra token geçersiz olur ve oturum silinir', async () => {
    const { token } = await registerUser(ctx.app);
    const logout = await ctx.app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: bearer(token),
    });
    expect(logout.statusCode).toBe(204);
    expect(await ctx.prisma.authSession.count()).toBe(0);

    const me = await ctx.app.inject({ method: 'GET', url: '/me', headers: bearer(token) });
    expect(me.statusCode).toBe(401);
  });

  it('kullanıldıkça oturum süresi 30 güne uzar', async () => {
    const { token } = await registerUser(ctx.app);
    const soon = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await ctx.prisma.authSession.updateMany({
      data: { expiresAt: soon, lastUsedAt: new Date(Date.now() - 60 * 60 * 1000) },
    });

    const me = await ctx.app.inject({ method: 'GET', url: '/me', headers: bearer(token) });
    expect(me.statusCode).toBe(200);

    const session = await ctx.prisma.authSession.findFirstOrThrow();
    const daysLeft = (session.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
    expect(daysLeft).toBeGreaterThan(29.9);
  });

  it('süresi dolmuş oturum 401 döner ve silinir', async () => {
    const { token } = await registerUser(ctx.app);
    await ctx.prisma.authSession.updateMany({ data: { expiresAt: new Date(Date.now() - 1000) } });

    const me = await ctx.app.inject({ method: 'GET', url: '/me', headers: bearer(token) });
    expect(me.statusCode).toBe(401);
    expect(await ctx.prisma.authSession.count()).toBe(0);
  });
});

describe('hata biçimi', () => {
  it('olmayan uç için 404 ve standart biçim', async () => {
    const response = await ctx.app.inject({ method: 'GET', url: '/olmayan' });
    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      code: 'NOT_FOUND',
      message: 'Aradığın sayfa bulunamadı.',
    });
  });

  it('bozuk JSON için 400 ve standart biçim', async () => {
    const response = await ctx.app.inject({
      method: 'POST',
      url: '/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: '{bozuk',
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      code: 'BAD_REQUEST',
      message: 'İstek anlaşılamadı. Tekrar dene.',
    });
  });

  it('500 hatalarında iç ayrıntı sızdırmaz', async () => {
    ctx.app.get('/test-patlama', async () => {
      throw new Error('GİZLİ veritabanı ayrıntısı');
    });
    const response = await ctx.app.inject({ method: 'GET', url: '/test-patlama' });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'Bir şeyler ters gitti. Lütfen biraz sonra tekrar dene.',
    });
    expect(response.body).not.toContain('GİZLİ');
  });

  it('/health çalışır', async () => {
    const response = await ctx.app.inject({ method: 'GET', url: '/health' });
    expect(response.json()).toEqual({ ok: true });
  });
});
