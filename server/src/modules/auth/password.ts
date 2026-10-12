import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

/**
 * Node'un yerleşik scrypt'i kullanılır; native modül gerektirmez (Windows Akıllı Uygulama
 * Denetimi imzasız .node dosyalarını engelleyebiliyor). Parametreler OWASP'ın scrypt
 * önerilerinden: N=2^15, r=8, p=3 (~32 MiB).
 */
const PARAMS = { N: 2 ** 15, r: 8, p: 3 } as const;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const MAX_MEM = 64 * 1024 * 1024;

function deriveKey(
  password: string,
  salt: Buffer,
  params: { N: number; r: number; p: number },
  keyLength: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, { ...params, maxmem: MAX_MEM }, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

/** Biçim: `scrypt$N$r$p$tuz(base64)$hash(base64)` */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await deriveKey(password, salt, PARAMS, KEY_LENGTH);
  const { N, r, p } = PARAMS;
  return ['scrypt', N, r, p, salt.toString('base64'), key.toString('base64')].join('$');
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    const [scheme, N, r, p, salt, expected] = hash.split('$');
    if (scheme !== 'scrypt' || !salt || !expected) return false;
    const expectedKey = Buffer.from(expected, 'base64');
    const key = await deriveKey(
      password,
      Buffer.from(salt, 'base64'),
      { N: Number(N), r: Number(r), p: Number(p) },
      expectedKey.length,
    );
    return timingSafeEqual(key, expectedKey);
  } catch {
    return false;
  }
}

let dummyHash: Promise<string> | null = null;

/**
 * Kullanıcı bulunamadığında da aynı süre harcanır; böylece yanıt süresinden kullanıcı adının
 * var olup olmadığı anlaşılamaz.
 */
export async function verifyAgainstDummy(password: string): Promise<false> {
  dummyHash ??= hashPassword('okumatik-dummy-password');
  await verifyPassword(await dummyHash, password);
  return false;
}
