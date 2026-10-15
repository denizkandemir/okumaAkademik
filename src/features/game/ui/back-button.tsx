import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { GameColors } from '../theme';
import { BackIcon } from './icons';

export type BackButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  /** Varsayılan "Geri". */
  accessibilityLabel?: string;
};

/**
 * Beyaz, köşeleri yuvarlak geri düğmesi (S02Giris: 44×44, köşe 14, altta krem "dudak").
 * Görünen boyut tasarımdaki gibi 44; dokunma alanı `hitSlop` ile 52'ye çıkar.
 */
export function BackButton({ accessibilityLabel = 'Geri', ...rest }: BackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={4}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      {...rest}>
      <BackIcon size={22} color={GameColors.warm} />
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
    boxShadow: '0 4px 0 #F0D3B8',
  },
  pressed: {
    transform: [{ translateY: 2 }],
    boxShadow: '0 2px 0 #F0D3B8',
  },
});
