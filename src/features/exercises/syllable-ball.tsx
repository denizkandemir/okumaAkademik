import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutRectangle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { FeedbackPanel } from '@/design/components/feedback-panel';
import { FilterChip } from '@/design/components/filter-chip';
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
  StartExerciseResponse,
  SyllableBallData,
  SyllableBallParams,
  SyllableBallResult,
} from '@/features/exercises/types';
import { useActiveTimer } from '@/features/exercises/use-active-timer';
import { useExerciseIntro } from '@/features/exercises/use-exercise-intro';
import { QuizView } from '@/features/game/quiz/quiz-view';
import { getErrorMessage } from '@/lib/errors';

type Phase = 'ready' | 'reading' | 'questions' | 'result';

const INFO = EXERCISE_INFO.HECE_TOPU;
/** Hız ölçümü gelmezse sakin G1 hızı (hece/saniye; sunucudaki değerle aynı). */
const CALM_SYLLABLES_PER_SECOND = 1.5;
/** "Yavaş" seçiliyken hız çarpanı. */
const SLOW_FACTOR = 0.75;
const BALL = 14;
/** Topun hecenin üstünde durduğu yükseklik ve zıplama yüksekliği. */
const BALL_GAP = 4;
const HOP_HEIGHT = 16;
const FONT_SIZE = readingSize.default + 2;
const LINE_HEIGHT = Math.round(FONT_SIZE * 1.7);

/** Kelimenin metindeki yeri ve ilk hecesinin sırası. */
type WordRef = { paragraph: number; word: number; first: number; syllables: string[] };

/**
 * E11 Hece hece oku (zıplayan top): metin hecelere ayrılmış gösterilir (ince boşluk ve dönüşümlü
 * hafif renk). Küçük bir top Reanimated ile UI thread'de heceden heceye yay çizerek zıplar; çocuk
 * sesli okur. Hız çocuğun kendi temposudur ("Yavaş / Normal", duraklat, kelimeye dokununca o
 * kelimeden yeniden). Hareketi azalt açıkken top zıplamaz; o anki hece yalnızca renkle vurgulanır.
 * Günde en fazla 5 dakika; sonunda 1-2 soru.
 */
export function SyllableBall({
  start,
}: {
  start: StartExerciseResponse<SyllableBallParams, SyllableBallData>;
}) {
  const { marker, syllablesPerSecond } = start.item.params;
  const { words: paragraphs } = start.item.data;
  const text = start.text;
  const intro = useExerciseIntro('HECE_TOPU');
  const reduceMotion = useReducedMotion();
  const basePace = syllablesPerSecond ?? CALM_SYLLABLES_PER_SECOND;

  // Kelimeler ve hecelerin sırası (bütün metinde).
  const { wordRefs, total } = useMemo(() => {
    const refs: WordRef[][] = [];
    let count = 0;
    paragraphs.forEach((paragraph, p) => {
      refs.push(
        paragraph.map((syllables, w) => {
          const ref = { paragraph: p, word: w, first: count, syllables };
          count += syllables.length;
          return ref;
        }),
      );
    });
    return { wordRefs: refs, total: count };
  }, [paragraphs]);

  const sessionStartedAt = useRef(0);
  useEffect(() => {
    sessionStartedAt.current = Date.now();
  }, []);
  const [phase, setPhase] = useState<Phase>('ready');
  const [slow, setSlow] = useState(false);
  const [slowUsed, setSlowUsed] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [current, setCurrent] = useState(0);
  const restarts = useRef(0);
  const readSeconds = useRef(0);
  const [result, setResult] = useState<FinishExerciseResponse | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const pace = basePace * (slow ? SLOW_FACTOR : 1);

  // Hecelerin konumları: paragraf (okuyucuya göre) + kelime (paragrafa göre) + hece (kelimeye göre).
  const paragraphLayouts = useRef<LayoutRectangle[]>([]);
  const wordLayouts = useRef<LayoutRectangle[][]>([]);
  const syllableLayouts = useRef<LayoutRectangle[]>([]);
  const xs = useSharedValue<number[]>([]);
  const ys = useSharedValue<number[]>([]);
  const progress = useSharedValue(0);

  // Ölçümler toplanır; konumlar kare başına en fazla bir kez yeniden hesaplanır.
  const [layoutVersion, setLayoutVersion] = useState(0);
  const layoutPending = useRef(false);
  const onMeasured = useCallback(() => {
    if (layoutPending.current) return;
    layoutPending.current = true;
    requestAnimationFrame(() => {
      layoutPending.current = false;
      setLayoutVersion((version) => version + 1);
    });
  }, []);
  useEffect(() => {
    if (layoutVersion === 0) return;
    const x: number[] = [];
    const y: number[] = [];
    for (const paragraph of wordRefs) {
      for (const ref of paragraph) {
        const para = paragraphLayouts.current[ref.paragraph];
        const word = wordLayouts.current[ref.paragraph]?.[ref.word];
        ref.syllables.forEach((_, s) => {
          const syllable = syllableLayouts.current[ref.first + s];
          if (!para || !word || !syllable) return;
          x.push(para.x + word.x + syllable.x + syllable.width / 2);
          y.push(para.y + word.y + syllable.y);
        });
      }
    }
    if (x.length === total) {
      xs.set(x);
      ys.set(y);
    }
  }, [layoutVersion, wordRefs, total, xs, ys]);

  /** Top: tam sayıda hecenin üstünde; aradaki değerlerde bir sonrakine yay çizerek zıplar. */
  const ballStyle = useAnimatedStyle(() => {
    const x = xs.get();
    const y = ys.get();
    if (x.length === 0) return { opacity: 0 };
    const p = Math.min(progress.get(), x.length - 1);
    const from = Math.max(0, Math.floor(p));
    const to = Math.min(from + 1, x.length - 1);
    const f = p - from;
    const fromX = x[from] as number;
    const fromY = y[from] as number;
    const left = fromX + ((x[to] as number) - fromX) * f - BALL / 2;
    const top =
      fromY + ((y[to] as number) - fromY) * f - BALL - BALL_GAP - HOP_HEIGHT * 4 * f * (1 - f);
    return { opacity: 1, transform: [{ translateX: left }, { translateY: top }] };
  });

  // Hareketli modda o anki hece UI thread'den bildirilir (renk vurgusu için).
  useAnimatedReaction(
    () => Math.min(total - 1, Math.max(0, Math.floor(progress.get()))),
    (index, previous) => {
      if (index !== previous) scheduleOnRN(setCurrent, index);
    },
    [total],
  );

  const handleEnd = useCallback(() => {
    setRunning(false);
    setDone(true);
  }, []);

  const timer = useActiveTimer(() => {
    // 5 dakika doldu: top durur, sorulara geçilir.
    if (phase === 'reading') goToQuestions();
  });
  const { pause: pauseTimer, resume: resumeTimer } = timer;

  /** Topu `from` hecesinden başlatır (hareketli mod). */
  const animateFrom = useCallback(
    (from: number, speed: number) => {
      progress.set(from);
      progress.set(
        withTiming(
          total,
          { duration: Math.max(0, ((total - from) / speed) * 1000), easing: Easing.linear },
          (finished) => {
            if (finished) scheduleOnRN(handleEnd);
          },
        ),
      );
    },
    [progress, total, handleEnd],
  );

  // Hareketi azalt: top yok; hece hece zamanlayıcıyla ilerler.
  useEffect(() => {
    if (!reduceMotion || !running) return;
    const id = setTimeout(() => {
      if (current + 1 < total) setCurrent(current + 1);
      else handleEnd();
    }, 1000 / pace);
    return () => clearTimeout(id);
  }, [reduceMotion, running, current, total, pace, handleEnd]);

  // Bitince ya da duraklayınca süre durur.
  useEffect(() => {
    if (running) resumeTimer();
    else pauseTimer();
  }, [running, resumeTimer, pauseTimer]);

  useEffect(() => () => cancelAnimation(progress), [progress]);

  if (phase === 'result' && result) {
    return <ExerciseResult title={text?.title ?? INFO?.title ?? ''} result={result} />;
  }

  const finish = async () => {
    const body: { durationSeconds: number; result: SyllableBallResult } = {
      durationSeconds: Math.round((Date.now() - sessionStartedAt.current) / 1000),
      result: {
        readSeconds: Math.max(1, Math.round(readSeconds.current)),
        slowUsed,
        restarts: restarts.current,
      },
    };
    setResult(await finishExercise(start.sessionId, body));
    setPhase('result');
  };

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

  /** Topu bir heceden başlatır ya da devam ettirir. */
  function play(from: number, speed = pace) {
    setDone(false);
    setCurrent(from);
    setRunning(true);
    if (reduceMotion) progress.set(from);
    else animateFrom(from, speed);
  }
  function stop() {
    cancelAnimation(progress);
    setRunning(false);
  }
  function begin() {
    void intro.markSeen();
    setPhase('reading');
    play(0);
  }
  function togglePause() {
    if (running) stop();
    else play(done ? 0 : current);
  }
  function restartAt(first: number) {
    restarts.current++;
    play(first);
  }
  function changeSpeed(nextSlow: boolean) {
    if (nextSlow === slow) return;
    setSlow(nextSlow);
    if (nextSlow) setSlowUsed(true);
    const nextPace = basePace * (nextSlow ? SLOW_FACTOR : 1);
    if (running && !reduceMotion) animateFrom(progress.get(), nextPace);
  }
  function goToQuestions() {
    if (finishing) return;
    stop();
    pauseTimer();
    readSeconds.current = Math.max(1, timer.elapsedMs() / 1000);
    if (start.questions.length > 0) {
      setPhase('questions');
      return;
    }
    setFinishing(true);
    setFinishError(null);
    finish().catch((error: unknown) => {
      setFinishError(getErrorMessage(error));
      setFinishing(false);
    });
  }

  const showGap = marker === 'gap' || marker === 'both';
  const showColor = marker === 'color' || marker === 'both';
  const helper =
    phase === 'ready'
      ? `${intro.firstTime ? (INFO?.intro ?? '') : (INFO?.reminder ?? '')} Takıldığın kelimeye dokun, top oradan başlasın.`
      : done
        ? 'Çok güzel okudun! Hazır olunca BİTİRDİM’e bas.'
        : running
          ? (INFO?.reminder ?? '')
          : 'Mola! Hazır olunca DEVAM ET’e bas.';

  return (
    <ExerciseShell
      eyebrow={(INFO?.title ?? '').toLocaleUpperCase('tr-TR')}
      progress={phase === 'ready' ? 0 : done ? 0.8 : (0.7 * current) / Math.max(1, total)}
      progressLabel={phase === 'reading' ? `Hece ${current + 1} / ${total}` : 'Hece hece oku'}
      confirmClose={phase !== 'ready'}
      footer={
        intro.firstTime === null ? null : phase === 'ready' ? (
          <Button title="BAŞLA" accessibilityLabel="Topu başlat" onPress={begin} />
        ) : (
          <View style={styles.footer}>
            {finishError ? (
              <FeedbackPanel tone="wrong" title="Egzersizi kaydedemedim" text={finishError} />
            ) : null}
            <View style={styles.row}>
              <View style={styles.grow}>
                <Button
                  title={running ? 'DURAKLAT' : done ? 'BAŞTAN' : 'DEVAM ET'}
                  variant="secondary"
                  accessibilityLabel={running ? 'Duraklat' : done ? 'Baştan oku' : 'Devam et'}
                  onPress={togglePause}
                />
              </View>
              <View style={styles.grow}>
                <Button
                  title="BİTİRDİM"
                  accessibilityLabel="Bitirdim"
                  loading={finishing}
                  onPress={goToQuestions}
                />
              </View>
            </View>
          </View>
        )
      }>
      <PirilHelper text={helper} pose={done ? 'happy' : 'talk'} />
      {text ? <ExerciseHeading title={text.title} /> : null}

      <View style={styles.speed} accessibilityRole="radiogroup" accessibilityLabel="Topun hızı">
        <FilterChip label="Yavaş" selected={slow} onPress={() => changeSpeed(true)} />
        <FilterChip label="Normal" selected={!slow} onPress={() => changeSpeed(false)} />
      </View>

      <View style={styles.reader}>
        {wordRefs.map((paragraph, p) => (
          <View
            key={p}
            style={styles.paragraph}
            onLayout={(event) => {
              paragraphLayouts.current[p] = event.nativeEvent.layout;
              onMeasured();
            }}>
            {paragraph.map((ref) => (
              <Pressable
                key={ref.word}
                accessibilityRole="button"
                accessibilityLabel={`${ref.syllables.join('')}: buradan oku`}
                onPress={phase === 'reading' ? () => restartAt(ref.first) : undefined}
                style={styles.word}
                onLayout={(event) => {
                  (wordLayouts.current[p] ??= [])[ref.word] = event.nativeEvent.layout;
                  onMeasured();
                }}>
                {ref.syllables.map((syllable, s) => {
                  const index = ref.first + s;
                  const active = phase === 'reading' && index === current;
                  return (
                    <AppText
                      key={s}
                      style={[
                        styles.syllable,
                        showGap && s < ref.syllables.length - 1 && styles.gap,
                        showColor && index % 2 === 1 && styles.alternate,
                        active && styles.active,
                      ]}
                      onLayout={(event) => {
                        syllableLayouts.current[index] = event.nativeEvent.layout;
                        onMeasured();
                      }}>
                      {syllable}
                    </AppText>
                  );
                })}
              </Pressable>
            ))}
          </View>
        ))}
        {phase === 'reading' && !reduceMotion ? (
          <Animated.View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.ball, ballStyle]}
          />
        ) : null}
      </View>
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  speed: {
    flexDirection: 'row',
    gap: 8,
  },
  reader: {
    gap: 14,
    marginTop: 4,
    paddingTop: BALL + BALL_GAP + HOP_HEIGHT,
  },
  paragraph: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: BALL + BALL_GAP,
  },
  word: {
    flexDirection: 'row',
    marginRight: 12,
    minHeight: 48,
    alignItems: 'center',
  },
  syllable: {
    fontFamily: type.reading.fontFamily,
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    color: colors.readingText,
    borderRadius: 6,
    paddingHorizontal: 1,
  },
  /** Heceler arasındaki ince boşluk. */
  gap: {
    marginRight: 4,
  },
  /** Dönüşümlü hafif renk. */
  alternate: {
    color: colors.accent,
  },
  /** O anki hece. */
  active: {
    backgroundColor: colors.option.selected.background,
    color: colors.text,
  },
  footer: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  grow: {
    flex: 1,
  },
  ball: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BALL,
    height: BALL,
    borderRadius: BALL / 2,
    backgroundColor: colors.logoAccent,
  },
});
