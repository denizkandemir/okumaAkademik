import { useEffect } from 'react';

import { useCurrentCity, useSetCurrentCity } from './current-city';
import { CITY_INFO, CITY_THEMES } from './theme';
import type { JourneyResponse } from './types';

import { useApiQuery } from '@/hooks/use-api-query';

/**
 * Ana sayfanın verisi (GET /me/journey). Ekrana her dönüldüğünde tazelenir; kullanıcının şehri
 * sekme çubuğu için ortak bağlama yazılır. Veri gelene kadar bağlamdaki son şehrin teması döner.
 */
export function useJourney() {
  const query = useApiQuery<JourneyResponse>('/me/journey', { refetchOnFocus: true });
  const knownCity = useCurrentCity();
  const setCurrentCity = useSetCurrentCity();
  const currentCity = query.data?.currentCity;

  useEffect(() => {
    if (currentCity) setCurrentCity(currentCity);
  }, [currentCity, setCurrentCity]);

  const cityId = query.data?.city.id ?? knownCity;
  return { ...query, cityId, theme: CITY_THEMES[cityId], info: CITY_INFO[cityId] };
}
