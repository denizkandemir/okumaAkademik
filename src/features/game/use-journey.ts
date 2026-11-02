import { useEffect } from 'react';

import { useCurrentCity, useSetCurrentCity } from './current-city';
import type { CityId } from '@/design/cities';
import type { JourneyResponse } from './types';

import { useApiQuery } from '@/hooks/use-api-query';

/**
 * Ana sayfanın verisi (GET /me/journey). Ekrana her dönüldüğünde tazelenir. `city` verilirse o
 * şehrin yolu istenir (`?city=`; kilitli şehirde sunucu 403 döner), yoksa kullanıcının şu anki
 * şehri. Kullanıcının şehri ortak bağlama yazılır; veri gelene kadar o şehir gösterilir.
 */
export function useJourney(city?: CityId) {
  const path = city ? `/me/journey?city=${encodeURIComponent(city)}` : '/me/journey';
  const query = useApiQuery<JourneyResponse>(path, { refetchOnFocus: true });
  const knownCity = useCurrentCity();
  const setCurrentCity = useSetCurrentCity();
  const currentCity = query.data?.currentCity;

  useEffect(() => {
    if (currentCity) setCurrentCity(currentCity);
  }, [currentCity, setCurrentCity]);

  const cityId: CityId = query.data?.city.id ?? city ?? knownCity;
  return { ...query, cityId, currentCity: currentCity ?? knownCity };
}
