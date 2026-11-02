import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import type { CityId } from '../theme';

import { CITIES } from '@/design/cities';
import { AppText } from '@/design/components/app-text';
import { Eyebrow } from '@/design/components/eyebrow';
import { colors, radius, size } from '@/design/tokens';

/**
 * Haritanın sonundaki kart. `next`: bir sonraki şehir ("Şehri önizle ↗"); `last`: Van, yolculuğun
 * son durağı ("SON DURAK · Eve dönüş"); `finished`: yolculuk bitti.
 */
export type NextStop =
  { kind: 'next'; city: CityId } | { kind: 'last' } | { kind: 'finished'; city: CityId | null };

export function NextStopCard({
  nextStop,
  onPreview,
}: {
  nextStop: NextStop;
  onPreview: (city: CityId) => void;
}) {
  const last = nextStop.kind === 'last' || (nextStop.kind === 'finished' && !nextStop.city);
  const city = nextStop.kind === 'last' ? null : nextStop.city;

  return (
    <View style={styles.card}>
      <Eyebrow align="center">{last ? 'SON DURAK' : 'SONRAKİ DURAK'}</Eyebrow>
      <AppText variant="heading" align="center">
        {city ? CITIES[city].name : 'Eve dönüş'}
      </AppText>
      {nextStop.kind === 'finished' ? (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Sertifikamı gör"
          onPress={() => router.push('/certificate')}
          hitSlop={6}
          style={styles.link}>
          <AppText variant="bodyStrong" color={colors.accent}>
            Sertifikamı gör ↗
          </AppText>
        </Pressable>
      ) : null}
      {nextStop.kind === 'next' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${CITIES[nextStop.city].name} şehrini önizle`}
          onPress={() => onPreview(nextStop.city)}
          hitSlop={6}
          style={styles.link}>
          <AppText variant="bodyStrong" color={colors.accent}>
            Şehri önizle ↗
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 6,
    padding: 18,
    backgroundColor: colors.map.nextStop,
    borderWidth: 1,
    borderColor: colors.map.nextStopBorder,
    borderRadius: radius.cardLarge,
  },
  link: {
    minHeight: size.touch,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});
