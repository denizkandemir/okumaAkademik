import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from './button';
import { ThemedText } from './themed-text';

import { Spacing } from '@/constants/theme';
import { Mascot } from '@/features/mascot/mascot';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage } from '@/lib/errors';

type QueryStateProps = {
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  loadingLabel?: string;
  /** `false` ise Pırıl yerine yalnızca yükleniyor göstergesi çizilir (ekranda zaten maskot varsa). */
  mascot?: boolean;
};

/**
 * Yükleniyor (Pırıl okuyor) ve hata (Pırıl düşünüyor) durumlarını gösterir. İkisi de yoksa hiçbir şey çizmez;
 * bu durumda ekran kendi içeriğini göstermelidir.
 */
export function QueryState({
  isLoading,
  error,
  onRetry,
  loadingLabel = 'Hikâyeni hazırlıyorum…',
  mascot = true,
}: QueryStateProps) {
  const theme = useTheme();

  if (error) {
    return (
      <View style={styles.container} accessibilityLiveRegion="polite">
        {mascot ? <Mascot pose="think" size={MASCOT_SIZE} /> : null}
        <ThemedText type="subtitle" style={styles.center}>
          Bir şeyler ters gitti. Tekrar deneyelim mi?
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.center}>
          {getErrorMessage(error)}
        </ThemedText>
        <Button title="Tekrar dene" variant="secondary" onPress={onRetry} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View
        style={styles.container}
        accessibilityRole="progressbar"
        accessibilityLabel={loadingLabel}>
        {mascot ? (
          <Mascot pose="read" size={MASCOT_SIZE} accessibilityLabel={loadingLabel} />
        ) : (
          <ActivityIndicator size="large" color={theme.primary} />
        )}
        <ThemedText themeColor="textSecondary">{loadingLabel}</ThemedText>
      </View>
    );
  }

  return null;
}

const MASCOT_SIZE = 96;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.five,
  },
  center: {
    textAlign: 'center',
  },
});
