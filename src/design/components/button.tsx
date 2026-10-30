import * as Haptics from 'expo-haptics';
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
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion, radius, size } from '../tokens';
import { AppText } from './app-text';

const VARIANTS = {
  primary: {
    face: colors.primary.face,
    lip: colors.primary.lip,
    border: colors.primary.face,
    text: colors.primary.text,
  },
  secondary: {
    face: colors.secondary.face,
    lip: colors.secondary.lip,
    border: colors.secondary.border,
    text: colors.secondary.text,
  },
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  /** Büyük harfle verin (ör. "TEKRAR DENE"); ekran okuyucu için `accessibilityLabel` verilebilir. */
  title: string;
  /** Varsayılan `primary`. */
  variant?: ButtonVariant;
  loading?: boolean;
  /** Yazının solunda; rengi düğmenin yazı rengiyle uyumlu olmalı. */
  icon?: ReactNode;
  /** Varsayılan tam genişlik; `false` ise içeriği kadar. */
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Tasarımın düğmesi: köşe 13, altta 4 dp "dudak". Basınca yüz 2 dp iner ve dudak incelir; hafif
 * titreşim verir. Dudak ayrı bir katmandır (gölge değil), her platformda keskin çizilir.
 */
export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  icon,
  fullWidth = true,
  onPress,
  onPressIn,
  onPressOut,
  style,
  accessibilityRole = 'button',
  accessibilityLabel,
  accessibilityState,
  ...rest
}: ButtonProps) {
  const palette = VARIANTS[variant];
  const isDisabled = !!disabled || loading;
  const reduceMotion = useReducedMotion();

  const pressed = useSharedValue(0);
  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressed.get() * size.buttonPressDepth }],
  }));

  const animateTo = (value: number, duration: number) =>
    pressed.set(reduceMotion ? value : withTiming(value, { duration }));

  const handlePressIn = (event: GestureResponderEvent) => {
    animateTo(1, motion.pressIn);
    onPressIn?.(event);
  };
  const handlePressOut = (event: GestureResponderEvent) => {
    animateTo(0, motion.pressOut);
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
      style={[
        styles.root,
        fullWidth ? styles.fullWidth : styles.hug,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}>
      <View style={[styles.lip, { backgroundColor: palette.lip, borderColor: palette.lip }]} />
      <Animated.View
        style={[
          styles.face,
          { backgroundColor: palette.face, borderColor: palette.border },
          faceStyle,
        ]}>
        {loading ? (
          <ActivityIndicator color={palette.text} />
        ) : (
          <>
            {icon}
            <AppText variant="button" color={palette.text} align="center" numberOfLines={2}>
              {title}
            </AppText>
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: size.buttonHeight + size.buttonLip,
    paddingBottom: size.buttonLip,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  hug: {
    alignSelf: 'flex-start',
  },
  disabled: {
    opacity: 0.5,
  },
  lip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: size.buttonLip,
    borderRadius: radius.button,
    borderWidth: 1,
  },
  face: {
    minHeight: size.buttonHeight,
    borderRadius: radius.button,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
