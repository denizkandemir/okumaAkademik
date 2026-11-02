import type { CityId } from '@/features/game/theme';
import type { StatsResponse } from '@/features/game/types';

/** Profildeki unvan, şu anki şehre göre (T05, "Profile"). */
const TITLES: Record<CityId, string> = {
  istanbul: 'Yeni kaşif',
  izmir: 'Meraklı okur',
  efes: 'Bilge gezgin',
  antalya: 'Cesur kaşif',
  kapadokya: 'Hayalperest okur',
  van: 'Usta kaşif',
};

const FINISHED_TITLE = 'Okuma kaşifi';

export function explorerTitle(stats: Pick<StatsResponse, 'finished' | 'cities'>): string {
  if (stats.finished) return FINISHED_TITLE;
  const current = stats.cities.find((city) => city.status === 'current');
  return TITLES[current?.id ?? 'istanbul'];
}
