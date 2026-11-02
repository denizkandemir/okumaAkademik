import { router } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/design/components/button';
import { FeedbackPanel } from '@/design/components/feedback-panel';
import { TextField } from '@/design/components/text-field';
import { TextLink } from '@/design/components/text-link';
import { useAuth } from '@/features/auth/auth-context';
import { AuthFormLayout } from '@/features/auth/auth-form-layout';
import { GradePicker } from '@/features/auth/grade-picker';
import type { Grade } from '@/features/auth/types';
import {
  hasErrors,
  pickFieldErrors,
  validateSignUp,
  type FieldErrors,
} from '@/features/auth/validation';
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

  const handleSubmit = async () => {
    // Düğme ve klavyedeki "git" birlikte basılınca ikinci istek gitmesin.
    if (submitting) return;
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
    <AuthFormLayout
      eyebrow="YOLA ÇIKMADAN ÖNCE"
      title="Sana nasıl seslenelim?"
      text="Keşif pasaportunu birlikte hazırlayalım."
      footer={
        // Bağlantı ekranı değiştirir (geri yığını büyümez).
        <TextLink title="Zaten bir yolculuğum var" onPress={() => router.replace('/login')} />
      }>
      <TextField
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
      <GradePicker value={grade} onChange={setGrade} error={errors.grade} />
      <TextField
        label="Kullanıcı adı"
        helper="Giriş yaparken bunu kullanacaksın."
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
        label="Şifre"
        placeholder="En az 4 karakter"
        maxLength={128}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secure
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
      />

      {formError ? <FeedbackPanel tone="wrong" title="Hımm, olmadı!" text={formError} /> : null}

      <Button
        title="PASAPORTUMU HAZIRLA"
        accessibilityLabel="Pasaportumu hazırla"
        onPress={handleSubmit}
        loading={submitting}
      />
    </AuthFormLayout>
  );
}
