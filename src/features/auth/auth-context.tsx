import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

import * as authService from './auth-service';
import type { AuthResponse, SignUpInput, User } from './types';

import { setAuthToken, setUnauthorizedHandler } from '@/lib/api';
import * as storage from '@/lib/storage';

type AuthContextValue = {
  user: User | null;
  /** Kayıtlı oturum depodan okunurken `true`. */
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

async function clearSession() {
  await storage.removeItem(storage.StorageKeys.authToken);
  await storage.removeItem(storage.StorageKeys.authUser);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const startSession = async (response: AuthResponse) => {
    await persistSession(response);
    setAuthToken(response.token);
    setUser(response.user);
  };

  const signOut = async () => {
    setAuthToken(null);
    setUser(null);
    await Promise.allSettled([authService.signOut(), clearSession()]);
  };

  useEffect(() => {
    let cancelled = false;

    // Task 2: Kayıtlı token ile `GET /me` çağrılıp kullanıcı sunucudan doğrulanacak.
    Promise.all([
      storage.getItem(storage.StorageKeys.authToken),
      storage.getJSON<User>(storage.StorageKeys.authUser),
    ])
      .then(([token, storedUser]) => {
        if (cancelled || !token || !storedUser) return;
        setAuthToken(token);
        setUser(storedUser);
      })
      .catch((error) => console.warn('Oturum yüklenemedi:', error))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => void signOut());
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
