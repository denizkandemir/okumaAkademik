import { Stack } from 'expo-router';

/**
 * Karşılama, giriş/kayıt yığınının ilk ekranıdır: oturum kapanınca ya da doğrudan /login açılınca
 * altta karşılama durur, geri tuşu oraya döner.
 */
export const unstable_settings = {
  anchor: 'welcome',
};

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
