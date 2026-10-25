import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth, MinTouchSize, ReadingFont } from '@/constants/theme';
import { LessonCompleteView } from '@/features/game/rewards/lesson-complete-view';
import { CITY_INFO, GameColors, GameFonts } from '@/features/game/theme';
import type { LessonDetailResponse } from '@/features/game/types';
import { ConfirmDialog } from '@/features/game/ui/confirm-dialog';
import { GameButton } from '@/features/game/ui/game-button';
import { CloseIcon } from '@/features/game/ui/icons';
import { ProgressFills, ProgressTrack } from '@/features/game/ui/progress-track';
import { SquareButton } from '@/features/game/ui/square-button';
import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';
import { GlossaryText, type GlossaryEntry } from '@/features/reading/glossary-text';
import type { ReadingSessionResult, ReadingText } from '@/features/reading/types';
import { useReadingSession } from '@/features/reading/use-reading-session';
import { useApiQuery } from '@/hooks/use-api-query';
import { useHardwareBack } from '@/hooks/use-hardware-back';
import { getErrorMessage } from '@/lib/errors';

/** Okuma ekranının zemini (S04Okuma). */
const BACKGROUND = '#FFF9EF';
const DEFAULT_BUBBLE = 'Mor kelimelere dokun, anlamını söyleyeyim!';

type LessonContext = { id: string; title: string; caption: string };

/**
 * Okuma ekranı (S04Okuma). `lessonId` ile açılırsa ders akışıdır: BİTİRDİM'den sonra sorular gelir.
 * `lessonId` yoksa kitaplıktan serbest okumadır: soru ve ödül olmadan bitiş ekranıyla biter.
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
  const text: ReadingText | undefined = lessonId
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
    ? {
        id: lessonData.lesson.id,
        title: lessonData.lesson.title,
        caption: `${CITY_INFO[lessonData.lesson.city].upperName} · DERS ${lessonData.lesson.position}`,
      }
    : null;

  return <ReadingView text={text} glossary={lessonData?.glossary ?? []} lesson={lesson} />;
}

function ReadingView({
  text,
  glossary,
  lesson,
}: {
  text: ReadingText;
  glossary: GlossaryEntry[];
  lesson: LessonContext | null;
}) {
  const insets = useSafeAreaInsets();
  const session = useReadingSession(text.id);
  const [fontSize, setFontSize] = useState<number>(ReadingFont.default);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bubble, setBubble] = useState(DEFAULT_BUBBLE);
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

  // Kaydırarak geri (iOS) ile BİTİRDİM sürerken çıkılırsa, yanıt gelince yönlendirme yapılmaz.
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
  /** Kapat (X ve Android geri): BİTİRDİM kaydedilirken yok sayılır; ilerleme varsa onay sorar. */
  const requestClose = () => {
    if (finishing) return;
    if (progress > 0) setConfirmLeave(true);
    else leave();
  };
  useHardwareBack(() => {
    if (freeResult) leave();
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
    setFontSize((size) => Math.min(Math.max(size + delta, ReadingFont.min), ReadingFont.max));

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <SquareButton accessibilityLabel="Kapat" onPress={requestClose}>
          <CloseIcon size={20} color={GameColors.textWarmSecondary} />
        </SquareButton>
        <ProgressTrack
          progress={progress}
          height={14}
          fill={ProgressFills.purple}
          trackColor="#EFE2CF"
          accessibilityLabel="Okuma ilerlemesi"
          style={styles.progress}
        />
        <SquareButton
          accessibilityLabel="Yazı boyutu"
          accessibilityState={{ expanded: fontMenuOpen }}
          onPress={() => setFontMenuOpen((open) => !open)}>
          <Text style={styles.aa}>Aa</Text>
        </SquareButton>
      </View>

      {fontMenuOpen ? (
        <View style={[styles.fontMenu, { top: insets.top + 68 }]}>
          <FontButton
            label="A−"
            accessibilityLabel="Yazıyı küçült"
            disabled={fontSize <= ReadingFont.min}
            onPress={() => changeFontSize(-ReadingFont.step)}
          />
          <FontButton
            label="A+"
            accessibilityLabel="Yazıyı büyüt"
            disabled={fontSize >= ReadingFont.max}
            onPress={() => changeFontSize(ReadingFont.step)}
          />
        </View>
      ) : null}

      <ScrollView
        style={styles.scroll}
        onScroll={onScroll}
        scrollEventThrottle={100}
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}
        contentContainerStyle={styles.content}>
        <View style={styles.article}>
          <Text style={styles.caption}>{lesson ? lesson.caption : 'KİTAPLIK'}</Text>
          <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
            {text.title}
          </Text>
          {text.paragraphs.map((paragraph, index) => (
            <GlossaryText
              key={index}
              paragraph={paragraph}
              glossary={glossary}
              onWordPress={(entry) => setBubble(`“${entry.word}”: ${entry.meaning}`)}
              style={[
                styles.paragraph,
                { fontSize, lineHeight: Math.round(fontSize * ReadingFont.lineHeightRatio) },
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.mascotRow}>
          <Mascot pose="read" size={72} />
          <View style={styles.bubble}>
            <MascotBubble
              tone="game"
              text={glossary.length > 0 ? bubble : 'Bitirince BİTİRDİM’e bas!'}
            />
          </View>
        </View>
        {finishError ? (
          <Text style={styles.error} accessibilityRole="alert">
            {finishError}
          </Text>
        ) : null}
        <GameButton
          variant="purple"
          title="BİTİRDİM"
          accessibilityLabel="Bitirdim"
          loading={finishing}
          onPress={handleFinish}
        />
      </View>

      <ConfirmDialog
        visible={confirmLeave}
        title="Okumayı bırakmak istiyor musun?"
        message="İlerlemen kaydedilir; sonra kaldığın yerden okuyabilirsin."
        stayLabel="Okumaya devam et"
        leaveLabel="Bırak"
        onStay={() => setConfirmLeave(false)}
        onLeave={leave}
      />
    </View>
  );
}

function FontButton({
  label,
  accessibilityLabel,
  disabled,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.fontButton,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <Text style={styles.fontButtonText}>{label}</Text>
    </Pressable>
  );
}

/** Yükleniyor ya da hata: aynı krem zeminde kapat düğmesi ve Pırıl. */
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
  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <SquareButton
          accessibilityLabel="Kapat"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
          <CloseIcon size={20} color={GameColors.textWarmSecondary} />
        </SquareButton>
      </View>
      <View style={styles.state}>
        <Mascot pose={error ? 'think' : 'read'} size={140} />
        <MascotBubble
          tone="game"
          side="top"
          align="center"
          text={
            error ? `Hımm, hikâyeyi açamadım. ${getErrorMessage(error)}` : 'Hikâyeyi hazırlıyorum…'
          }
        />
        {error && !loading ? (
          <GameButton title="TEKRAR DENE" accessibilityLabel="Tekrar dene" onPress={onRetry} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  progress: {
    flex: 1,
  },
  aa: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 17,
    color: '#5B34D6',
  },
  fontMenu: {
    position: 'absolute',
    right: 16,
    zIndex: 2,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderRadius: 18,
    backgroundColor: GameColors.white,
    boxShadow: '0 10px 24px rgba(150,90,40,0.18)',
  },
  fontButton: {
    minWidth: MinTouchSize + 8,
    minHeight: MinTouchSize,
    borderRadius: 14,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontButtonText: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 18,
    color: '#5B34D6',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  article: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: 14,
  },
  caption: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.8,
    color: '#7A5A44',
    marginBottom: -10,
  },
  title: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 30,
    lineHeight: 36,
    color: GameColors.warm,
  },
  paragraph: {
    fontFamily: GameFonts.body,
    color: GameColors.warm,
  },
  bottom: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
    backgroundColor: BACKGROUND,
    boxShadow: '0 -8px 16px rgba(150,90,40,0.08)',
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  bubble: {
    flex: 1,
    marginBottom: 14,
  },
  error: {
    fontFamily: GameFonts.bodyBold,
    fontSize: 14,
    color: '#B42318',
    textAlign: 'center',
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
});
