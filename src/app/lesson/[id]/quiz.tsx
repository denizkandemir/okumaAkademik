import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { ConfirmDialog } from '@/design/components/confirm-dialog';
import { Eyebrow } from '@/design/components/eyebrow';
import { FeedbackPanel } from '@/design/components/feedback-panel';
import { IconButton } from '@/design/components/icon-button';
import { OptionCard, type OptionState } from '@/design/components/option-card';
import { ProgressBar } from '@/design/components/progress-bar';
import { StateView } from '@/design/components/state-view';
import { BackIcon } from '@/design/icons';
import { colors, screenPadding, size } from '@/design/tokens';
import { TextSheet } from '@/features/game/quiz/text-sheet';
import { setReward } from '@/features/game/reward-store';
import type {
  AnswerRequest,
  AnswerResponse,
  CompleteLessonRequest,
  CompleteLessonResponse,
  LessonDetailResponse,
} from '@/features/game/types';
import { Mascot } from '@/features/mascot/mascot';
import { useApiQuery } from '@/hooks/use-api-query';
import { useHardwareBack } from '@/hooks/use-hardware-back';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

const LETTERS = ['A', 'B', 'C', 'D'];
/** API ipucu boşsa yanlış cevaptan sonra gösterilir (10-yanlis-cevap). */
const DEFAULT_HINT = 'İpucunu metinde bulabilirsin. Her deneme öğrenmenin bir parçası.';
const MASCOT_SIZE = 96;

/** Anlama soruları (09-11): okuma bitince açılır; okuma oturumu kimliği olmadan açılmaz. */
export default function QuizScreen() {
  const { id, readingSessionId } = useLocalSearchParams<{
    id: string;
    readingSessionId?: string;
  }>();
  const { data, error, isLoading, refetch } = useApiQuery<LessonDetailResponse>(
    id ? `/lessons/${encodeURIComponent(id)}` : null,
  );

  if (data && readingSessionId && data.questions.length > 0) {
    return <Quiz data={data} readingSessionId={readingSessionId} />;
  }

  const problem = !readingSessionId
    ? 'Önce hikâyeyi okuyalım.'
    : error
      ? `Hımm, soruları açamadım. ${getErrorMessage(error)}`
      : data
        ? 'Bu derste soru yok.'
        : null;
  return (
    <QuizState
      loading={isLoading && !problem}
      message={problem}
      onRetry={error ? refetch : undefined}
    />
  );
}

function Quiz({
  data,
  readingSessionId,
}: {
  data: LessonDetailResponse;
  readingSessionId: string;
}) {
  const insets = useSafeAreaInsets();
  const questions = [...data.questions].sort((a, b) => a.position - b.position);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  /** Bu soruda yanlış bulunan şıklar: işaretli ve dokunulamaz kalır. */
  const [wrongChoices, setWrongChoices] = useState<ReadonlySet<number>>(new Set());
  const [feedback, setFeedback] = useState<AnswerResponse | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  // Sonucu ekran okuyucuya söyle ve odağı geri bildirim paneline taşı.
  const feedbackRef = useRef<ViewInstance>(null);
  useEffect(() => {
    if (!feedback) return;
    AccessibilityInfo.announceForAccessibility(feedback.correct ? 'Doğru!' : 'Tekrar deneyelim');
    const timer = setTimeout(() => {
      if (feedbackRef.current) {
        AccessibilityInfo.sendAccessibilityEvent(feedbackRef.current, 'focus');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Geri (düğme ve Android geri) onay sorar; ders bitirilirken yok sayılır, yoksa yanıt gelince
  // uygulama kendiliğinden ders sonu ekranına gider.
  const requestLeave = () => {
    if (!completing) setConfirmLeave(true);
  };
  useHardwareBack(() => {
    requestLeave();
    return true;
  });

  const question = questions[index];
  if (!question) return null;
  const isLast = index === questions.length - 1;
  const answered = index + (feedback?.correct ? 1 : 0);

  const check = async () => {
    if (selected == null || checking) return;
    setChecking(true);
    setCheckError(null);
    try {
      const body: AnswerRequest = {
        readingSessionId,
        questionId: question.id,
        choiceIndex: selected,
      };
      const result = await api.post<AnswerResponse>(
        `/lessons/${encodeURIComponent(data.lesson.id)}/answers`,
        body,
      );
      if (result.correct) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } else {
        setWrongChoices((previous) => new Set(previous).add(selected));
      }
      setFeedback(result);
    } catch (error) {
      setCheckError(getErrorMessage(error));
    } finally {
      setChecking(false);
    }
  };

  const retry = () => {
    setFeedback(null);
    setSelected(null);
  };

  const choose = (choice: number) => {
    // Yanlış cevaptan sonra başka bir şık seçmek de yeniden denemektir.
    if (feedback && !feedback.correct) setFeedback(null);
    setSelected(choice);
  };

  const next = async () => {
    if (!isLast) {
      setIndex(index + 1);
      setSelected(null);
      setFeedback(null);
      setWrongChoices(new Set());
      return;
    }
    if (completing) return;
    setCompleting(true);
    setCompleteError(null);
    try {
      const body: CompleteLessonRequest = { readingSessionId };
      const result = await api.post<CompleteLessonResponse>(
        `/lessons/${encodeURIComponent(data.lesson.id)}/complete`,
        body,
      );
      setReward({
        lessonId: data.lesson.id,
        lessonTitle: data.lesson.title,
        kind: 'story',
        city: data.lesson.city,
        result,
        note: feedback?.correct ? feedback.explanation : undefined,
      });
      router.replace({ pathname: '/lesson/[id]/complete', params: { id: data.lesson.id } });
    } catch (error) {
      setCompleteError(getErrorMessage(error));
      setCompleting(false);
    }
  };

  const leave = () => {
    setConfirmLeave(false);
    router.dismissTo('/');
  };

  const optionState = (choice: number): OptionState => {
    if (wrongChoices.has(choice)) return 'wrong';
    if (feedback?.correct) return choice === selected ? 'correct' : 'disabled';
    if (checking) return choice === selected ? 'selected' : 'disabled';
    return choice === selected ? 'selected' : 'default';
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader profileLink={false} />
      <View style={styles.toolbar}>
        <IconButton accessibilityLabel="Geri" onPress={requestLeave}>
          <BackIcon />
        </IconButton>
        <ProgressBar
          progress={answered / questions.length}
          accessibilityLabel={`${questions.length} sorudan ${answered} tanesi yanıtlandı`}
          style={styles.grow}
        />
        <AppText variant="mapLabel" color={colors.textMuted} accessibilityElementsHidden>
          {index + 1} / {questions.length}
        </AppText>
      </View>

      <ScrollView
        style={styles.grow}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}>
        <View style={styles.column}>
          <Eyebrow>PIRIL MERAK EDİYOR</Eyebrow>
          <View style={styles.questionRow}>
            <Mascot pose={feedback?.correct ? 'happy' : 'think'} size={MASCOT_SIZE} />
            <AppText
              variant="question"
              accessibilityRole="header"
              accessibilityLabel={`Soru ${index + 1} / ${questions.length}: ${question.prompt}`}
              style={styles.grow}>
              {question.prompt}
            </AppText>
          </View>

          <View style={styles.options} accessibilityRole="radiogroup">
            {question.options.map((option, choice) => (
              <OptionCard
                key={choice}
                letter={LETTERS[choice] ?? String(choice + 1)}
                text={option}
                state={optionState(choice)}
                onPress={() => choose(choice)}
              />
            ))}
          </View>

          {feedback ? (
            <View ref={feedbackRef} accessible={false} style={styles.feedback}>
              {feedback.correct ? (
                <FeedbackPanel
                  tone="right"
                  title="Evet, tam da öyle!"
                  text={feedback.explanation}
                  extra={feedback.lokum > 0 ? `+${feedback.lokum} lokum` : undefined}
                />
              ) : (
                <FeedbackPanel
                  tone="wrong"
                  title="Bir daha bakalım mı?"
                  text={feedback.hint.trim() || DEFAULT_HINT}
                />
              )}
            </View>
          ) : null}

          {feedback?.correct ? (
            <>
              {completeError ? (
                <FeedbackPanel tone="wrong" title="Dersi kaydedemedim" text={completeError} />
              ) : null}
              <Button
                title={isLast ? 'DEVAM ET' : 'SONRAKİ SORU'}
                accessibilityLabel={isLast ? 'Devam et' : 'Sonraki soru'}
                loading={completing}
                onPress={next}
              />
            </>
          ) : feedback ? (
            <>
              <Button title="TEKRAR DENE" accessibilityLabel="Tekrar dene" onPress={retry} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Metne bak"
                onPress={() => setShowText(true)}
                style={styles.link}>
                <AppText color={colors.textMuted} style={styles.linkText}>
                  Metne bak
                </AppText>
              </Pressable>
            </>
          ) : (
            <>
              {checkError ? (
                <FeedbackPanel tone="wrong" title="Cevabını gönderemedim" text={checkError} />
              ) : null}
              <Button
                title="KONTROL ET"
                accessibilityLabel="Kontrol et"
                disabled={selected == null}
                loading={checking}
                onPress={check}
              />
            </>
          )}
        </View>
      </ScrollView>

      <TextSheet
        visible={showText}
        title={data.text?.title ?? data.lesson.title}
        paragraphs={data.text?.paragraphs ?? []}
        onClose={() => setShowText(false)}
      />
      <ConfirmDialog
        visible={confirmLeave}
        title="Soruları bırakmak istiyor musun?"
        message="Dersi bitirmek için hikâyeyi yeniden okuman gerekecek."
        stayLabel="DEVAM ET"
        leaveLabel="BIRAK"
        onStay={() => setConfirmLeave(false)}
        onLeave={leave}
      />
    </View>
  );
}

/** Sorular yüklenirken, yüklenemediğinde ya da açılamadığında. */
function QuizState({
  loading,
  message,
  onRetry,
}: {
  loading: boolean;
  message: string | null;
  onRetry?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader profileLink={false} />
      <View style={styles.state}>
        {loading ? (
          <StateView
            isLoading
            error={null}
            onRetry={() => {}}
            loadingLabel="Sorularımı hazırlıyorum…"
          />
        ) : (
          <View style={styles.message} accessibilityLiveRegion="polite">
            <Mascot pose="think" size={MASCOT_SIZE} />
            <AppText variant="heading" align="center">
              {message ?? ''}
            </AppText>
            {onRetry ? (
              <Button title="TEKRAR DENE" accessibilityLabel="Tekrar dene" onPress={onRetry} />
            ) : null}
            <Button
              title="ANA SAYFAYA DÖN"
              accessibilityLabel="Ana sayfaya dön"
              variant="secondary"
              onPress={() => router.dismissTo('/')}
            />
          </View>
        )}
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
    gap: 14,
    paddingHorizontal: screenPadding,
    paddingVertical: 12,
  },
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: 8,
  },
  column: {
    width: '100%',
    maxWidth: size.maxContentWidth,
    alignSelf: 'center',
    gap: 14,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  options: {
    gap: 12,
  },
  feedback: {
    marginTop: 6,
  },
  link: {
    alignSelf: 'center',
    minHeight: size.touch,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  state: {
    flex: 1,
    paddingHorizontal: screenPadding,
    paddingTop: 24,
  },
  message: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 24,
  },
});
