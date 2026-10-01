/**
 * Hassas veriler (oturum token'ı vb.) için güvenli depolama sarmalayıcısı.
 * iOS'ta Keychain, Android'de Keystore kullanır.
 *
 * Web'de expo-secure-store desteklenmez; geliştirme kolaylığı için localStorage kullanılır.
 * localStorage şifreli değildir, web üretime çıkarsa httpOnly çerez tercih edilmeli.
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/** SecureStore anahtarları yalnızca harf, rakam, `.`, `-` ve `_` içerebilir. */
export const StorageKeys = {
  authToken: 'okumatik.auth-token',
  authUser: 'okumatik.auth-user',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

const isWeb = Platform.OS === 'web';

function webStorage(): Storage | null {
  try {
    // Statik (sunucu tarafı) render sırasında localStorage yoktur.
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export async function getItem(key: StorageKey): Promise<string | null> {
  if (isWeb) return webStorage()?.getItem(key) ?? null;
  return SecureStore.getItemAsync(key);
}

export async function setItem(key: StorageKey, value: string): Promise<void> {
  if (isWeb) {
    webStorage()?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function removeItem(key: StorageKey): Promise<void> {
  if (isWeb) {
    webStorage()?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function getJSON<T>(key: StorageKey): Promise<T | null> {
  const raw = await getItem(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJSON(key: StorageKey, value: unknown): Promise<void> {
  await setItem(key, JSON.stringify(value));
}
