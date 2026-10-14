import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { GameColors } from '../theme';
import { StarIcon } from './icons';

export type StarRowProps = {
  /** Dolu yıldız sayısı, 0-3. */
  filled: number;
  /** Yan yıldızların boyu; ortadaki %23 daha büyük ve yukarıda (tasarımda 52 / 64). */
  size?: number;
  /** `true` olunca dolu yıldızlar sırayla "pop" ile belirir (ders sonu ekranı). */
  animate?: boolean;
};

const POP_STAGGER_MS = 180;

/** 3 yıldız; dolu olanlar altın, boşlar krem. Hareketi azalt açıksa animasyon olmaz. */
export function StarRow({ filled, size = 52, animate = false }: StarRowProps) {
  const count = Math.min(Math.max(Math.round(filled), 0), 3);
  const middle = Math.round(size * (64 / 52));
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`3 yıldızdan ${count} yıldız`}
      style={[styles.row, { gap: Math.round(size * 0.15) }]}>
      {[0, 1, 2].map((index) => (
        <Star
          key={index}
          index={index}
          on={index < count}
          size={index === 1 ? middle : size}
          raise={index === 1 ? Math.round(size * (10 / 52)) : 0}
          animate={animate}
        />
      ))}
    </View>
  );
}

type StarProps = { index: number; on: boolean; size: number; raise: number; animate: boolean };

function Star({ index, on, size, raise, animate }: StarProps) {
  const reduceMotion = useReducedMotion();
  const shouldPop = animate && on && !reduceMotion;
  const scale = useSharedValue(shouldPop ? 0 : 1);

  useEffect(() => {
    if (!shouldPop) {
      scale.set(1);
      return;
    }
    scale.set(0);
    scale.set(
      withDelay(
        index * POP_STAGGER_MS,
        withSequence(
          withTiming(1.25, { duration: 180 }),
          withSpring(1, { damping: 8, stiffness: 180 }),
        ),
      ),
    );
  }, [shouldPop, index, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Animated.View style={[{ marginTop: -raise }, style]}>
      <StarIcon
        size={size}
        fill={on ? GameColors.starFill : GameColors.starEmptyFill}
        stroke={on ? GameColors.starStroke : GameColors.starEmptyStroke}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
