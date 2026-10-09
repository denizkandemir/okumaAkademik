import { AppState, type AppStateStatus } from 'react-native';

import type { ReadingSessionResult } from './types';

import { api } from '@/lib/api';

type SaveBody = { progress: number; durationSeconds: number; completed: boolean };

export type ReadingSessionController = {
  /** Kaydırma oranından hesaplanan ilerlemeyi bildirir (0-1). Yalnızca en yüksek değer tutulur. */
  reportProgress: (progress: number) => void;
  /** "Bitirdim": metni tamamlandı olarak kaydeder. Kaydedilemezse hata fırlatır. */
  finish: () => Promise<ReadingSessionResult>;
  /** Ekrandan çıkarken çağrılır; bitirilmediyse ilerlemeyi ve süreyi kaydeder. */
  dispose: () => void;
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * Bir metnin okunma oturumunu yönetir: açılınca sunucuda oturum başlatır, aktif okuma süresini
 * ölçer (uygulama arka plandayken sayılmaz), çıkarken ve "Bitirdim"de PATCH'ler.
 */
export function startReadingSession(textId: string): ReadingSessionController {
  let progress = 0;
  let activeMs = 0;
  let activeSince: number | null = AppState.currentState === 'background' ? null : Date.now();
  let finished = false;

  const sessionId: Promise<string | null> = api
    .post<{ id: string }>('/reading-sessions', { textId })
    .then(({ id }) => id)
    .catch((error) => {
      console.warn('Okuma oturumu başlatılamadı:', error);
      return null;
    });

  const durationSeconds = () =>
    Math.round((activeMs + (activeSince === null ? 0 : Date.now() - activeSince)) / 1000);

  const save = async (completed: boolean) => {
    const id = await sessionId;
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
    dispose: () => {
      subscription.remove();
      saveQuietly();
    },
  };
}
