import { StyleSheet } from 'react-native';

import { LevelLabels, type ReadingLevel } from './types';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';

export function LevelBadge({ level }: { level: ReadingLevel }) {
  return (
    <ThemedView type="backgroundSelected" style={styles.badge}>
      <ThemedText type="smallBold">
        Seviye {level} · {LevelLabels[level]}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
});
