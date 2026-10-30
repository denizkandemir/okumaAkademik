import { StyleSheet, View } from 'react-native';

import { CloseIcon } from '../icons';
import { colors } from '../tokens';
import { IconButton } from './icon-button';

export type SheetHeaderProps = {
  onClose: () => void;
  /** Varsayılan "Kapat". */
  closeLabel?: string;
};

/** Alt sayfanın üstü: ortada tutamaç, sağda yuvarlak kapat düğmesi. */
export function SheetHeader({ onClose, closeLabel = 'Kapat' }: SheetHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.handle} accessible={false} importantForAccessibility="no" />
      <IconButton
        shape="round"
        accessibilityLabel={closeLabel}
        onPress={onClose}
        style={styles.close}>
        <CloseIcon size={20} strokeWidth={2.2} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    alignItems: 'center',
  },
  handle: {
    marginTop: 4,
    width: 35,
    height: 4,
    borderRadius: 5,
    backgroundColor: colors.handle,
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 8,
  },
});
