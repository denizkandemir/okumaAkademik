/**
 * SAHTE (mock) kimlik doğrulama servisi. Herhangi bir kullanıcı adı ve şifreyi kabul eder;
 * kayıtlı kullanıcılar yalnızca bellekte tutulur.
 *
 * Task 2: Fonksiyon imzaları korunarak gövdeler `api` istemcisiyle değiştirilecek, ör.
 *   return api.post<AuthResponse>('/auth/login', input, { auth: false });
 */
import type { AuthResponse, SignInInput, SignUpInput, User } from './types';

const MOCK_DELAY_MS = 400;
const users = new Map<string, User>();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (username: string) => username.trim().toLowerCase();

function createToken(user: User) {
  return `mock-token.${user.id}.${Date.now()}`;
}

export async function signIn({ username }: SignInInput): Promise<AuthResponse> {
  await wait(MOCK_DELAY_MS);
  const key = normalize(username);
  const user = users.get(key) ?? {
    id: `mock-${key}`,
    username: username.trim(),
    name: username.trim(),
    grade: null,
  };
  return { token: createToken(user), user };
}

export async function signUp({ username, name, grade }: SignUpInput): Promise<AuthResponse> {
  await wait(MOCK_DELAY_MS);
  const key = normalize(username);
  if (users.has(key)) {
    throw new Error('Bu kullanıcı adı alınmış. Başka bir tane dene.');
  }
  const user: User = { id: `mock-${key}`, username: username.trim(), name: name.trim(), grade };
  users.set(key, user);
  return { token: createToken(user), user };
}

export async function signOut(): Promise<void> {
  // Task 2: Sunucu tarafında token geçersiz kılınacaksa burada çağrılacak.
}
