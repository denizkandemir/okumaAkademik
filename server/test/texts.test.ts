import { describe, expect, it } from 'vitest';

import { bearer, registerUser, useTestContext } from './helpers.js';

const ctx = useTestContext();

async function listTexts(grade: number) {
  const { token } = await registerUser(ctx.app, { username: `sinif${grade}`, grade });
  const response = await ctx.app.inject({ method: 'GET', url: '/texts', headers: bearer(token) });
  expect(response.statusCode).toBe(200);
  return response.json<{ texts: Record<string, unknown>[] }>().texts;
}

describe('GET /texts', () => {
  it('yalnızca kullanıcının sınıfına uygun metinleri döner', async () => {
    expect((await listTexts(1)).map((text) => text.id)).toEqual([
      'bahcedeki-domatesler',
      'minik-serce',
    ]);
    expect((await listTexts(3)).map((text) => text.id)).toEqual([
      'bahcedeki-domatesler',
      'minik-serce',
      'kayip-anahtar',
      'deniz-feneri',
    ]);
    expect((await listTexts(8)).map((text) => text.id)).toEqual([
      'deniz-feneri',
      'gokyuzundeki-haritalar',
    ]);
  });

  it('seviye ve süreye göre sıralar, listede paragraflar yoktur', async () => {
    const [first] = await listTexts(1);
    expect(first).toEqual({
      id: 'bahcedeki-domatesler',
      title: 'Bahçedeki Domatesler',
      level: 1,
      estimatedMinutes: 2,
    });
  });

  it('token olmadan 401 döner', async () => {
    const response = await ctx.app.inject({ method: 'GET', url: '/texts' });
    expect(response.statusCode).toBe(401);
  });
});

describe('GET /texts/:id', () => {
  it('metnin tamamını döner', async () => {
    const { token } = await registerUser(ctx.app);
    const response = await ctx.app.inject({
      method: 'GET',
      url: '/texts/kayip-anahtar',
      headers: bearer(token),
    });

    expect(response.statusCode).toBe(200);
    const { text } = response.json();
    expect(text).toMatchObject({ id: 'kayip-anahtar', title: 'Kayıp Anahtar', level: 2 });
    expect(text.paragraphs).toHaveLength(5);
  });

  it('olmayan metin için 404 döner', async () => {
    const { token } = await registerUser(ctx.app);
    const response = await ctx.app.inject({
      method: 'GET',
      url: '/texts/olmayan',
      headers: bearer(token),
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ code: 'NOT_FOUND', message: 'Bu metni bulamadık.' });
  });
});
