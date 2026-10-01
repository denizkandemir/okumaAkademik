import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, MinTouchSize, Radius, ReadingFont, Spacing } from '@/constants/theme';
import { LevelBadge } from '@/features/reading/level-badge';
import { getReadingText } from '@/features/reading/mock-data';
import { useTheme } from '@/hooks/use-theme';

export default function ReadingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const text = getReadingText(id);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [fontSize, setFontSize] = useState<number>(ReadingFont.default);

  if (!text) {
    return (
      <ThemedView style={styles.notFound}>
        <Stack.Screen options={{ title: 'Metin bulunamadı' }} />
        <ThemedText type="subtitle">Bu metni bulamadık.</ThemedText>
        <Button title="Kitaplığa dön" onPress={() => router.replace('/library')} />
      </ThemedView>
    );
  }

  const canDecrease = fontSize > ReadingFont.min;
  const canIncrease = fontSize < ReadingFont.max;
  const changeFontSize = (delta: number) =>
    setFontSize((size) => Math.min(Math.max(size + delta, ReadingFont.min), ReadingFont.max));

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: text.title }} />

      <View style={[styles.toolbar, { borderColor: theme.border }]}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Yazı boyutu
        </ThemedText>
        <View style={styles.fontControls}>
          <FontSizeButton
            label="A−"
            accessibilityLabel="Yazıyı küçült"
            disabled={!canDecrease}
            onPress={() => changeFontSize(-ReadingFont.step)}
          />
          <FontSizeButton
            label="A+"
            accessibilityLabel="Yazıyı büyüt"
            disabled={!canIncrease}
            onPress={() => changeFontSize(ReadingFont.step)}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + Spacing.five,
            paddingLeft: insets.left + Spacing.four,
            paddingRight: insets.right + Spacing.four,
          },
        ]}>
        <View style={styles.article}>
          <ThemedText type="title">{text.title}</ThemedText>
          <View style={styles.meta}>
            <LevelBadge level={text.level} />
            <ThemedText themeColor="textSecondary">~{text.estimatedMinutes} dakika</ThemedText>
          </View>

          {text.paragraphs.map((paragraph, index) => (
            <ThemedText
              key={index}
              style={[
                styles.paragraph,
                { fontSize, lineHeight: Math.round(fontSize * ReadingFont.lineHeightRatio) },
              ]}>
              {paragraph}
            </ThemedText>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

type FontSizeButtonProps = {
  label: string;
  accessibilityLabel: string;
  disabled: boolean;
  onPress: () => void;
};

function FontSizeButton({ label, accessibilityLabel, disabled, onPress }: FontSizeButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.fontButton,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <ThemedText type="subtitle">{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    padding: Spacing.four,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
  fontControls: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  fontButton: {
    minWidth: MinTouchSize + Spacing.two,
    minHeight: MinTouchSize + Spacing.two,
    borderWidth: 2,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.four,
  },
  article: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  paragraph: {
    fontWeight: 400,
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
});
