import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { Prisma } from '../../generated/prisma/client.js';
import { Errors } from '../../lib/errors.js';
import { gradeSchema, parse, passwordSchema, usernameSchema } from '../../lib/validation.js';
import { requireAuth } from '../../plugins/auth.js';
import { AUTH_RATE_LIMIT, ipAndUsernameKey } from '../../plugins/rate-limit.js';
import { hashPassword, verifyAgainstDummy, verifyPassword } from './password.js';
import { createSession, deleteSession } from './session.js';
import { publicUserSelect, toPublicUser } from './user.js';

const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: z
    .string({ error: 'Adını yaz.' })
    .trim()
    .min(1, { error: 'Adını yaz.' })
    .max(40, { error: 'Adın en fazla 40 karakter olabilir.' }),
  grade: gradeSchema,
});

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

export async function authRoutes(app: FastifyInstance) {
  const { prisma, config } = app;

  app.post('/auth/register', { config: authRateLimit }, async (request, reply) => {
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
      const token = await createSession(prisma, user.id, config.SESSION_TTL_DAYS);
      return reply.status(201).send({ token, user: toPublicUser(user) });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw Errors.usernameTaken();
      }
      throw error;
    }
  });

  app.post('/auth/login', { config: authRateLimit }, async (request) => {
    const input = parse(loginSchema, request.body);

    const user = await prisma.user.findUnique({
      where: { username: input.username },
      select: { ...publicUserSelect, passwordHash: true },
    });
    const valid = user
      ? await verifyPassword(user.passwordHash, input.password)
      : await verifyAgainstDummy(input.password);
    if (!user || !valid) throw Errors.invalidCredentials();

    const token = await createSession(prisma, user.id, config.SESSION_TTL_DAYS);
    return { token, user: toPublicUser(user) };
  });

  app.post('/auth/logout', { preHandler: app.authenticate }, async (request, reply) => {
    await deleteSession(prisma, requireAuth(request).sessionId);
    return reply.status(204).send();
  });

  app.get('/me', { preHandler: app.authenticate }, async (request) => {
    return { user: toPublicUser(requireAuth(request).user) };
  });
}
