import type { ReactNode } from 'react';

import { BookIcon, ClockIcon, SparkleIcon, StarIcon } from '@/design/icons';
import type { ExerciseType } from '@/features/exercises/types';

type ExerciseInfo = {
  /** Kartta ve üst başlıkta görünen ad. */
  title: string;
  /** Pırıl'ın ilk kullanımdaki talimatı. */
  intro: string;
  /** Sonraki kullanımlarda kısa hatırlatma. */
  reminder: string;
  icon: (color: string) => ReactNode;
};

/**
 * Egzersizlerin çocuğa görünen adları ve Pırıl'ın talimatları. E6 bir okuma temposu egzersizidir;
 * hiçbir metinde göz egzersizi ya da göz takibi denmez (02-egzersiz-katalogu.md, E6 "Tanıtım dili").
 */
export const EXERCISE_INFO: Partial<Record<ExerciseType, ExerciseInfo>> = {
  TEKRARLI_OKUMA: {
    title: 'Tekrarlı okuma',
    intro:
      'Aynı kısa metni birkaç kez okuyacağız. Her okumadan sonra grafiğe bakalım: okudukça daha akıcı olacaksın. Sonunda da birkaç soru var.',
    reminder: 'Aynı metni birkaç kez oku, grafikte ilerlemeni gör.',
    icon: (color) => <ClockIcon size={20} color={color} />,
  },
  OBEK_OKUMA: {
    title: 'Öbek öbek oku',
    intro:
      'Kelimeler küçük gruplar hâlinde. Her öbeği bir solukta oku, çizgilerde kısacık dur. Böylece cümleler anlam kazanır.',
    reminder: 'Her öbeği bir solukta oku, çizgilerde kısacık dur.',
    icon: (color) => <BookIcon size={20} color={color} />,
  },
  HIZLI_KELIME: {
    title: 'Hızlı kelime',
    intro: 'Bir kelime kısa bir an görünecek. Gördüğün kelimeyi seçeneklerin arasında bul!',
    reminder: 'Kelimeyi gör, seçeneklerde bul.',
    icon: (color) => <SparkleIcon size={20} color={color} />,
  },
  PIRIL_ISIGI: {
    title: "Pırıl'ın ışığı",
    intro:
      'Bu bir okuma temposu egzersizi. Önce kendi hızında oku; sonra yumuşak bir ışık okuduğun satırları arkandan soldurur. İstediğin an durdurabilirsin.',
    reminder: 'Kendi temponda oku; ışık okuduğun yerleri arkandan soldurur.',
    icon: (color) => <SparkleIcon size={20} color={color} filled />,
  },
  HECE_TOPU: {
    title: 'Hece hece oku',
    intro: 'Topu takip et, heceleri sesli oku!',
    reminder: 'Topu takip et, heceleri sesli oku!',
    icon: () => <StarIcon size={20} />,
  },
};

export function exerciseTitle(type: ExerciseType): string {
  return EXERCISE_INFO[type]?.title ?? 'Egzersiz';
}
