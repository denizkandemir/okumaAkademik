import { Pressable, StyleSheet, View } from 'react-native';

import { GRADES, type Grade } from './types';

import { ThemedText } from '@/components/themed-text';
import { ControlHeight, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type GradePickerProps = {
  value: Grade | null;
  onChange: (grade: Grade) => void;
  error?: string;
};

export function GradePicker({ value, onChange, error }: GradePickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" nativeID="grade-label">
        Sınıfın
      </ThemedText>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabelledBy="grade-label"
        style={styles.grid}>
        {GRADES.map((grade) => {
          const selected = grade === value;
          return (
            <Pressable
              key={grade}
              accessibilityRole="radio"
              accessibilityLabel={`${grade}. sınıf`}
              accessibilityState={{ checked: selected }}
              onPress={() => onChange(grade)}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: selected ? theme.primary : theme.backgroundElement,
                  borderColor: selected ? theme.primary : error ? theme.danger : theme.border,
                },
                pressed && styles.pressed,
              ]}>
              <ThemedText
                type="subtitle"
                style={{ color: selected ? theme.onPrimary : theme.text }}>
                {grade}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <ThemedText type="small" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  option: {
    width: ControlHeight + Spacing.two,
    height: ControlHeight + Spacing.two,
    borderRadius: Radius.medium,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
