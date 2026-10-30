import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FlameIcon, LokumIcon } from '../icons';
import { colors, size, type } from '../tokens';
import { AppText } from './app-text';

import { usePlayerSummary } from '@/features/game/use-player-summary';

/**
 * Üst çubuk: solda logo; sağda seri (alev), lokum (altıgen) ve ad baş harfli avatar. Avatara
 * dokununca Profil sekmesi açılır. Sayılar gelene kadar yalnızca logo ve avatar görünür.
 */
export function AppHeader() {
  const { name, streak, lokum } = usePlayerSummary();
  const initial = name.trim().charAt(0).toLocaleUpperCase('tr-TR') || '?';

  return (
    <View style={styles.bar}>
      <Text
        style={[type.brand, styles.brand]}
        maxFontSizeMultiplier={1.3}
        accessibilityRole="header"
        accessibilityLabel="okumatik">
        oku<Text style={styles.brandAccent}>matik</Text>
      </Text>
      <View style={styles.stats}>
        {streak != null ? (
          <View style={styles.stat} accessible accessibilityLabel={`${streak} günlük seri`}>
            <FlameIcon size={20} />
            <AppText variant="bodyStrong" maxFontSizeMultiplier={1.5}>
              {streak}
            </AppText>
          </View>
        ) : null}
        {lokum != null ? (
          <View style={styles.stat} accessible accessibilityLabel={`${lokum} lokum`}>
            <LokumIcon size={20} />
            <AppText variant="bodyStrong" maxFontSizeMultiplier={1.5}>
              {lokum.toLocaleString('tr-TR')}
            </AppText>
          </View>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={name ? `Profil, ${name}` : 'Profil'}
          onPress={() => router.navigate('/profile')}
          style={styles.avatarTouch}>
          <View style={styles.avatar}>
            <AppText variant="bodyStrong" color={colors.avatar.text} maxFontSizeMultiplier={1.3}>
              {initial}
            </AppText>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: size.header,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: {
    color: colors.text,
  },
  brandAccent: {
    color: colors.logoAccent,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  avatarTouch: {
    width: size.touch,
    height: size.touch,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -7,
  },
  avatar: {
    width: size.avatar,
    height: size.avatar,
    borderRadius: size.avatar / 2,
    backgroundColor: colors.avatar.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
