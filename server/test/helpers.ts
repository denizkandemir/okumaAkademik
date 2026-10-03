import 'dotenv/config';

import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach } from 'vitest';

import { seedTexts } from '../prisma/seed-data.js';
import { buildApp } from '../src/app.js';
import { loadConfig } from '../src/config.js';
import { createPrismaClient, type PrismaClient } from '../src/db.js';
import { getTestDatabaseUrl } from './test-db.js';

export type TestContext = {
  app: FastifyInstance;
  prisma: PrismaClient;
};

/**
 * Her test dosyası için uygulama kurar; her testten önce veritabanını temizleyip metinleri yükler.
 * Rate limit sayaçları bellekte olduğundan her test yeni bir uygulama örneği kullanır.
 */
export function useTestContext(): TestContext {
  const databaseUrl = getTestDatabaseUrl();
  const prisma = createPrismaClient(databaseUrl);
  const config = loadConfig({
    ...process.env,
    DATABASE_URL: databaseUrl,
    NODE_ENV: 'test',
    LOG_LEVEL: 'silent',
  });
  const context = { prisma } as TestContext;

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE reading_sessions, auth_sessions, users, texts CASCADE',
    );
    await prisma.text.createMany({ data: seedTexts });
    await context.app?.close();
    context.app = await buildApp({ config, prisma, logger: false });
  });

  afterAll(async () => {
    await context.app?.close();
    await prisma.$disconnect();
  });

  return context;
}

export type RegisterInput = {
  username?: string;
  password?: string;
  name?: string;
  grade?: number;
};

export async function registerUser(app: FastifyInstance, input: RegisterInput = {}) {
  const payload = { username: 'ayse', password: '1234', name: 'Ayşe', grade: 3, ...input };
  const response = await app.inject({ method: 'POST', url: '/auth/register', payload });
  if (response.statusCode !== 201) {
    throw new Error(`Kayıt başarısız: ${response.statusCode} ${response.body}`);
  }
  return response.json<{ token: string; user: { id: string; username: string } }>();
}

export function bearer(token: string) {
  return { authorization: `Bearer ${token}` };
}
