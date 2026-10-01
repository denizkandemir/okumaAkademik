import { z } from 'zod';

import { Errors } from './errors.js';

/**
 * Kurallar mobildeki `src/features/auth/validation.ts` ile aynıdır; birini değiştirirsen
 * diğerini de güncelle.
 */
export const USERNAME_PATTERN = /^[a-zA-Z0-9._]{3,20}$/;
export const MIN_PASSWORD_LENGTH = 4;
/** argon2 için makul üst sınır; aşırı uzun girdilerle CPU tüketimini engeller. */
export const MAX_PASSWORD_LENGTH = 128;

export const usernameSchema = z
  .string({ error: 'Kullanıcı adını yaz.' })
  .trim()
  .regex(USERNAME_PATTERN, {
    error: 'En az 3 karakter olmalı. Harf, rakam, nokta ve alt çizgi kullanabilirsin.',
  })
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string({ error: 'Şifreni yaz.' })
  .min(MIN_PASSWORD_LENGTH, { error: `Şifren en az ${MIN_PASSWORD_LENGTH} karakter olmalı.` })
  .max(MAX_PASSWORD_LENGTH, { error: 'Şifren çok uzun.' });

export const gradeSchema = z
  .number({ error: 'Sınıfını seç.' })
  .int({ error: 'Sınıfını seç.' })
  .min(1, { error: 'Sınıfını seç.' })
  .max(8, { error: 'Sınıfını seç.' });

/**
 * Girdiyi doğrular; hatalıysa alan bazlı Türkçe mesajlarla 400 fırlatır.
 * Her alan için yalnızca ilk hata mesajı döner.
 */
export function parse<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const result = schema.safeParse(input ?? {});
  if (result.success) return result.data;

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.length > 0 ? issue.path.map(String).join('.') : '_';
    fieldErrors[key] ??= issue.message;
  }
  throw Errors.validation(fieldErrors);
}
