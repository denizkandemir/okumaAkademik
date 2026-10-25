import { AppState, type AppStateStatus } from 'react-native';

import type { ReadingSessionResult, ReadingSessionStart } from './types';

import { api, ApiError } from '@/lib/api';

type SaveBody = { progress: number; durationSeconds: number; completed: boolean };

export type ReadingSessionController = {
  /** Kaydırma oranından hesaplanan ilerlemeyi bildirir (0-1). Yalnızca en yüksek değer tutulur. */
  reportProgress: (progress: number) => void;
  /** "Bitirdim": metni tamamlandı olarak kaydeder. Kaydedilemezse hata fırlatır. */
  finish: () => Promise<ReadingSessionResult>;
  /** Sunucudaki oturum kimliği (soru cevapları ve ders tamamlama bununla gönderilir). */
  sessionId: () => Promise<string | null>;
  /** Ekrandan çıkarken çağrılır; bitirilmediyse ilerlemeyi ve süreyi kaydeder. */
  dispose: () => void;
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

/** Oturum başlatılamazsa arka planda yeniden deneme aralıkları; sonra 15 sn'de bir. */
const RETRY_DELAYS_MS = [2_000, 4_000, 8_000];
const RETRY_STEADY_MS = 15_000;

/** Ağ hatası (status 0) ve sunucu hatası (5xx) geçicidir; 4xx (kilitli, bulunamadı) kalıcıdır. */
function isTemporary(error: unknown) {
  return error instanceof ApiError && (error.isNetworkError || error.status >= 500);
}

/**
 * Bir metnin okunma oturumunu yönetir: açılınca sunucuda oturum başlatır, aktif okuma süresini
 * ölçer (uygulama arka plandayken sayılmaz), çıkarken ve "Bitirdim"de PATCH'ler.
 */
export function startReadingSession(textId: string): ReadingSessionController {
  let progress = 0;
  let activeMs = 0;
  let activeSince: number | null = AppState.currentState === 'background' ? null : Date.now();
  let finished = false;
  let disposed = false;

  let sessionId: string | null = null;
  /** Kalıcı hata (4xx) alındıysa bir daha denenmez. */
  let gaveUp = false;
  /** Süren başlatma isteği; aynı anda yalnızca bir POST atılır. */
  let pending: Promise<string | null> | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let retryCount = 0;

  const clearRetry = () => {
    if (retryTimer !== null) clearTimeout(retryTimer);
    retryTimer = null;
  };

  // Sunucu, kaydedilen süreyi oturumun başladığı andan beri geçen süreyle sınırlar (süre
  // şişirilmesin diye; DURATION_SLACK_SECONDS). Oturum geç açılırsa o ana kadar okunan süre
  // kaybolur; arka planda erken yeniden denemek bu kaybı küçük tutar.
  const scheduleRetry = () => {
    if (disposed || sessionId || gaveUp || retryTimer !== null) return;
    const delay = RETRY_DELAYS_MS[retryCount] ?? RETRY_STEADY_MS;
    retryCount += 1;
    retryTimer = setTimeout(() => {
      retryTimer = null;
      void ensureSession();
    }, delay);
  };

  /**
   * Oturum kimliğini döndürür. Oturum yoksa beklemeden bir deneme yapar; süren bir istek varsa
   * yeni POST atmadan onu bekler. Başlatılamazsa `null` (geçici hatada arka planda yeniden dener).
   */
  const ensureSession = (): Promise<string | null> => {
    if (sessionId) return Promise.resolve(sessionId);
    if (gaveUp) return Promise.resolve(null);
    if (pending) return pending;
    clearRetry();
    pending = api
      .post<ReadingSessionStart>('/reading-sessions', { textId })
      .then(({ id }) => {
        sessionId = id;
        return id;
      })
      .catch((error: unknown) => {
        console.warn('Okuma oturumu başlatılamadı:', error);
        if (isTemporary(error)) scheduleRetry();
        else gaveUp = true;
        return null;
      })
      .finally(() => {
        pending = null;
      });
    return pending;
  };

  void ensureSession();

  const durationSeconds = () =>
    Math.round((activeMs + (activeSince === null ? 0 : Date.now() - activeSince)) / 1000);

  const save = async (completed: boolean) => {
    const id = await ensureSession();
    if (!id) throw new Error('Okuman kaydedilemedi. İnternet bağlantını kontrol et.');
    const body: SaveBody = {
      progress: completed ? 1 : progress,
      durationSeconds: durationSeconds(),
      completed,
    };
    // keepalive: web'de sekme kapanırken de istek tamamlansın.
    return api.patch<ReadingSessionResult>(`/reading-sessions/${id}`, body, { keepalive: true });
  };

  const saveQuietly = () => {
    if (finished) return;
    save(false).catch((error) => console.warn('Okuma ilerlemesi kaydedilemedi:', error));
  };

  const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
    if (state === 'active') {
      activeSince ??= Date.now();
      return;
    }
    if (activeSince !== null) {
      activeMs += Date.now() - activeSince;
      activeSince = null;
    }
    // Uygulama arka plana atıldığında (veya web'de sekme gizlendiğinde) ara kayıt.
    if (state === 'background') saveQuietly();
  });

  return {
    reportProgress: (value) => {
      progress = Math.max(progress, clamp(value));
    },
    finish: async () => {
      finished = true;
      try {
        return await save(true);
      } catch (error) {
        finished = false;
        throw error;
      }
    },
    sessionId: ensureSession,
    dispose: () => {
      // Arka plan denemeleri durur; oturum hâlâ yoksa save son bir kez başlatmayı dener.
      disposed = true;
      clearRetry();
      subscription.remove();
      saveQuietly();
    },
  };
}
