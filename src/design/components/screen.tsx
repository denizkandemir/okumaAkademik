import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useReducedMotion, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, motion, screenPadding, size } from '../tokens';

export type ScreenProps = {
  children: ReactNode;
  /** Varsayılan `true`: içerik kaydırılır. */
  scroll?: boolean;
  /** Alt sekme çubuğunun altında kalmasın diye içerik çubuk kadar yukarıda biter. */
  withTabBar?: boolean;
  /** İçeriğin üstünde sabit kalan alan (ör. AppHeader). */
  header?: ReactNode;
  /** İçerik kabının stili (boşluklar varsayılan olarak ekran kenar boşluğudur). */
  contentStyle?: StyleProp<ViewStyle>;
};

/** Panodaki `appear`: .2 sn'de opaklık .5 → 1 ve 4 dp aşağıdan yerine. */
function appear() {
  'worklet';
  return {
    initialValues: { opacity: 0.5, transform: [{ translateY: 4 }] },
    animations: {
      opacity: withTiming(1, { duration: motion.appear }),
      transform: [{ translateY: withTiming(0, { duration: motion.appear }) }],
    },
  };
}

/**
 * Ekran kabı: zemin, güvenli alan, isteğe bağlı kaydırma ve açılışta kısa bir belirme. "Hareketi
 * azalt" açıkken belirme yoktur.
 */
export function Screen({
  children,
  scroll = true,
  withTabBar = false,
  header,
  contentStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();

  const padding = {
    paddingTop: 24,
    paddingBottom: insets.bottom + 30 + (withTabBar ? size.tabBar : 0),
    paddingLeft: insets.left + screenPadding,
    paddingRight: insets.right + screenPadding,
  };

  const content = (
    <Animated.View
      entering={reduceMotion ? undefined : appear}
      style={[styles.content, !scroll && styles.fill, padding, contentStyle]}>
      {children}
    </Animated.View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {header}
      {scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.grow}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  grow: {
    flexGrow: 1,
  },
  fill: {
    flex: 1,
  },
  content: {
    gap: 16,
    width: '100%',
    maxWidth: size.maxContentWidth,
    alignSelf: 'center',
  },
});
