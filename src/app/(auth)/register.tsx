import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { TextField } from '@/components/text-field';
import { useAuth } from '@/features/auth/auth-context';
import {
  AuthFooterLink,
  AuthFormLayout,
  PasswordVisibilityButton,
} from '@/features/auth/auth-form-layout';
import { GradePicker } from '@/features/auth/grade-picker';
import type { Grade } from '@/features/auth/types';
import {
  hasErrors,
  pickFieldErrors,
  validateSignUp,
  type FieldErrors,
} from '@/features/auth/validation';
import { GameButton } from '@/features/game/ui/game-button';
import { GameText } from '@/features/game/ui/game-text';
import { ApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

const FIELDS = ['name', 'username', 'password', 'grade'] as const;
type Field = (typeof FIELDS)[number];

const GREETING = 'Seni tanıyalım! Adın ne, kaçıncı sınıftasın?';

/** İlk hatayı Pırıl'ın ağzından, çocuğa uygun bir dille söyler; hata yoksa `null`. */
function errorBubble(errors: FieldErrors<Field>, formError: string | null) {
  if (formError) return `Hımm, olmadı! ${formError}`;
  if (errors.name) return 'Hımm, önce adını söyler misin?';
  if (errors.username) return `Kullanıcı adına bir bakalım: ${errors.username}`;
  if (errors.password) return `Şifrene bir bakalım: ${errors.password}`;
  if (errors.grade) return 'Kaçıncı sınıfta olduğunu seçer misin?';
  return null;
}

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
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

  const problem = errorBubble(errors, formError);

  return (
    <AuthFormLayout
      pose={problem ? 'think' : 'wave'}
      bubble={problem ?? GREETING}
      title="Kayıt ol"
      footer={<AuthFooterLink prompt="Zaten hesabın var mı?" label="Giriş yap" href="/login" />}>
      <TextField
        variant="game"
        label="Adın"
        placeholder="Adını yaz"
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
        variant="game"
        label="Kullanıcı adın"
        placeholder="ör. ayse.k"
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
        variant="game"
        label="Şifren"
        placeholder="En az 4 karakter"
        maxLength={128}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        trailing={
          <PasswordVisibilityButton
            visible={showPassword}
            onToggle={() => setShowPassword((value) => !value)}
          />
        }
      />
      <GradePicker value={grade} onChange={setGrade} error={errors.grade} />

      {formError ? (
        <GameText variant="caption" color={ERROR_COLOR} accessibilityRole="alert">
          {formError}
        </GameText>
      ) : null}

      <GameButton
        title="KAYIT OL"
        accessibilityLabel="Kayıt ol"
        size="md"
        onPress={handleSubmit}
        loading={submitting}
        style={styles.button}
      />
    </AuthFormLayout>
  );
}

const ERROR_COLOR = '#B42318';

const styles = StyleSheet.create({
  button: {
    marginTop: 2,
  },
});
