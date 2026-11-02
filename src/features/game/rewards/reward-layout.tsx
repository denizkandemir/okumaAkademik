import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Eyebrow } from '@/design/components/eyebrow';
import { colors, screenPadding, size } from '@/design/tokens';

type RewardLayoutProps = {
  eyebrow: string;
  /** Başlığın üstündeki görsel alan (Pırıl, madalya, sandık). */
  hero: ReactNode;
  title: string;
  /** Başlığın altında soluk, ortalı metin; satırlar alt alta. */
  subtitle?: readonly string[];
  /** Başlığın üstünde, sola dayalı küçük satır (ör. sandıktaki kapat düğmesi). */
  toolbar?: ReactNode;
  /** Alt yazı ile düğmeler arasındaki içerik (kutucuklar, ödül satırları). */
  children?: ReactNode;
  /** Ekranın altındaki düğmeler. */
  actions: ReactNode;
};

/**
 * Ödül ekranlarının ortak düzeni (12-ders-sonucu, 13-seviye-odulu): üst çubuk, ortalanmış üst
 * başlık, görsel, başlık, alt yazı, içerik ve düğmeler. Avatar burada Profil'e götürmez; ödül
 * akışının adımları atlanmasın.
 */
export function RewardLayout({
  eyebrow,
  hero,
  title,
  subtitle,
  toolbar,
  children,
  actions,
}: RewardLayoutProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader profileLink={false} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}>
        <View style={styles.column}>
          {toolbar ? <View style={styles.toolbar}>{toolbar}</View> : null}
          <Eyebrow align="center">{eyebrow}</Eyebrow>
          <View style={styles.hero}>{hero}</View>
          <AppText variant="title" align="center" accessibilityRole="header">
            {title}
          </AppText>
          {subtitle?.length ? (
            <View>
              {subtitle.map((line) => (
                <AppText key={line} color={colors.textMuted} align="center">
                  {line}
                </AppText>
              ))}
            </View>
          ) : null}
          {children ? <View style={styles.body}>{children}</View> : null}
          <View style={styles.actions}>{actions}</View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: 20,
  },
  column: {
    flexGrow: 1,
    width: '100%',
    maxWidth: size.maxContentWidth,
    alignSelf: 'center',
    gap: 12,
  },
  toolbar: {
    flexDirection: 'row',
  },
  hero: {
    alignItems: 'center',
    marginVertical: 8,
  },
  body: {
    gap: 12,
    marginTop: 10,
  },
  // Düğmeler içeriğin hemen ardından gelir (12-ders-sonucu: kutucuklardan sonra 23 px).
  actions: {
    gap: 12,
    marginTop: 11,
  },
});
