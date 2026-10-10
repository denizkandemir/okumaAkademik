import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';
import { Platform } from 'react-native';

import * as authService from './auth-service';
import type { AuthResponse, SignUpInput, User } from './types';

import { API_URL, ApiError, setAuthToken, setUnauthorizedHandler } from '@/lib/api';
import * as storage from '@/lib/storage';

/**
 * Açılışta oturum doğrulaması bu süreden uzun sürerse yerel kullanıcıyla devam edilir.
 * Açılış ekranı bu istek bitene kadar açık kaldığından kısa tutulur.
 */
const SESSION_CHECK_TIMEOUT_MS = 4_000;

type AuthContextValue = {
  user: User | null;
  /** Kayıtlı oturum okunup doğrulanırken `true`. */
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useAuth, <AuthProvider> içinde kullanılmalı.');
  }
  return value;
}

async function persistSession({ token, user }: AuthResponse) {
  await storage.setItem(storage.StorageKeys.authToken, token);
  await storage.setJSON(storage.StorageKeys.authUser, user);
}

async function clearStoredSession() {
  await storage.removeItem(storage.StorageKeys.authToken);
  await storage.removeItem(storage.StorageKeys.authUser);
}

/** Geliştirmede, açılıştaki oturum kontrolü sunucuya ulaşamazsa nedenini tek uyarıyla bildirir. */
function warnUnreachableApi(error: unknown) {
  const pointsToSelf = /\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(API_URL);
  const hint =
    pointsToSelf && Platform.OS !== 'web'
      ? ` Telefon "localhost"a ulaşamaz; .env içinde bilgisayarın yerel ağ IP'sini kullanın (ipconfig).`
      : ' Sunucunun çalıştığını ve telefonla aynı ağda olduğunu kontrol edin.';
  console.warn(
    `Açılışta oturum doğrulanamadı (${API_URL}/me); kayıtlı kullanıcıyla devam ediliyor.${hint}`,
    error instanceof Error ? error.message : error,
  );
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const startSession = async (response: AuthResponse) => {
    await persistSession(response);
    setAuthToken(response.token);
    setUser(response.user);
  };

  /** Yalnızca cihazdaki oturumu siler; sunucuya istek atmaz (ör. 401 alındığında). */
  const clearLocalSession = async () => {
    setAuthToken(null);
    setUser(null);
    await clearStoredSession().catch((error) => console.warn('Oturum silinemedi:', error));
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch {
      // Sunucuya ulaşılamasa da cihazda çıkış yapılır; token 30 gün içinde kendiliğinden düşer.
    }
    await clearLocalSession();
  };

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const [token, storedUser] = await Promise.all([
        storage.getItem(storage.StorageKeys.authToken),
        storage.getJSON<User>(storage.StorageKeys.authUser),
      ]);
      if (!token || cancelled) return;
      setAuthToken(token);

      try {
        const freshUser = await authService.fetchCurrentUser({
          timeoutMs: SESSION_CHECK_TIMEOUT_MS,
        });
        if (cancelled) return;
        setUser(freshUser);
        await storage.setJSON(storage.StorageKeys.authUser, freshUser);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401) {
          await clearLocalSession();
          return;
        }
        // Ağ ya da sunucu hatası: çocuk internet yokken çıkışa atılmasın, yerel kullanıcıyla devam.
        if (__DEV__) warnUnreachableApi(error);
        if (storedUser) setUser(storedUser);
      }
    };

    restoreSession()
      .catch((error) => console.warn('Oturum yüklenemedi:', error))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => void clearLocalSession());
    return () => setUnauthorizedHandler(null);
  });

  const value: AuthContextValue = {
    user,
    isLoading,
    signIn: async (username, password) =>
      startSession(await authService.signIn({ username, password })),
    signUp: async (input) => startSession(await authService.signUp(input)),
    signOut,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
