import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { TextField } from '@/components/text-field';
import { useAuth } from '@/features/auth/auth-context';
import {
  AuthFooterLink,
  AuthFormLayout,
  PasswordVisibilityButton,
} from '@/features/auth/auth-form-layout';
import { hasErrors, validateSignIn, type FieldErrors } from '@/features/auth/validation';
import { GameText } from '@/features/game/ui/game-text';
import { GameButton } from '@/features/game/ui/game-button';
import { getErrorMessage } from '@/lib/errors';

const GREETING = 'Tekrar hoş geldin! Kullanıcı adını yazar mısın?';

/** Hatayı Pırıl'ın ağzından, çocuğa uygun bir dille söyler; hata yoksa `null`. */
function errorBubble(errors: FieldErrors<'username' | 'password'>, formError: string | null) {
  if (formError) return `Hımm, olmadı! ${formError}`;
  if (errors.username && errors.password) {
    return 'Hımm, kullanıcı adını ve şifreni yazmayı unuttun galiba.';
  }
  if (errors.username) return 'Hımm, önce kullanıcı adını yazar mısın?';
  if (errors.password) return 'Şifreni de yazar mısın? Sonra hemen başlarız!';
  return null;
}

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<'username' | 'password'>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mascotTalking, setMascotTalking] = useState(false);

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

  const problem = errorBubble(errors, formError);

  return (
    <AuthFormLayout
      pose={problem ? 'think' : 'talk'}
      talking={!problem && mascotTalking}
      bubble={problem ?? GREETING}
      onBubbleTypingChange={setMascotTalking}
      title="Giriş yap"
      footer={<AuthFooterLink prompt="Hesabın yok mu?" label="Kayıt ol" href="/register" />}>
      <TextField
        variant="game"
        label="Kullanıcı adın"
        placeholder="Kullanıcı adını yaz"
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
        variant="game"
        label="Şifren"
        placeholder="Şifreni yaz"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        trailing={
          <PasswordVisibilityButton
            visible={showPassword}
            onToggle={() => setShowPassword((value) => !value)}
          />
        }
      />

      {formError ? (
        <GameText variant="caption" color={ERROR_COLOR} accessibilityRole="alert">
          {formError}
        </GameText>
      ) : null}

      <GameButton
        title="GİRİŞ YAP"
        accessibilityLabel="Giriş yap"
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
