import { Fragment, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { FeedbackPanel } from '@/design/components/feedback-panel';
import { colors, readingSize, type } from '@/design/tokens';
import { chunkMarkers } from '@/features/exercises/chunk-markers';
import { exerciseAnswerPath, finishExercise } from '@/features/exercises/exercise-api';
import { EXERCISE_INFO } from '@/features/exercises/exercise-info';
import { ExerciseResult } from '@/features/exercises/exercise-result';
import {
  ExerciseHeading,
  ExerciseShell,
  leaveExercise,
  PirilHelper,
} from '@/features/exercises/exercise-shell';
import type {
  ChunkReadingData,
  ChunkReadingParams,
  ChunkReadingResult,
  FinishExerciseResponse,
  StartExerciseResponse,
} from '@/features/exercises/types';
import { useExerciseIntro } from '@/features/exercises/use-exercise-intro';
import { QuizView } from '@/features/game/quiz/quiz-view';
import { getErrorMessage } from '@/lib/errors';

type Phase = 'ready' | 'reading' | 'questions' | 'result';

const INFO = EXERCISE_INFO.OBEK_OKUMA;

/**
 * E4 Öbek öbek oku: metin anlamlı öbekler hâlinde, öbek sınırlarında ince bir boşluk ve soluk "/"
 * ile gösterilir (ipucu: tam, yarı, yok). Okuma süresi ölçülür, ardından 1-2 soru gelir.
 */
export function ChunkReading({
  start,
}: {
  start: StartExerciseResponse<ChunkReadingParams, ChunkReadingData>;
}) {
  const { cueLevel } = start.item.params;
  const { chunks } = start.item.data;
  const text = start.text;
  const intro = useExerciseIntro('OBEK_OKUMA');

  // Egzersizin toplam süresi ekran açıldığından itibaren ölçülür.
  const sessionStartedAt = useRef(0);
  useEffect(() => {
    sessionStartedAt.current = Date.now();
  }, []);
  const readStartedAt = useRef(0);
  const readSeconds = useRef(0);
  const [phase, setPhase] = useState<Phase>('ready');
  const [result, setResult] = useState<FinishExerciseResponse | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  const finish = async () => {
    const body: { durationSeconds: number; result: ChunkReadingResult } = {
      durationSeconds: Math.round((Date.now() - sessionStartedAt.current) / 1000),
      result: { readSeconds: readSeconds.current },
    };
    setResult(await finishExercise(start.sessionId, body));
    setPhase('result');
  };

  if (phase === 'result' && result) {
    return <ExerciseResult title={text?.title ?? INFO?.title ?? ''} result={result} />;
  }

  if (phase === 'questions') {
    return (
      <QuizView
        questions={start.questions}
        text={{ title: text?.title ?? '', paragraphs: text?.paragraphs ?? [] }}
        answerPath={exerciseAnswerPath(start.sessionId)}
        onComplete={finish}
        completeErrorTitle="Egzersizi kaydedemedim"
        leaveMessage="Bu egzersiz kaydedilmez; sonra yeniden başlayabilirsin."
        onLeave={leaveExercise}
      />
    );
  }

  const startReading = () => {
    void intro.markSeen();
    readStartedAt.current = Date.now();
    setPhase('reading');
  };
  const stopReading = async () => {
    if (finishing) return;
    readSeconds.current = Math.max(1, Math.round((Date.now() - readStartedAt.current) / 1000));
    if (start.questions.length > 0) {
      setPhase('questions');
      return;
    }
    setFinishing(true);
    setFinishError(null);
    try {
      await finish();
    } catch (error) {
      setFinishError(getErrorMessage(error));
      setFinishing(false);
    }
  };

  const helper =
    phase === 'ready'
      ? `${intro.firstTime ? (INFO?.intro ?? '') : (INFO?.reminder ?? '')} Hazır olunca OKUMAYA BAŞLA'ya bas.`
      : 'Bitirince BİTİRDİM’e bas.';
  const cueNote =
    cueLevel === 'full'
      ? 'Her öbeğin sonunda bir çizgi var.'
      : cueLevel === 'half'
        ? 'Çizgiler yalnızca uzun cümlelerde.'
        : 'Bu sefer çizgi yok; öbekleri sen bul.';

  return (
    <ExerciseShell
      eyebrow={(INFO?.title ?? '').toLocaleUpperCase('tr-TR')}
      progress={phase === 'reading' ? 0.5 : 0}
      progressLabel={phase === 'reading' ? 'Okuma sürüyor' : 'Okuma başlamadı'}
      confirmClose={phase === 'reading'}
      footer={
        intro.firstTime === null ? null : phase === 'ready' ? (
          <Button title="OKUMAYA BAŞLA" accessibilityLabel="Okumaya başla" onPress={startReading} />
        ) : (
          <View style={styles.footer}>
            {finishError ? (
              <FeedbackPanel tone="wrong" title="Egzersizi kaydedemedim" text={finishError} />
            ) : null}
            <Button
              title="BİTİRDİM"
              accessibilityLabel="Bitirdim"
              loading={finishing}
              onPress={() => void stopReading()}
            />
          </View>
        )
      }>
      <PirilHelper text={helper} />
      {text ? <ExerciseHeading title={text.title} note={cueNote} /> : null}
      {phase === 'reading' ? (
        <View style={styles.reader}>
          {chunks.map((paragraph, paragraphIndex) => {
            const markers = chunkMarkers(paragraph, cueLevel);
            return (
              <AppText
                key={paragraphIndex}
                style={styles.paragraph}
                accessibilityLabel={paragraph.join(' ')}>
                {paragraph.map((chunk, index) => (
                  <Fragment key={index}>
                    {chunk}
                    {index < paragraph.length - 1 ? (
                      markers[index] ? (
                        <AppText style={[styles.paragraph, styles.marker]}>{' / '}</AppText>
                      ) : (
                        ' '
                      )
                    ) : null}
                  </Fragment>
                ))}
              </AppText>
            );
          })}
        </View>
      ) : null}
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  reader: {
    gap: 18,
    marginTop: 6,
  },
  paragraph: {
    fontFamily: type.reading.fontFamily,
    fontSize: readingSize.default,
    lineHeight: Math.round(readingSize.default * readingSize.lineHeightRatio),
    color: colors.readingText,
  },
  /** Soluk öbek işareti: okumayı bölmez, yalnızca nefes yerini gösterir. */
  marker: {
    color: colors.node.locked.icon,
  },
  footer: {
    gap: 12,
  },
});
