import * as Haptics from 'expo-haptics';
import {
  Image,
  type ImageErrorEventData,
  type ImageLoadEventData,
  type ImageSource,
} from 'expo-image';
import { use, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Confetti } from './confetti';
import { POSE_ART } from './mascot-assets';
import { MascotDebugContext, type MascotFrameKind } from './mascot-debug';
import { SleepZ } from './sleep-z';
import type { MascotPose, MascotProps } from './types';
import {
  BREATH,
  JUMP_HEIGHT,
  MASCOT_BASE_SIZE,
  useMascotCanAnimate,
  useMascotReducedMotion,
  usePoseAnimation,
} from './use-mascot-animations';

const CROSSFADE_MS = 180;
const SHADOW_COLOR = '#4A2E1A';
/** Gölge yüksekliği, boyuta oranla. */
const SHADOW_HEIGHT = 0.07;

/** iOS'ta NaN/sonsuz bir transform görünümü tamamen kaybettirir; animasyon değerleri korunur. */
function finite(value: number, fallback: number) {
  'worklet';
  return Number.isFinite(value) ? value : fallback;
}

/** Geliştirici vitrini için: maskot bileşenlerinin toplam commit sayısı (yalnızca __DEV__). */
export const mascotRenderStats = { commits: 0 };

function useCountCommit() {
  // Bağımlılıksız effect her commit'ten sonra çalışır; render'ı saf bırakır.
  useEffect(() => {
    if (__DEV__) mascotRenderStats.commits += 1;
  });
}

type Layer = { id: number; pose: MascotPose };

/**
 * Pırıl. Her poz iki kare (temel + göz/ağız/el karesi) üst üste çizilerek ve ikinci karenin
 * opaklığı UI thread'de değiştirilerek canlandırılır; `source` hiç değişmez (titreme olmaz).
 */
export function Mascot({
  pose = 'idle',
  size = MASCOT_BASE_SIZE,
  talking = false,
  animated = true,
  onPress,
  accessibilityLabel = 'Pırıl',
  reduceMotion: reduceMotionOverride,
}: MascotProps) {
  useCountCommit();
  const reduceMotion = useMascotReducedMotion(reduceMotionOverride);
  const canAnimate = useMascotCanAnimate();
  const active = animated && !reduceMotion && canAnimate;

  // Poz değişince eski katman 180 ms'de solarken yenisi küçük bir "pop" ile belirir.
  const [layers, setLayers] = useState<Layer[]>(() => [{ id: 0, pose }]);
  const current = layers[layers.length - 1];
  if (current.pose !== pose) {
    setLayers([current, { id: current.id + 1, pose }]);
  }
  useEffect(() => {
    if (layers.length < 2) return;
    const timer = setTimeout(() => setLayers((prev) => prev.slice(-1)), CROSSFADE_MS + 40);
    return () => clearTimeout(timer);
  }, [layers]);
  const visibleLayers = reduceMotion ? [current] : layers;

  // Dokunma zıplaması alt ortadan ölçeklenir: merkez → alt kenar → ölçek → geri.
  const tap = useSharedValue(1);
  const tapPivot = size / 2;
  const tapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: tapPivot },
      { scale: finite(tap.get(), 1) },
      { translateY: -tapPivot },
    ],
  }));
  const handlePress = () => {
    if (!reduceMotion) {
      tap.set(
        withSequence(
          withTiming(0.92, { duration: 90 }),
          withTiming(1.04, { duration: 130 }),
          withTiming(1, { duration: 130 }),
        ),
      );
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessible
      accessibilityRole={onPress ? 'button' : 'image'}
      accessibilityLabel={accessibilityLabel}
      style={{ width: size, height: size }}>
      <Animated.View style={[StyleSheet.absoluteFill, tapStyle]}>
        {visibleLayers.map((layer) => (
          <PoseLayer
            key={reduceMotion ? `still-${layer.pose}` : layer.id}
            pose={layer.pose}
            size={size}
            talking={talking}
            active={active && layer.id === current.id}
            exiting={layer.id !== current.id}
            animateIn={!reduceMotion && layer.id !== 0}
          />
        ))}
      </Animated.View>
    </Pressable>
  );
}

type PoseLayerProps = {
  pose: MascotPose;
  size: number;
  talking: boolean;
  active: boolean;
  exiting: boolean;
  animateIn: boolean;
};

function PoseLayer({ pose, size, talking, active, exiting, animateIn }: PoseLayerProps) {
  useCountCommit();
  const debug = use(MascotDebugContext);
  const art = POSE_ART[pose];
  const unit = size / MASCOT_BASE_SIZE;
  const { breathe, rotate, lift, squashX, squashY, overlay } = usePoseAnimation(pose, {
    active,
    talking,
    unit,
  });
  const breath = BREATH[pose];
  const breathScale = breath?.scale ?? 0;
  const breathLift = (breath?.lift ?? 0) * unit;
  const jumpHeight = JUMP_HEIGHT * unit;

  const presence = useSharedValue(animateIn ? 0 : 1);
  useEffect(() => {
    presence.set(withTiming(exiting ? 0 : 1, { duration: CROSSFADE_MS }));
  }, [exiting, presence]);

  const layerStyle = useAnimatedStyle(() => {
    const p = presence.get();
    return { opacity: p, transform: [{ scale: 0.96 + 0.04 * p }] };
  });

  // Gövde ayakların hizasından (alt orta) döner ve ölçeklenir. transformOrigin yerine pivot,
  // çevir → dönüştür → geri çevir ile kurulur: RN'nin iOS/Android için kullandığı transformOrigin
  // ayrıştırıcısı ondalıklı yüzdeleri tanımıyor ("98.5%" → "5%"); bu yöntem her platformda aynı.
  const pivot = debug.legacyTransformOrigin ? 0 : (art.ground - 0.5) * size;
  const bodyStyle = useAnimatedStyle(() => {
    const b = finite(breathe.get(), 0);
    return {
      transform: [
        { translateY: pivot + finite(lift.get(), 0) - b * breathLift },
        { rotate: `${finite(rotate.get(), 0)}deg` },
        { scaleX: finite(squashX.get(), 1) },
        { scaleY: finite(squashY.get(), 1) * (1 + b * breathScale) },
        { translateY: -pivot },
      ],
    };
  });
  const legacyOrigin = debug.legacyTransformOrigin
    ? { transformOrigin: `50% ${art.ground * 100}%` }
    : null;

  // Gölge, yassılaştırılmış bir dairedir (her platformda gerçek elips). İçte koyu, dışta açık
  // iki halka kenarı yumuşatır.
  const shadowWidth = size * art.shadow;
  const flatten = (size * SHADOW_HEIGHT) / shadowWidth;
  const shadowStyle = useAnimatedStyle(() => {
    // Havadayken (yukarı kaydıkça) gölge küçülür ve açılır; nefes alırken hafifçe daralır.
    const air = Math.min(Math.max(-finite(lift.get(), 0) / jumpHeight, 0), 1);
    const scale =
      (1 - 0.45 * air) * (1 - 0.04 * finite(breathe.get(), 0)) * finite(squashX.get(), 1);
    return {
      opacity: 1 - 0.5 * air,
      transform: [{ scaleX: scale }, { scaleY: scale * flatten }],
    };
  });

  // Ön kare tam görünürken alttaki kareyi gizle: iki karenin kenarlarındaki 1-2 piksellik
  // farklar çift kontur gibi görünmesin. Ancak yalnızca ön kare gerçekten yüklendiyse: aksi halde
  // ikisi birden görünmez olurdu. Geçiş sırasında (esneme) ikisi birlikte görünür.
  const overlayReady = useSharedValue(0);
  const baseStyle = useAnimatedStyle(() => ({
    opacity: overlayReady.get() === 1 && finite(overlay.get(), 0) > 0.99 ? 0 : 1,
  }));
  const overlayStyle = useAnimatedStyle(() => ({ opacity: finite(overlay.get(), 0) }));

  const report = (frame: MascotFrameKind) => ({
    onLoad: (event: ImageLoadEventData) => {
      if (frame === 'overlay') overlayReady.set(1);
      debug.onFrameEvent?.({
        pose,
        frame,
        status: 'loaded',
        width: event.source.width,
        height: event.source.height,
      });
    },
    onError: (event: ImageErrorEventData) => {
      if (frame === 'overlay') overlayReady.set(0);
      if (__DEV__) console.warn(`Pırıl görseli yüklenemedi (${pose}, ${frame}):`, event.error);
      debug.onFrameEvent?.({ pose, frame, status: 'error', message: event.error });
    },
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.passThrough, layerStyle]}>
      {active && pose === 'celebrate' ? <Confetti size={size} /> : null}

      <Animated.View
        style={[
          styles.shadow,
          {
            width: shadowWidth,
            height: shadowWidth,
            left: (size - shadowWidth) / 2,
            top: size * art.ground - shadowWidth / 2,
          },
          shadowStyle,
        ]}>
        <View style={[styles.shadowRing, styles.shadowOuter]} />
        <View style={[styles.shadowRing, styles.shadowInner]} />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, legacyOrigin, bodyStyle]}>
        <Animated.View style={[StyleSheet.absoluteFill, baseStyle]}>
          <Frame
            source={art.base}
            useAppleWebpCodec={debug.useAppleWebpCodec}
            cachePolicy={debug.disableImageCache ? 'none' : 'memory'}
            {...report('base')}
          />
        </Animated.View>
        {art.overlay ? (
          <Animated.View style={[StyleSheet.absoluteFill, styles.hidden, overlayStyle]}>
            <Frame
              source={art.overlay}
              useAppleWebpCodec={debug.useAppleWebpCodec}
              cachePolicy={debug.disableImageCache ? 'none' : 'memory'}
              {...report('overlay')}
            />
          </Animated.View>
        ) : null}
      </Animated.View>

      {active && pose === 'sleep' ? <SleepZ size={size} /> : null}
    </Animated.View>
  );
}

type FrameProps = {
  source: ImageSource;
  useAppleWebpCodec: boolean;
  cachePolicy: 'none' | 'memory';
  onLoad: (event: ImageLoadEventData) => void;
  onError: (event: ImageErrorEventData) => void;
};

function Frame({ source, useAppleWebpCodec, cachePolicy, onLoad, onError }: FrameProps) {
  return (
    <Image
      source={source}
      style={StyleSheet.absoluteFill}
      contentFit="contain"
      cachePolicy={cachePolicy}
      // iOS: varsayılan Apple (ImageIO) WebP çözücüsü yerine libwebp. Yalnızca iOS'u etkiler.
      useAppleWebpCodec={useAppleWebpCodec}
      onLoad={onLoad}
      onError={onError}
      accessible={false}
    />
  );
}

const styles = StyleSheet.create({
  passThrough: {
    pointerEvents: 'none',
  },
  shadow: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowRing: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: SHADOW_COLOR,
  },
  shadowOuter: {
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  shadowInner: {
    width: '78%',
    height: '78%',
    opacity: 0.16,
  },
  hidden: {
    opacity: 0,
  },
});

/** Boyut önerileri (dp). */
export const MascotSizes = { small: 72, medium: 120, large: 220 } as const;
