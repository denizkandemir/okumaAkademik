import { Text, type TextProps } from 'react-native';

import { colors, type, type TypeVariant } from '../tokens';

export type AppTextProps = TextProps & {
  /** Varsayılan `body`. */
  variant?: TypeVariant;
  /** Varsayılan ana metin rengi. */
  color?: string;
  align?: 'left' | 'center' | 'right';
};

/** Çok büyük yazılar büyük yazı tipi ayarında satırı taşırmasın diye 1.3 ile sınırlanır. */
const LARGE_VARIANTS: readonly TypeVariant[] = ['brand', 'display', 'title', 'certificateName'];

/** Yazı ölçeğindeki (tokens.type) bir stil ile metin. */
export function AppText({
  variant = 'body',
  color = colors.text,
  align,
  style,
  maxFontSizeMultiplier,
  ...rest
}: AppTextProps) {
  return (
    <Text
      maxFontSizeMultiplier={
        maxFontSizeMultiplier ?? (LARGE_VARIANTS.includes(variant) ? 1.3 : undefined)
      }
      style={[type[variant], { color, textAlign: align }, style]}
      {...rest}
    />
  );
}
