import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { FeedbackPanel } from '@/design/components/feedback-panel';
import { colors, readingSize, type } from '@/design/tokens';
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
  FinishExerciseResponse,
  RepeatedReadingParams,
  RepeatedReadingResult,
  StartExerciseResponse,
} from '@/features/exercises/types';
import { useExerciseIntro } from '@/features/exercises/use-exercise-intro';
import { WpmChart } from '@/features/exercises/wpm-chart';
import { QuizView } from '@/features/game/quiz/quiz-view';
import { getErrorMessage } from '@/lib/errors';

type Phase = 'ready' | 'reading' | 'chart' | 'questions' | 'result';

const INFO = EXERCISE_INFO.TEKRARLI_OKUMA;

/**
 * E1 Tekrarlı okuma: aynı metin 2-4 kez okunur; her okumanın süresi ölçülür ve hızı grafikte
 * hedef çizgisiyle (ilk okuma + %10-20) gösterilir. Son okumadan sonra metnin soruları gelir;
 * sonuç hız değişimini ve anlamayı birlikte söyler.
 */
export function RepeatedReading({
  start,
}: {
  start: StartExerciseResponse<RepeatedReadingParams, unknown>;
}) {
  const { repeatCount, goalPercent } = start.item.params;
  const text = start.text;
  const words = text?.wordCount ?? 0;
  const intro = useExerciseIntro('TEKRARLI_OKUMA');

  // Egzersizin toplam süresi ekran açıldığından itibaren ölçülür.
  const sessionStartedAt = useRef(0);
  useEffect(() => {
    sessionStartedAt.current = Date.now();
  }, []);
  const readStartedAt = useRef(0);
  const [phase, setPhase] = useState<Phase>('ready');
  const [reads, setReads] = useState<number[]>([]);
  const [result, setResult] = useState<FinishExerciseResponse | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  const speeds = reads.map((seconds) => (words * 60) / seconds);
  const goal = speeds[0] != null ? speeds[0] * (1 + goalPercent / 100) : null;
  const lastRead = reads.length >= repeatCount;
  const steps = repeatCount + (start.questions.length > 0 ? 1 : 0);

  const finish = async () => {
    const body: { durationSeconds: number; result: RepeatedReadingResult } = {
      durationSeconds: Math.round((Date.now() - sessionStartedAt.current) / 1000),
      result: { reads: reads.map((durationSeconds) => ({ durationSeconds })) },
    };
    setResult(await finishExercise(start.sessionId, body));
    setPhase('result');
  };

  /** Sorusuz metinde son okumadan sonra doğrudan bitirilir. */
  const finishWithoutQuestions = async () => {
    if (finishing) return;
    setFinishing(true);
    setFinishError(null);
    try {
      await finish();
    } catch (error) {
      setFinishError(getErrorMessage(error));
      setFinishing(false);
    }
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
    if (reads.length === 0) void intro.markSeen();
    readStartedAt.current = Date.now();
    setPhase('reading');
  };
  const stopReading = () => {
    const seconds = Math.max(1, Math.round((Date.now() - readStartedAt.current) / 1000));
    setReads((previous) => [...previous, seconds]);
    setPhase('chart');
  };

  const readNo = reads.length + (phase === 'chart' ? 0 : 1);
  const eyebrow = `${(INFO?.title ?? '').toLocaleUpperCase('tr-TR')} · ${Math.min(readNo, repeatCount)} / ${repeatCount}`;

  let helper: string;
  if (phase === 'ready') {
    helper =
      reads.length === 0
        ? `${intro.firstTime ? (INFO?.intro ?? '') : (INFO?.reminder ?? '')} Hazır olunca OKUMAYA BAŞLA'ya bas; süre o an başlar.`
        : 'Bir kez daha oku. Acele etme; akıcı ve anlayarak oku.';
  } else if (phase === 'reading') {
    helper = 'Bitirince BİTİRDİM’e bas.';
  } else {
    helper = lastRead
      ? 'Okumaların bitti! Şimdi metni ne kadar anladığına bakalım.'
      : `${reads.length}. okuma bitti. Grafiğe bak, sonra bir kez daha okuyalım.`;
  }

  const footer =
    phase === 'ready' ? (
      <Button
        title={reads.length === 0 ? 'OKUMAYA BAŞLA' : 'TEKRAR OKU'}
        accessibilityLabel={reads.length === 0 ? 'Okumaya başla' : 'Tekrar oku'}
        onPress={startReading}
      />
    ) : phase === 'reading' ? (
      <Button title="BİTİRDİM" accessibilityLabel="Bitirdim" onPress={stopReading} />
    ) : lastRead ? (
      <View style={styles.footer}>
        {finishError ? (
          <FeedbackPanel tone="wrong" title="Egzersizi kaydedemedim" text={finishError} />
        ) : null}
        <Button
          title={start.questions.length > 0 ? 'SORULARA GEÇ' : 'BİTİR'}
          accessibilityLabel={start.questions.length > 0 ? 'Sorulara geç' : 'Bitir'}
          loading={finishing}
          onPress={() =>
            start.questions.length > 0 ? setPhase('questions') : void finishWithoutQuestions()
          }
        />
      </View>
    ) : (
      <Button
        title={`${reads.length + 1}. OKUMAYA HAZIRIM`}
        accessibilityLabel={`${reads.length + 1}. okumaya hazırım`}
        onPress={() => setPhase('ready')}
      />
    );

  return (
    <ExerciseShell
      eyebrow={eyebrow}
      progress={reads.length / steps}
      progressLabel={`${repeatCount} okumadan ${reads.length} tanesi bitti`}
      confirmClose={reads.length > 0 || phase === 'reading'}
      footer={intro.firstTime === null ? null : footer}>
      <PirilHelper text={helper} pose={phase === 'chart' ? 'happy' : 'talk'} />
      {phase === 'chart' && goal != null ? (
        <WpmChart speeds={speeds} slots={repeatCount} goal={goal} />
      ) : null}
      {phase === 'reading' && text ? (
        <View style={styles.reader}>
          <ExerciseHeading title={text.title} />
          {text.paragraphs.map((paragraph, index) => (
            <AppText key={index} style={styles.paragraph}>
              {paragraph}
            </AppText>
          ))}
        </View>
      ) : null}
      {phase === 'ready' && text ? (
        <ExerciseHeading
          title={text.title}
          note={`${words} kelime · ${repeatCount} okuma · hedef: ilk okumandan %${goalPercent} daha akıcı`}
        />
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
  footer: {
    gap: 12,
  },
});
