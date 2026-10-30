import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { colors, radius, size } from '../tokens';

export type IconButtonProps = Omit<PressableProps, 'children'> & {
  /** Zorunlu: ikonun anlamı ("Geri", "Kapat", "Ayarlar"). */
  accessibilityLabel: string;
  children: ReactNode;
  /** `round`: alt sayfadaki yuvarlak kapat düğmesi. Varsayılan `square`. */
  shape?: 'square' | 'round';
};

/** Geri, kapat ve ayarlar için kare (48 dp) ikon düğmesi. */
export function IconButton({
  children,
  shape = 'square',
  style,
  accessibilityRole = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      hitSlop={4}
      style={(state) => [
        styles.base,
        shape === 'round' ? styles.round : styles.square,
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: size.iconButton,
    height: size.iconButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.iconButton.border,
    backgroundColor: colors.iconButton.face,
  },
  round: {
    borderRadius: radius.full,
    backgroundColor: colors.closeButton,
  },
  pressed: {
    transform: [{ translateY: 1 }],
    opacity: 0.85,
  },
});
