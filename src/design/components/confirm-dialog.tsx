import { Modal, StyleSheet, View } from 'react-native';

import { colors, radius } from '../tokens';
import { AppText } from './app-text';
import { Button } from './button';

import { Mascot } from '@/features/mascot/mascot';

export type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  /** Kalma düğmesi (ana düğme). */
  stayLabel: string;
  /** Ayrılma düğmesi (ikincil). */
  leaveLabel: string;
  onStay: () => void;
  onLeave: () => void;
};

/**
 * Onay penceresi (ör. "Okumayı bırakmak istiyor musun?"). Panoda yok; kart ve düğme diliyle
 * yapıldı. Android geri tuşu "kal" demektir (eski ConfirmDialog ile aynı API ve davranış).
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  stayLabel,
  leaveLabel,
  onStay,
  onLeave,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onStay}>
      <View style={styles.backdrop}>
        <View style={styles.dialog} accessibilityViewIsModal>
          <View style={styles.mascot}>
            <Mascot pose="think" size={96} />
          </View>
          <AppText variant="heading" align="center" accessibilityRole="header">
            {title}
          </AppText>
          {message ? (
            <AppText color={colors.textMuted} align="center">
              {message}
            </AppText>
          ) : null}
          <View style={styles.buttons}>
            <Button title={stayLabel} onPress={onStay} />
            <Button title={leaveLabel} variant="secondary" onPress={onLeave} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radius.sheet,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 22,
    gap: 12,
  },
  mascot: {
    alignItems: 'center',
  },
  buttons: {
    gap: 10,
    marginTop: 6,
  },
});
