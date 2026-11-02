import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { CITIES, type CityId } from '@/design/cities';
import { LessonResultView, formatDuration } from '@/features/game/rewards/lesson-result-view';
import type { LessonDetailResponse } from '@/features/game/types';
import {
  ReadingState,
  ReadingView,
  leaveReading,
  type StoryText,
} from '@/features/reading/reading-view';
import type { ReadingSessionResult, ReadingText } from '@/features/reading/types';
import { useApiQuery } from '@/hooks/use-api-query';
import { useHardwareBack } from '@/hooks/use-hardware-back';

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
  const [freeResult, setFreeResult] = useState<ReadingSessionResult | null>(null);

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

  if (freeResult) return <FreeReadingResult title={text.title} result={freeResult} />;

  const eyebrow = lessonData
    ? `${cityLabel(lessonData.lesson.city)} · OKUMA ${String(lessonData.lesson.position).padStart(2, '0')}`
    : [cityLabel(textQuery.data?.text.city ?? null), 'KİTAPLIK'].filter(Boolean).join(' · ');

  const onFinished = (result: ReadingSessionResult, readingSessionId: string) => {
    if (!lessonData) {
      setFreeResult(result);
      return;
    }
    router.replace({
      pathname: '/lesson/[id]/quiz',
      params: { id: lessonData.lesson.id, readingSessionId },
    });
  };

  return (
    <ReadingView
      text={text}
      glossary={lessonData?.glossary ?? []}
      eyebrow={eyebrow}
      questionsNext={!!lessonId}
      onFinished={onFinished}
    />
  );
}

function cityLabel(city: CityId | null): string | null {
  return city ? CITIES[city].name.toLocaleUpperCase('tr-TR') : null;
}

/** Kitaplık okumasının bitiş ekranı: soru ve ödül yok. */
function FreeReadingResult({ title, result }: { title: string; result: ReadingSessionResult }) {
  useHardwareBack(() => {
    leaveReading();
    return true;
  });
  return (
    <LessonResultView
      storyTitle={title}
      heading="Bir hikâye daha bitti!"
      stars={null}
      tiles={[{ value: formatDuration(result.durationSeconds), label: 'okuma süresi' }]}
      buttonTitle="KİTAPLIĞA DÖN"
      buttonLabel="Kitaplığa dön"
      onContinue={leaveReading}
    />
  );
}
