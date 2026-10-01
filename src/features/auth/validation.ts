import type { Grade } from './types';

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

const USERNAME_PATTERN = /^[a-zA-Z0-9._]{3,20}$/;
const MIN_PASSWORD_LENGTH = 4;

export function validateSignIn(values: { username: string; password: string }) {
  const errors: FieldErrors<'username' | 'password'> = {};
  if (!values.username.trim()) errors.username = 'Kullanıcı adını yaz.';
  if (!values.password) errors.password = 'Şifreni yaz.';
  return errors;
}

export function validateSignUp(values: {
  name: string;
  username: string;
  password: string;
  grade: Grade | null;
}) {
  const errors: FieldErrors<'name' | 'username' | 'password' | 'grade'> = {};
  if (!values.name.trim()) errors.name = 'Adını yaz.';
  if (!USERNAME_PATTERN.test(values.username.trim())) {
    errors.username = 'En az 3 karakter olmalı. Harf, rakam, nokta ve alt çizgi kullanabilirsin.';
  }
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Şifren en az ${MIN_PASSWORD_LENGTH} karakter olmalı.`;
  }
  if (values.grade == null) errors.grade = 'Sınıfını seç.';
  return errors;
}

export function hasErrors(errors: object) {
  return Object.keys(errors).length > 0;
}
