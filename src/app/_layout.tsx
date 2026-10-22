import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { AuthProvider, useAuth } from '@/features/auth/auth-context';
import { SplashScreenController } from '@/features/auth/splash-screen-controller';
import { useGameFonts } from '@/features/game/fonts';
import { useTheme } from '@/hooks/use-theme';

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
  const colors = useTheme();

  // Oturum okunmadan guard'lar değerlendirilirse açılan derin bağlantı (ör. /reading/x)
  // login'e yönlendirilip kaybolur. Bu sürede açılış ekranı görünür kalır.
  if (isLoading || !fontsReady) return null;

  // Oyun tasarımı yalnızca açık temadır.
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
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
          {/* Ders kartı alttan açılan sayfa; web'de modal (formSheet yalnızca native). */}
          <Stack.Screen
            name="lesson/[id]/index"
            options={{
              presentation: Platform.OS === 'web' ? 'modal' : 'formSheet',
              sheetAllowedDetents: [0.62, 0.92],
              sheetGrabberVisible: true,
              sheetCornerRadius: 30,
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
          <Stack.Screen
            name="journey-map"
            options={{ headerShown: true, title: '', headerBackTitle: 'Geri' }}
          />
        </Stack.Protected>

        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
