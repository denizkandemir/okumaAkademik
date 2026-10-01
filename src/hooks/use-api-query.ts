import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api';

type QueryResult<T> = {
  /** İsteğin anahtarı (yol + yenileme sayacı); sonucun güncel isteğe ait olup olmadığını gösterir. */
  key: string;
  path: string;
  data?: T;
  error?: unknown;
};

export type UseApiQueryOptions = {
  /** Ekran yeniden odaklandığında (ör. geri dönüldüğünde) veriyi tazeler. */
  refetchOnFocus?: boolean;
};

export type UseApiQuery<T> = {
  data: T | undefined;
  error: unknown;
  /** İlk yükleme sürüyor (gösterilecek veri yok). */
  isLoading: boolean;
  /** Eldeki veri gösterilirken arka planda tazeleniyor. */
  isRefreshing: boolean;
  refetch: () => void;
};

/**
 * Basit GET sorgusu. `path` `null` ise istek atılmaz.
 * Önbellek yoktur; yol değişince ya da `refetch` çağrılınca yeniden istenir.
 */
export function useApiQuery<T>(
  path: string | null,
  { refetchOnFocus = false }: UseApiQueryOptions = {},
): UseApiQuery<T> {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<QueryResult<T> | null>(null);
  const key = `${path}#${version}`;

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    api
      .get<T>(path, { signal: controller.signal })
      .then((data) => setResult({ key, path, data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setResult({ key, path, error });
      });
    return () => controller.abort();
  }, [path, key]);

  const refetch = useCallback(() => setVersion((value) => value + 1), []);

  // İlk odaklanmada zaten istek atılıyor; yalnızca sonraki odaklanmalarda tazele.
  const hasFocusedRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!refetchOnFocus) return;
      if (hasFocusedRef.current) refetch();
      hasFocusedRef.current = true;
    }, [refetchOnFocus, refetch]),
  );

  const isCurrent = result?.key === key;
  // Aynı yol tazelenirken eski veri gösterilmeye devam eder.
  const data = result?.path === path ? result?.data : undefined;

  return {
    data,
    error: isCurrent ? result?.error : undefined,
    isLoading: !!path && !isCurrent && data === undefined,
    isRefreshing: !!path && !isCurrent && data !== undefined,
    refetch,
  };
}
