import type { ComponentType } from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconProps } from '../icons';
import { colors, size } from '../tokens';
import { AppText } from './app-text';

/**
 * Alt sekme çubuğu: 70 dp + alt güvenli alan, `surface` zemin, üstte ince çizgi. Öğeler
 * `TabBarItem`'dır. expo-router/ui ile `<TabList asChild><TabBar>…` olarak kullanılır.
 */
export function TabBar({ children, style, ...rest }: ViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      {...rest}
      accessibilityRole="tablist"
      style={[
        styles.bar,
        {
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + 7,
          paddingRight: insets.right + 7,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

export type TabBarItemProps = Omit<PressableProps, 'children'> & {
  label: string;
  Icon: ComponentType<IconProps>;
  /** expo-router/ui'nin `TabTrigger asChild`'ı verir. */
  isFocused?: boolean;
};

/** Sekme: ikon (22) ve etiket (12). Aktif sekmede ikon açık bir hapın içinde, ikisi vurgu renginde. */
export function TabBarItem({ label, Icon, isFocused = false, style, ...rest }: TabBarItemProps) {
  const color = isFocused ? colors.tab.active : colors.tab.inactive;
  return (
    <Pressable
      {...rest}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      style={(state) => [styles.item, typeof style === 'function' ? style(state) : style]}>
      <View style={[styles.pill, isFocused && styles.pillActive]}>
        <Icon size={size.tabIcon} color={color} />
      </View>
      <AppText variant="tab" color={color} numberOfLines={1} maxFontSizeMultiplier={1.3}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  item: {
    flex: 1,
    height: size.tabBar,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  pill: {
    width: size.tabPill.width,
    height: size.tabPill.height,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: colors.tab.pill,
  },
});
