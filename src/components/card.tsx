import { StyleSheet } from 'react-native';

import { ThemedView, type ThemedViewProps } from './themed-view';

import { Radius, Spacing } from '@/constants/theme';

export function Card({ style, ...rest }: ThemedViewProps) {
  return <ThemedView type="backgroundElement" style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.large,
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
