import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnswerOption, type AnswerState } from '@/features/game/quiz/answer-option';
import { FeedbackPanel } from '@/features/game/quiz/feedback-panel';
import { TextSheet } from '@/features/game/quiz/text-sheet';
import { setReward } from '@/features/game/reward-store';
import { GameBackgrounds, GameColors, GameFonts } from '@/features/game/theme';
import type {
  AnswerRequest,
  AnswerResponse,
  CompleteLessonRequest,
  CompleteLessonResponse,
  LessonDetailResponse,
} from '@/features/game/types';
import { ConfirmDialog } from '@/features/game/ui/confirm-dialog';
import { GameButton } from '@/features/game/ui/game-button';
import { CloseIcon } from '@/features/game/ui/icons';
import { SquareButton } from '@/features/game/ui/square-button';
import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';
import type { MascotPose } from '@/features/mascot/types';
import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

const LETTERS = ['A', 'B', 'C'];
const LIP = '#E6DCF5';

/** Anlama soruları (S05Soru, S06Yanlis, S07Dogru). */
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
  const window = useWindowDimensions();
  const questions = [...data.questions].sort((a, b) => a.position - b.position);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerResponse | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const question = questions[index];
  if (!question) return null;
  const isLast = index === questions.length - 1;
  const mascotSize = Math.min(180, Math.round(window.width * 0.42));
  const pose: MascotPose = feedback ? (feedback.correct ? 'happy' : 'think') : 'talk';

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

  const next = async () => {
    if (!isLast) {
      setIndex(index + 1);
      setSelected(null);
      setFeedback(null);
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

  const optionState = (choice: number): AnswerState => {
    if (feedback?.correct) return choice === selected ? 'correct' : 'faded';
    if (feedback && choice === selected) return 'wrong';
    return choice === selected ? 'selected' : 'idle';
  };

  return (
    <View style={styles.root}>
      <LinearGradient {...GameBackgrounds.lilacCream} style={StyleSheet.absoluteFill} />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <SquareButton accessibilityLabel="Kapat" lip={LIP} onPress={() => setConfirmLeave(true)}>
          <CloseIcon size={20} color={GameColors.textLilacSecondary} />
        </SquareButton>
        <View
          style={styles.segments}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={`Soru ${index + 1} / ${questions.length}`}>
          {questions.map((item, segment) => {
            const done = segment < index || (segment === index && feedback?.correct);
            const current = segment === index;
            return (
              <View
                key={item.id}
                style={[
                  styles.segment,
                  { backgroundColor: done ? '#2FB86B' : current ? '#7B4DFF' : '#E3D9F2' },
                ]}
              />
            );
          })}
        </View>
        <Text style={styles.counter} importantForAccessibility="no">
          {index + 1}/{questions.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.askRow}>
          <Mascot pose={pose} size={mascotSize} />
          <View style={[styles.ask, { marginTop: mascotSize * 0.11 }]}>
            <View style={styles.askTail} />
            <Text style={styles.askLabel}>PIRIL SORUYOR</Text>
            <Text style={styles.prompt} accessibilityRole="header">
              {question.prompt}
            </Text>
          </View>
        </View>

        <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel="Cevaplar">
          {question.options.map((option, choice) => (
            <AnswerOption
              key={choice}
              letter={LETTERS[choice] ?? String(choice + 1)}
              label={option}
              state={optionState(choice)}
              disabled={!!feedback || checking}
              onPress={() => setSelected(choice)}
            />
          ))}
        </View>
      </ScrollView>

      {feedback ? (
        feedback.correct ? (
          <FeedbackPanel
            kind="correct"
            explanation={feedback.explanation}
            lokum={feedback.lokum}
            continueLabel="DEVAM ET"
            loading={completing}
            error={completeError}
            onContinue={next}
            bottomInset={insets.bottom}
          />
        ) : (
          <FeedbackPanel
            kind="wrong"
            hint={feedback.hint}
            onShowText={() => setShowText(true)}
            onRetry={retry}
            bottomInset={insets.bottom}
          />
        )
      ) : (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
          {checkError ? (
            <Text style={styles.error} accessibilityRole="alert">
              {checkError}
            </Text>
          ) : null}
          <GameButton
            variant="purple"
            title="KONTROL ET"
            accessibilityLabel="Kontrol et"
            disabled={selected == null}
            loading={checking}
            onPress={check}
          />
        </View>
      )}

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
        stayLabel="Devam et"
        leaveLabel="Bırak"
        onStay={() => setConfirmLeave(false)}
        onLeave={leave}
      />
    </View>
  );
}

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
    <View style={[styles.root, styles.state, { paddingTop: insets.top + 24 }]}>
      <LinearGradient {...GameBackgrounds.lilacCream} style={StyleSheet.absoluteFill} />
      <Mascot pose="think" size={140} />
      <MascotBubble
        tone="game"
        side="top"
        align="center"
        text={loading ? 'Sorularımı hazırlıyorum…' : (message ?? '')}
      />
      {onRetry ? (
        <GameButton title="TEKRAR DENE" accessibilityLabel="Tekrar dene" onPress={onRetry} />
      ) : null}
      {!loading ? (
        <GameButton
          variant="white"
          size="md"
          title="Ana sayfaya dön"
          onPress={() => router.dismissTo('/')}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  segments: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 12,
    borderRadius: 6,
  },
  counter: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 15,
    color: '#5B4A75',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 20,
  },
  askRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: -20,
  },
  ask: {
    flex: 1,
    marginLeft: -8,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: GameColors.white,
    boxShadow: GameColors.panelShadow,
  },
  askTail: {
    position: 'absolute',
    left: -8,
    top: 40,
    width: 16,
    height: 16,
    borderRadius: 3,
    backgroundColor: GameColors.white,
    transform: [{ rotate: '45deg' }],
  },
  askLabel: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 12,
    letterSpacing: 0.7,
    color: '#5B34D6',
  },
  prompt: {
    marginTop: 4,
    fontFamily: GameFonts.heading,
    fontSize: 21,
    lineHeight: 26,
    color: GameColors.warm,
  },
  options: {
    gap: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 8,
  },
  error: {
    fontFamily: GameFonts.bodyBold,
    fontSize: 14,
    color: '#B42318',
    textAlign: 'center',
  },
  state: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
});
