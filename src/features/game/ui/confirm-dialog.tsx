import { Modal, StyleSheet, View } from 'react-native';

import { GameColors } from '../theme';
import { GameButton } from './game-button';
import { GameText } from './game-text';
import { Panel } from './panel';

import { Mascot } from '@/features/mascot/mascot';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  /** Kalma düğmesi (vurgulu). */
  stayLabel: string;
  /** Ayrılma düğmesi. */
  leaveLabel: string;
  onStay: () => void;
  onLeave: () => void;
};

/**
 * Oyun stilinde onay penceresi (ör. "Okumayı bırakmak istiyor musun?"). Tüm platformlarda aynı
 * görünür; Android geri tuşu "kal" demektir.
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
        <Panel tone="warm" style={styles.panel} accessibilityViewIsModal>
          <View style={styles.mascot}>
            <Mascot pose="think" size={96} />
          </View>
          <GameText
            variant="heading"
            color={GameColors.warm}
            align="center"
            accessibilityRole="header">
            {title}
          </GameText>
          {message ? (
            <GameText color={GameColors.textWarmSecondary} align="center">
              {message}
            </GameText>
          ) : null}
          <View style={styles.buttons}>
            <GameButton title={stayLabel} variant="purple" size="md" onPress={onStay} />
            <GameButton title={leaveLabel} variant="white" size="md" onPress={onLeave} />
          </View>
        </Panel>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(30,18,50,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  panel: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 26,
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
