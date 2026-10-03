import { createHash, randomBytes } from 'node:crypto';

import type { PrismaClient } from '../../db.js';
import { publicUserSelect, type PublicUser } from './user.js';

/**
 * Opak oturum token'ları: istemciye 32 byte rastgele değer gider, veritabanında yalnızca
 * SHA-256 hash'i saklanır. Veritabanı sızsa bile token'lar kullanılamaz; oturum sunucudan
 * silinerek anında iptal edilebilir.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
/** Her istekte veritabanına yazmamak için süre uzatma en fazla bu sıklıkta yapılır. */
const TOUCH_INTERVAL_MS = 5 * 60 * 1000;

export type AuthenticatedSession = {
  sessionId: string;
  user: PublicUser & { dailyGoalMinutes: number };
};

export function generateToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function expiresFrom(now: Date, ttlDays: number) {
  return new Date(now.getTime() + ttlDays * DAY_MS);
}

export async function createAuthSession(
  prisma: PrismaClient,
  userId: string,
  ttlDays: number,
): Promise<string> {
  const token = generateToken();
  const now = new Date();
  await prisma.authSession.create({
    data: { tokenHash: hashToken(token), userId, expiresAt: expiresFrom(now, ttlDays) },
  });
  // Süresi dolmuş eski oturumları temizle.
  await prisma.authSession.deleteMany({ where: { userId, expiresAt: { lte: now } } });
  return token;
}

export async function findValidAuthSession(
  prisma: PrismaClient,
  token: string,
  ttlDays: number,
): Promise<AuthenticatedSession | null> {
  const authSession = await prisma.authSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { ...publicUserSelect, dailyGoalMinutes: true } } },
  });
  if (!authSession) return null;

  const now = new Date();
  if (authSession.expiresAt <= now) {
    await prisma.authSession.deleteMany({ where: { id: authSession.id } });
    return null;
  }

  // Kayan süre: kullanıldıkça 30 gün daha uzar.
  if (now.getTime() - authSession.lastUsedAt.getTime() >= TOUCH_INTERVAL_MS) {
    await prisma.authSession.updateMany({
      where: { id: authSession.id },
      data: { lastUsedAt: now, expiresAt: expiresFrom(now, ttlDays) },
    });
  }

  return { sessionId: authSession.id, user: authSession.user };
}

export async function deleteAuthSession(prisma: PrismaClient, sessionId: string): Promise<void> {
  await prisma.authSession.deleteMany({ where: { id: sessionId } });
}
