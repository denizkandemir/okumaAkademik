import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { QueryState } from '@/components/query-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, MinTouchSize, Radius, ReadingFont, Spacing } from '@/constants/theme';
import { LevelBadge } from '@/features/reading/level-badge';
import type { ReadingText } from '@/features/reading/types';
import { useReadingSession } from '@/features/reading/use-reading-session';
import { useApiQuery } from '@/hooks/use-api-query';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

function leaveReading() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function ReadingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, error, isLoading, refetch } = useApiQuery<{ text: ReadingText }>(
    id ? `/texts/${encodeURIComponent(id)}` : null,
  );
  const text = data?.text;

  if (error instanceof ApiError && error.status === 404) {
    return (
      <ThemedView style={styles.centered}>
        <Stack.Screen options={{ title: 'Metin bulunamadı' }} />
        <ThemedText type="subtitle">Bu metni bulamadık.</ThemedText>
        <Button title="Kitaplığa dön" onPress={() => router.replace('/library')} />
      </ThemedView>
    );
  }

  if (!text || error) {
    return (
      <ThemedView style={styles.centered}>
        <Stack.Screen options={{ title: '' }} />
        <QueryState
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          loadingLabel="Metin yükleniyor…"
        />
      </ThemedView>
    );
  }

  return <ReadingView text={text} />;
}

function ReadingView({ text }: { text: ReadingText }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [fontSize, setFontSize] = useState<number>(ReadingFont.default);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const session = useReadingSession(text.id);

  // İlerleme = ekranın alt kenarının metin içindeki konumu / metnin toplam yüksekliği.
  const metrics = useRef({ offset: 0, viewport: 0, content: 0 });
  const updateProgress = () => {
    const { offset, viewport, content } = metrics.current;
    if (content > 0 && viewport > 0) session.reportProgress((offset + viewport) / content);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    metrics.current = {
      offset: contentOffset.y,
      viewport: layoutMeasurement.height,
      content: contentSize.height,
    };
    updateProgress();
  };
  const onLayout = (event: LayoutChangeEvent) => {
    metrics.current.viewport = event.nativeEvent.layout.height;
    updateProgress();
  };
  const onContentSizeChange = (_width: number, height: number) => {
    metrics.current.content = height;
    updateProgress();
  };

  const handleFinish = async () => {
    setFinishing(true);
    setFinishError(null);
    try {
      await session.finish();
      leaveReading();
    } catch (error) {
      setFinishError(getErrorMessage(error));
      setFinishing(false);
    }
  };

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
        onScroll={onScroll}
        scrollEventThrottle={100}
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}
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

          <View style={styles.finish}>
            {finishError ? (
              <ThemedText themeColor="danger" accessibilityRole="alert">
                {finishError}
              </ThemedText>
            ) : null}
            <Button title="Bitirdim" onPress={handleFinish} loading={finishing} />
          </View>
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
  centered: {
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
  finish: {
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
});
