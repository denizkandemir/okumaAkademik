import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { MinTouchSize, Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/auth-context';
import { GradePicker } from '@/features/auth/grade-picker';
import type { Grade } from '@/features/auth/types';
import { hasErrors, validateSignUp, type FieldErrors } from '@/features/auth/validation';
import { getErrorMessage } from '@/lib/errors';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<Grade | null>(null);
  const [errors, setErrors] = useState<FieldErrors<'name' | 'username' | 'password' | 'grade'>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const nextErrors = validateSignUp({ name, username, password, grade });
    setErrors(nextErrors);
    setFormError(null);
    if (hasErrors(nextErrors) || grade == null) return;

    setSubmitting(true);
    try {
      await signUp({ name: name.trim(), username: username.trim(), password, grade });
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
          <ThemedText type="title">Kayıt ol</ThemedText>
          <ThemedText themeColor="textSecondary">
            Birkaç bilgi yeterli, hemen okumaya başlayalım!
          </ThemedText>
        </View>

        <View style={styles.form}>
          <TextField
            label="Adın"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            returnKeyType="next"
          />
          <TextField
            label="Kullanıcı adı"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username-new"
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
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <GradePicker value={grade} onChange={setGrade} error={errors.grade} />

          {formError ? (
            <ThemedText themeColor="danger" accessibilityRole="alert">
              {formError}
            </ThemedText>
          ) : null}

          <Button title="Kayıt ol" onPress={handleSubmit} loading={submitting} />
        </View>

        <View style={styles.footer}>
          <ThemedText themeColor="textSecondary">Zaten hesabın var mı?</ThemedText>
          <Link href="/login" replace asChild>
            <Pressable accessibilityRole="link" style={styles.link}>
              <ThemedText type="link">Giriş yap</ThemedText>
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
    marginTop: Spacing.four,
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
