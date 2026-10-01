import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { LevelBadge } from '@/features/reading/level-badge';
import { LevelLabels, readingTexts } from '@/features/reading/mock-data';
import { useTheme } from '@/hooks/use-theme';

export default function LibraryScreen() {
  const theme = useTheme();

  return (
    <Screen withTabBar>
      <View style={styles.header}>
        <ThemedText type="title">Kitaplığım</ThemedText>
        <ThemedText themeColor="textSecondary">Okumak istediğin metni seç.</ThemedText>
      </View>

      <View style={styles.list}>
        {readingTexts.map((text) => (
          <Link key={text.id} href={{ pathname: '/reading/[id]', params: { id: text.id } }} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${text.title}. Seviye ${text.level}, ${LevelLabels[text.level]}. Yaklaşık ${text.estimatedMinutes} dakika.`}
              style={({ pressed }) => pressed && styles.pressed}>
              {/* Link asChild web'de fonksiyon tipindeki style'ı iletmediği için görsel stil içeride. */}
              <View
                style={[
                  styles.item,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                ]}>
                <ThemedText type="subtitle">{text.title}</ThemedText>
                <View style={styles.meta}>
                  <LevelBadge level={text.level} />
                  <ThemedText themeColor="textSecondary">
                    ~{text.estimatedMinutes} dakika
                  </ThemedText>
                </View>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
  list: {
    gap: Spacing.three,
  },
  item: {
    minHeight: MinTouchSize,
    padding: Spacing.four,
    borderRadius: Radius.large,
    borderWidth: 2,
    gap: Spacing.two,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.three,
  },
  pressed: {
    opacity: 0.8,
  },
});
