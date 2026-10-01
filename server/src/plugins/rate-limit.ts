import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { Errors } from '../lib/errors.js';

/** Giriş/kayıt denemeleri: IP + kullanıcı adı başına 5 dakikada 10 deneme. */
export const AUTH_RATE_LIMIT = { max: 10, timeWindow: '5 minutes' } as const;

/**
 * Route bazlı çalışır (`global: false`). Anahtarın gövdedeki kullanıcı adını içerebilmesi için
 * `preHandler` aşamasında (gövde ayrıştırıldıktan sonra) değerlendirilir.
 *
 * Not: Sayaçlar bellekte tutulur; birden fazla sunucu örneğine geçilirse Redis store gerekir.
 */
export default fp(async function rateLimitPlugin(app: FastifyInstance) {
  await app.register(rateLimit, {
    global: false,
    hook: 'preHandler',
    errorResponseBuilder: () => Errors.rateLimited(),
  });
});

/** Rate limit anahtarı: istemci IP'si + küçük harfe çevrilmiş kullanıcı adı. */
export function ipAndUsernameKey(request: FastifyRequest): string {
  const body = request.body as { username?: unknown } | undefined;
  const username =
    typeof body?.username === 'string' ? body.username.trim().toLowerCase().slice(0, 40) : '';
  return `${request.ip}|${username}`;
}
