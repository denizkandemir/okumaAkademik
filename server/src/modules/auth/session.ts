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

export async function createSession(
  prisma: PrismaClient,
  userId: string,
  ttlDays: number,
): Promise<string> {
  const token = generateToken();
  const now = new Date();
  await prisma.session.create({
    data: { tokenHash: hashToken(token), userId, expiresAt: expiresFrom(now, ttlDays) },
  });
  // Süresi dolmuş eski oturumları temizle.
  await prisma.session.deleteMany({ where: { userId, expiresAt: { lte: now } } });
  return token;
}

export async function findValidSession(
  prisma: PrismaClient,
  token: string,
  ttlDays: number,
): Promise<AuthenticatedSession | null> {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { ...publicUserSelect, dailyGoalMinutes: true } } },
  });
  if (!session) return null;

  const now = new Date();
  if (session.expiresAt <= now) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    return null;
  }

  // Kayan süre: kullanıldıkça 30 gün daha uzar.
  if (now.getTime() - session.lastUsedAt.getTime() >= TOUCH_INTERVAL_MS) {
    await prisma.session.updateMany({
      where: { id: session.id },
      data: { lastUsedAt: now, expiresAt: expiresFrom(now, ttlDays) },
    });
  }

  return { sessionId: session.id, user: session.user };
}

export async function deleteSession(prisma: PrismaClient, sessionId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { id: sessionId } });
}
