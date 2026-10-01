import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from './button';
import { ThemedText } from './themed-text';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage } from '@/lib/errors';

type QueryStateProps = {
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  loadingLabel?: string;
};

/**
 * Yükleniyor ve hata durumlarını gösterir. İkisi de yoksa hiçbir şey çizmez;
 * bu durumda ekran kendi içeriğini göstermelidir.
 */
export function QueryState({
  isLoading,
  error,
  onRetry,
  loadingLabel = 'Yükleniyor…',
}: QueryStateProps) {
  const theme = useTheme();

  if (error) {
    return (
      <View style={styles.container} accessibilityLiveRegion="polite">
        <ThemedText type="subtitle" style={styles.center}>
          Bir sorun oldu
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
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText themeColor="textSecondary">{loadingLabel}</ThemedText>
      </View>
    );
  }

  return null;
}

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
