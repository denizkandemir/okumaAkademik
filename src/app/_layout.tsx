import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { colors, radius } from '@/design/tokens';
import { AuthProvider, useAuth } from '@/features/auth/auth-context';
import { SplashScreenController } from '@/features/auth/splash-screen-controller';
import { useGameFonts } from '@/features/game/fonts';
import { WelcomeBackGate } from '@/features/welcome-back/welcome-back-gate';

/** Ödül ekranları: tam ekran, başlıksız, kaydırarak kapanmaz. */
const REWARD_SCREEN = { presentation: 'fullScreenModal', gestureEnabled: false } as const;

export default function RootLayout() {
  // Yazı tipleri yüklenmeden metin çizilirse iOS bilinmeyen aile uyarısı verir; açılış ekranı
  // bu sürede açık kalır. Yüklenemezse sistem yazı tipiyle devam edilir (bkz. useGameFonts).
  const fontsReady = useGameFonts();

  return (
    <AuthProvider>
      <SplashScreenController fontsReady={fontsReady} />
      <RootNavigator fontsReady={fontsReady} />
    </AuthProvider>
  );
}

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const { user, isLoading } = useAuth();

  // Oturum okunmadan guard'lar değerlendirilirse açılan derin bağlantı (ör. /reading/x)
  // login'e yönlendirilip kaybolur. Bu sürede açılış ekranı görünür kalır.
  if (isLoading || !fontsReady) return null;

  // Tasarım yalnızca açık temadır (docs/tasarim/README.md, karar 15).
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
          {/* Okuma ekranı kendi üst çubuğunu çizer (kapat, ilerleme, yazı boyutu). */}
          <Stack.Screen name="reading/[id]" />
          {/* Ders kartı alttan açılan sayfa; web'de modal (formSheet yalnızca native). Tutamacı
              ve kapat düğmesini kartın kendi SheetHeader'ı çizer (07-ders-karti). */}
          <Stack.Screen
            name="lesson/[id]/index"
            options={{
              presentation: Platform.OS === 'web' ? 'modal' : 'formSheet',
              sheetAllowedDetents: [0.62, 0.92],
              sheetGrabberVisible: false,
              sheetCornerRadius: radius.sheet,
            }}
          />
          {/* Ders akışı: soru sırasında kaydırarak geri dönülmez (kapat düğmesi onay sorar). */}
          <Stack.Screen name="lesson/[id]/quiz" options={{ gestureEnabled: false }} />
          {/* Ödül ekranları: başlıksız tam ekran modallar; akış DEVAM ET ile ilerler. */}
          <Stack.Screen name="lesson/[id]/complete" options={REWARD_SCREEN} />
          <Stack.Screen name="lesson/[id]/chest" options={REWARD_SCREEN} />
          <Stack.Screen name="level-up" options={REWARD_SCREEN} />
          <Stack.Screen name="city-unlocked" options={REWARD_SCREEN} />
          <Stack.Screen name="finale" options={REWARD_SCREEN} />
          {/* Sertifika kendi geri düğmesini çizer; eve dönüşten ve haritadan açılır. */}
          <Stack.Screen name="certificate" />
          {/* Küçük başarılar: sekme değil, Profil'den açılır; kendi geri düğmesini çizer. */}
          <Stack.Screen name="badges" />
          {/* Ayarlar kendi geri düğmesini çizer; Profil'den açılır. */}
          <Stack.Screen name="settings" />
          {/* Yeniden merhaba: tam ekran; kapat ve Android geri tuşu Yolculuk'a döner. */}
          <Stack.Screen name="welcome-back" options={{ presentation: 'fullScreenModal' }} />
        </Stack.Protected>

        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
      {user ? <WelcomeBackGate /> : null}
    </ThemeProvider>
  );
}
