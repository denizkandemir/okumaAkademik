import { useCallback, useEffect, useState } from 'react';

import type { ExerciseType } from '@/features/exercises/types';
import { getJSON, setJSON, StorageKeys } from '@/lib/storage';

/**
 * Pırıl'ın talimatı bu cihazda ilk kullanımda uzun, sonra kısa hatırlatma olarak gösterilir.
 * `firstTime` okunana kadar `null`dır.
 */
export function useExerciseIntro(type: ExerciseType) {
  const [firstTime, setFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    getJSON<string[]>(StorageKeys.exerciseIntroSeen)
      .then((seen) => {
        if (active) setFirstTime(!(seen ?? []).includes(type));
      })
      .catch(() => {
        if (active) setFirstTime(true);
      });
    return () => {
      active = false;
    };
  }, [type]);

  const markSeen = useCallback(async () => {
    try {
      const seen = (await getJSON<string[]>(StorageKeys.exerciseIntroSeen)) ?? [];
      if (!seen.includes(type)) await setJSON(StorageKeys.exerciseIntroSeen, [...seen, type]);
    } catch {
      // Cihazda saklanamazsa talimat bir dahaki sefer yine uzun gösterilir.
    }
  }, [type]);

  return { firstTime, markSeen };
}
