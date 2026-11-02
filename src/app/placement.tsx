import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { Eyebrow } from '@/design/components/eyebrow';
import { IconButton } from '@/design/components/icon-button';
import { Screen } from '@/design/components/screen';
import { StateView } from '@/design/components/state-view';
import { TextLink } from '@/design/components/text-link';
import { CloseIcon } from '@/design/icons';
import { colors } from '@/design/tokens';
import { QuizView } from '@/features/game/quiz/quiz-view';
import { Mascot } from '@/features/mascot/mascot';
import type {
  CompletePlacementRequest,
  CompletePlacementResponse,
  PlacementResponse,
} from '@/features/placement/types';
import { ReadingView, leaveReading } from '@/features/reading/reading-view';
import { useApiQuery } from '@/hooks/use-api-query';
import { useHardwareBack } from '@/hooks/use-hardware-back';
import { api } from '@/lib/api';

type Step =
  | { kind: 'intro' }
  | { kind: 'read'; index: number }
  | { kind: 'quiz'; index: number; readingSessionId: string }
  | { kind: 'done' };

/** Seviye belirleme her an bırakılabilir; yolculuk onu hiç beklemez. */
const close = leaveReading;

/**
 * Seviye belirleme ("Pırıl seni tanımak istiyor!"): Pırıl'ın daveti → 1. metin → 3 soru → 2. metin
 * → 3 soru → "Seni tanıdım!". Okuma ve sorular ders akışının ekranlarıdır (ReadingView, QuizView).
 * Sonuçta hız gösterilmez; çocuk ölçüldüğünü değil, Pırıl'la tanıştığını hisseder.
 */
export default function PlacementScreen() {
  const { data, error, isLoading, refetch } = useApiQuery<PlacementResponse>('/placement');
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [readingSessionIds, setReadingSessionIds] = useState<string[]>([]);

  const texts = data?.texts ?? [];
  const current = step.kind === 'read' || step.kind === 'quiz' ? texts[step.index] : undefined;

  if (step.kind === 'read' && current) {
    return (
      <ReadingView
        key={current.text.id}
        text={current.text}
        glossary={[]}
        eyebrow={`SENİ TANIYORUM · HİKÂYE ${step.index + 1} / ${texts.length}`}
        questionsNext
        onFinished={(_, readingSessionId) => {
          setReadingSessionIds((ids) => [...ids, readingSessionId]);
          setStep({ kind: 'quiz', index: step.index, readingSessionId });
        }}
        leaveMessage="Pırıl’la tanışmayı burada bırakıp yolculuğuna dönebilirsin."
        onLeave={close}
      />
    );
  }

  if (step.kind === 'quiz' && current) {
    const isLast = step.index === texts.length - 1;
    const complete = async () => {
      if (!isLast) {
        setStep({ kind: 'read', index: step.index + 1 });
        return;
      }
      const body: CompletePlacementRequest = { readingSessionIds };
      await api.post<CompletePlacementResponse>('/placement/complete', body);
      setStep({ kind: 'done' });
    };
    return (
      <QuizView
        key={step.readingSessionId}
        questions={current.questions}
        readingSessionId={step.readingSessionId}
        text={current.text}
        answerPath="/placement/answers"
        onComplete={complete}
        completeErrorTitle="Cevaplarını kaydedemedim"
        leaveMessage="Pırıl’la tanışmayı burada bırakıp yolculuğuna dönebilirsin."
        onLeave={close}
      />
    );
  }

  if (step.kind === 'done') return <Done />;

  return (
    <Intro
      loading={isLoading}
      error={error}
      onRetry={refetch}
      // Grubun metni yoksa seviye belirleme yapılamaz; başlat düğmesi yolculuğa döner.
      onStart={() => (texts.length > 0 ? setStep({ kind: 'read', index: 0 }) : close())}
    />
  );
}

/** Pırıl'ın daveti; "Sonra yapalım" yolculuğa döner. */
function Intro({
  loading,
  error,
  onRetry,
  onStart,
}: {
  loading: boolean;
  error: unknown;
  onRetry: () => void;
  onStart: () => void;
}) {
  useHardwareBack(() => {
    close();
    return true;
  });

  return (
    <Screen header={<AppHeader profileLink={false} />}>
      <IconButton
        accessibilityLabel="Kapat"
        accessibilityHint="Yolculuk haritasına döner"
        shape="round"
        onPress={close}
        style={styles.close}>
        <CloseIcon />
      </IconButton>
      <View style={styles.hero}>
        <Eyebrow align="center">SENİ TANIYALIM</Eyebrow>
        <Mascot pose="talk" size={170} accessibilityLabel="Pırıl konuşuyor" />
        <AppText variant="display" align="center" accessibilityRole="header">
          Pırıl seni tanımak istiyor!
        </AppText>
        <AppText color={colors.textMuted} align="center">
          İki kısa hikâye okuyacağız. Her birinden sonra üç soru soracağım. Acele etme, hikâyeyi
          anlamaya odaklan.
        </AppText>
      </View>
      {error ? (
        <StateView isLoading={false} error={error} onRetry={onRetry} />
      ) : (
        <View style={styles.actions}>
          <Button
            title="HADİ BAŞLAYALIM"
            accessibilityLabel="Hadi başlayalım"
            loading={loading}
            onPress={onStart}
          />
        </View>
      )}
      <TextLink title="Sonra yapalım" accessibilityRole="button" onPress={close} />
    </Screen>
  );
}

/** "Seni tanıdım!": sonuç sayıları gösterilmez. */
function Done() {
  useHardwareBack(() => {
    close();
    return true;
  });

  return (
    <Screen header={<AppHeader profileLink={false} />}>
      <View style={styles.hero}>
        <Eyebrow align="center">TEŞEKKÜRLER</Eyebrow>
        <Mascot pose="happy" size={170} accessibilityLabel="Pırıl mutlu" />
        <AppText variant="display" align="center" accessibilityRole="header">
          Seni tanıdım!
        </AppText>
        <AppText color={colors.textMuted} align="center">
          Artık sana uygun hikâyeler seçebilirim. Hadi yolculuğumuza devam edelim!
        </AppText>
      </View>
      <View style={styles.actions}>
        <Button title="YOLCULUĞA DÖN" accessibilityLabel="Yolculuğa dön" onPress={close} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  close: {
    alignSelf: 'flex-end',
  },
  hero: {
    alignItems: 'center',
    gap: 12,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
});
