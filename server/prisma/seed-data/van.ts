import { City } from '../../src/generated/prisma/enums.js';
import { chest, placeholderStory } from './placeholder.js';
import type { SeedCity } from './types.js';

const city = City.VAN;

/** 6. durak (final) — "Pırıl'ın Memleketi" */
export const van: SeedCity = {
  city,
  lessons: [
    placeholderStory(city, 1), // TODO(P03)
    placeholderStory(city, 2), // TODO(P03)
    placeholderStory(city, 3), // TODO(P03)
    placeholderStory(city, 4), // TODO(P03)
    chest(city, 5),
    placeholderStory(city, 6), // TODO(P03)
    placeholderStory(city, 7), // TODO(P03)
    placeholderStory(city, 8), // TODO(P03)
    placeholderStory(city, 9), // TODO(P03): "Eve Dönüş"
    chest(city, 10),
  ],
};
