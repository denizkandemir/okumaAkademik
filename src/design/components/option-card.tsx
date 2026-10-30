import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { colors, radius, size } from '../tokens';
import { AppText } from './app-text';

export type OptionState = 'default' | 'selected' | 'correct' | 'wrong' | 'disabled';

export type OptionCardProps = Omit<PressableProps, 'children' | 'style' | 'disabled'> & {
  /** Harf rozeti, ör. "A". */
  letter: string;
  text: string;
  /** Varsayılan `default`. `disabled` görünüm olarak `default`'tur ama dokunulamaz. */
  state?: OptionState;
};

const STATE_LABEL: Partial<Record<OptionState, string>> = {
  correct: 'doğru',
  wrong: 'yanlış',
};

/**
 * Cevap seçeneği: harf rozeti ve metin. Kenar ve 4 dp alt kenar duruma göre renk alır; seçili,
 * doğru ve yanlış durumlar ekran okuyucuya da bildirilir.
 */
export function OptionCard({
  letter,
  text,
  state = 'default',
  accessibilityLabel,
  ...rest
}: OptionCardProps) {
  const palette = colors.option[state === 'disabled' ? 'default' : state];
  const disabled = state === 'disabled' || state === 'correct' || state === 'wrong';
  const suffix = STATE_LABEL[state];

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel ?? `${letter}: ${text}${suffix ? `, ${suffix}` : ''}`}
      accessibilityState={{
        selected: state === 'selected' || state === 'correct' || state === 'wrong',
        disabled,
      }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          borderBottomColor: palette.lip,
        },
        pressed && styles.pressed,
      ]}
      {...rest}>
      <View style={styles.badge}>
        <AppText variant="mapLabel">{letter}</AppText>
      </View>
      <AppText variant="bodyStrong" style={styles.text}>
        {text}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: size.touch + 16,
    padding: 14,
    borderWidth: 2,
    borderBottomWidth: size.optionLip,
    borderRadius: radius.button,
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: radius.badge,
    backgroundColor: colors.option.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
});
