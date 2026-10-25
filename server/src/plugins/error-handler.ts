import type { FastifyError, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { Prisma } from '../generated/prisma/client.js';
import { AppError, Errors } from '../lib/errors.js';

/** Postgres metin kolonuna yazılamayan karakter (ör. `\u0000`): SQLSTATE 22021. İstemci hatasıdır. */
function isInvalidTextError(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  const adapterError = error.meta?.driverAdapterError as
    { cause?: { originalCode?: string } } | undefined;
  return adapterError?.cause?.originalCode === '22021';
}

/**
 * Bütün hataları `{ message, code, fieldErrors? }` biçimine çevirir.
 * 500 hatalarında iç ayrıntı (stack, SQL, vb.) asla istemciye gönderilmez.
 */
export default fp(async function errorHandlerPlugin(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError | AppError, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(error.toBody());
    }

    if (isInvalidTextError(error)) {
      request.log.info({ err: error }, 'istemci hatası: geçersiz karakter');
      return reply.status(400).send(Errors.badRequest().toBody());
    }

    const statusCode = error.statusCode ?? 500;

    if (statusCode === 429) {
      return reply.status(429).send(Errors.rateLimited().toBody());
    }

    if (statusCode >= 400 && statusCode < 500) {
      // Fastify'ın kendi istemci hataları (geçersiz JSON, çok büyük gövde vb.)
      request.log.info({ err: error }, 'istemci hatası');
      const body =
        statusCode === 404
          ? Errors.notFound().toBody()
          : statusCode === 401
            ? Errors.unauthorized().toBody()
            : Errors.badRequest().toBody();
      return reply.status(statusCode).send(body);
    }

    request.log.error({ err: error }, 'beklenmeyen sunucu hatası');
    return reply.status(500).send(Errors.internal().toBody());
  });

  app.setNotFoundHandler((_request, reply) => {
    return reply.status(404).send(Errors.notFound('Aradığın sayfa bulunamadı.').toBody());
  });
});
