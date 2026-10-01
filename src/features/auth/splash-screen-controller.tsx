import { SplashScreen } from 'expo-router';

import { useAuth } from './auth-context';

SplashScreen.preventAutoHideAsync();

/** Kayıtlı oturum okunana kadar açılış ekranını açık tutar. */
export function SplashScreenController() {
  const { isLoading } = useAuth();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
}
