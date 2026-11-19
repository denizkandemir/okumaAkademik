import { useCallback, useEffect, useRef, useState } from 'react';

/** E6 ve E11: günde en fazla 5 dakika (02-egzersiz-katalogu.md). */
export const DAILY_LIMIT_MS = 5 * 60 * 1000;

/**
 * Duraklatmalar hariç geçen süre. Süre `limitMs`'e ulaşınca `onLimit` bir kez çağrılır (E6/E11'in
 * 5 dakika sınırı). `elapsedMs` her an okunabilir; yeniden çizim gerektirmez.
 */
export function useActiveTimer(onLimit: () => void, limitMs = DAILY_LIMIT_MS) {
  const startedAt = useRef<number | null>(null);
  const accumulated = useRef(0);
  const [running, setRunning] = useState(false);
  const onLimitRef = useRef(onLimit);
  useEffect(() => {
    onLimitRef.current = onLimit;
  }, [onLimit]);

  const elapsedMs = useCallback(
    () => accumulated.current + (startedAt.current !== null ? Date.now() - startedAt.current : 0),
    [],
  );

  const resume = useCallback(() => {
    if (startedAt.current !== null) return;
    startedAt.current = Date.now();
    setRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (startedAt.current === null) return;
    accumulated.current += Date.now() - startedAt.current;
    startedAt.current = null;
    setRunning(false);
  }, []);

  // Çalışırken kalan süre dolunca sınır bildirilir.
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(
      () => {
        if (elapsedMs() >= limitMs) onLimitRef.current();
      },
      Math.max(0, limitMs - elapsedMs()) + 50,
    );
    return () => clearTimeout(id);
  }, [running, elapsedMs, limitMs]);

  return { running, resume, pause, elapsedMs };
}
