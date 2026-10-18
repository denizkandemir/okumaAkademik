import { LinearGradient } from 'expo-linear-gradient';
import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import type { ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBar } from '@/constants/theme';
import { useCurrentCity } from '@/features/game/current-city';
import { GameFonts, READABLE_BANNERS } from '@/features/game/theme';
import {
  BadgeIcon,
  BookIcon,
  HouseIcon,
  PersonIcon,
  type IconProps,
} from '@/features/game/ui/icons';

/** Seçili olmayan sekmenin ikon ve yazı rengi (AnaSayfa.dc.html #5B4A60; beyaz üzerinde 8:1). */
const INACTIVE_COLOR = '#5B4A60';
const ACTIVE_COLOR = '#FFFFFF';

/**
 * Yüzen sekme çubuğu (AnaSayfa.dc.html `<nav>`): güvenli alanın 14 dp üstünde, beyaz, köşe 26,
 * yükseklik 70. Seçili sekme şehrin başlık gradyanıyla dolu bir haptır. Tüm platformlarda aynı
 * (expo-router/ui'nin başsız sekmeleri).
 */
export default function AppTabs() {
  return (
    <Tabs style={styles.tabs}>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <FloatingTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton label="Yol" Icon={HouseIcon} />
          </TabTrigger>
          <TabTrigger name="library" href="/library" asChild>
            <TabButton label="Kitaplık" Icon={BookIcon} />
          </TabTrigger>
          <TabTrigger name="badges" href="/badges" asChild>
            <TabButton label="Rozetler" Icon={BadgeIcon} />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton label="Profil" Icon={PersonIcon} />
          </TabTrigger>
        </FloatingTabList>
      </TabList>
    </Tabs>
  );
}

function FloatingTabList({ children, style: _style, ...props }: ViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.listContainer, { bottom: insets.bottom + TabBar.gap }]}>
      <View {...props} accessibilityRole="tablist" style={styles.list}>
        {children}
      </View>
    </View>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  Icon: ComponentType<IconProps>;
};

function TabButton({ label, Icon, isFocused = false, ...props }: TabButtonProps) {
  const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;
  // Kullanıcının şu anki şehri; ana sayfa GET /me/journey ile günceller.
  const banner = READABLE_BANNERS[useCurrentCity()];

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      style={({ pressed }) => [styles.button, pressed && !isFocused && styles.pressed]}>
      {isFocused ? (
        <LinearGradient
          colors={banner.colors}
          start={banner.start}
          end={banner.end}
          style={[StyleSheet.absoluteFill, styles.pill]}
        />
      ) : null}
      <Icon size={22} color={color} />
      <Text style={[styles.label, { color }]} numberOfLines={1} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
  },
  slot: {
    flex: 1,
  },
  listContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: TabBar.gap,
  },
  list: {
    width: '100%',
    maxWidth: TabBar.maxWidth,
    height: TabBar.height,
    borderRadius: 26,
    padding: 6,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.94)',
    boxShadow: '0 12px 30px rgba(20,10,50,0.22)',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  pill: {
    borderRadius: 20,
  },
  pressed: {
    backgroundColor: 'rgba(91,74,96,0.08)',
  },
  label: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 12,
    lineHeight: 16,
  },
});
