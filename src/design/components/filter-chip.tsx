import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { colors, radius, size } from '../tokens';
import { AppText } from './app-text';

export type FilterChipProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  selected: boolean;
};

/** Süzgeç hapı (ör. "Tüm hikâyeler" / "Okuduklarım"); seçili olan adaçayı zeminlidir. */
export function FilterChip({ label, selected, ...rest }: FilterChipProps) {
  const palette = selected ? colors.filterChip.selected : colors.filterChip;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: palette.background, borderColor: palette.border },
        pressed && styles.pressed,
      ]}
      {...rest}>
      <AppText variant="secondary" color={palette.text}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: size.touch,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  pressed: {
    opacity: 0.8,
  },
});
