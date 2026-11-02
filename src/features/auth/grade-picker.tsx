import { Pressable, StyleSheet, View } from 'react-native';

import { GRADES, type Grade } from './types';

import { AppText } from '@/design/components/app-text';
import { colors, radius, size } from '@/design/tokens';

type GradePickerProps = {
  value: Grade | null;
  onChange: (grade: Grade) => void;
  error?: string;
};

const CHIP_HEIGHT = 56;

/** Sınıf seçimi: 1-8 arası seçenek kartı görünümünde çipler, iki sıra × 4 (tek seçimli). */
export function GradePicker({ value, onChange, error }: GradePickerProps) {
  return (
    <View style={styles.container}>
      <AppText variant="bodyStrong" color={colors.formLabel} nativeID="grade-label">
        Sınıfın
      </AppText>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabelledBy="grade-label"
        style={styles.grid}>
        {/* Her zaman iki sıra × 4 çip (en dar ekranda da sığar). */}
        {[GRADES.slice(0, 4), GRADES.slice(4)].map((row) => (
          <View key={row[0]} style={styles.row}>
            {row.map((grade) => {
              const selected = grade === value;
              const palette = colors.option[selected ? 'selected' : 'default'];
              return (
                <Pressable
                  key={grade}
                  accessibilityRole="radio"
                  accessibilityLabel={`${grade}. sınıf`}
                  accessibilityState={{ checked: selected }}
                  onPress={() => onChange(grade)}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      backgroundColor: palette.background,
                      borderColor: error && !selected ? colors.danger : palette.border,
                      borderBottomColor: error && !selected ? colors.danger : palette.lip,
                    },
                    pressed && styles.pressed,
                  ]}>
                  <AppText variant="heading" maxFontSizeMultiplier={1.5}>
                    {grade}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
      {error ? (
        <AppText variant="secondary" color={colors.danger} accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  grid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flex: 1,
    minHeight: CHIP_HEIGHT,
    minWidth: size.touch,
    borderWidth: 2,
    borderBottomWidth: size.optionLip,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
});
