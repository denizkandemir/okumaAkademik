import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, size } from '../tokens';
import { AppText } from './app-text';

export type StatTileProps = ViewProps & {
  value: string | number;
  label: string;
  align?: 'left' | 'center';
};

/** Büyük sayı ve altında etiket (ör. "560 / lokum"). Ekran okuyucu tek parça okur. */
export function StatTile({ value, label, align = 'left', style, ...rest }: StatTileProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${value} ${label}`}
      style={[styles.tile, align === 'center' && styles.center, style]}
      {...rest}>
      <AppText variant="title" color={colors.resultNumber} align={align}>
        {value}
      </AppText>
      <AppText variant="secondary" color={colors.textMuted} align={align}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    gap: 4,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.statTile.border,
    borderBottomWidth: size.cardLip,
    borderBottomColor: colors.statTile.lip,
    borderRadius: radius.input,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  center: {
    alignItems: 'center',
  },
});
