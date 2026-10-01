/**
 * Backend ile konuşan fetch tabanlı küçük istemci.
 * Base URL `EXPO_PUBLIC_API_URL` ortam değişkeninden gelir (bkz. `.env.example`).
 */

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
const DEFAULT_TIMEOUT_MS = 15_000;

let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

/** AuthProvider oturum açıldığında/kapandığında token'ı buraya bildirir. */
export function setAuthToken(token: string | null) {
  authToken = token;
}

/** Sunucu 401 döndürdüğünde çağrılır (ör. oturumu kapatmak için). */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  body?: unknown;
  headers?: Record<string, string>;
  /** `false` ise Authorization başlığı eklenmez (ör. giriş/kayıt istekleri). */
  auth?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
};

export async function request<T>(
  method: HttpMethod,
  path: string,
  { body, headers, auth = true, timeoutMs = DEFAULT_TIMEOUT_MS, signal }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  signal?.addEventListener('abort', () => controller.abort());

  const finalHeaders: Record<string, string> = { Accept: 'application/json', ...headers };
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';
  if (auth && authToken) finalHeaders.Authorization = `Bearer ${authToken}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      method,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError('Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.', 0);
  } finally {
    clearTimeout(timeout);
  }

  const text = await response.text();
  let data: unknown = undefined;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth) unauthorizedHandler?.();
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message: unknown }).message)
        : 'Bir hata oluştu. Lütfen tekrar dene.';
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
};
