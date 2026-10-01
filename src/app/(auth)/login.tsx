import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { MinTouchSize, Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/auth-context';
import { hasErrors, validateSignIn, type FieldErrors } from '@/features/auth/validation';
import { getErrorMessage } from '@/lib/errors';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors<'username' | 'password'>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const nextErrors = validateSignIn({ username, password });
    setErrors(nextErrors);
    setFormError(null);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    try {
      // Giriş başarılı olunca Stack.Protected kullanıcıyı otomatik olarak sekmelere yönlendirir.
      await signIn(username.trim(), password);
    } catch (error) {
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <View style={styles.header}>
          <ThemedText type="title">Okumatik</ThemedText>
          <ThemedText themeColor="textSecondary">Hesabına giriş yap ve okumaya başla!</ThemedText>
        </View>

        <View style={styles.form}>
          <TextField
            label="Kullanıcı adı"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            textContentType="username"
            returnKeyType="next"
          />
          <TextField
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
          />

          {formError ? (
            <ThemedText themeColor="danger" accessibilityRole="alert">
              {formError}
            </ThemedText>
          ) : null}

          <Button title="Giriş yap" onPress={handleSubmit} loading={submitting} />
        </View>

        <View style={styles.footer}>
          <ThemedText themeColor="textSecondary">Hesabın yok mu?</ThemedText>
          <Link href="/register" replace asChild>
            <Pressable accessibilityRole="link" style={styles.link}>
              <ThemedText type="link">Kayıt ol</ThemedText>
            </Pressable>
          </Link>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    gap: Spacing.two,
    marginTop: Spacing.five,
  },
  form: {
    gap: Spacing.three,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    columnGap: Spacing.two,
  },
  link: {
    minHeight: MinTouchSize,
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
});
