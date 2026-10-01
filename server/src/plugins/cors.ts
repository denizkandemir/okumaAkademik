import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Yalnızca web istemcisi için gereklidir; mobil uygulamalar Origin başlığı göndermez.
 */
export default fp(async function corsPlugin(app: FastifyInstance) {
  const allowed = new Set(app.config.CORS_ORIGINS);
  await app.register(cors, {
    origin: (origin, callback) => callback(null, !origin || allowed.has(origin)),
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  });
});
