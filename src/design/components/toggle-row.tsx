import { Pressable, StyleSheet, View } from 'react-native';

import { CheckIcon } from '../icons';
import { colors, size } from '../tokens';
import { AppText } from './app-text';

export type ToggleRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

/**
 * Etiket ve sağda açık/kapalı kutusu (panoda adaçayı onay kutusu). Satırın tamamı dokunulabilir;
 * ekran okuyucu "anahtar, açık/kapalı" olarak okur.
 */
export function ToggleRow({ label, value, onValueChange, disabled = false }: ToggleRowProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[styles.row, disabled && styles.disabled]}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={[styles.box, value ? styles.on : styles.off]}>
        {value ? <CheckIcon size={20} color={colors.toggle.check} strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: size.touch,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    flex: 1,
  },
  box: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  on: {
    backgroundColor: colors.toggle.on,
  },
  off: {
    backgroundColor: colors.toggle.off,
    borderWidth: 2,
    borderColor: colors.toggle.border,
  },
});
