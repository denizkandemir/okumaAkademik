import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CITIES } from '@/design/cities';
import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Eyebrow } from '@/design/components/eyebrow';
import { colors, screenPadding, size } from '@/design/tokens';
import type { CityId } from '@/features/game/theme';
import { Mascot } from '@/features/mascot/mascot';
import type { MascotPose } from '@/features/mascot/types';

/** Kahraman görselin ekran yüksekliğine oranı (14-sehir-acilisi). */
const HERO_RATIO = 0.45;

type CityHeroLayoutProps = {
  city: CityId;
  pose: MascotPose;
  mascotLabel: string;
  eyebrow: string;
  title: string;
  /** Başlığın altında soluk, ortalı metin; satırlar alt alta. */
  lines: readonly string[];
  /** Metin ile düğmeler arasındaki içerik (ör. bilgi hapları). */
  children?: ReactNode;
  /** Ekranın altındaki düğmeler. */
  actions: ReactNode;
  /** Varsayılan `true`: üstte AppHeader. Karşılamada oturum olmadığı için kapalıdır. */
  header?: boolean;
  /** Kahraman görselin ekran yüksekliğine oranı; varsayılan 0,45. */
  heroRatio?: number;
  /** Pırıl'ın en büyük boyutu ve kahraman yüksekliğine oranı; varsayılan 170 ve 0,55. */
  mascotMax?: number;
  mascotRatio?: number;
};

/**
 * Şehir arka planlı ekranların ortak düzeni (14-sehir-acilisi, 24-eve-donus, 15-karsilama): şehrin üst
 * kısmı ekran zeminine kaybolur, Pırıl üstünde durur; altında üst başlık, başlık, metin ve düğmeler.
 */
export function CityHeroLayout({
  city,
  pose,
  mascotLabel,
  eyebrow,
  title,
  lines,
  children,
  actions,
  header = true,
  heroRatio = HERO_RATIO,
  mascotMax = 170,
  mascotRatio = 0.55,
}: CityHeroLayoutProps) {
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const heroHeight = Math.round(window.height * heroRatio);
  const mascotSize = Math.min(mascotMax, Math.round(heroHeight * mascotRatio));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {header ? <AppHeader profileLink={false} /> : null}
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}>
        <View style={[styles.hero, { height: heroHeight }]}>
          <Image
            source={CITIES[city].background}
            contentFit="cover"
            contentPosition="top"
            recyclingKey={city}
            style={StyleSheet.absoluteFill}
            accessible={false}
          />
          <LinearGradient
            colors={[colors.transparent, colors.background]}
            locations={[0.55, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.mascot}>
            <Mascot pose={pose} size={mascotSize} accessibilityLabel={mascotLabel} />
          </View>
        </View>

        <View style={styles.copy}>
          <Eyebrow align="center">{eyebrow}</Eyebrow>
          <AppText variant="display" align="center" accessibilityRole="header">
            {title}
          </AppText>
          <View>
            {lines.map((line) => (
              <AppText key={line} color={colors.textMuted} align="center">
                {line}
              </AppText>
            ))}
          </View>
          {children}
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
  },
  hero: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.map.ground,
  },
  mascot: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  copy: {
    width: '100%',
    maxWidth: size.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: screenPadding,
    paddingTop: 8,
    gap: 12,
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
});
