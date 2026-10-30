import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius } from '../tokens';
import { AppText } from './app-text';

export type RewardRowProps = ViewProps & {
  /** Solda ikon; rengi `colors.rewardRow.icon` önerilir. */
  icon: ReactNode;
  title: string;
  subtitle?: string;
};

/** İkon, başlık ve alt yazılı satır (ödüller, küçük başarılar). */
export function RewardRow({ icon, title, subtitle, style, ...rest }: RewardRowProps) {
  return (
    <View
      accessible
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      style={[styles.row, style]}
      {...rest}>
      <View style={styles.icon}>{icon}</View>
      <View style={styles.texts}>
        <AppText variant="bodyStrong">{title}</AppText>
        {subtitle ? (
          <AppText variant="secondary" color={colors.textMuted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 15,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.rewardRow.border,
    borderRadius: radius.button,
  },
  icon: {
    width: 28,
    alignItems: 'center',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
