import { describe, expect, it } from 'vitest';

import { bearer, completeLessonsDirectly, registerUser, useTestContext } from './helpers.js';

const ctx = useTestContext();

/** `completed` dersi bitirmiş, `grade`. sınıftaki bir kullanıcının kitaplığı. */
async function listTexts(grade: number, completed = 0) {
  const { token, user } = await registerUser(ctx.app, { username: `sinif${grade}`, grade });
  await completeLessonsDirectly(ctx.prisma, user.id, completed);
  const response = await ctx.app.inject({ method: 'GET', url: '/texts', headers: bearer(token) });
  expect(response.statusCode).toBe(200);
  return response.json<{ texts: { id: string; level: number; estimatedMinutes: number }[] }>()
    .texts;
}

describe('GET /texts', () => {
  it('yeni kullanıcı yalnızca yolculukta açık olan ilk dersin metnini görür', async () => {
    expect((await listTexts(3)).map((text) => text.id)).toEqual(['istanbul-01-hikaye']);
  });

  it('dersler açıldıkça metinler kitaplığa eklenir; sınıf aralığı yine geçerlidir', async () => {
    // 40 ders bitti: Antalya'nın tamamı ve Kapadokya'nın ilk dersi açık, gerisi kilitli.
    const grade1 = (await listTexts(1, 40)).map((text) => text.id);
    expect(grade1).toEqual(expect.arrayContaining(['minik-serce', 'bahcedeki-domatesler']));
    expect(grade1).toContain('kapadokya-01-hikaye');
    expect(grade1).not.toContain('kayip-anahtar'); // sınıf 2-6
    expect(grade1).not.toContain('kapadokya-02-hikaye'); // kilitli

    const grade8 = (await listTexts(8, 40)).map((text) => text.id);
    expect(grade8).toContain('deniz-feneri');
    expect(grade8).not.toContain('minik-serce'); // sınıf 1-4
    expect(grade8).not.toContain('gokyuzundeki-haritalar'); // Kapadokya 7, kilitli
  });

  it('seviye ve süreye göre sıralar, listede paragraflar yoktur', async () => {
    const texts = await listTexts(5, 40);
    const order = texts.map((text) => [text.level, text.estimatedMinutes]);
    expect(order).toEqual([...order].sort(([a = 0, b = 0], [c = 0, d = 0]) => a - c || b - d));
    expect(Object.keys(texts[0] ?? {}).sort()).toEqual([
      'estimatedMinutes',
      'id',
      'level',
      'title',
    ]);
  });

  it('token olmadan 401 döner', async () => {
    const response = await ctx.app.inject({ method: 'GET', url: '/texts' });
    expect(response.statusCode).toBe(401);
  });
});

describe('GET /texts/:id', () => {
  it('açık dersin metninin tamamını döner', async () => {
    const { token, user } = await registerUser(ctx.app);
    await completeLessonsDirectly(ctx.prisma, user.id, 22);
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

  it('kilitli dersin metni için 403 döner', async () => {
    const { token } = await registerUser(ctx.app);
    const response = await ctx.app.inject({
      method: 'GET',
      url: '/texts/kayip-anahtar',
      headers: bearer(token),
    });

    expect(response.statusCode).toBe(403);
    expect(response.json()).toEqual({
      code: 'LESSON_LOCKED',
      message: 'Bu ders henüz kilitli. Önceki dersleri bitirince açılacak.',
    });
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
