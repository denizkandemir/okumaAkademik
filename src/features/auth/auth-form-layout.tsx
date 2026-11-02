import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { AppText } from '@/design/components/app-text';
import { Eyebrow } from '@/design/components/eyebrow';
import { IconButton } from '@/design/components/icon-button';
import { Screen } from '@/design/components/screen';
import { BackIcon } from '@/design/icons';
import { colors } from '@/design/tokens';
import { Mascot } from '@/features/mascot/mascot';

/** Panoda 115×125; ortada küçük Pırıl. */
const MASCOT_SIZE = 125;

type AuthFormLayoutProps = {
  eyebrow: string;
  title: string;
  /** Başlığın altında soluk açıklama. */
  text?: string;
  /** Alanlar, hata kutusu ve ana düğme. */
  children: ReactNode;
  /** Formun altında (ör. "Yeni bir yolculuk başlat" bağlantısı). */
  footer?: ReactNode;
};

/**
 * Giriş ve kayıt ekranlarının ortak düzeni (16-kayit): geri düğmesi, ortada el sallayan Pırıl,
 * üst başlık, başlık, açıklama ve form. Klavye açılınca içerik kaydırılabilir kalır.
 */
export function AuthFormLayout({ eyebrow, title, text, children, footer }: AuthFormLayoutProps) {
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/welcome');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <IconButton accessibilityLabel="Geri" onPress={goBack} style={styles.back}>
          <BackIcon />
        </IconButton>
        <View style={styles.mascot}>
          <Mascot pose="wave" size={MASCOT_SIZE} accessibilityLabel="Pırıl el sallıyor" />
        </View>
        <View style={styles.heading}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <AppText variant="title" accessibilityRole="header">
            {title}
          </AppText>
          {text ? <AppText color={colors.textMuted}>{text}</AppText> : null}
        </View>
        <View style={styles.form}>{children}</View>
        {footer}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  back: {
    alignSelf: 'flex-start',
  },
  mascot: {
    alignItems: 'center',
  },
  heading: {
    gap: 10,
  },
  form: {
    gap: 18,
    marginTop: 8,
  },
});
