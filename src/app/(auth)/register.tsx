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
import {
  hasErrors,
  pickFieldErrors,
  validateSignUp,
  type FieldErrors,
} from '@/features/auth/validation';
import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';
import { ApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

const FIELDS = ['name', 'username', 'password', 'grade'] as const;
type Field = (typeof FIELDS)[number];

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<Grade | null>(null);
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mascotTalking, setMascotTalking] = useState(false);

  const handleSubmit = async () => {
    const nextErrors = validateSignUp({ name, username, password, grade });
    setErrors(nextErrors);
    setFormError(null);
    if (hasErrors(nextErrors) || grade == null) return;

    setSubmitting(true);
    try {
      await signUp({ name: name.trim(), username: username.trim(), password, grade });
    } catch (error) {
      // Sunucu alan hatası döndürdüyse (ör. "Bu kullanıcı adı alınmış") ilgili alanın altında göster.
      const serverErrors = pickFieldErrors(
        error instanceof ApiError ? error.fieldErrors : undefined,
        FIELDS,
      );
      if (serverErrors) setErrors(serverErrors);
      else setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <View style={styles.mascotRow}>
          <Mascot pose="talk" size={130} talking={mascotTalking} />
          <MascotBubble
            text="Seni tanımak istiyorum! Adın ne?"
            side="right"
            onTypingChange={setMascotTalking}
          />
        </View>

        <View style={styles.header}>
          <ThemedText type="title">Kayıt ol</ThemedText>
          <ThemedText themeColor="textSecondary">
            Birkaç bilgi yeterli, hemen okumaya başlayalım!
          </ThemedText>
        </View>

        <View style={styles.form}>
          <TextField
            label="Adın"
            maxLength={40}
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
            maxLength={20}
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
            maxLength={128}
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
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  header: {
    gap: Spacing.two,
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
