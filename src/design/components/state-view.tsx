import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '../tokens';
import { AppText } from './app-text';
import { Button } from './button';

import { Mascot } from '@/features/mascot/mascot';
import { getErrorMessage } from '@/lib/errors';

export type StateViewProps = {
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  loadingLabel?: string;
  /** `false` ise Pırıl yerine yalnızca yükleniyor göstergesi çizilir (ekranda zaten maskot varsa). */
  mascot?: boolean;
};

const MASCOT_SIZE = 96;

/**
 * Yükleniyor (Pırıl okuyor) ve hata (Pırıl düşünüyor, TEKRAR DENE) durumları. İkisi de yoksa hiçbir
 * şey çizmez; ekran kendi içeriğini gösterir. `QueryState` ile aynı API, ekranlar doğrudan geçebilir.
 */
export function StateView({
  isLoading,
  error,
  onRetry,
  loadingLabel = 'Hikâyeni hazırlıyorum…',
  mascot = true,
}: StateViewProps) {
  if (error) {
    return (
      <View style={styles.container} accessibilityLiveRegion="polite">
        {mascot ? <Mascot pose="think" size={MASCOT_SIZE} /> : null}
        <AppText variant="heading" align="center">
          Bir şeyler ters gitti. Tekrar deneyelim mi?
        </AppText>
        <AppText color={colors.textMuted} align="center">
          {getErrorMessage(error)}
        </AppText>
        <Button title="TEKRAR DENE" accessibilityLabel="Tekrar dene" onPress={onRetry} />
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
          <ActivityIndicator size="large" color={colors.accent} />
        )}
        <AppText color={colors.textMuted}>{loadingLabel}</AppText>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 32,
  },
});
