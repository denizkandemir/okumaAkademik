import { Pressable, StyleSheet, View } from 'react-native';

import type { GlossaryEntry } from './glossary-text';

import { AppText } from '@/design/components/app-text';
import { IconButton } from '@/design/components/icon-button';
import { CloseIcon } from '@/design/icons';
import { colors, radius } from '@/design/tokens';
import { Mascot } from '@/features/mascot/mascot';

type GlossaryCardProps = {
  entry: GlossaryEntry;
  onClose: () => void;
  bottomInset: number;
};

/**
 * Sözlük kartı (08-okuma): altı noktalı bir kelimeye dokununca ekranın altında açılır. Pırıl
 * kelimeyi ve anlamını söyler. Karta ya da kapat düğmesine dokunmak kapatır.
 */
export function GlossaryCard({ entry, onClose, bottomInset }: GlossaryCardProps) {
  return (
    <View style={[styles.wrap, { paddingBottom: bottomInset + 12 }]} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${entry.word}: ${entry.meaning}`}
        accessibilityHint="Kartı kapatır"
        accessibilityLiveRegion="polite"
        onPress={onClose}
        style={styles.card}>
        <Mascot pose="talk" size={64} animated={false} />
        <View style={styles.texts}>
          <AppText variant="bodyStrong">{entry.word}</AppText>
          <AppText variant="secondary" color={colors.textMuted}>
            {entry.meaning}
          </AppText>
        </View>
        <IconButton shape="round" accessibilityLabel="Kapat" onPress={onClose}>
          <CloseIcon size={18} strokeWidth={2.2} />
        </IconButton>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.cardLarge,
    boxShadow: `0 8px 24px ${colors.shadow}`,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
