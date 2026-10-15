import { City } from '../../src/generated/prisma/enums.js';
import { chest, placeholderStory } from './placeholder.js';
import type { SeedCity } from './types.js';

const city = City.IZMIR;

/** 2. durak — "Kordon'un Rüzgârı" */
export const izmir: SeedCity = {
  city,
  lessons: [
    placeholderStory(city, 1), // TODO(P03)
    placeholderStory(city, 2), // TODO(P03)
    placeholderStory(city, 3), // TODO(P03): "Kordon'da Bisiklet"
    placeholderStory(city, 4), // TODO(P03)
    chest(city, 5),
    placeholderStory(city, 6), // TODO(P03)
    placeholderStory(city, 7), // TODO(P03)
    placeholderStory(city, 8), // TODO(P03)
    placeholderStory(city, 9), // TODO(P03)
    chest(city, 10),
  ],
};
