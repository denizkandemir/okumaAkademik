import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Backend ile konuşan fetch tabanlı küçük istemci.
 * Sunucu hataları her zaman `{ message, code, fieldErrors? }` biçimindedir.
 *
 * Base URL sırasıyla (bkz. `.env.example`):
 * 1. `EXPO_PUBLIC_API_URL` tanımlıysa o,
 * 2. geliştirmede telefonda/emülatörde Metro'nun adresi (`expoConfig.hostUri`, ör.
 *    "192.168.1.20:8081") ve sunucunun portu: `http://192.168.1.20:3000`,
 * 3. aksi hâlde (web dahil) `http://localhost:3000`.
 */

const API_PORT = 3000;

/** Adresin nereden geldiği; geliştirici uyarılarında gösterilir. */
export type ApiUrlSource = 'env' | 'metro' | 'default';

function resolveApiUrl(): { url: string; source: ApiUrlSource } {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) return { url: fromEnv, source: 'env' };

  if (__DEV__ && Platform.OS !== 'web') {
    // hostUri: Metro'nun telefonun bağlandığı adresi, ör. "192.168.1.20:8081".
    const host = Constants.expoConfig?.hostUri?.match(/^([^:/]+)/)?.[1];
    if (host) return { url: `http://${host}:${API_PORT}`, source: 'metro' };
  }

  return { url: `http://localhost:${API_PORT}`, source: 'default' };
}

const resolved = resolveApiUrl();

export const API_URL = resolved.url.replace(/\/+$/, '');
export const API_URL_SOURCE: ApiUrlSource = resolved.source;
const DEFAULT_TIMEOUT_MS = 15_000;

let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

/** AuthProvider oturum açıldığında/kapandığında token'ı buraya bildirir. */
export function setAuthToken(token: string | null) {
  authToken = token;
}

/** Kimlik doğrulamalı bir istek 401 döndürdüğünde çağrılır (ör. oturumu kapatmak için). */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

/** İstek sunucuya hiç ulaşamadığında (ağ yok, zaman aşımı, iptal) `status` 0 olur. */
export const NETWORK_ERROR_STATUS = 0;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNetworkError() {
    return this.status === NETWORK_ERROR_STATUS;
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
  /** Web'de sayfa kapanırken bile isteğin tamamlanmasını sağlar. */
  keepalive?: boolean;
};

type ErrorBody = { message?: unknown; code?: unknown; fieldErrors?: unknown };

function toApiError(status: number, data: unknown): ApiError {
  const body = (typeof data === 'object' && data !== null ? data : {}) as ErrorBody;
  const message =
    typeof body.message === 'string' ? body.message : 'Bir hata oluştu. Lütfen tekrar dene.';
  const code = typeof body.code === 'string' ? body.code : `HTTP_${status}`;
  const fieldErrors =
    typeof body.fieldErrors === 'object' && body.fieldErrors !== null
      ? (body.fieldErrors as Record<string, string>)
      : undefined;
  return new ApiError(message, status, code, fieldErrors);
}

export async function request<T>(
  method: HttpMethod,
  path: string,
  {
    body,
    headers,
    auth = true,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal,
    keepalive,
  }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timeout = setTimeout(abort, timeoutMs);
  signal?.addEventListener('abort', abort);

  const finalHeaders: Record<string, string> = { Accept: 'application/json', ...headers };
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';
  if (auth && authToken) finalHeaders.Authorization = `Bearer ${authToken}`;

  let response: Response;
  let text: string;
  try {
    response = await fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      method,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      keepalive,
    });
    text = await response.text();
  } catch {
    throw new ApiError(
      'Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.',
      NETWORK_ERROR_STATUS,
      signal?.aborted ? 'ABORTED' : 'NETWORK_ERROR',
    );
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }

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
    throw toApiError(response.status, data);
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
