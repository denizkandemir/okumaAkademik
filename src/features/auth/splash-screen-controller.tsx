import { SplashScreen } from 'expo-router';

import { useAuth } from './auth-context';

SplashScreen.preventAutoHideAsync();

/** Kayıtlı oturum okunana ve yazı tipleri hazır olana kadar açılış ekranını açık tutar. */
export function SplashScreenController({ fontsReady }: { fontsReady: boolean }) {
  const { isLoading } = useAuth();

  if (!isLoading && fontsReady) {
    SplashScreen.hide();
  }

  return null;
}
