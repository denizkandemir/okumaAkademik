import { router } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { ConfirmDialog } from '@/design/components/confirm-dialog';
import { Eyebrow } from '@/design/components/eyebrow';
import { FeedbackPanel } from '@/design/components/feedback-panel';
import { IconButton } from '@/design/components/icon-button';
import { ProgressBar } from '@/design/components/progress-bar';
import { StateView } from '@/design/components/state-view';
import { ThemeTag } from '@/design/components/theme-tag';
import { BackIcon } from '@/design/icons';
import { colors, readingSize, screenPadding, size, type } from '@/design/tokens';
import { GlossaryCard } from '@/features/reading/glossary-card';
import { GlossaryText, type GlossaryEntry } from '@/features/reading/glossary-text';
import type { ReadingSessionResult, ReadingText } from '@/features/reading/types';
import { useReadingSession } from '@/features/reading/use-reading-session';
import { useHardwareBack } from '@/hooks/use-hardware-back';
import { getErrorMessage } from '@/lib/errors';

/** Okunacak metin: ders, kitaplık ya da seviye belirleme yanıtının ortak kısmı. */
export type StoryText = Omit<ReadingText, 'city'>;

/** Okuma ekranından çıkış: önceki ekrana, yoksa Yolculuk'a. */
export const leaveReading = () => (router.canGoBack() ? router.back() : router.replace('/'));

type ReadingViewProps = {
  text: StoryText;
  glossary: GlossaryEntry[];
  eyebrow: string;
  /** `true`: okumadan sonra sorular gelir ("OKUDUM, HAZIRIM"); `false`: "BİTİRDİM". */
  questionsNext: boolean;
  /** Okuma bitti olarak kaydedildikten sonra (ekran hâlâ açıksa) çağrılır. */
  onFinished: (result: ReadingSessionResult, readingSessionId: string) => void;
  /** Bırakma onayının açıklaması. */
  leaveMessage?: string;
  /** Geri ve "BIRAK": varsayılan `leaveReading`. */
  onLeave?: () => void;
};

/**
 * Okuma ekranı (08-okuma): metin, sözlük, yazı boyutu, ilerleme ve okuma oturumu. Ders, kitaplık
 * ve seviye belirleme akışları bunu kullanır; okumadan sonra ne olacağına `onFinished` karar verir.
 */
export function ReadingView({
  text,
  glossary,
  eyebrow,
  questionsNext,
  onFinished,
  onLeave = leaveReading,
  leaveMessage = 'İlerlemen kaydedilir; sonra kaldığın yerden okuyabilirsin.',
}: ReadingViewProps) {
  const insets = useSafeAreaInsets();
  const session = useReadingSession(text.id);
  const [fontSize, setFontSize] = useState<number>(readingSize.default);
  const [progress, setProgress] = useState(0);
  const [word, setWord] = useState<GlossaryEntry | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  // İlerleme = ekranın alt kenarının metin içindeki konumu / metnin toplam yüksekliği.
  const metrics = useRef({ offset: 0, viewport: 0, content: 0 });
  const updateProgress = () => {
    const { offset, viewport, content } = metrics.current;
    if (content <= 0 || viewport <= 0) return;
    const value = Math.min(1, (offset + viewport) / content);
    session.reportProgress(value);
    setProgress((previous) => Math.max(previous, value));
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

  // Kaydırarak geri (iOS) ile OKUDUM sürerken çıkılırsa, yanıt gelince yönlendirme yapılmaz.
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const leave = () => {
    setConfirmLeave(false);
    onLeave();
  };
  /** Geri (düğme ve Android geri): kaydedilirken yok sayılır; ilerleme varsa onay sorar. */
  const requestClose = () => {
    if (finishing) return;
    if (progress > 0) setConfirmLeave(true);
    else leave();
  };
  useHardwareBack(() => {
    if (word) setWord(null);
    else requestClose();
    return true;
  });

  const handleFinish = async () => {
    if (finishing) return;
    setFinishing(true);
    setFinishError(null);
    try {
      const result = await session.finish();
      if (!mounted.current) return;
      const readingSessionId = await session.sessionId();
      if (!readingSessionId)
        throw new Error('Okuman kaydedilemedi. İnternet bağlantını kontrol et.');
      if (!mounted.current) return;
      onFinished(result, readingSessionId);
    } catch (error) {
      setFinishError(getErrorMessage(error));
      setFinishing(false);
    }
  };

  const changeFontSize = (delta: number) =>
    setFontSize((value) => Math.min(Math.max(value + delta, readingSize.min), readingSize.max));
  const canShrink = fontSize > readingSize.min;
  const canGrow = fontSize < readingSize.max;
  const paragraphStyle = {
    fontSize,
    lineHeight: Math.round(fontSize * readingSize.lineHeightRatio),
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader profileLink={false} />
      <ReadingToolbar onBack={requestClose}>
        <ProgressBar
          progress={progress}
          accessibilityLabel="Okuma ilerlemesi"
          style={styles.grow}
        />
        <IconButton
          accessibilityLabel="Yazıyı küçült"
          accessibilityState={{ disabled: !canShrink }}
          disabled={!canShrink}
          onPress={() => changeFontSize(-readingSize.step)}
          style={!canShrink && styles.disabled}>
          <AppText variant="bodyStrong" maxFontSizeMultiplier={1.3}>
            A−
          </AppText>
        </IconButton>
        <IconButton
          accessibilityLabel="Yazıyı büyüt"
          accessibilityState={{ disabled: !canGrow }}
          disabled={!canGrow}
          onPress={() => changeFontSize(readingSize.step)}
          style={!canGrow && styles.disabled}>
          <AppText variant="bodyStrong" maxFontSizeMultiplier={1.3}>
            A+
          </AppText>
        </IconButton>
      </ReadingToolbar>

      <ScrollView
        style={styles.grow}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + (word ? 140 : 30) },
        ]}
        scrollEventThrottle={100}
        onScroll={onScroll}
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}>
        <View style={styles.article}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <AppText variant="title" accessibilityRole="header">
            {text.title}
          </AppText>
          <ThemeTag label={text.theme} style={styles.tag} />
          {glossary.length > 0 ? (
            <AppText variant="secondary" color={colors.textMuted}>
              Altı noktalı kelimelere dokun, anlamını söyleyeyim.
            </AppText>
          ) : null}

          <View style={styles.reader}>
            {text.paragraphs.map((paragraph, index) => (
              <GlossaryText
                key={index}
                paragraph={paragraph}
                glossary={glossary}
                onWordPress={setWord}
                style={[styles.paragraph, paragraphStyle]}
              />
            ))}
          </View>

          <View style={styles.footer}>
            <AppText variant="secondary" color={colors.textMuted}>
              Acele etme. Hikâyeyi anlamaya odaklan.
            </AppText>
            {finishError ? (
              <FeedbackPanel tone="wrong" title="Okuman kaydedilemedi" text={finishError} />
            ) : null}
            <Button
              title={questionsNext ? 'OKUDUM, HAZIRIM' : 'BİTİRDİM'}
              accessibilityLabel={questionsNext ? 'Okudum, hazırım' : 'Bitirdim'}
              loading={finishing}
              onPress={handleFinish}
            />
          </View>
        </View>
      </ScrollView>

      {word ? (
        <GlossaryCard entry={word} onClose={() => setWord(null)} bottomInset={insets.bottom} />
      ) : null}

      <ConfirmDialog
        visible={confirmLeave}
        title="Okumayı bırakmak istiyor musun?"
        message={leaveMessage}
        stayLabel="OKUMAYA DEVAM ET"
        leaveLabel="BIRAK"
        onStay={() => setConfirmLeave(false)}
        onLeave={leave}
      />
    </View>
  );
}

/** Üst çubuğun altındaki satır: geri düğmesi ve sağında verilen öğeler. */
function ReadingToolbar({ onBack, children }: { onBack: () => void; children?: ReactNode }) {
  return (
    <View style={styles.toolbar}>
      <IconButton accessibilityLabel="Geri" onPress={onBack}>
        <BackIcon />
      </IconButton>
      {children}
    </View>
  );
}

/** Metin yüklenirken ya da yüklenemediğinde. */
export function ReadingState({
  loading,
  error,
  onRetry,
  onBack = leaveReading,
}: {
  loading: boolean;
  error: unknown;
  onRetry: () => void;
  onBack?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader profileLink={false} />
      <ReadingToolbar onBack={onBack} />
      <View style={styles.state}>
        <StateView
          isLoading={loading}
          error={error}
          onRetry={onRetry}
          loadingLabel="Hikâyeyi hazırlıyorum…"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  grow: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: screenPadding,
    // .screen üst boşluğu 24, .screenhead alt boşluğu 25 (12 + içeriğin 13'ü).
    paddingTop: 24,
    paddingBottom: 12,
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: 13,
  },
  article: {
    width: '100%',
    maxWidth: size.maxContentWidth,
    alignSelf: 'center',
    gap: 8,
  },
  tag: {
    marginTop: 4,
  },
  reader: {
    marginVertical: 27,
    gap: 22,
  },
  paragraph: {
    fontFamily: type.reading.fontFamily,
    color: colors.readingText,
  },
  footer: {
    gap: 14,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  state: {
    flex: 1,
    paddingHorizontal: screenPadding,
    paddingTop: 24,
  },
});
