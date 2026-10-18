import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { GameColors } from '../theme';
import type { CityTheme } from '../theme';
import type { JourneyLesson } from '../types';
import { BookIcon, CheckIcon, ChestIcon, StarIcon } from '../ui/icons';
import { CURRENT_NODE_SIZE, NODE_SIZE } from './path-layout';

type NodeLook = {
  light: string;
  base: string;
  edge: string;
  lip: string;
  icon: string;
  boxShadow: string;
  innerShadow: string;
};

/** Düğüm renkleri ve gölgeleri (AnaSayfa.dc.html'deki biten / aktif / kilitli düğümler). */
function lookFor(status: JourneyLesson['status'], theme: CityTheme): NodeLook {
  switch (status) {
    case 'done':
      return {
        light: theme.d1,
        base: theme.d2,
        edge: theme.d3,
        lip: theme.dSh,
        icon: theme.dIcon,
        boxShadow: `0 7px 0 ${theme.dSh}, 0 14px 20px rgba(0,0,0,0.18)`,
        innerShadow: 'inset 0 -8px 12px rgba(0,0,0,0.2), inset 0 6px 10px rgba(255,255,255,0.55)',
      };
    case 'current':
      return {
        light: theme.a1,
        base: theme.a2,
        edge: theme.a3,
        lip: theme.aSh,
        icon: GameColors.white,
        boxShadow: `0 7px 0 ${theme.aSh}, 0 16px 24px rgba(0,0,0,0.25)`,
        innerShadow: 'inset 0 -8px 12px rgba(0,0,0,0.25), inset 0 6px 10px rgba(255,255,255,0.55)',
      };
    case 'locked':
      return {
        light: theme.l1,
        base: theme.l2,
        edge: theme.l3,
        lip: theme.lSh,
        icon: theme.lIcon,
        boxShadow: `0 7px 0 ${theme.lSh}, 0 12px 18px rgba(0,0,0,0.12)`,
        innerShadow: 'inset 0 -7px 10px rgba(0,0,0,0.12), inset 0 6px 10px rgba(255,255,255,0.6)',
      };
  }
}

/** Ekran okuyucu etiketi: "Ders 3, Minik Serçe, sıradaki ders" / "…, tamamlandı, 3 yıldız". */
export function nodeLabel(lesson: JourneyLesson): string {
  const base = `Ders ${lesson.position}, ${lesson.title}`;
  if (lesson.status === 'current') return `${base}, sıradaki ders`;
  if (lesson.status === 'locked') return `${base}, kilitli`;
  return lesson.stars ? `${base}, tamamlandı, ${lesson.stars} yıldız` : `${base}, tamamlandı`;
}

type PathNodeProps = {
  lesson: JourneyLesson;
  theme: CityTheme;
  x: number;
  y: number;
  onPress: (lesson: JourneyLesson) => void;
  /** Kilitli derse dokunulunca: düğüm sallanır, titreşir ve bu çağrılır. */
  onLockedPress: (lesson: JourneyLesson) => void;
};

/** Yoldaki yuvarlak "3B" ders düğümü. */
export function PathNode({ lesson, theme, x, y, onPress, onLockedPress }: PathNodeProps) {
  const current = lesson.status === 'current';
  const size = current ? CURRENT_NODE_SIZE : NODE_SIZE;
  const look = lookFor(lesson.status, theme);
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  const handlePress = () => {
    if (lesson.status !== 'locked') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      onPress(lesson);
      return;
    }
    shake.set(
      withSequence(
        withTiming(-7, { duration: 50 }),
        withTiming(7, { duration: 60 }),
        withTiming(-5, { duration: 60 }),
        withTiming(5, { duration: 60 }),
        withTiming(0, { duration: 50 }),
      ),
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    onLockedPress(lesson);
  };

  const Icon =
    lesson.status === 'done' ? CheckIcon : lesson.kind === 'chest' ? ChestIcon : BookIcon;
  const iconSize = current ? 36 : 32;
  const gradientId = `node-${lesson.id}`;

  return (
    <Animated.View
      style={[styles.slot, { left: x - size / 2, top: y - size / 2, width: size }, shakeStyle]}>
      {current ? <PulseRing size={size} color={theme.a2} /> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={nodeLabel(lesson)}
        accessibilityHint={lesson.status === 'locked' ? undefined : 'Ders kartını açar'}
        onPress={handlePress}
        style={({ pressed }) => [
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: look.edge,
            boxShadow: look.boxShadow,
          },
          pressed && styles.pressed,
        ]}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id={gradientId} cx="35%" cy="28%" r="75%">
              <Stop offset="0" stopColor={look.light} />
              <Stop offset="0.5" stopColor={look.base} />
              <Stop offset="1" stopColor={look.edge} />
            </RadialGradient>
          </Defs>
          <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${gradientId})`} />
        </Svg>
        <View style={[styles.inner, { borderRadius: size / 2, boxShadow: look.innerShadow }]} />
        <View style={styles.icon}>
          <Icon
            size={iconSize}
            color={look.icon}
            strokeWidth={lesson.status === 'done' ? 3 : undefined}
          />
        </View>
      </Pressable>
      {lesson.status === 'done' && lesson.stars ? <BestStars stars={lesson.stars} /> : null}
    </Animated.View>
  );
}

/** Biten dersin altında en iyi yıldızlar (3 üzerinden). */
function BestStars({ stars }: { stars: number }) {
  return (
    <View style={styles.stars} accessible={false} importantForAccessibility="no-hide-descendants">
      {[1, 2, 3].map((index) => (
        <StarIcon
          key={index}
          size={15}
          fill={index <= stars ? GameColors.starFill : GameColors.starEmptyFill}
          stroke={index <= stars ? GameColors.starStroke : GameColors.starEmptyStroke}
        />
      ))}
    </View>
  );
}

/** Şu anki düğümün nabız halkası: 1 → 1,8 kat büyür ve söner (1,8 s); hareketi azalt'ta yok. */
function PulseRing({ size, color }: { size: number; color: string }) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    progress.set(
      withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }), -1),
    );
    return () => cancelAnimation(progress);
  }, [progress, reduceMotion]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.7 * (1 - progress.get()),
    transform: [{ scale: 1 + 0.8 * progress.get() }],
  }));

  if (reduceMotion) return null;
  return (
    <Animated.View
      style={[
        styles.ring,
        { width: size, height: size, borderRadius: size / 2, borderColor: color },
        ringStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  slot: {
    position: 'absolute',
    alignItems: 'center',
  },
  pressed: {
    transform: [{ translateY: 3 }],
  },
  inner: {
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  icon: {
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 12,
  },
  ring: {
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 6,
  },
});
