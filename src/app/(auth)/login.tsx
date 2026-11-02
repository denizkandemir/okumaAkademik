import { router } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/design/components/button';
import { FeedbackPanel } from '@/design/components/feedback-panel';
import { TextField } from '@/design/components/text-field';
import { TextLink } from '@/design/components/text-link';
import { useAuth } from '@/features/auth/auth-context';
import { AuthFormLayout } from '@/features/auth/auth-form-layout';
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
    // Düğme ve klavyedeki "git" birlikte basılınca ikinci istek gitmesin.
    if (submitting) return;
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
    <AuthFormLayout
      eyebrow="TEKRAR HOŞ GELDİN"
      title="Yolculuğuna devam et"
      footer={
        // Bağlantı ekranı değiştirir (geri yığını büyümez).
        <TextLink title="Yeni bir yolculuk başlat" onPress={() => router.replace('/register')} />
      }>
      <TextField
        label="Kullanıcı adı"
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
        label="Şifre"
        placeholder="Şifreni yaz"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secure
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
      />

      {formError ? <FeedbackPanel tone="wrong" title="Hımm, olmadı!" text={formError} /> : null}

      <Button
        title="YOLA DEVAM ET"
        accessibilityLabel="Yola devam et"
        onPress={handleSubmit}
        loading={submitting}
      />
    </AuthFormLayout>
  );
}
