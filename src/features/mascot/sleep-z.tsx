import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const BRAND_BLUE = '#2453C9';
const CYCLE_MS = 2700;
const LETTERS = [0, 1, 2];

/** Uyuyan Pırıl'ın başının üstünden yükselip kaybolan "Z" harfleri. */
export function SleepZ({ size }: { size: number }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}>
      {LETTERS.map((index) => (
        <Letter key={index} delay={(index * CYCLE_MS) / LETTERS.length} size={size} />
      ))}
    </View>
  );
}

function Letter({ delay, size }: { delay: number; size: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withDelay(
        delay,
        withRepeat(
          withTiming(1, { duration: CYCLE_MS, easing: Easing.out(Easing.quad) }),
          -1,
          false,
        ),
      ),
    );
    return () => cancelAnimation(progress);
  }, [delay, progress]);

  const fontSize = Math.max(size * 0.13, 12);

  const style = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      opacity: p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8,
      transform: [
        // Başın sağ üstünden (görselde baş solda) sağa ve yukarı doğru yükselir.
        { translateX: size * 0.5 + p * size * 0.2 + Math.sin(p * Math.PI * 2) * size * 0.03 },
        { translateY: size * 0.12 - p * size * 0.32 },
        { scale: 0.6 + p * 0.6 },
      ],
    };
  });

  return (
    <Animated.Text style={[styles.letter, { fontSize, lineHeight: fontSize * 1.2 }, style]}>
      Z
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  letter: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    color: BRAND_BLUE,
    fontWeight: 800,
  },
});
