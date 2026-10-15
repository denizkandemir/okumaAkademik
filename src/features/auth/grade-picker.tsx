import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GRADES, type Grade } from './types';

import { GameColors, GameFonts } from '@/features/game/theme';
import { GameText } from '@/features/game/ui/game-text';

type GradePickerProps = {
  value: Grade | null;
  onChange: (grade: Grade) => void;
  error?: string;
};

/** Seçili sınıf: mavi buton rengi (#2453C9) ve koyu "dudak". */
const SELECTED = { background: '#2453C9', lip: '#183A99' } as const;
const ERROR_COLOR = '#B42318';
const CHIP_SIZE = 56;

/** Sınıf seçimi: 1-8 arası büyük yuvarlak çipler (tek seçimli). */
export function GradePicker({ value, onChange, error }: GradePickerProps) {
  return (
    <View style={styles.container}>
      <GameText variant="label" color={GameColors.warm} nativeID="grade-label">
        Sınıfın
      </GameText>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabelledBy="grade-label"
        style={styles.grid}>
        {/* Her zaman iki sıra × 4 çip (en dar ekranda da sığar: 4 × 56 = 224 dp). */}
        {[GRADES.slice(0, 4), GRADES.slice(4)].map((row) => (
          <View key={row[0]} style={styles.row}>
            {row.map((grade) => {
              const selected = grade === value;
              return (
                <Pressable
                  key={grade}
                  accessibilityRole="radio"
                  accessibilityLabel={`${grade}. sınıf`}
                  accessibilityState={{ checked: selected }}
                  onPress={() => onChange(grade)}
                  style={({ pressed }) => [
                    styles.chip,
                    selected
                      ? styles.chipSelected
                      : { borderColor: error ? ERROR_COLOR : GameColors.inputBorder },
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.number, selected && styles.numberSelected]}>{grade}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
      {error ? (
        <GameText variant="caption" color={ERROR_COLOR}>
          {error}
        </GameText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chip: {
    width: CHIP_SIZE,
    height: CHIP_SIZE,
    borderRadius: CHIP_SIZE / 2,
    borderWidth: 2,
    backgroundColor: GameColors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 0 #F0D3B8',
  },
  chipSelected: {
    backgroundColor: SELECTED.background,
    borderColor: SELECTED.background,
    boxShadow: `0 4px 0 ${SELECTED.lip}`,
  },
  number: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 24,
    lineHeight: 30,
    color: GameColors.warm,
  },
  numberSelected: {
    color: GameColors.white,
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
});
