import { StyleSheet, Text, type TextProps } from 'react-native';

import { GameColors, GameFonts } from '../theme';

export type GameTextVariant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption';

export type GameTextProps = TextProps & {
  /** Varsayılan `body`. */
  variant?: GameTextVariant;
  /** Varsayılan `GameColors.text`. */
  color?: string;
  align?: 'left' | 'center' | 'right';
};

/**
 * Oyun ekranlarının yazısı: başlık ve sayılar Baloo 2, metin ve etiketler Nunito.
 * Büyük başlıklar sistem yazı boyutu ayarıyla en fazla 1,3 kat büyür; metin sınırsız büyür.
 */
export function GameText({ variant = 'body', color, align, style, ...rest }: GameTextProps) {
  const large = variant === 'display' || variant === 'title';
  return (
    <Text
      maxFontSizeMultiplier={large ? 1.3 : undefined}
      style={[
        styles[variant],
        { color: color ?? GameColors.text },
        align ? { textAlign: align } : null,
        style,
      ]}
      {...rest}
    />
  );
}

/** Tasarımdaki ölçüler: seviye rakamı 72, ekran başlıkları 22-34, metin 16-18, etiket 14-15. */
const styles = StyleSheet.create({
  display: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 72,
    lineHeight: 80,
  },
  title: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 34,
    lineHeight: 40,
  },
  heading: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 26,
    lineHeight: 32,
  },
  body: {
    fontFamily: GameFonts.body,
    fontSize: 17,
    lineHeight: 25,
  },
  label: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 15,
    lineHeight: 20,
  },
  caption: {
    fontFamily: GameFonts.bodyBold,
    fontSize: 13,
    lineHeight: 18,
  },
});
