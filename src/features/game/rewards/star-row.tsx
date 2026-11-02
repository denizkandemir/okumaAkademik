import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn, useReducedMotion } from 'react-native-reanimated';

import { StarIcon } from '@/design/icons';
import { colors } from '@/design/tokens';

/** Ders sonucundaki yıldızlar: 3 yıldızdan `filled` kadarı dolu, sırayla kısaca belirir. */
export function StarRow({ filled, size = 40 }: { filled: number; size?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <View style={styles.row} accessible accessibilityLabel={`3 yıldızdan ${filled}`}>
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={index}
          entering={reduceMotion ? undefined : ZoomIn.delay(250 + index * 180).springify()}>
          {index < filled ? (
            <StarIcon size={size} />
          ) : (
            <StarIcon size={size} color={colors.node.locked.fill} stroke={colors.node.locked.lip} />
          )}
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
});
