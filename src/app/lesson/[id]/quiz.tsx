import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { StateView } from '@/design/components/state-view';
import { colors, screenPadding } from '@/design/tokens';
import { QUIZ_MASCOT_SIZE, QuizView } from '@/features/game/quiz/quiz-view';
import { setReward } from '@/features/game/reward-store';
import type {
  CompleteLessonRequest,
  CompleteLessonResponse,
  LessonDetailResponse,
} from '@/features/game/types';
import { Mascot } from '@/features/mascot/mascot';
import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

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
  const lessonPath = `/lessons/${encodeURIComponent(data.lesson.id)}`;

  /** Dersi bitirir ve ders sonu ekranına geçer. */
  const complete = async () => {
    const body: CompleteLessonRequest = { readingSessionId };
    const result = await api.post<CompleteLessonResponse>(`${lessonPath}/complete`, body);
    setReward({
      lessonId: data.lesson.id,
      lessonTitle: data.lesson.title,
      kind: 'story',
      city: data.lesson.city,
      result,
      bestStars: Math.max(data.lesson.bestStars ?? 0, result.stars ?? 0) || null,
    });
    router.replace({ pathname: '/lesson/[id]/complete', params: { id: data.lesson.id } });
  };

  return (
    <QuizView
      questions={data.questions}
      readingSessionId={readingSessionId}
      text={{
        title: data.text?.title ?? data.lesson.title,
        paragraphs: data.text?.paragraphs ?? [],
      }}
      answerPath={`${lessonPath}/answers`}
      onComplete={complete}
      completeErrorTitle="Dersi kaydedemedim"
      leaveMessage="Dersi bitirmek için hikâyeyi yeniden okuman gerekecek."
      onLeave={() => router.dismissTo('/')}
    />
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
            <Mascot pose="think" size={QUIZ_MASCOT_SIZE} decorative />
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
