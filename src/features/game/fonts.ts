import { Baloo2_700Bold } from '@expo-google-fonts/baloo-2/700Bold';
import { Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2/800ExtraBold';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { Literata_400Regular } from '@expo-google-fonts/literata/400Regular';
import { Literata_400Regular_Italic } from '@expo-google-fonts/literata/400Regular_Italic';
import { Literata_600SemiBold } from '@expo-google-fonts/literata/600SemiBold';
import { NunitoSans_400Regular } from '@expo-google-fonts/nunito-sans/400Regular';
import { NunitoSans_600SemiBold } from '@expo-google-fonts/nunito-sans/600SemiBold';
import { NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans/700Bold';
import { NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans/800ExtraBold';
import { NunitoSans_900Black } from '@expo-google-fonts/nunito-sans/900Black';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';

import { GameFonts } from './theme';

import { fonts } from '@/design/tokens';

/** Yalnızca tasarımda kullanılan kalınlıklar yüklenir (her biri ayrı bir dosya). */
const FONT_MAP = {
  // Eski oyun tasarımı (T06'da kaldırılır).
  [GameFonts.heading]: Baloo2_700Bold,
  [GameFonts.headingHeavy]: Baloo2_800ExtraBold,
  [GameFonts.body]: Nunito_600SemiBold,
  [GameFonts.bodyBold]: Nunito_700Bold,
  [GameFonts.bodyHeavy]: Nunito_800ExtraBold,
  // "Pırıl'ın Atlası": arayüz Nunito Sans, okuma metni Literata.
  [fonts.sans]: NunitoSans_400Regular,
  [fonts.sansSemiBold]: NunitoSans_600SemiBold,
  [fonts.sansBold]: NunitoSans_700Bold,
  [fonts.sansExtraBold]: NunitoSans_800ExtraBold,
  [fonts.sansBlack]: NunitoSans_900Black,
  [fonts.serif]: Literata_400Regular,
  [fonts.serifItalic]: Literata_400Regular_Italic,
  [fonts.serifSemiBold]: Literata_600SemiBold,
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
