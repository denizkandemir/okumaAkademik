import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { colors, fonts, radius } from '../tokens';
import { AppText } from './app-text';

export type SpeechBubbleProps = ViewProps & {
  text: string;
  /** Kuyruğun çıktığı kenar (konuşanın olduğu taraf). Varsayılan `bottom`. */
  tail?: 'left' | 'right' | 'top' | 'bottom';
  /** `accent`: haritadaki "HADİ OKUYALIM" gibi vurgulu, büyük harfli etiket. */
  tone?: 'default' | 'accent';
};

const TAIL = 10;
const TAIL_OFFSET = -TAIL / 2 - 1;

/** Kuyruk: kenarlıklı, 45° döndürülmüş kare; yarısı balonun altında kalır. */
const TAIL_POSITION: Record<NonNullable<SpeechBubbleProps['tail']>, ViewStyle> = {
  bottom: { bottom: TAIL_OFFSET, alignSelf: 'center', borderTopWidth: 0, borderLeftWidth: 0 },
  top: { top: TAIL_OFFSET, alignSelf: 'center', borderBottomWidth: 0, borderRightWidth: 0 },
  left: {
    left: TAIL_OFFSET,
    top: '50%',
    marginTop: -TAIL / 2,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  right: {
    right: TAIL_OFFSET,
    top: '50%',
    marginTop: -TAIL / 2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
};

/** Pırıl'ın konuşma balonu ya da haritadaki işaret balonu. Panoda ayrı bir bileşen yok. */
export function SpeechBubble({
  text,
  tail = 'bottom',
  tone = 'default',
  style,
  ...rest
}: SpeechBubbleProps) {
  const accent = tone === 'accent';
  const borderColor = accent ? colors.bubble.border : colors.cardBorder;
  return (
    <View
      accessible
      accessibilityLabel={text}
      style={[styles.bubble, { borderColor }, style]}
      {...rest}>
      <View style={[styles.tail, { borderColor }, TAIL_POSITION[tail]]} />
      <AppText
        variant={accent ? 'eyebrow' : 'secondary'}
        color={accent ? colors.accent : colors.text}
        style={accent ? styles.accentText : styles.text}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.bubble.background,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  tail: {
    position: 'absolute',
    width: TAIL,
    height: TAIL,
    backgroundColor: colors.bubble.background,
    borderWidth: 1,
    transform: [{ rotate: '45deg' }],
  },
  text: {
    fontFamily: fonts.sansBold,
  },
  accentText: {
    fontFamily: fonts.sansBlack,
  },
});
