import * as Haptics from 'expo-haptics';
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
import { BackIcon } from '@/design/icons';
import { colors, screenPadding, size } from '@/design/tokens';
import { TextSheet } from '@/features/game/quiz/text-sheet';
import type { AnswerRequest, AnswerResponse, LessonDetailResponse } from '@/features/game/types';
import { Mascot } from '@/features/mascot/mascot';
import { useHardwareBack } from '@/hooks/use-hardware-back';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

const LETTERS = ['A', 'B', 'C', 'D'];
/** API ipucu boşsa yanlış cevaptan sonra gösterilir (10-yanlis-cevap). */
const DEFAULT_HINT = 'İpucunu metinde bulabilirsin. Her deneme öğrenmenin bir parçası.';
export const QUIZ_MASCOT_SIZE = 96;

export type QuizQuestion = LessonDetailResponse['questions'][number];

type QuizViewProps = {
  questions: QuizQuestion[];
  readingSessionId: string;
  /** "Metne bak" alt sayfası için. */
  text: { title: string; paragraphs: string[] };
  /** Şık dokunuşunun gönderildiği uç (POST /lessons/:id/answers ya da /placement/answers). */
  answerPath: string;
  /**
   * Son soru doğru cevaplanıp DEVAM ET'e basılınca. Hata fırlatırsa mesajı düğmenin üstünde
   * `completeErrorTitle` başlığıyla gösterilir ve yeniden denenebilir.
   */
  onComplete: () => Promise<void>;
  completeErrorTitle: string;
  /** Geri onayının metni ve "BIRAK" sonrası. */
  leaveMessage: string;
  onLeave: () => void;
};

/**
 * Anlama soruları (09-11): seç → KONTROL ET → geri bildirim; yanlışta yeniden denenir, doğruda
 * sonraki soruya geçilir. Ders ve seviye belirleme akışları bunu kullanır.
 */
export function QuizView({
  questions: unsorted,
  readingSessionId,
  text,
  answerPath,
  onComplete,
  completeErrorTitle,
  leaveMessage,
  onLeave,
}: QuizViewProps) {
  const insets = useSafeAreaInsets();
  const questions = [...unsorted].sort((a, b) => a.position - b.position);
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

  // Odağı geri bildirim paneline taşı; ekran okuyucu paneli okur (iki platformda da). Panelin
  // canlı bölgesi kapalı: Android'de aynı metin iki kez okunmasın.
  const feedbackRef = useRef<ViewInstance>(null);
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      if (feedbackRef.current) {
        AccessibilityInfo.sendAccessibilityEvent(feedbackRef.current, 'focus');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Geri (düğme ve Android geri) onay sorar; bitirilirken yok sayılır, yoksa yanıt gelince
  // uygulama kendiliğinden sonraki ekrana gider.
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
      const result = await api.post<AnswerResponse>(answerPath, body);
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
      await onComplete();
    } catch (error) {
      setCompleteError(getErrorMessage(error));
      setCompleting(false);
    }
  };

  const leave = () => {
    setConfirmLeave(false);
    onLeave();
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
        <AppText
          variant="mapLabel"
          color={colors.textMuted}
          accessibilityElementsHidden
          importantForAccessibility="no">
          {index + 1} / {questions.length}
        </AppText>
      </View>

      <ScrollView
        style={styles.grow}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}>
        <View style={styles.column}>
          <Eyebrow>PIRIL MERAK EDİYOR</Eyebrow>
          <View style={styles.questionRow}>
            <Mascot
              pose={feedback?.correct ? 'happy' : 'think'}
              size={QUIZ_MASCOT_SIZE}
              decorative
            />
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
            <View style={styles.feedback}>
              {feedback.correct ? (
                <FeedbackPanel
                  ref={feedbackRef}
                  accessibilityLiveRegion="none"
                  tone="right"
                  title="Evet, tam da öyle!"
                  text={feedback.explanation}
                  extra={feedback.lokum > 0 ? `+${feedback.lokum} lokum` : undefined}
                />
              ) : (
                <FeedbackPanel
                  ref={feedbackRef}
                  accessibilityLiveRegion="none"
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
                <FeedbackPanel tone="wrong" title={completeErrorTitle} text={completeError} />
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
        title={text.title}
        paragraphs={text.paragraphs}
        onClose={() => setShowText(false)}
      />
      <ConfirmDialog
        visible={confirmLeave}
        title="Soruları bırakmak istiyor musun?"
        message={leaveMessage}
        stayLabel="DEVAM ET"
        leaveLabel="BIRAK"
        onStay={() => setConfirmLeave(false)}
        onLeave={leave}
      />
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
    gap: 15,
    paddingHorizontal: screenPadding,
    // .screen üst boşluğu 24, .screenhead alt boşluğu 25 (12 + içeriğin 13'ü).
    paddingTop: 24,
    paddingBottom: 12,
  },
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: 13,
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
    marginBottom: 11,
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
});
