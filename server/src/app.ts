import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';

import type { Config } from './config.js';
import type { PrismaClient } from './db.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { progressRoutes } from './modules/progress/progress.routes.js';
import { textsRoutes } from './modules/texts/texts.routes.js';
import authPlugin from './plugins/auth.js';
import corsPlugin from './plugins/cors.js';
import errorHandlerPlugin from './plugins/error-handler.js';
import rateLimitPlugin from './plugins/rate-limit.js';

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
    prisma: PrismaClient;
  }
}

export type BuildAppOptions = {
  config: Config;
  prisma: PrismaClient;
  logger?: FastifyServerOptions['logger'];
};

/** Fastify uygulamasını kurar ama dinlemeyi başlatmaz (testler `inject` ile kullanır). */
export async function buildApp({
  config,
  prisma,
  logger,
}: BuildAppOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: logger ?? { level: config.LOG_LEVEL },
    trustProxy: config.TRUST_PROXY,
    bodyLimit: 64 * 1024,
  });

  app.decorate('config', config);
  app.decorate('prisma', prisma);

  await app.register(errorHandlerPlugin);
  await app.register(corsPlugin);
  await app.register(rateLimitPlugin);
  await app.register(authPlugin);

  app.get('/health', async () => ({ ok: true }));

  await app.register(authRoutes);
  await app.register(textsRoutes);
  await app.register(progressRoutes);

  return app;
}
