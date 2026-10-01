import type { AuthResponse, SignInInput, SignUpInput, User } from './types';

import { api } from '@/lib/api';

export function signIn(input: SignInInput): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', input, { auth: false });
}

export function signUp(input: SignUpInput): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/register', input, { auth: false });
}

/** Sunucudaki oturumu siler. Kayıtlı token ile çağrılmalıdır. */
export async function signOut(): Promise<void> {
  await api.post<void>('/auth/logout', undefined, { timeoutMs: 5_000 });
}

/** Kayıtlı token'ın hâlâ geçerli olduğunu doğrular ve güncel kullanıcıyı döner. */
export async function fetchCurrentUser(options?: { timeoutMs?: number }): Promise<User> {
  const { user } = await api.get<{ user: User }>('/me', options);
  return user;
}
