import { Baloo2_700Bold } from '@expo-google-fonts/baloo-2/700Bold';
import { Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2/800ExtraBold';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';

import { GameFonts } from './theme';

/** Yalnızca tasarımda kullanılan kalınlıklar yüklenir (her biri ayrı bir dosya). */
const FONT_MAP = {
  [GameFonts.heading]: Baloo2_700Bold,
  [GameFonts.headingHeavy]: Baloo2_800ExtraBold,
  [GameFonts.body]: Nunito_600SemiBold,
  [GameFonts.bodyBold]: Nunito_700Bold,
  [GameFonts.bodyHeavy]: Nunito_800ExtraBold,
};

/** Yazı tipleri bu sürede yüklenemezse sistem yazı tipiyle devam edilir. */
const FONT_TIMEOUT_MS = 4_000;

/**
 * Oyun yazı tiplerini yükler. Yüklendiğinde, hata verdiğinde ya da zaman aşımında `true` döner;
 * açılış ekranı bu süre boyunca açık kalır. Hata olursa uygulama sistem yazı tipiyle çalışır.
 */
export function useGameFonts(): boolean {
  const [loaded, error] = useFonts(FONT_MAP);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (loaded || error) return;
    const timer = setTimeout(() => setTimedOut(true), FONT_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [loaded, error]);

  useEffect(() => {
    if (error) console.warn('Yazı tipleri yüklenemedi, sistem yazı tipi kullanılıyor:', error);
    else if (timedOut && !loaded)
      console.warn('Yazı tipleri zamanında yüklenemedi, devam ediliyor.');
  }, [error, timedOut, loaded]);

  return loaded || !!error || timedOut;
}
