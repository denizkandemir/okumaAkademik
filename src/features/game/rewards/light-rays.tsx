import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, Path, RadialGradient, Stop } from 'react-native-svg';

type LightRaysProps = {
  /** Çapı (dp). */
  size: number;
  /** Işın rengi (beyaz ya da tasarımdaki ton). */
  color?: string;
  /** Merkezdeki en yüksek opaklık. */
  opacity?: number;
  /** Bir tam turun süresi (ms); tasarımda 22 s. */
  periodMs?: number;
};

const RAY_COUNT = 16;

/**
 * Yavaşça dönen ışık huzmeleri (S08Tamamlandi'deki `repeating-conic-gradient` + radyal maske):
 * kenara doğru sönen dilimler. Süseldir; hareketi azalt açıkken durur.
 */
export function LightRays({
  size,
  color = '#FFFFFF',
  opacity = 0.55,
  periodMs = 22000,
}: LightRaysProps) {
  const reduceMotion = useReducedMotion();
  const turn = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    turn.set(withRepeat(withTiming(1, { duration: periodMs, easing: Easing.linear }), -1));
    return () => cancelAnimation(turn);
  }, [turn, reduceMotion, periodMs]);

  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get() * 360}deg` }] }));

  const r = size / 2;
  // Her dilim 8°, aralarında 14° boşluk (tasarımdaki 0-8° / 8-22° deseni).
  const step = (2 * Math.PI) / RAY_COUNT;
  const wedge = (8 / 22) * step;
  const rays = Array.from({ length: RAY_COUNT }, (_, index) => {
    const a = index * step;
    const b = a + wedge;
    return `M ${r} ${r} L ${r + r * Math.cos(a)} ${r + r * Math.sin(a)} L ${r + r * Math.cos(b)} ${r + r * Math.sin(b)} Z`;
  }).join(' ');

  return (
    <Animated.View
      style={[styles.rays, { width: size, height: size }, spinStyle]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="ray-fade" cx={r} cy={r} r={r} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset="0.3" stopColor={color} stopOpacity={opacity} />
            <Stop offset="0.68" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Path d={rays} fill="url(#ray-fade)" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rays: {
    pointerEvents: 'none',
  },
});
