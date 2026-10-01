import argon2 from 'argon2';

/** OWASP'ın argon2id için önerdiği asgari değerlerin üzerinde. */
const HASH_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const;

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, HASH_OPTIONS);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
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
