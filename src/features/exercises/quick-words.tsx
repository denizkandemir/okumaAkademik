import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { Card } from '@/design/components/card';
import { FeedbackPanel } from '@/design/components/feedback-panel';
import { OptionCard, type OptionState } from '@/design/components/option-card';
import { colors, fonts, readingSize, type } from '@/design/tokens';
import { finishExercise } from '@/features/exercises/exercise-api';
import { EXERCISE_INFO } from '@/features/exercises/exercise-info';
import { ExerciseResult } from '@/features/exercises/exercise-result';
import { ExerciseHeading, ExerciseShell, PirilHelper } from '@/features/exercises/exercise-shell';
import type {
  FinishExerciseResponse,
  QuickWordsData,
  QuickWordsParams,
  QuickWordsResult,
  StartExerciseResponse,
} from '@/features/exercises/types';
import { useExerciseIntro } from '@/features/exercises/use-exercise-intro';
import { getErrorMessage } from '@/lib/errors';

type Phase = 'ready' | 'cards' | 'text-ready' | 'reading' | 'result';
/** Kartın aşaması: odak noktası, kelime görünür, seçenekler, cevaplandı. */
type Stage = 'focus' | 'flash' | 'choose' | 'answered';

const INFO = EXERCISE_INFO.HIZLI_KELIME;
const LOCALE = 'tr-TR';
const LETTERS = ['A', 'B', 'C', 'D'];
/** Kelimeden önce odak noktasının görünme süresi (ms). */
const FOCUS_MS = 600;
/** Cevaptan sonra sonraki karta geçmeden önceki bekleme (ms). */
const ANSWER_PAUSE_MS = 1100;
/** Doğru cevapta görünme süresi kısalır, yanlışta biraz uzar. */
const FASTER = 0.85;
const SLOWER = 1.15;

/** Seçenekler: kelime ve çeldiriciler, karta göre belirlenimci sırayla, hepsi küçük harf. */
function optionsFor(word: string, distractors: string[], index: number): string[] {
  const all = [word, ...distractors].map((option) => option.toLocaleLowerCase(LOCALE));
  const shift = index % all.length;
  return [...all.slice(shift), ...all.slice(0, shift)];
}

/** Okunan metindeki çalışılmış kelimeler (noktalamasız, küçük harf). */
function bare(word: string): string {
  return word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '').toLocaleLowerCase(LOCALE);
}

/**
 * E5 Hızlı kelime: metindeki kelime kısa bir an görünür, çocuk onu 3-4 benzer seçenek arasından
 * bulur. Doğru cevapta süre kısalır (en kısa `minFlashMs`). Kartlardan sonra kelimelerin geldiği
 * metin okunur; çalışılan kelimeler metinde hafifçe belirgindir. Sonuçta tanınan kelime sayısı.
 */
export function QuickWords({
  start,
}: {
  start: StartExerciseResponse<QuickWordsParams, QuickWordsData>;
}) {
  const { flashMs: startFlashMs, minFlashMs } = start.item.params;
  const { words } = start.item.data;
  const text = start.text;
  const intro = useExerciseIntro('HIZLI_KELIME');

  const sessionStartedAt = useRef(0);
  useEffect(() => {
    sessionStartedAt.current = Date.now();
  }, []);
  const readStartedAt = useRef(0);
  const [phase, setPhase] = useState<Phase>('ready');
  const [cardIndex, setCardIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('focus');
  const [flashMs, setFlashMs] = useState(startFlashMs);
  const [chosen, setChosen] = useState<string | null>(null);
  const [cards, setCards] = useState<QuickWordsResult['cards']>([]);
  const [result, setResult] = useState<FinishExerciseResponse | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  const card = words[cardIndex];
  const target = card?.word.toLocaleLowerCase(LOCALE) ?? '';
  const options = card ? optionsFor(card.word, card.distractors, cardIndex) : [];

  // Kartın akışı: odak → kelime (flashMs) → seçenekler; cevaptan sonra sonraki kart.
  useEffect(() => {
    if (phase !== 'cards') return;
    if (stage === 'focus') {
      const id = setTimeout(() => setStage('flash'), FOCUS_MS);
      return () => clearTimeout(id);
    }
    if (stage === 'flash') {
      const id = setTimeout(() => setStage('choose'), flashMs);
      return () => clearTimeout(id);
    }
    if (stage === 'answered') {
      const id = setTimeout(() => {
        setChosen(null);
        if (cardIndex + 1 < words.length) {
          setCardIndex(cardIndex + 1);
          setStage('focus');
        } else {
          setPhase('text-ready');
        }
      }, ANSWER_PAUSE_MS);
      return () => clearTimeout(id);
    }
  }, [phase, stage, flashMs, cardIndex, words.length]);

  if (phase === 'result' && result) {
    return <ExerciseResult title={text?.title ?? INFO?.title ?? ''} result={result} />;
  }

  const choose = (option: string) => {
    if (stage !== 'choose' || !card) return;
    const correct = option === target;
    setChosen(option);
    setCards((previous) => [...previous, { word: card.word, correct, flashMs }]);
    setFlashMs((current) =>
      correct
        ? Math.max(minFlashMs, Math.round(current * FASTER))
        : Math.min(startFlashMs, Math.round(current * SLOWER)),
    );
    setStage('answered');
  };

  const optionState = (option: string): OptionState => {
    if (stage !== 'answered') return 'default';
    if (option === target) return 'correct';
    if (option === chosen) return 'wrong';
    return 'disabled';
  };

  const startCards = () => {
    void intro.markSeen();
    setPhase('cards');
    setStage('focus');
  };
  const startReading = () => {
    readStartedAt.current = Date.now();
    setPhase('reading');
  };
  const finish = async () => {
    if (finishing) return;
    setFinishing(true);
    setFinishError(null);
    const body: { durationSeconds: number; result: QuickWordsResult } = {
      durationSeconds: Math.round((Date.now() - sessionStartedAt.current) / 1000),
      result: {
        cards,
        readSeconds: Math.max(1, Math.round((Date.now() - readStartedAt.current) / 1000)),
      },
    };
    try {
      setResult(await finishExercise(start.sessionId, body));
      setPhase('result');
    } catch (error) {
      setFinishError(getErrorMessage(error));
      setFinishing(false);
    }
  };

  const practiced = new Set(words.map((entry) => entry.word.toLocaleLowerCase(LOCALE)));
  const correctCount = cards.filter((entry) => entry.correct).length;
  const steps = words.length + 1;
  const progress =
    phase === 'ready'
      ? 0
      : phase === 'cards'
        ? (cardIndex + (stage === 'answered' ? 1 : 0)) / steps
        : phase === 'text-ready'
          ? words.length / steps
          : (words.length + 0.5) / steps;

  const helper =
    phase === 'ready'
      ? `${intro.firstTime ? (INFO?.intro ?? '') : (INFO?.reminder ?? '')} Hazır olunca BAŞLA'ya bas.`
      : phase === 'cards'
        ? stage === 'choose' || stage === 'answered'
          ? 'Hangi kelimeyi gördün?'
          : 'Ortaya bak, kelime geliyor!'
        : phase === 'text-ready'
          ? `${correctCount}/${words.length} kelimeyi tanıdın! Şimdi bu kelimeler metinde. Hazır olunca OKUMAYA BAŞLA'ya bas.`
          : 'Bitirince BİTİRDİM’e bas.';

  return (
    <ExerciseShell
      eyebrow={`${(INFO?.title ?? '').toLocaleUpperCase(LOCALE)}${
        phase === 'cards' ? ` · ${cardIndex + 1} / ${words.length}` : ''
      }`}
      progress={progress}
      progressLabel={
        phase === 'cards' ? `Kelime ${cardIndex + 1} / ${words.length}` : 'Hızlı kelime'
      }
      confirmClose={phase !== 'ready'}
      footer={
        intro.firstTime === null ? null : phase === 'ready' ? (
          <Button title="BAŞLA" accessibilityLabel="Kelimelere başla" onPress={startCards} />
        ) : phase === 'text-ready' ? (
          <Button title="OKUMAYA BAŞLA" accessibilityLabel="Okumaya başla" onPress={startReading} />
        ) : phase === 'reading' ? (
          <View style={styles.footer}>
            {finishError ? (
              <FeedbackPanel tone="wrong" title="Egzersizi kaydedemedim" text={finishError} />
            ) : null}
            <Button
              title="BİTİRDİM"
              accessibilityLabel="Bitirdim"
              loading={finishing}
              onPress={() => void finish()}
            />
          </View>
        ) : null
      }>
      <PirilHelper text={helper} pose={phase === 'text-ready' ? 'happy' : 'talk'} />

      {phase === 'cards' && card ? (
        <View style={styles.cardArea}>
          <Card style={styles.flashCard}>
            {stage === 'focus' ? (
              <AppText style={styles.focus} accessibilityLabel="Kelime geliyor">
                •
              </AppText>
            ) : stage === 'flash' ? (
              <AppText style={styles.flashWord} accessibilityLiveRegion="assertive">
                {target}
              </AppText>
            ) : (
              <AppText style={styles.focus} accessibilityLabel="Kelime gizlendi">
                ?
              </AppText>
            )}
          </Card>
          {stage === 'choose' || stage === 'answered' ? (
            <View style={styles.options} accessibilityRole="radiogroup">
              {options.map((option, index) => (
                <OptionCard
                  key={option}
                  letter={LETTERS[index] ?? ''}
                  text={option}
                  state={optionState(option)}
                  onPress={() => choose(option)}
                />
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {phase === 'reading' && text ? (
        <>
          <ExerciseHeading title={text.title} note="Kartlardaki kelimeler metinde koyu yazılı." />
          <View style={styles.reader}>
            {text.paragraphs.map((paragraph, paragraphIndex) => (
              <AppText key={paragraphIndex} style={styles.paragraph}>
                {paragraph.split(' ').map((word, index) => (
                  <AppText
                    key={index}
                    style={[styles.paragraph, practiced.has(bare(word)) && styles.practiced]}>
                    {index > 0 ? ` ${word}` : word}
                  </AppText>
                ))}
              </AppText>
            ))}
          </View>
        </>
      ) : null}
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  cardArea: {
    gap: 16,
    marginTop: 4,
  },
  flashCard: {
    minHeight: 132,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  flashWord: {
    fontFamily: type.reading.fontFamily,
    fontSize: 34,
    lineHeight: 44,
    color: colors.text,
    textAlign: 'center',
  },
  focus: {
    fontFamily: fonts.sansBlack,
    fontSize: 30,
    lineHeight: 44,
    color: colors.textMuted,
    textAlign: 'center',
  },
  options: {
    gap: 10,
  },
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
  practiced: {
    fontFamily: fonts.serifSemiBold,
    color: colors.text,
  },
  footer: {
    gap: 12,
  },
});
