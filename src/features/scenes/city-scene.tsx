import { memo, type ComponentType } from 'react';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import type { CityId } from '@/features/game/theme';

import { AntalyaScene } from './antalya-scene';
import { EfesScene } from './efes-scene';
import { IstanbulScene } from './istanbul-scene';
import { IzmirScene } from './izmir-scene';
import { KapadokyaScene } from './kapadokya-scene';
import { SCENE_HEIGHT, SCENE_WIDTH, type SceneProps } from './scene-kit';
import { VanScene } from './van-scene';

const SCENES: Record<CityId, ComponentType<SceneProps>> = {
  istanbul: IstanbulScene,
  izmir: IzmirScene,
  efes: EfesScene,
  antalya: AntalyaScene,
  kapadokya: KapadokyaScene,
  van: VanScene,
};

export type CitySceneProps = {
  city: CityId;
  width: number;
  /** Varsayılan `true`. Küçük resimlerde `false` verin: tek statik `Svg`, animasyon yok. */
  animated?: boolean;
};

/**
 * Ana sayfanın üstündeki şehir çizimi (yükseklik = genişlik × 340 / 390). Süsleme amaçlıdır;
 * ekran okuyucudan gizlidir. Sistem "hareketi azalt" açıkken her zaman statik çizilir.
 */
export const CityScene = memo(function CityScene({ city, width, animated = true }: CitySceneProps) {
  const reduceMotion = useReducedMotion();
  const Scene = SCENES[city];
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width,
        height: (width * SCENE_HEIGHT) / SCENE_WIDTH,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
      <Scene width={width} animated={animated && !reduceMotion} />
    </View>
  );
});
