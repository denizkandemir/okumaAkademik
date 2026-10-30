import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius } from '../tokens';
import { AppText } from './app-text';

export type ChipProps = ViewProps & {
  label: string;
  /** Yazının solunda küçük ikon. */
  icon?: ReactNode;
};

/** Bilgi hapı (ör. "2 dk", "3 soru"). */
export function Chip({ label, icon, style, ...rest }: ChipProps) {
  return (
    <View style={[styles.chip, style]} {...rest}>
      {icon}
      <AppText variant="mapLabel">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: colors.chip,
    borderRadius: radius.chip,
    paddingVertical: 8,
    paddingHorizontal: 11,
  },
});
