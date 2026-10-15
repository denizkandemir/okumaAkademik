import 'dotenv/config';

import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach } from 'vitest';

import {
  seedGlossaryRows,
  seedLessonRows,
  seedQuestionRows,
  seedTexts,
} from '../prisma/seed-data/index.js';
import { buildApp } from '../src/app.js';
import { toApiCity, type ApiCityId } from '../src/lib/city.js';
import { loadConfig } from '../src/config.js';
import { createPrismaClient, type PrismaClient } from '../src/db.js';
import { getTestDatabaseUrl } from './test-db.js';

export type TestContext = {
  app: FastifyInstance;
  prisma: PrismaClient;
};

/**
 * Her test dosyası için uygulama kurar; her testten önce veritabanını temizleyip içeriği (metinler,
 * dersler, sorular, kelime anlamları) yükler. Rate limit sayaçları bellekte olduğundan her test
 * yeni bir uygulama örneği kullanır.
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
      'TRUNCATE TABLE lokum_entries, lesson_completions, question_attempts, glossary_entries, ' +
        'questions, lessons, reading_sessions, auth_sessions, users, texts CASCADE',
    );
    await prisma.text.createMany({ data: seedTexts });
    await prisma.lesson.createMany({ data: seedLessonRows });
    await prisma.question.createMany({ data: seedQuestionRows });
    await prisma.glossaryEntry.createMany({ data: seedGlossaryRows });
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

/**
 * Yolculuktaki bir hikâye dersi (içerikten bağımsız test yazmak için). Ders kimliği ile metin
 * kimliği farklıdır: `istanbul-03-minik-serce` / `minik-serce`.
 */
export function storyAt(city: ApiCityId, position: number) {
  const lesson = seedLessonRows.find(
    (row) => toApiCity(row.city) === city && row.position === position,
  );
  if (!lesson?.textId) throw new Error(`${city} ${position}. ders bir hikâye değil`);
  return { id: lesson.id, textId: lesson.textId, title: lesson.title };
}

/**
 * Yolculuk sırasıyla ilk `count` dersi doğrudan veritabanında bitirilmiş yapar (3 yıldız, lokum
 * yazılmaz). Testlerde kullanıcıyı yolculuğun ileri bir noktasına taşımak içindir.
 */
export async function completeLessonsDirectly(prisma: PrismaClient, userId: string, count: number) {
  await prisma.lessonCompletion.createMany({
    data: seedLessonRows.slice(0, count).map((lesson) => ({
      userId,
      lessonId: lesson.id,
      stars: lesson.textId ? 3 : null,
      bestStars: lesson.textId ? 3 : null,
    })),
  });
}
