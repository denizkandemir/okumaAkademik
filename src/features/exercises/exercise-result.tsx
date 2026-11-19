import { StyleSheet, View } from 'react-native';

import { Button } from '@/design/components/button';
import { RewardRow } from '@/design/components/reward-row';
import { StatTile } from '@/design/components/stat-tile';
import { LokumIcon } from '@/design/icons';
import { leaveExercise } from '@/features/exercises/exercise-shell';
import type { FinishExerciseResponse } from '@/features/exercises/types';
import { RewardLayout } from '@/features/game/rewards/reward-layout';
import { Mascot } from '@/features/mascot/mascot';
import { useHardwareBack } from '@/hooks/use-hardware-back';

/** "+18%" / "−4%" / "0%": ilk okumaya göre hız değişimi. */
export function formatChange(percent: number): string {
  const rounded = Math.round(percent);
  if (rounded > 0) return `+${rounded}%`;
  if (rounded < 0) return `−${Math.abs(rounded)}%`;
  return '0%';
}

/** "3/3"; soru yoksa null. */
export function formatComprehension(result: FinishExerciseResponse): string | null {
  if (result.questionsTotal == null || result.firstTryCorrect == null) return null;
  return `${result.firstTryCorrect}/${result.questionsTotal}`;
}

/**
 * Hız hiçbir zaman tek başına gösterilmez: hep anlamayla birlikte (01-arastirma.md §1). E1'de
 * "Hız +18%, anlama 3/3"; tek okumalı egzersizde dakikadaki kelime.
 */
export function resultSummary(result: FinishExerciseResponse): string {
  const speed =
    result.score != null
      ? `Hız ${formatChange(result.score)}`
      : result.wpmLast != null
        ? `Hız dakikada ${Math.round(result.wpmLast)} kelime`
        : null;
  const comprehension = formatComprehension(result);
  return [speed, comprehension ? `anlama ${comprehension}` : null].filter(Boolean).join(', ');
}

type ExerciseResultProps = {
  title: string;
  result: FinishExerciseResponse;
};

/** Egzersizin bitiş ekranı: Pırıl, hız ve anlama birlikte, kazanılan lokum. */
export function ExerciseResult({ title, result }: ExerciseResultProps) {
  useHardwareBack(() => {
    leaveExercise();
    return true;
  });

  const comprehension = formatComprehension(result);
  const allRight =
    result.questionsTotal != null && result.firstTryCorrect === result.questionsTotal;
  const speed =
    result.score != null
      ? { value: formatChange(result.score), label: 'hız (ilk okumaya göre)' }
      : result.wpmLast != null
        ? { value: String(Math.round(result.wpmLast)), label: 'kelime / dakika' }
        : null;

  return (
    <RewardLayout
      eyebrow="BUGÜNÜN ANTRENMANI"
      hero={<Mascot pose={allRight ? 'celebrate' : 'happy'} size={180} />}
      title="Antrenman tamam!"
      subtitle={[title, resultSummary(result)]}
      actions={
        <Button
          title="ANTRENMANA DÖN"
          accessibilityLabel="Antrenmana dön"
          onPress={leaveExercise}
        />
      }>
      <View style={styles.tiles}>
        {speed ? (
          <StatTile value={speed.value} label={speed.label} align="center" style={styles.tile} />
        ) : null}
        {comprehension ? (
          <StatTile value={comprehension} label="anlama" align="center" style={styles.tile} />
        ) : null}
      </View>
      <RewardRow
        icon={<LokumIcon size={24} />}
        title={
          result.lokum.earned > 0 ? `+${result.lokum.earned} lokum` : 'Bugünün lokumları toplandı'
        }
        subtitle={
          result.lokum.earned > 0
            ? `Toplam ${result.lokum.balance} lokum`
            : 'Günde 3 egzersiz lokum kazandırır. Okumaya devam!'
        }
      />
    </RewardLayout>
  );
}

const styles = StyleSheet.create({
  tiles: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
  },
});
