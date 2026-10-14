import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { GameButtonColors, GameFonts, type GameButtonVariant } from '../theme';
import { GameText } from './game-text';

/** Basınca yüzün aşağı inme miktarı (dp); dudak bu kadar incelir. */
const PRESS_DEPTH = 3;

const SIZES = {
  /** Ekranın ana butonu (tasarımda 58-60 dp) */
  lg: { height: 60, radius: 20, lip: 6, fontSize: 19 },
  /** Panel içi ikincil buton (tasarımda 54-56 dp) */
  md: { height: 56, radius: 18, lip: 5, fontSize: 19 },
} as const;

export type GameButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  /** Varsayılan `blue`. */
  variant?: GameButtonVariant;
  /** Varsayılan `lg`. */
  size?: keyof typeof SIZES;
  loading?: boolean;
  /** Yazının solunda gösterilir; rengi butonun yazı rengiyle uyumlu verin. */
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * 3B "şeker" buton: üstten alta gradyan, üstte 2 dp açık parlama, altta koyu "dudak" ve yumuşak
 * gölge. Basınca 3 dp aşağı iner (dudak incelir) ve hafif titreşim verir.
 *
 * Dudak ayrı bir koyu katmandır (gölgeyle değil): her platformda keskin ve animasyonlu çizilir.
 * Yumuşak gölge `boxShadow` ile; New Architecture'da iOS ve Android 9+ destekler, daha eski
 * Android'de yalnızca çizilmez.
 */
export function GameButton({
  title,
  variant = 'blue',
  size = 'lg',
  loading = false,
  disabled,
  icon,
  onPress,
  onPressIn,
  onPressOut,
  style,
  accessibilityRole = 'button',
  accessibilityLabel,
  accessibilityState,
  ...rest
}: GameButtonProps) {
  const colors = GameButtonColors[variant];
  const { height, radius, lip, fontSize } = SIZES[size];
  const isDisabled = !!disabled || loading;

  const pressed = useSharedValue(0);
  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressed.get() * PRESS_DEPTH }],
  }));

  const handlePressIn = (event: GestureResponderEvent) => {
    pressed.set(withTiming(1, { duration: 70 }));
    onPressIn?.(event);
  };
  const handlePressOut = (event: GestureResponderEvent) => {
    pressed.set(withTiming(0, { duration: 120 }));
    onPressOut?.(event);
  };
  const handlePress = (event: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(event);
  };

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ ...accessibilityState, disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[{ height: height + lip }, isDisabled && styles.disabled, style]}
      {...rest}>
      {/* Dudak + yumuşak gölge. Gölge tasarımda yüz katmanına göre; dudak `lip` kadar aşağıda. */}
      <View
        style={[
          styles.layer,
          {
            top: lip,
            height,
            borderRadius: radius,
            backgroundColor: colors.lip,
            boxShadow: [
              {
                offsetX: 0,
                offsetY: colors.glow.offsetY - lip,
                blurRadius: colors.glow.blur,
                color: colors.glow.color,
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[styles.layer, styles.face, { height, borderRadius: radius }, faceStyle]}>
        <LinearGradient
          colors={colors.face.colors}
          start={colors.face.start}
          end={colors.face.end}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.highlight, { backgroundColor: colors.highlight }]} />
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <>
              {icon}
              <GameText
                variant="label"
                numberOfLines={1}
                style={[styles.title, { fontSize, lineHeight: fontSize + 6, color: colors.text }]}>
                {title}
              </GameText>
            </>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

export type GameLinkButtonProps = GameButtonProps;

/**
 * `Link asChild` ile kullanılan buton: `<Link href="/x" asChild><GameLinkButton … /></Link>`.
 * Link'in verdiği `href`/`onPress` gibi prop'lar Pressable'a iletilir; rolü bağlantıdır.
 */
export function GameLinkButton(props: GameLinkButtonProps) {
  return <GameButton accessibilityRole="link" {...props} />;
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  face: {
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: GameFonts.bodyHeavy,
    letterSpacing: 0.7,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
