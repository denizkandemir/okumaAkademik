import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { horizontal, type Gradient } from '../theme';

/** Tasarımdaki dolgular (kaynak/*.dc.html). */
export const ProgressFills = {
  /** Başlık kartı (renkli zemin üzerinde) */
  gold: horizontal('#FFF0A8', '#FFC23A'),
  /** Soru başlığı */
  purple: horizontal('#9B6BFF', '#5B34D6'),
  /** Seviye kartı (koyu zemin üzerinde) */
  mint: horizontal('#7CFFD4', '#3BE8B0'),
  /** Harita kartı */
  sky: horizontal('#36C5E8', '#0A6FB8'),
} as const;

/** Tasarımdaki zeminler. */
export const ProgressTracks = {
  /** Renkli kart üzerinde yarı saydam beyaz */
  onColor: 'rgba(255,255,255,0.28)',
  /** Koyu kart üzerinde */
  onDark: 'rgba(255,255,255,0.2)',
  /** Krem/beyaz zemin üzerinde */
  cream: '#EFE2CF',
  sky: '#DCEFF8',
} as const;

export type ProgressTrackProps = {
  /** 0-1 arası; dışındaki değerler sınırlanır. */
  progress: number;
  /** Varsayılan 10 (başlık kartı); soru başlığı 14, seviye kartı 12. */
  height?: number;
  fill?: Gradient;
  trackColor?: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Gradyan dolgulu yuvarlak ilerleme çubuğu. Değer değişince dolgu 400 ms'de kayar; sistemin
 * "hareketi azalt" ayarı açıksa Reanimated geçişi atlar ve dolgu doğrudan yerine gelir.
 */
export function ProgressTrack({
  progress,
  height = 10,
  fill = ProgressFills.gold,
  trackColor = ProgressTracks.onColor,
  accessibilityLabel,
  style,
}: ProgressTrackProps) {
  const clamped = Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 0;
  const width = useSharedValue(clamped);

  useEffect(() => {
    width.set(withTiming(clamped, { duration: 400, easing: Easing.out(Easing.cubic) }));
  }, [clamped, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${width.get() * 100}%` }));
  const radius = height / 2;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: radius, backgroundColor: trackColor }, style]}>
      <Animated.View style={[styles.fill, { borderRadius: radius }, fillStyle]}>
        <LinearGradient
          colors={fill.colors}
          start={fill.start}
          end={fill.end}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    flexGrow: 1,
  },
  fill: {
    height: '100%',
    overflow: 'hidden',
  },
});
