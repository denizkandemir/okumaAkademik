import type { MeResponse } from './types';

import { api } from '@/lib/api';
import * as storage from '@/lib/storage';

/**
 * Seviye belirleme önerilmeli mi? Sunucu `needsPlacement` diyorsa ve bu kullanıcıya bu cihazda
 * daha önce önerilmediyse. Öneri bir kezdir: "Sonra yapalım" denirse kendiliğinden bir daha
 * açılmaz; çocuk Profil'deki "Seviyemi belirle" bağlantısıyla açabilir.
 */
export async function shouldOfferPlacement(userId: string): Promise<boolean> {
  const offered = (await storage.getJSON<string[]>(storage.StorageKeys.placementOfferedTo)) ?? [];
  if (offered.includes(userId)) return false;
  const me = await api.get<MeResponse>('/me', { timeoutMs: 8_000 });
  return me.needsPlacement;
}

/** Öneri ekranı gerçekten açılınca kaydedilir. */
export async function markPlacementOffered(userId: string): Promise<void> {
  const offered = (await storage.getJSON<string[]>(storage.StorageKeys.placementOfferedTo)) ?? [];
  if (!offered.includes(userId)) {
    await storage.setJSON(storage.StorageKeys.placementOfferedTo, [...offered, userId]);
  }
}
