import { createContext, use, useState, type PropsWithChildren } from 'react';

import type { CityId } from './theme';

type CurrentCityValue = {
  city: CityId;
  setCity: (city: CityId) => void;
};

const CurrentCityContext = createContext<CurrentCityValue | null>(null);

/**
 * Kullanıcının şu anki şehri (GET /me/journey `currentCity`). Ana sayfa veriyi alınca yazar;
 * sekme çubuğu seçili hapı bu şehrin rengiyle çizer. Veri gelene kadar İstanbul.
 */
export function CurrentCityProvider({ children }: PropsWithChildren) {
  const [city, setCity] = useState<CityId>('istanbul');
  return <CurrentCityContext value={{ city, setCity }}>{children}</CurrentCityContext>;
}

function useCurrentCityContext() {
  const value = use(CurrentCityContext);
  if (!value) throw new Error('useCurrentCity, <CurrentCityProvider> içinde kullanılmalı.');
  return value;
}

export function useCurrentCity(): CityId {
  return useCurrentCityContext().city;
}

export function useSetCurrentCity(): (city: CityId) => void {
  return useCurrentCityContext().setCity;
}
