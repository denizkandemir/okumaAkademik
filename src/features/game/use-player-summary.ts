import type { StatsResponse } from './types';

import { useAuth } from '@/features/auth/auth-context';
import { useApiQuery } from '@/hooks/use-api-query';

export type PlayerSummary = {
  /** Çocuğun adı (oturumdan). */
  name: string;
  /** `null`: istatistikler henüz gelmedi. */
  streak: number | null;
  lokum: number | null;
};

/**
 * Üst çubuğun verisi: ad, seri ve lokum. Ekran her odaklandığında tazelenir (ders bitip dönünce
 * yeni lokum görünür); tazeleme hata verirse önceki değerler kalır.
 */
export function usePlayerSummary(): PlayerSummary {
  const { user } = useAuth();
  const { data } = useApiQuery<StatsResponse>(user ? '/me/stats' : null, {
    refetchOnFocus: true,
  });
  return {
    name: user?.name ?? '',
    streak: data?.streak ?? null,
    lokum: data?.lokum ?? null,
  };
}
