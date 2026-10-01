import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { Errors } from '../lib/errors.js';
import { findValidSession, type AuthenticatedSession } from '../modules/auth/session.js';

declare module 'fastify' {
  interface FastifyRequest {
    auth: AuthenticatedSession | null;
  }
  interface FastifyInstance {
    /** Route'larda `preHandler: app.authenticate` olarak kullanılır. Token yoksa 401. */
    authenticate: (request: FastifyRequest) => Promise<void>;
  }
}

function readBearerToken(request: FastifyRequest): string | null {
  const header = request.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token.trim();
}

/** Kimliği doğrulanmış isteklerde `request.auth` dolu olmak zorundadır. */
export function requireAuth(request: FastifyRequest): AuthenticatedSession {
  if (!request.auth) throw Errors.unauthorized();
  return request.auth;
}

export default fp(async function authPlugin(app: FastifyInstance) {
  app.decorateRequest('auth', null);

  app.decorate('authenticate', async (request: FastifyRequest) => {
    const token = readBearerToken(request);
    if (!token) throw Errors.unauthorized();

    const session = await findValidSession(app.prisma, token, app.config.SESSION_TTL_DAYS);
    if (!session) throw Errors.unauthorized();

    request.auth = session;
  });
});
