import { City } from '../generated/prisma/enums.js';

/**
 * Veritabanında şehir `city` enum'u olarak saklanır (ISTANBUL); API sözleşmesinde küçük harfli
 * kimliktir ("istanbul"). Dönüşüm yalnızca burada yapılır. Dizinin sırası yolculuk sırasıdır.
 */
export const CITY_ORDER = [
  City.ISTANBUL,
  City.IZMIR,
  City.EFES,
  City.ANTALYA,
  City.KAPADOKYA,
  City.VAN,
] as const satisfies readonly City[];

export const API_CITY_IDS = ['istanbul', 'izmir', 'efes', 'antalya', 'kapadokya', 'van'] as const;
export type ApiCityId = (typeof API_CITY_IDS)[number];

const TO_API = {
  [City.ISTANBUL]: 'istanbul',
  [City.IZMIR]: 'izmir',
  [City.EFES]: 'efes',
  [City.ANTALYA]: 'antalya',
  [City.KAPADOKYA]: 'kapadokya',
  [City.VAN]: 'van',
} as const satisfies Record<City, ApiCityId>;

/** Hata mesajlarında kullanılan Türkçe adlar. */
export const CITY_NAMES = {
  [City.ISTANBUL]: 'İstanbul',
  [City.IZMIR]: 'İzmir',
  [City.EFES]: 'Efes',
  [City.ANTALYA]: 'Antalya',
  [City.KAPADOKYA]: 'Kapadokya',
  [City.VAN]: 'Van',
} as const satisfies Record<City, string>;

export function toApiCity(city: City): ApiCityId {
  return TO_API[city];
}

export function fromApiCity(id: ApiCityId): City {
  return CITY_ORDER[API_CITY_IDS.indexOf(id)] as City;
}

/** Yolculuktaki sıra numarası (İstanbul 1, Van 6). */
export function cityNo(city: City): number {
  return CITY_ORDER.indexOf(city) + 1;
}
