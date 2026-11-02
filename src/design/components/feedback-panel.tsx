import type { Ref } from 'react';
import { StyleSheet, View, type ViewInstance, type ViewProps } from 'react-native';

import { colors, radius } from '../tokens';
import { AppText } from './app-text';

export type FeedbackPanelProps = ViewProps & {
  tone: 'wrong' | 'right';
  title: string;
  text: string;
  /** İsteğe bağlı ek satır (ör. "+5 lokum"). */
  extra?: string;
  /** Ekran okuyucu odağını panele taşımak için (ör. soru ekranı). */
  ref?: Ref<ViewInstance>;
};

/** Cevaptan sonraki geri bildirim kutusu. Ekran okuyucu içeriği kendiliğinden okur. */
export function FeedbackPanel({ tone, title, text, extra, style, ...rest }: FeedbackPanelProps) {
  const palette = colors.feedback[tone];
  return (
    <View
      accessibilityLiveRegion="polite"
      accessible
      style={[styles.panel, { backgroundColor: palette.background }, style]}
      {...rest}>
      <AppText variant="heading" color={palette.text}>
        {title}
      </AppText>
      <AppText color={palette.text}>{text}</AppText>
      {extra ? (
        <AppText variant="bodyStrong" color={palette.text}>
          {extra}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: radius.card,
    padding: 17,
    gap: 6,
  },
});
