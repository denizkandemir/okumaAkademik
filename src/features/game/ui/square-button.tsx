import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { GameColors } from '../theme';

export type SquareButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  accessibilityLabel: string;
  children: ReactNode;
  /** Alttaki "dudak" rengi (okuma #EFE2CF, soru #E6DCF5). */
  lip?: string;
};

/**
 * Üst çubuktaki beyaz kare düğme (S04Okuma, S05Soru: 44×44, köşe 14, altta 3 dp dudak): kapat,
 * yazı boyutu. Görünen boyut 44; dokunma alanı `hitSlop` ile 52.
 */
export function SquareButton({ children, lip = '#EFE2CF', ...rest }: SquareButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={4}
      style={({ pressed }) => [
        styles.button,
        { boxShadow: `0 ${pressed ? 1 : 3}px 0 ${lip}` },
        pressed && styles.pressed,
      ]}
      {...rest}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: GameColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
});
