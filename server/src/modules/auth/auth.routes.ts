import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { Prisma } from '../../generated/prisma/client.js';
import { Errors } from '../../lib/errors.js';
import {
  gradeSchema,
  nameSchema,
  parse,
  passwordSchema,
  usernameSchema,
} from '../../lib/validation.js';
import { requireAuth } from '../../plugins/auth.js';
import { needsPlacement } from '../placement/placement.routes.js';
import { AUTH_RATE_LIMIT, authIpRateLimit, ipAndUsernameKey } from '../../plugins/rate-limit.js';
import { hashPassword, verifyAgainstDummy, verifyPassword } from './password.js';
import { createAuthSession, deleteAuthSession } from './auth-session.js';
import { publicUserSelect, toPublicUser } from './user.js';

const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: nameSchema,
  grade: gradeSchema,
});

const updateMeSchema = z.object({ name: nameSchema });

// Girişte biçim kontrolü yapılmaz; yalnızca boş olmamalı. Biçim hatası da "hatalı" sayılır.
const loginSchema = z.object({
  username: z
    .string({ error: 'Kullanıcı adını yaz.' })
    .trim()
    .min(1, { error: 'Kullanıcı adını yaz.' })
    .max(40, { error: 'Kullanıcı adı veya şifre hatalı.' })
    .transform((value) => value.toLowerCase()),
  password: z
    .string({ error: 'Şifreni yaz.' })
    .min(1, { error: 'Şifreni yaz.' })
    .max(128, { error: 'Kullanıcı adı veya şifre hatalı.' }),
});

const authRateLimit = { rateLimit: { ...AUTH_RATE_LIMIT, keyGenerator: ipAndUsernameKey } };

// Rate limit kancası route'un `authenticate` kancasından sonra çalışır; anahtar kullanıcıdır.
const updateMeRateLimit = {
  rateLimit: {
    ...AUTH_RATE_LIMIT,
    keyGenerator: (request: FastifyRequest) => `me|${request.auth?.user.id ?? request.ip}`,
  },
};

export async function authRoutes(app: FastifyInstance) {
  const { prisma, config } = app;
  const ipRateLimit = authIpRateLimit(app);

  app.post(
    '/auth/register',
    { config: authRateLimit, preHandler: ipRateLimit },
    async (request, reply) => {
      const input = parse(registerSchema, request.body);
      const passwordHash = await hashPassword(input.password);

      try {
        const user = await prisma.user.create({
          data: {
            username: input.username,
            passwordHash,
            name: input.name,
            grade: input.grade,
          },
          select: publicUserSelect,
        });
        const token = await createAuthSession(prisma, user.id, config.SESSION_TTL_DAYS);
        return reply.status(201).send({ token, user: toPublicUser(user) });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          throw Errors.usernameTaken();
        }
        throw error;
      }
    },
  );

  app.post('/auth/login', { config: authRateLimit, preHandler: ipRateLimit }, async (request) => {
    const input = parse(loginSchema, request.body);

    const user = await prisma.user.findUnique({
      where: { username: input.username },
      select: { ...publicUserSelect, passwordHash: true },
    });
    const valid = user
      ? await verifyPassword(user.passwordHash, input.password)
      : await verifyAgainstDummy(input.password);
    if (!user || !valid) throw Errors.invalidCredentials();

    const token = await createAuthSession(prisma, user.id, config.SESSION_TTL_DAYS);
    return { token, user: toPublicUser(user) };
  });

  app.post('/auth/logout', { preHandler: app.authenticate }, async (request, reply) => {
    await deleteAuthSession(prisma, requireAuth(request).sessionId);
    return reply.status(204).send();
  });

  /** `needsPlacement`: seviye belirleme okuması henüz yapılmadı (uygulama bir kez önerir). */
  app.get('/me', { preHandler: app.authenticate }, async (request) => {
    const { user } = requireAuth(request);
    return {
      user: toPublicUser(user),
      needsPlacement: await needsPlacement(prisma, user.id, user.grade),
    };
  });

  /** Ayarlar ekranından adı değiştirir; GET /me ile aynı şekli döner. */
  app.patch('/me', { preHandler: app.authenticate, config: updateMeRateLimit }, async (request) => {
    const { user } = requireAuth(request);
    const input = parse(updateMeSchema, request.body);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: input.name },
      select: publicUserSelect,
    });
    return { user: toPublicUser(updated) };
  });
}
