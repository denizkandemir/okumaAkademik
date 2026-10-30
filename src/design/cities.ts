import type { ImageSource } from 'expo-image';

import type { CityId } from '@/features/game/theme';
import type { MascotPose } from '@/features/mascot/types';

/** Bir şehrin tasarım verisi (docs/tasarim/README.md, "Şehir verileri"). */
export type CityDesign = {
  /** Durak numarası, 1-6. */
  number: number;
  name: string;
  /** Bölüm başlığı, ör. "Galata'dan Boğaz'a". */
  chapterTitle: string;
  /** Şehir açılışındaki slogan. */
  tagline: string;
  /** Haritadaki italik yer notu. */
  landmarkNote: string;
  /** Haritadaki Pırıl pozu. */
  homePose: MascotPose;
  /** Bulunma hâli, ör. "İstanbul'daki". */
  locative: string;
  /** Belirtme hâli, ör. "İstanbul'u". */
  accusative: string;
  /** Arayüzsüz arka plan, 1024×1536. */
  background: ImageSource;
};

/** Şehir açılışında slogandan sonra her şehirde gelen cümle. */
export const CITY_UNLOCK_LINE = 'Yeni sokaklar, yeni hikâyeler, yeni arkadaşlar.';

export const CITIES: Record<CityId, CityDesign> = {
  istanbul: {
    number: 1,
    name: 'İstanbul',
    chapterTitle: "Galata'dan Boğaz'a",
    tagline: 'İki kıta, binbir hikâye.',
    landmarkNote: "Boğaz'a doğru",
    homePose: 'idle',
    locative: "İstanbul'daki",
    accusative: "İstanbul'u",
    background: require('@/assets/cities/istanbul.webp'),
  },
  izmir: {
    number: 2,
    name: 'İzmir',
    chapterTitle: "Kordon'da bir gün",
    tagline: 'Biraz deniz, biraz merak.',
    landmarkNote: 'Kordon boyunca',
    homePose: 'wave',
    locative: "İzmir'deki",
    accusative: "İzmir'i",
    background: require('@/assets/cities/izmir.webp'),
  },
  efes: {
    number: 3,
    name: 'Efes',
    chapterTitle: 'Antik kentin izleri',
    tagline: 'Taşların sakladığı öyküler.',
    landmarkNote: 'Mermer yol',
    homePose: 'read',
    locative: "Efes'teki",
    accusative: "Efes'i",
    background: require('@/assets/cities/efes.webp'),
  },
  antalya: {
    number: 4,
    name: 'Antalya',
    chapterTitle: "Kaleiçi'nde bir sabah",
    tagline: 'Güneşe açılan bir kapı.',
    landmarkNote: 'Limana inen yol',
    homePose: 'happy',
    locative: "Antalya'daki",
    accusative: "Antalya'yı",
    background: require('@/assets/cities/antalya.webp'),
  },
  kapadokya: {
    number: 5,
    name: 'Kapadokya',
    chapterTitle: 'Vadinin üstünde',
    tagline: 'Gökyüzüne uzanan hayaller.',
    landmarkNote: 'Peribacalarına doğru',
    homePose: 'think',
    locative: "Kapadokya'daki",
    accusative: "Kapadokya'yı",
    background: require('@/assets/cities/kapadokya.webp'),
  },
  van: {
    number: 6,
    name: 'Van',
    chapterTitle: "Pırıl'ın memleketi",
    tagline: 'Her yol bir hikâyeye çıkar.',
    landmarkNote: 'Göl kıyısında',
    homePose: 'talk',
    locative: "Van'daki",
    accusative: "Van'ı",
    background: require('@/assets/cities/van.webp'),
  },
};
