import { router, useLocalSearchParams } from 'expo-router';
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

import { CITIES } from '@/design/cities';
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
import { LessonCompleteView } from '@/features/game/rewards/lesson-complete-view';
import type { CityId } from '@/features/game/theme';
import type { LessonDetailResponse } from '@/features/game/types';
import { GlossaryCard } from '@/features/reading/glossary-card';
import { GlossaryText, type GlossaryEntry } from '@/features/reading/glossary-text';
import type { ReadingSessionResult, ReadingText } from '@/features/reading/types';
import { useReadingSession } from '@/features/reading/use-reading-session';
import { useApiQuery } from '@/hooks/use-api-query';
import { useHardwareBack } from '@/hooks/use-hardware-back';
import { getErrorMessage } from '@/lib/errors';

/** Okunacak metin: ders ya da kitaplık yanıtının ortak kısmı. */
type StoryText = Omit<ReadingText, 'city'>;
type LessonContext = { id: string; title: string };

/**
 * Okuma ekranı (08-okuma). `lessonId` ile açılırsa ders akışıdır: OKUDUM, HAZIRIM'dan sonra
 * sorular gelir. `lessonId` yoksa kitaplıktan serbest okumadır: soru ve ödül olmadan bitiş
 * ekranıyla biter.
 */
export default function ReadingScreen() {
  const { id, lessonId } = useLocalSearchParams<{ id: string; lessonId?: string }>();
  const lessonQuery = useApiQuery<LessonDetailResponse>(
    lessonId ? `/lessons/${encodeURIComponent(lessonId)}` : null,
  );
  const textQuery = useApiQuery<{ text: ReadingText }>(
    !lessonId && id ? `/texts/${encodeURIComponent(id)}` : null,
  );

  const query = lessonId ? lessonQuery : textQuery;
  const lessonData = lessonQuery.data;
  const text: StoryText | undefined = lessonId
    ? (lessonData?.text ?? undefined)
    : textQuery.data?.text;

  if (!text) {
    return (
      <ReadingState
        loading={query.isLoading}
        error={
          query.error ??
          (lessonData && !lessonData.text ? new Error('Bu derste okunacak metin yok.') : null)
        }
        onRetry={query.refetch}
      />
    );
  }

  const lesson: LessonContext | null = lessonData
    ? { id: lessonData.lesson.id, title: lessonData.lesson.title }
    : null;
  const eyebrow = lessonData
    ? `${cityLabel(lessonData.lesson.city)} · OKUMA ${String(lessonData.lesson.position).padStart(2, '0')}`
    : [cityLabel(textQuery.data?.text.city ?? null), 'KİTAPLIK'].filter(Boolean).join(' · ');

  return (
    <ReadingView
      text={text}
      glossary={lessonData?.glossary ?? []}
      lesson={lesson}
      eyebrow={eyebrow}
    />
  );
}

function cityLabel(city: CityId | null): string | null {
  return city ? CITIES[city].name.toLocaleUpperCase('tr-TR') : null;
}

function ReadingView({
  text,
  glossary,
  lesson,
  eyebrow,
}: {
  text: StoryText;
  glossary: GlossaryEntry[];
  lesson: LessonContext | null;
  eyebrow: string;
}) {
  const insets = useSafeAreaInsets();
  const session = useReadingSession(text.id);
  const [fontSize, setFontSize] = useState<number>(readingSize.default);
  const [progress, setProgress] = useState(0);
  const [word, setWord] = useState<GlossaryEntry | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [freeResult, setFreeResult] = useState<ReadingSessionResult | null>(null);

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
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };
  /** Geri (düğme ve Android geri): kaydedilirken yok sayılır; ilerleme varsa onay sorar. */
  const requestClose = () => {
    if (finishing) return;
    if (progress > 0) setConfirmLeave(true);
    else leave();
  };
  useHardwareBack(() => {
    if (freeResult) leave();
    else if (word) setWord(null);
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
      if (!lesson) {
        setFreeResult(result);
        return;
      }
      const readingSessionId = await session.sessionId();
      if (!readingSessionId)
        throw new Error('Okuman kaydedilemedi. İnternet bağlantını kontrol et.');
      if (!mounted.current) return;
      router.replace({
        pathname: '/lesson/[id]/quiz',
        params: { id: lesson.id, readingSessionId },
      });
    } catch (error) {
      setFinishError(getErrorMessage(error));
      setFinishing(false);
    }
  };

  if (freeResult) {
    return (
      <LessonCompleteView
        title={text.title}
        durationSeconds={freeResult.durationSeconds}
        lokum={null}
        correct={null}
        stars={null}
        note={null}
        onContinue={leave}
      />
    );
  }

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
      <Toolbar onBack={requestClose}>
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
      </Toolbar>

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
              title={lesson ? 'OKUDUM, HAZIRIM' : 'BİTİRDİM'}
              accessibilityLabel={lesson ? 'Okudum, hazırım' : 'Bitirdim'}
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
        message="İlerlemen kaydedilir; sonra kaldığın yerden okuyabilirsin."
        stayLabel="OKUMAYA DEVAM ET"
        leaveLabel="BIRAK"
        onStay={() => setConfirmLeave(false)}
        onLeave={leave}
      />
    </View>
  );
}

/** Üst çubuğun altındaki satır: geri düğmesi ve sağında verilen öğeler. */
function Toolbar({ onBack, children }: { onBack: () => void; children?: ReactNode }) {
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
function ReadingState({
  loading,
  error,
  onRetry,
}: {
  loading: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  const insets = useSafeAreaInsets();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader profileLink={false} />
      <Toolbar onBack={close} />
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
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: 8,
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
    marginVertical: 20,
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
