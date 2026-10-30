import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { EyeIcon, EyeOffIcon } from '../icons';
import { colors, radius, size, type } from '../tokens';
import { AppText } from './app-text';

export type TextFieldProps = Omit<TextInputProps, 'secureTextEntry'> & {
  label: string;
  /** Alanın altında gösterilir ve ekran okuyucuya ipucu olarak verilir. */
  error?: string;
  /** Şifre alanı: gizli yazılır, sağdaki göz düğmesiyle gösterilebilir. */
  secure?: boolean;
  /** Alanın sağına yerleşen öğe (ör. saat ikonu). `secure` ise göz düğmesi kullanılır. */
  trailing?: ReactNode;
};

/**
 * Etiketli metin alanı: köşe 12, 3 dp alt kenar. Odakta vurgu kenarı, hatada hata rengi. Panoda
 * hata ve şifre göster/gizle durumu yok; aynı dille eklendi.
 */
export function TextField({
  label,
  error,
  secure = false,
  trailing,
  style,
  onFocus,
  onBlur,
  accessibilityHint,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.accent : colors.input.border;

  return (
    <View style={styles.container}>
      <AppText variant="bodyStrong" color={colors.formLabel}>
        {label}
      </AppText>
      <View style={[styles.field, { borderColor }]}>
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={error ?? accessibilityHint}
          placeholderTextColor={colors.input.placeholder}
          secureTextEntry={secure && !revealed}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, style]}
          {...rest}
        />
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Şifreyi gizle' : 'Şifreyi göster'}
            onPress={() => setRevealed((value) => !value)}
            hitSlop={4}
            style={styles.trailing}>
            {revealed ? (
              <EyeOffIcon color={colors.textMuted} />
            ) : (
              <EyeIcon color={colors.textMuted} />
            )}
          </Pressable>
        ) : trailing ? (
          <View style={styles.trailing}>{trailing}</View>
        ) : null}
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
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: size.touch + 8,
    backgroundColor: colors.input.background,
    borderWidth: 1,
    borderBottomWidth: size.cardLip,
    borderRadius: radius.input,
  },
  input: {
    ...type.bodyStrong,
    flex: 1,
    color: colors.input.text,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  trailing: {
    width: size.touch,
    height: size.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
