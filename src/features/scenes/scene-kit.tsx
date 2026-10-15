import { Fragment, useEffect, type ReactElement } from 'react';
import { StyleSheet, View, type TransformsStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg from 'react-native-svg';

/** Tasarımdaki sahne `viewBox`'ı: 0 0 390 340. */
export const SCENE_WIDTH = 390;
export const SCENE_HEIGHT = 340;
const VIEW_BOX = `0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`;

/**
 * Tasarımdaki SMIL `values` listesi: anahtar kareler eşit aralıklı, aralarında doğrusal geçiş
 * (`ease` ile yumuşak giriş-çıkış). Süreler ms.
 */
export type Track = {
  values: readonly number[];
  dur: number;
  ease?: boolean;
  /** SMIL `begin`: ilk döngüden önce bekleme. */
  delay?: number;
};

export type SpriteMotion = {
  /** Sahne birimiyle; ölçekle çarpılır. */
  translate?: {
    x: readonly number[];
    y: readonly number[];
    dur: number;
    ease?: boolean;
    delay?: number;
  };
  /** Derece */
  rotate?: Track;
  /** Derece */
  skewY?: Track;
  scale?: Track;
  opacity?: Track;
};

export type SceneSprite = {
  /** [x, y, genişlik, yükseklik] sahne birimiyle. Hareketsiz içeriği tamamen kapsar. */
  box: readonly [number, number, number, number];
  /** Döndürme/eğme merkezi (sahne birimi); verilmezse kutunun ortası. */
  origin?: readonly [number, number];
  /** Hangi statik katmandan sonra çizildiği (0 = ilk katman). */
  after: number;
  /** İçerik `defs`'teki bir gradyanı kullanıyorsa sprite'ın kendi `Svg`'sine de konur. */
  usesDefs?: boolean;
  content: ReactElement;
  motion: SpriteMotion;
};

export type SceneDefinition = {
  defs: ReactElement;
  /** Sprite'lar çıkarılmış statik katmanlar, alttan üste. */
  layers: readonly ReactElement[];
  sprites: readonly SceneSprite[];
};

export type SceneProps = {
  width: number;
  /** `false` iken tek bir statik `Svg` çizilir; Reanimated hiç kullanılmaz. */
  animated: boolean;
};

/**
 * Bir şehir sahnesini çizer. Hareketsiz hâli (küçük resimler, "hareketi azalt"), tasarımın SMIL
 * animasyonları kapalıyken görünen karesidir: tek `Svg`, sprite'lar yerinde.
 *
 * Hareketli hâlde statik kısımlar katman katman ayrı `Svg`'lerde, sprite'lar ise kendi küçük
 * `Svg`'leriyle `Animated.View` içinde çizilir; hareket yalnızca UI thread'de transform/opacity
 * değişimidir (kare başına React render'ı ve SVG yeniden çizimi yok).
 */
export function SceneCanvas({ scene, width, animated }: SceneProps & { scene: SceneDefinition }) {
  const scale = width / SCENE_WIDTH;
  const height = scale * SCENE_HEIGHT;

  if (!animated) {
    return (
      <Svg width={width} height={height} viewBox={VIEW_BOX}>
        {scene.defs}
        {scene.layers.map((layer, index) => (
          <Fragment key={index}>
            {layer}
            {scene.sprites.map((sprite, i) =>
              sprite.after === index ? <Fragment key={i}>{sprite.content}</Fragment> : null,
            )}
          </Fragment>
        ))}
      </Svg>
    );
  }

  return (
    <View style={{ width, height }}>
      {scene.layers.map((layer, index) => (
        <Fragment key={index}>
          <Svg width={width} height={height} viewBox={VIEW_BOX} style={StyleSheet.absoluteFill}>
            {scene.defs}
            {layer}
          </Svg>
          {scene.sprites.map((sprite, i) =>
            sprite.after === index ? (
              <AnimatedSprite key={i} sprite={sprite} scale={scale} defs={scene.defs} />
            ) : null,
          )}
        </Fragment>
      ))}
    </View>
  );
}

function AnimatedSprite({
  sprite,
  scale,
  defs,
}: {
  sprite: SceneSprite;
  scale: number;
  defs: ReactElement;
}) {
  const { box, motion } = sprite;
  const [x, y, w, h] = box;
  const [ox, oy] = sprite.origin ?? [x + w / 2, y + h / 2];
  const { translate, rotate, skewY, scale: grow, opacity } = motion;

  // Kanca sayısı sabit: kullanılmayan kanalın döngüsü başlamaz.
  const translateProgress = useLoop(translate && movingAxis(translate), translate, 0);
  const rotateProgress = useLoop(rotate?.values, rotate, 0);
  const skewProgress = useLoop(skewY?.values, skewY, 0);
  const scaleProgress = useLoop(grow?.values, grow, 1);
  const opacityProgress = useLoop(opacity?.values, opacity, 1);

  const animatedStyle = useAnimatedStyle(() => {
    const transform: Exclude<TransformsStyle['transform'], string | undefined>[number][] = [];
    if (translate) {
      const p = translateProgress.get();
      transform.push(
        { translateX: sample(translate.x, p, translate.ease) * scale },
        { translateY: sample(translate.y, p, translate.ease) * scale },
      );
    }
    if (rotate)
      transform.push({ rotate: `${sample(rotate.values, rotateProgress.get(), rotate.ease)}deg` });
    if (skewY)
      transform.push({ skewY: `${sample(skewY.values, skewProgress.get(), skewY.ease)}deg` });
    if (grow) transform.push({ scale: sample(grow.values, scaleProgress.get(), grow.ease) });
    return {
      opacity: opacity ? sample(opacity.values, opacityProgress.get(), opacity.ease) : 1,
      transform,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x * scale,
          top: y * scale,
          width: w * scale,
          height: h * scale,
          transformOrigin: [(ox - x) * scale, (oy - y) * scale, 0],
        },
        animatedStyle,
      ]}>
      <Svg width={w * scale} height={h * scale} viewBox={`${x} ${y} ${w} ${h}`}>
        {sprite.usesDefs ? defs : null}
        {sprite.content}
      </Svg>
    </Animated.View>
  );
}

/** Ötelemenin dinlenme evresi hareket eden eksenden bulunur (diğer eksen o evrede de 0). */
function movingAxis(translate: NonNullable<SpriteMotion['translate']>): readonly number[] {
  return translate.x.some((v) => v !== translate.x[0]) ? translate.x : translate.y;
}

/**
 * Döngünün ilerlemesi (0 → 1, tekrar). Döngü, değerin hareketsiz kareye (`rest`: öteleme ve açı
 * için 0, ölçek ve opaklık için 1) eşit olduğu evreden başlar; animasyon açılıp kapanınca sıçramaz.
 * `values` ve `timing` modül sabitlerinden gelir; referansları değişmez.
 */
function useLoop(
  values: readonly number[] | undefined,
  timing: { dur: number; delay?: number } | undefined,
  rest: number,
): SharedValue<number> {
  const progress = useSharedValue(values ? restPhase(values, rest) : 0);
  useEffect(() => {
    if (!values || !timing) return;
    const phase = restPhase(values, rest);
    progress.set(phase);
    const loop = withRepeat(
      withTiming(phase + 1, { duration: timing.dur, easing: Easing.linear }),
      -1,
      false,
    );
    progress.set(timing.delay ? withDelay(timing.delay, loop) : loop);
    return () => cancelAnimation(progress);
  }, [progress, values, timing, rest]);
  return progress;
}

/** Değerin `rest`e ilk eşit olduğu evre (anahtar kareler eşit aralıklı, doğrusal). */
function restPhase(values: readonly number[], rest: number): number {
  const n = values.length - 1;
  for (let i = 0; i < n; i += 1) {
    const a = values[i];
    const b = values[i + 1];
    if (a === rest) return i / n;
    if ((a - rest) * (b - rest) < 0) return (i + (rest - a) / (b - a)) / n;
  }
  return 0;
}

/** `p` evresindeki değer (p 1'i aşabilir; döngü evreden başladığı için). */
function sample(values: readonly number[], p: number, ease?: boolean): number {
  'worklet';
  const n = values.length - 1;
  const x = (p % 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  let t = x - i;
  if (ease) t = 0.5 - 0.5 * Math.cos(Math.PI * t);
  return values[i] + (values[i + 1] - values[i]) * t;
}
