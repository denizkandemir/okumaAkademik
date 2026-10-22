import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GameColors, GameFonts } from '../theme';
import { CheckIcon } from '../ui/icons';

export type AnswerState = 'idle' | 'selected' | 'wrong' | 'correct' | 'faded';

const LOOKS: Record<
  AnswerState,
  {
    border: string;
    borderWidth: number;
    background: string;
    lip: string;
    badge: string;
    badgeText: string;
    text: string;
  }
> = {
  idle: {
    border: '#E6DCF5',
    borderWidth: 2,
    background: GameColors.white,
    lip: '#E6DCF5',
    badge: '#F3EEFF',
    badgeText: '#5B34D6',
    text: GameColors.warm,
  },
  selected: {
    border: '#7B4DFF',
    borderWidth: 3,
    background: '#F3EEFF',
    lip: '#B7A1F5',
    badge: '#7B4DFF',
    badgeText: GameColors.white,
    text: GameColors.warm,
  },
  wrong: {
    border: '#F08A2E',
    borderWidth: 3,
    background: '#FFF1E2',
    lip: '#F5C08E',
    badge: '#C25519',
    badgeText: GameColors.white,
    text: GameColors.warm,
  },
  correct: {
    border: '#2FB86B',
    borderWidth: 3,
    background: '#E7F8EE',
    lip: '#9FDDB8',
    badge: '#1E9E57',
    badgeText: GameColors.white,
    text: GameColors.warm,
  },
  faded: {
    border: '#E6DCF5',
    borderWidth: 2,
    background: GameColors.white,
    lip: '#E6DCF5',
    badge: '#F3EEFF',
    badgeText: '#8E80A8',
    text: '#8E80A8',
  },
};

type AnswerOptionProps = {
  letter: string;
  label: string;
  state: AnswerState;
  disabled: boolean;
  onPress: () => void;
};

/** Cevap şıkkı (S05-S07): A/B/C rozeti ve metin; seçili, yanlış, doğru ve sönük hâlleri. */
export function AnswerOption({ letter, label, state, disabled, onPress }: AnswerOptionProps) {
  const look = LOOKS[state];
  const checked = state === 'selected' || state === 'wrong' || state === 'correct';
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`${letter}: ${label}`}
      accessibilityHint={state === 'wrong' ? 'Yanlış, tekrar dene' : undefined}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          borderColor: look.border,
          borderWidth: look.borderWidth,
          paddingHorizontal: 18 - look.borderWidth,
          backgroundColor: look.background,
          boxShadow: `0 ${pressed ? 2 : 5}px 0 ${look.lip}`,
        },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.badge, { backgroundColor: look.badge }]}>
        {state === 'correct' ? (
          <CheckIcon size={20} color={GameColors.white} strokeWidth={3} />
        ) : (
          <Text style={[styles.letter, { color: look.badgeText }]}>{letter}</Text>
        )}
      </View>
      <Text style={[styles.label, { color: look.text }]}>{label}</Text>
      {state === 'wrong' ? <Text style={styles.retry}>Tekrar dene</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 68,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
  pressed: {
    transform: [{ translateY: 3 }],
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 18,
  },
  label: {
    flex: 1,
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 18,
    lineHeight: 24,
  },
  retry: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 13,
    color: '#A84E05',
  },
});
