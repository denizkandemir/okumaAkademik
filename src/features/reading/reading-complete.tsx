import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { Mascot } from '@/features/mascot/mascot';
import { useTheme } from '@/hooks/use-theme';

type ReadingCompleteProps = {
  durationSeconds: number;
  /** Kazanılan lokum; yoksa satır gösterilmez. */
  lokum?: number;
  onContinue: () => void;
};

/** "Bitirdim"den sonra ekranı kaplayan kutlama: Pırıl zıplar, konfeti yağar. */
export function ReadingComplete({ durationSeconds, lokum, onContinue }: ReadingCompleteProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      accessibilityViewIsModal
      style={[
        styles.overlay,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + Spacing.four,
          paddingLeft: insets.left + Spacing.four,
          paddingRight: insets.right + Spacing.four,
        },
      ]}>
      <View style={styles.content}>
        <Mascot pose="celebrate" size={220} accessibilityLabel="Pırıl sevinçle zıplıyor" />
        <ThemedText type="title" accessibilityRole="header" style={styles.center}>
          Harika okudun!
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.center}>
          Okuma süren: {formatDuration(durationSeconds)}
        </ThemedText>
        {lokum != null && lokum > 0 ? (
          <ThemedText type="subtitle" style={[styles.center, { color: theme.success }]}>
            +{lokum} lokum kazandın!
          </ThemedText>
        ) : null}
        <View style={styles.button}>
          <Button title="Devam et" onPress={onContinue} />
        </View>
      </View>
    </Animated.View>
  );
}

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(Math.round(totalSeconds), 0);
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest} saniye`;
  return rest === 0 ? `${minutes} dakika` : `${minutes} dakika ${rest} saniye`;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignItems: 'center',
    gap: Spacing.three,
  },
  center: {
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: Spacing.three,
  },
});
