import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { Errors } from '../lib/errors.js';

/** Giriş/kayıt denemeleri: IP + kullanıcı adı başına 5 dakikada 10 deneme. */
export const AUTH_RATE_LIMIT = { max: 10, timeWindow: '5 minutes' } as const;

/** Giriş/kayıt için IP başına ek sınırın penceresi; deneme sayısı `AUTH_IP_RATE_LIMIT_MAX`. */
export const AUTH_IP_RATE_LIMIT_WINDOW = '15 minutes';

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

/**
 * Kullanıcı adından bağımsız, IP başına sınır (kayıt ve giriş aynı sayacı kullanır). Kullanıcı adı
 * değiştirilerek sınırsız deneme (her birinde scrypt) yapılmasını engeller. Okul NAT'ı için
 * cömerttir. `app.rateLimit()` istek başına yalnızca bir kez çalıştığından route'un
 * `config.rateLimit`'iyle birlikte `createRateLimit` kullanılır.
 */
export function authIpRateLimit(app: FastifyInstance) {
  const check = app.createRateLimit({
    max: app.config.AUTH_IP_RATE_LIMIT_MAX,
    timeWindow: AUTH_IP_RATE_LIMIT_WINDOW,
    keyGenerator: (request) => `auth-ip|${request.ip}`,
  });
  return async (request: FastifyRequest) => {
    const result = await check(request);
    if (!result.isAllowed && result.isExceeded) throw Errors.rateLimited();
  };
}

/** Rate limit anahtarı: istemci IP'si + küçük harfe çevrilmiş kullanıcı adı. */
export function ipAndUsernameKey(request: FastifyRequest): string {
  const body = request.body as { username?: unknown } | undefined;
  const username =
    typeof body?.username === 'string' ? body.username.trim().toLowerCase().slice(0, 40) : '';
  return `${request.ip}|${username}`;
}
