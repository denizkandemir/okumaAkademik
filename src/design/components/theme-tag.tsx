import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius } from '../tokens';
import { AppText } from './app-text';

export type ThemeTagProps = ViewProps & {
  /** Hikâye teması, ör. "Arkadaşlık". */
  label: string;
};

/** Hikâye teması etiketi (yeşilimsi küçük hap). */
export function ThemeTag({ label, style, ...rest }: ThemeTagProps) {
  return (
    <View style={[styles.tag, style]} {...rest}>
      <AppText variant="mapLabel" color={colors.themeTag.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.themeTag.background,
    borderRadius: radius.tag,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
