import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { StateView } from '@/design/components/state-view';
import { ChunkReading } from '@/features/exercises/chunk-reading';
import { startExercise } from '@/features/exercises/exercise-api';
import { ExerciseShell, leaveExercise } from '@/features/exercises/exercise-shell';
import { RepeatedReading } from '@/features/exercises/repeated-reading';
import type {
  ChunkReadingData,
  ChunkReadingParams,
  RepeatedReadingParams,
  StartExerciseResponse,
} from '@/features/exercises/types';
import { Mascot } from '@/features/mascot/mascot';

/**
 * Egzersiz ekranı: açılınca oturumu başlatır (POST /exercises/:itemId/sessions) ve türüne göre
 * egzersizi gösterir. E5, E6 ve E11'in ekranları A1a-2'de gelir.
 */
export default function ExerciseScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const [start, setStart] = useState<StartExerciseResponse | null>(null);
  const [error, setError] = useState<unknown>(null);
  const requested = useRef<string | null>(null);

  const load = useCallback(() => {
    if (!itemId) return;
    setError(null);
    startExercise(itemId)
      .then(setStart)
      .catch((reason: unknown) => setError(reason));
  }, [itemId]);

  // Oturum bir kez başlatılır (geliştirmedeki çift efekt ikinci oturum açmasın).
  useEffect(() => {
    if (!itemId || requested.current === itemId) return;
    requested.current = itemId;
    load();
  }, [itemId, load]);

  if (!start) {
    return (
      <ExerciseShell
        eyebrow="BUGÜNÜN ANTRENMANI"
        progress={0}
        progressLabel="Egzersiz hazırlanıyor"
        confirmClose={false}>
        <View style={styles.state}>
          <StateView
            isLoading={!error}
            error={error}
            onRetry={load}
            loadingLabel="Egzersizi hazırlıyorum…"
          />
        </View>
      </ExerciseShell>
    );
  }

  switch (start.item.type) {
    case 'TEKRARLI_OKUMA':
      return (
        <RepeatedReading start={start as StartExerciseResponse<RepeatedReadingParams, unknown>} />
      );
    case 'OBEK_OKUMA':
      return (
        <ChunkReading
          start={start as StartExerciseResponse<ChunkReadingParams, ChunkReadingData>}
        />
      );
    default:
      return (
        <ExerciseShell
          eyebrow="BUGÜNÜN ANTRENMANI"
          progress={0}
          progressLabel="Egzersiz"
          confirmClose={false}>
          <View style={styles.soon}>
            <Mascot pose="think" size={120} decorative />
            <AppText variant="heading" align="center">
              Bu egzersiz çok yakında geliyor!
            </AppText>
            <Button
              title="ANTRENMANA DÖN"
              accessibilityLabel="Antrenmana dön"
              onPress={leaveExercise}
            />
          </View>
        </ExerciseShell>
      );
  }
}

const styles = StyleSheet.create({
  state: {
    paddingTop: 24,
  },
  soon: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 24,
  },
});
