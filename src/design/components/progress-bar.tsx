import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion, size } from '../tokens';

export type ProgressBarProps = {
  /** 0-1. */
  progress: number;
  /** Ekran okuyucu için, ör. "3 dersten 1'i tamamlandı". */
  accessibilityLabel: string;
  /** Varsayılan 6 (soru ekranı); harita kartında 4. */
  height?: number;
  style?: StyleProp<ViewStyle>;
};

/** Adaçayı dolgulu ince ilerleme çubuğu. Değişince yumuşakça dolar (hareketi azalt: anında). */
export function ProgressBar({
  progress,
  accessibilityLabel,
  height = size.progress,
  style,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const reduceMotion = useReducedMotion();
  const value = useSharedValue(clamped);

  useEffect(() => {
    value.set(reduceMotion ? clamped : withTiming(clamped, { duration: motion.progress }));
  }, [clamped, reduceMotion, value]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${value.get() * 100}%` }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: height }, style]}>
      <Animated.View style={[styles.fill, { borderRadius: height }, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.progress.track,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.progress.fill,
  },
});
