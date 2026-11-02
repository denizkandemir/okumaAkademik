import { Image } from 'expo-image';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { CITIES } from '../cities';
import { colors } from '../tokens';

import type { CityId } from '@/features/game/theme';

export type CityImageProps = {
  city: CityId;
  /** Kilitli / kazanılmamış: gri tonlu ve soluk. */
  muted?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Şehir arka planından bir kesit (Kitaplık kartı, Pasaport kartı). Panodaki gibi üstten %20'ye
 * hizalanır; her şehir için tek kaynak kullanılır, expo-image önbelleğe alır. Süseldir.
 *
 * iOS'ta RN `filter` gri tonu desteklemez; orada soluklaştırma yalnızca opaklık ve zemin renginde
 * bir perdeyle yapılır.
 */
export function CityImage({ city, muted = false, style }: CityImageProps) {
  return (
    <View
      style={[styles.frame, style]}
      accessible={false}
      importantForAccessibility="no-hide-descendants">
      <Image
        source={CITIES[city].background}
        contentFit="cover"
        contentPosition={{ top: '20%', left: '50%' }}
        recyclingKey={city}
        style={[StyleSheet.absoluteFill, muted && styles.muted]}
      />
      {muted ? <View style={[StyleSheet.absoluteFill, styles.veil]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: colors.map.ground,
  },
  muted: {
    opacity: 0.48,
    ...(Platform.OS === 'ios' ? null : { filter: [{ grayscale: 1 }] }),
  },
  veil: {
    backgroundColor: colors.background,
    opacity: 0.3,
  },
});
