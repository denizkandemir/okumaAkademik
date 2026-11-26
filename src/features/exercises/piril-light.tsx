import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type TextLayoutEvent } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

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
  PirilLightParams,
  PirilLightResult,
  StartExerciseResponse,
} from '@/features/exercises/types';
import { useActiveTimer } from '@/features/exercises/use-active-timer';
import { useExerciseIntro } from '@/features/exercises/use-exercise-intro';
import { QuizView } from '@/features/game/quiz/quiz-view';
import { getErrorMessage } from '@/lib/errors';

type Phase = 'ready' | 'baseline' | 'light-ready' | 'light' | 'questions' | 'result';

type Line = { top: number; height: number; x: number; width: number; words: number };

const INFO = EXERCISE_INFO.PIRIL_ISIGI;
const LINE_HEIGHT = Math.round(readingSize.default * readingSize.lineHeightRatio);
/** Işığın okunmuş satırları soldurma yoğunluğu (zemin rengi bu saydamlıkla üstüne düşer). */
const VEIL_OPACITY = 0.82;
const SENTENCE_END = /[.!?…]["”’»)]*$/;

/**
 * İlk bölüm: en az `segmentWords` kelime, cümle sonuna tamamlanır (en fazla iki katı); geri kalan
 * metin ışıkla okunur. Paragraf bölünebilir.
 */
export function splitSegment(paragraphs: string[], segmentWords: number) {
  const words = paragraphs.flatMap((paragraph, p) =>
    paragraph
      .split(' ')
      .filter(Boolean)
      .map((word) => ({ p, word })),
  );
  const limit = Math.max(1, Math.min(segmentWords * 2, words.length - 10));
  let cut = Math.min(segmentWords, limit);
  while (cut < limit && !SENTENCE_END.test(words[cut - 1]?.word ?? '')) cut++;
  /** Kelimeleri yeniden paragraflara toplar. */
  const paragraphsOf = (part: typeof words) => {
    const result: string[] = [];
    let current = -1;
    for (const { p, word } of part) {
      if (p === current) result[result.length - 1] += ` ${word}`;
      else result.push(word);
      current = p;
    }
    return result;
  };
  return {
    segment: paragraphsOf(words.slice(0, cut)),
    rest: paragraphsOf(words.slice(cut)),
    baselineWords: cut,
  };
}

/**
 * E6 Pırıl'ın ışığı (okuma temposu): çocuk ilk bölümü kendi hızında okur (temel hız). Sonra
 * yumuşak bir ışık okunmuş satırları arkadan soldurur; hızı temel hız × `speedFactor`. Işık
 * Reanimated ile UI thread'de ilerler; duraklat düğmesi hep görünür. Hareketi azalt açıkken ışık
 * yerine o anki satırın yanında sabit bir işaret durur. Günde en fazla 5 dakika; sonra sorular.
 */
export function PirilLight({ start }: { start: StartExerciseResponse<PirilLightParams, unknown> }) {
  const { speedFactor, segmentWords, fadeUnit } = start.item.params;
  const text = start.text;
  const intro = useExerciseIntro('PIRIL_ISIGI');
  const reduceMotion = useReducedMotion();
  const { segment, rest, baselineWords } = useMemo(
    () => splitSegment(text?.paragraphs ?? [], segmentWords),
    [text, segmentWords],
  );

  const sessionStartedAt = useRef(0);
  useEffect(() => {
    sessionStartedAt.current = Date.now();
  }, []);
  const [phase, setPhase] = useState<Phase>('ready');
  const [paused, setPaused] = useState(false);
  const [lightDone, setLightDone] = useState(false);
  const [markerLine, setMarkerLine] = useState(0);
  const pauses = useRef(0);
  const [baselineSeconds, setBaselineSeconds] = useState(0);
  const lightStartMs = useRef(0);
  const lightSeconds = useRef(0);
  const [result, setResult] = useState<FinishExerciseResponse | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  // Satır ölçüleri: paragrafın üstü (okuyucuya göre) ve satırları (paragrafa göre).
  const [paragraphTops, setParagraphTops] = useState<(number | undefined)[]>([]);
  const [paragraphLines, setParagraphLines] = useState<
    (TextLayoutEvent['nativeEvent']['lines'] | undefined)[]
  >([]);
  const lines = useMemo<Line[] | null>(() => {
    if (rest.length === 0) return [];
    const all: Line[] = [];
    for (let p = 0; p < rest.length; p++) {
      const top = paragraphTops[p];
      const measured = paragraphLines[p];
      if (top === undefined || measured === undefined) return null;
      for (const line of measured) {
        all.push({
          top: top + line.y,
          height: line.height,
          x: line.x,
          width: line.width,
          words: line.text.split(/\s+/).filter(Boolean).length,
        });
      }
    }
    return all;
  }, [rest.length, paragraphTops, paragraphLines]);

  // Işığın zaman çizelgesi: satır sonlarının saniyesi (temel hız × çarpan).
  const baselineWpm = (baselineWords * 60) / Math.max(1, baselineSeconds);
  const secondsPerWord = 60 / Math.max(1, baselineWpm * speedFactor);
  const ends = useMemo(() => {
    let total = 0;
    return (lines ?? []).map((line) => (total += Math.max(0.5, line.words) * secondsPerWord));
  }, [lines, secondsPerWord]);
  const totalSeconds = ends.at(-1) ?? 0;

  const progress = useSharedValue(0);
  const tops = useSharedValue<number[]>([]);
  const heights = useSharedValue<number[]>([]);
  const xs = useSharedValue<number[]>([]);
  const widths = useSharedValue<number[]>([]);
  const endsShared = useSharedValue<number[]>([]);
  useEffect(() => {
    tops.set((lines ?? []).map((line) => line.top));
    heights.set((lines ?? []).map((line) => line.height));
    xs.set((lines ?? []).map((line) => line.x));
    widths.set((lines ?? []).map((line) => line.width));
    endsShared.set(ends);
  }, [lines, ends, tops, heights, xs, widths, endsShared]);

  /** Okunmuş satırlar: o anki satırın üstüne kadar. */
  const blockStyle = useAnimatedStyle(() => {
    const p = progress.get();
    const e = endsShared.get();
    const t = tops.get();
    const h = heights.get();
    let i = 0;
    while (i < e.length && (e[i] as number) <= p) i++;
    const height =
      i >= e.length && e.length > 0
        ? (t[e.length - 1] as number) + (h[e.length - 1] as number)
        : (t[i] ?? 0);
    return { height };
  });
  /** O anki satır: satır biriminde sona doğru yumuşakça solar; kelime biriminde soldan sağa. */
  const lineStyle = useAnimatedStyle(() => {
    const p = progress.get();
    const e = endsShared.get();
    let i = 0;
    while (i < e.length && (e[i] as number) <= p) i++;
    if (i >= e.length) return { opacity: 0, width: 0 };
    const startAt = i === 0 ? 0 : (e[i - 1] as number);
    const fraction = Math.min(
      1,
      Math.max(0, (p - startAt) / Math.max(0.001, (e[i] as number) - startAt)),
    );
    const width = widths.get()[i] ?? 0;
    return {
      top: tops.get()[i] ?? 0,
      height: heights.get()[i] ?? 0,
      left: xs.get()[i] ?? 0,
      width: fadeUnit === 'word' ? width * fraction : width,
      opacity:
        fadeUnit === 'word'
          ? VEIL_OPACITY
          : VEIL_OPACITY * Math.min(1, Math.max(0, (fraction - 0.6) / 0.4)),
    };
  });

  const timer = useActiveTimer(() => {
    // 5 dakika doldu: ışık durur, sorulara geçilir.
    if (phase === 'light') endLight();
    else if (phase === 'baseline') endBaseline();
  });

  const { elapsedMs } = timer;
  const lightElapsedSeconds = useCallback(
    () => (elapsedMs() - lightStartMs.current) / 1000,
    [elapsedMs],
  );

  const animateFrom = useCallback(
    (from: number) => {
      progress.set(from);
      progress.set(
        withTiming(
          totalSeconds,
          { duration: Math.max(0, (totalSeconds - from) * 1000), easing: Easing.linear },
          (finished) => {
            if (finished) scheduleOnRN(setLightDone, true);
          },
        ),
      );
    },
    [progress, totalSeconds],
  );

  // Hareketi azalt: ışık yok; o anki satır işareti zamanla satır satır ilerler.
  useEffect(() => {
    if (!reduceMotion || phase !== 'light' || paused) return;
    const id = setInterval(() => {
      const elapsed = lightElapsedSeconds();
      const index = ends.findIndex((end) => end > elapsed);
      setMarkerLine(index === -1 ? Math.max(0, ends.length - 1) : index);
      if (index === -1) setLightDone(true);
    }, 250);
    return () => clearInterval(id);
  }, [reduceMotion, phase, paused, ends, lightElapsedSeconds]);

  // Ekrandan çıkınca animasyon durur.
  useEffect(() => () => cancelAnimation(progress), [progress]);

  if (phase === 'result' && result) {
    return <ExerciseResult title={text?.title ?? INFO?.title ?? ''} result={result} />;
  }

  const finish = async () => {
    const body: { durationSeconds: number; result: PirilLightResult } = {
      durationSeconds: Math.round((Date.now() - sessionStartedAt.current) / 1000),
      result: {
        baselineWords,
        baselineSeconds: Math.max(1, Math.round(baselineSeconds)),
        lightSeconds: Math.max(1, Math.round(lightSeconds.current)),
        pauses: pauses.current,
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

  function startBaseline() {
    void intro.markSeen();
    timer.resume();
    setPhase('baseline');
  }
  function endBaseline() {
    setBaselineSeconds(Math.max(1, timer.elapsedMs() / 1000));
    timer.pause();
    setPaused(false);
    setPhase('light-ready');
  }
  function startLight() {
    lightStartMs.current = timer.elapsedMs();
    timer.resume();
    setLightDone(false);
    setMarkerLine(0);
    setPhase('light');
    if (!reduceMotion) animateFrom(0);
  }
  function endLight() {
    if (finishing) return;
    lightSeconds.current = Math.max(1, lightElapsedSeconds());
    cancelAnimation(progress);
    timer.pause();
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
  function togglePause() {
    if (paused) {
      timer.resume();
      setPaused(false);
      if (phase === 'light' && !reduceMotion && !lightDone) animateFrom(progress.get());
    } else {
      pauses.current++;
      timer.pause();
      setPaused(true);
      if (phase === 'light') cancelAnimation(progress);
    }
  }

  const reading = phase === 'baseline' || phase === 'light';
  const helper =
    phase === 'ready'
      ? `${intro.firstTime ? (INFO?.intro ?? '') : (INFO?.reminder ?? '')} Önce ilk bölümü kendi hızında oku.`
      : phase === 'baseline'
        ? paused
          ? 'Mola! Hazır olunca DEVAM ET’e bas.'
          : 'Kendi hızında oku. Bitirince BİTİRDİM’e bas.'
        : phase === 'light-ready'
          ? 'Harika! Şimdi ışık seninle. Işık okuduğun satırları arkandan soldurur; istediğin an durdurabilirsin.'
          : paused
            ? 'Mola! Hazır olunca DEVAM ET’e bas.'
            : lightDone
              ? 'Işık metnin sonuna geldi. Bitirince BİTİRDİM’e bas.'
              : 'Okumaya devam et. Bitirince BİTİRDİM’e bas.';

  const paragraphStyle = [styles.paragraph];

  return (
    <ExerciseShell
      eyebrow={(INFO?.title ?? '').toLocaleUpperCase('tr-TR')}
      progress={
        phase === 'ready' ? 0 : phase === 'baseline' ? 0.2 : phase === 'light-ready' ? 0.35 : 0.6
      }
      progressLabel={
        phase === 'baseline' ? 'İlk bölüm' : phase === 'light' ? 'Işıkla okuma' : 'Okuma temposu'
      }
      confirmClose={phase !== 'ready'}
      footer={
        intro.firstTime === null ? null : phase === 'ready' ? (
          <Button
            title="OKUMAYA BAŞLA"
            accessibilityLabel="Okumaya başla"
            onPress={startBaseline}
          />
        ) : phase === 'light-ready' ? (
          <Button
            title="IŞIĞI BAŞLAT"
            accessibilityLabel="Işığı başlat"
            disabled={lines === null}
            onPress={startLight}
          />
        ) : reading ? (
          <View style={styles.footer}>
            {finishError ? (
              <FeedbackPanel tone="wrong" title="Egzersizi kaydedemedim" text={finishError} />
            ) : null}
            <View style={styles.row}>
              <View style={styles.grow}>
                <Button
                  title={paused ? 'DEVAM ET' : 'DURAKLAT'}
                  variant="secondary"
                  accessibilityLabel={paused ? 'Devam et' : 'Duraklat'}
                  onPress={togglePause}
                />
              </View>
              <View style={styles.grow}>
                <Button
                  title="BİTİRDİM"
                  accessibilityLabel="Bitirdim"
                  disabled={paused}
                  loading={finishing}
                  onPress={phase === 'baseline' ? endBaseline : endLight}
                />
              </View>
            </View>
          </View>
        ) : null
      }>
      <PirilHelper text={helper} pose={phase === 'light-ready' ? 'happy' : 'talk'} />
      {text ? (
        <ExerciseHeading
          title={text.title}
          note={
            phase === 'light' || phase === 'light-ready'
              ? 'Işık senin hızına göre ayarlandı.'
              : 'İlk bölüm: kendi hızında.'
          }
        />
      ) : null}

      {phase === 'baseline' ? (
        <View style={styles.reader}>
          {segment.map((paragraph, index) => (
            <AppText key={index} style={paragraphStyle}>
              {paragraph}
            </AppText>
          ))}
        </View>
      ) : null}

      {phase === 'light-ready' || phase === 'light' ? (
        <View style={styles.reader}>
          {rest.map((paragraph, index) => (
            <AppText
              key={index}
              style={paragraphStyle}
              onLayout={(event: LayoutChangeEvent) => {
                const y = event.nativeEvent.layout.y;
                setParagraphTops((previous) =>
                  previous[index] === y ? previous : Object.assign([...previous], { [index]: y }),
                );
              }}
              onTextLayout={(event: TextLayoutEvent) => {
                const measured = event.nativeEvent.lines;
                setParagraphLines((previous) =>
                  Object.assign([...previous], { [index]: measured }),
                );
              }}>
              {paragraph}
            </AppText>
          ))}
          {phase === 'light' && !reduceMotion ? (
            <>
              <Animated.View pointerEvents="none" style={[styles.veil, styles.block, blockStyle]} />
              <Animated.View
                pointerEvents="none"
                style={[styles.veil, styles.lineVeil, lineStyle]}
              />
            </>
          ) : null}
          {phase === 'light' && reduceMotion && lines?.[markerLine] ? (
            <View
              pointerEvents="none"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={[
                styles.marker,
                { top: lines[markerLine].top, height: lines[markerLine].height || LINE_HEIGHT },
              ]}
            />
          ) : null}
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
    lineHeight: LINE_HEIGHT,
    color: colors.readingText,
  },
  /** Işık: okunmuş yerin üstüne zemin rengi saydam düşer, metin solar. */
  veil: {
    position: 'absolute',
    backgroundColor: colors.background,
  },
  block: {
    top: 0,
    left: 0,
    right: 0,
    opacity: VEIL_OPACITY,
  },
  lineVeil: {
    top: 0,
    left: 0,
  },
  /** Hareketi azalt: o anki satırın solunda sabit işaret. */
  marker: {
    position: 'absolute',
    left: -12,
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.logoAccent,
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
});
