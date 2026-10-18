import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from './themed-text';

import { ControlHeight, Radius, Spacing } from '@/constants/theme';
import { GameColors, GameFonts } from '@/features/game/theme';
import { GameText } from '@/features/game/ui/game-text';
import { useTheme } from '@/hooks/use-theme';

export type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  /**
   * `game`: oyun ekranlarının alanı (S02Giris): köşe 16, 2 px kenarlık, odakta mavi kenarlık ve
   * yumuşak mavi parıltı. Varsayılan `default`.
   */
  variant?: 'default' | 'game';
  /** Yalnızca `game`: alanın sağına yerleşen düğme (ör. şifreyi göster). */
  trailing?: ReactNode;
};

export function TextField({ variant = 'default', ...props }: TextFieldProps) {
  return variant === 'game' ? <GameTextField {...props} /> : <DefaultTextField {...props} />;
}

function DefaultTextField({ label, error, style, trailing: _trailing, ...rest }: TextFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.backgroundElement,
            borderColor: error ? theme.danger : theme.border,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <ThemedText type="small" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

function GameTextField({
  label,
  error,
  style,
  trailing,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={gameStyles.container}>
      <GameText variant="label" color={GameColors.warm}>
        {label}
      </GameText>
      <View>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={GameColors.textWarmSecondary}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[
            gameStyles.input,
            trailing ? gameStyles.inputWithTrailing : null,
            focused
              ? gameStyles.inputFocused
              : { borderColor: error ? GAME_ERROR : GameColors.inputBorder },
            style,
          ]}
          {...rest}
        />
        {trailing ? <View style={gameStyles.trailing}>{trailing}</View> : null}
      </View>
      {error ? (
        <GameText variant="caption" color={GAME_ERROR}>
          {error}
        </GameText>
      ) : null}
    </View>
  );
}

/** Hata kenarlığı ve yazısı; beyaz üzerinde 6:1. */
const GAME_ERROR = '#B42318';
/** P04: odakta kenarlık #2453C9 (beyaz/açık mavi üzerinde 3:1'in üstünde). */
const GAME_FOCUS_BORDER = '#2453C9';

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  input: {
    minHeight: ControlHeight,
    borderWidth: 2,
    borderRadius: Radius.medium,
    paddingHorizontal: Spacing.three,
    fontSize: 18,
  },
});

const gameStyles = StyleSheet.create({
  container: {
    gap: 6,
  },
  input: {
    minHeight: 54,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: GameColors.inputBackground,
    fontFamily: GameFonts.bodyBold,
    fontSize: 18,
    color: GameColors.warm,
  },
  inputWithTrailing: {
    paddingRight: 56,
  },
  inputFocused: {
    borderColor: GAME_FOCUS_BORDER,
    backgroundColor: GameColors.inputFocusBackground,
    boxShadow: '0 0 0 4px rgba(79,123,242,0.18)',
  },
  trailing: {
    position: 'absolute',
    right: 4,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
