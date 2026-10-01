/**
 * Tüm API hataları aynı biçimde döner:
 *   { message: string, code: string, fieldErrors?: Record<string, string> }
 * `message` Türkçedir ve doğrudan çocuğa gösterilebilecek sadelikte yazılır.
 */
export type ErrorBody = {
  message: string;
  code: string;
  fieldErrors?: Record<string, string>;
};

export class AppError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string,
    readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'AppError';
  }

  toBody(): ErrorBody {
    return this.fieldErrors
      ? { message: this.message, code: this.code, fieldErrors: this.fieldErrors }
      : { message: this.message, code: this.code };
  }
}

export const Errors = {
  validation: (fieldErrors?: Record<string, string>) =>
    new AppError(400, 'VALIDATION_ERROR', 'Bazı bilgiler eksik ya da hatalı.', fieldErrors),
  badRequest: () => new AppError(400, 'BAD_REQUEST', 'İstek anlaşılamadı. Tekrar dene.'),
  unauthorized: () =>
    new AppError(401, 'UNAUTHORIZED', 'Oturumun sona erdi. Lütfen yeniden giriş yap.'),
  invalidCredentials: () =>
    new AppError(401, 'INVALID_CREDENTIALS', 'Kullanıcı adı veya şifre hatalı.'),
  notFound: (message = 'Aradığın şey bulunamadı.') => new AppError(404, 'NOT_FOUND', message),
  usernameTaken: () =>
    new AppError(409, 'USERNAME_TAKEN', 'Bu kullanıcı adı alınmış.', {
      username: 'Bu kullanıcı adı alınmış. Başka bir tane dene.',
    }),
  rateLimited: () =>
    new AppError(429, 'RATE_LIMITED', 'Çok fazla deneme yaptın. Biraz bekleyip tekrar dene.'),
  internal: () =>
    new AppError(500, 'INTERNAL_ERROR', 'Bir şeyler ters gitti. Lütfen biraz sonra tekrar dene.'),
};
