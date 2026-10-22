import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { Confetti } from '@/features/mascot/confetti';

/** Ekranın üstünden düşen konfeti (ödül ekranları). Hareketi azalt açıkken çizilmez. */
export function ConfettiLayer({ top = 0 }: { top?: number }) {
  const reduceMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  if (reduceMotion) return null;
  return (
    <View style={[styles.confetti, { top }]}>
      <Confetti size={width / 1.6} />
    </View>
  );
}

type SparkleProps = {
  x: number;
  y: number;
  size: number;
  color?: string;
  delay?: number;
};

/** Parlayan dört köşeli yıldız (S09SeviyeAtladi `okParla`, 1,8 s). Süseldir. */
export function Sparkle({ x, y, size, color = '#FFFFFF', delay = 0 }: SparkleProps) {
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    const half = { duration: 900, easing: Easing.inOut(Easing.quad) };
    pulse.set(
      withDelay(delay, withRepeat(withSequence(withTiming(0, half), withTiming(1, half)), -1)),
    );
    return () => cancelAnimation(pulse);
  }, [pulse, reduceMotion, delay]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.3 + 0.7 * pulse.get(),
    transform: [{ scale: 0.8 + 0.3 * pulse.get() }],
  }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.sparkle, { left: x, top: y }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill={color} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  confetti: {
    position: 'absolute',
    alignSelf: 'center',
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
    pointerEvents: 'none',
  },
});
