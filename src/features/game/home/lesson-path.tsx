import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { GameFonts, type CityTheme } from '../theme';
import type { JourneyLesson } from '../types';
import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';
import type { MascotPose } from '@/features/mascot/types';
import { CURRENT_NODE_SIZE, curveBetween, nodeCenters, pathHeight } from './path-layout';
import { PathNode } from './path-node';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** Pırıl'ın boyutu (tasarımda 150) ve balonunun genişliği (168). */
const MASCOT_SIZE = 150;
const BUBBLE_WIDTH = 168;

type LessonPathProps = {
  lessons: JourneyLesson[];
  theme: CityTheme;
  width: number;
  mascotPose: MascotPose;
  mascotMessage: string;
  onOpenLesson: (lesson: JourneyLesson) => void;
  onLockedLesson: (lesson: JourneyLesson) => void;
};

/** Yolun odak düğümü: şu anki ders; yolculuk bittiyse son ders. */
export function focusIndex(lessons: JourneyLesson[]): number {
  const current = lessons.findIndex((lesson) => lesson.status === 'current');
  if (current >= 0) return current;
  const lastDone = lessons.map((lesson) => lesson.status).lastIndexOf('done');
  return Math.max(0, lastDone);
}

/** Şehrin 10 dersi: zikzak yol, düğümler, Pırıl ve "BAŞLA!" balonu (AnaSayfa.dc.html). */
export function LessonPath({
  lessons,
  theme,
  width,
  mascotPose,
  mascotMessage,
  onOpenLesson,
  onLockedLesson,
}: LessonPathProps) {
  const points = nodeCenters(lessons.length, width);
  const height = pathHeight(lessons.length);
  const focus = focusIndex(lessons);
  const hasCurrent = lessons[focus]?.status === 'current';
  // Biten yol odak düğümüne kadar; bitmiş şehirde sona kadar.
  const doneUntil = hasCurrent ? focus : lessons.length - 1;
  const doneD = doneUntil > 0 ? curveBetween(points, 0, doneUntil) : '';
  const todoD = hasCurrent ? curveBetween(points, focus, lessons.length - 1, true) : '';

  const focusPoint = points[focus] ?? { x: width / 2, y: 0 };
  // Pırıl odak düğümünün boş tarafında: düğüm sağdaysa solda.
  const mascotOnLeft = focusPoint.x >= width / 2;
  const mascotSize = Math.min(MASCOT_SIZE, Math.round(width * 0.38));
  const mascotTop = focusPoint.y - mascotSize * 0.46;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        {todoD ? (
          <>
            <Path
              d={todoD}
              fill="none"
              stroke={theme.todo}
              strokeWidth={16}
              strokeLinecap="round"
              opacity={0.55}
            />
            <Path
              d={todoD}
              fill="none"
              stroke={theme.todoDash}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="1 15"
            />
          </>
        ) : null}
        {doneD ? <DonePath d={doneD} theme={theme} /> : null}
      </Svg>

      <View
        style={[
          styles.mascot,
          { top: mascotTop, width: Math.max(mascotSize, BUBBLE_WIDTH) },
          mascotOnLeft ? { left: 14 } : { right: 14 },
        ]}>
        <View style={styles.bubble}>
          <MascotBubble tone="game" side="top" text={mascotMessage} style={styles.bubbleBox} />
        </View>
        <View style={mascotOnLeft ? styles.mascotLeft : styles.mascotRight}>
          <Mascot pose={mascotPose} size={mascotSize} />
        </View>
      </View>

      {lessons.map((lesson, index) => {
        const point = points[index];
        if (!point) return null;
        return (
          <PathNode
            key={lesson.id}
            lesson={lesson}
            theme={theme}
            x={point.x}
            y={point.y}
            onPress={onOpenLesson}
            onLockedPress={onLockedLesson}
          />
        );
      })}

      {hasCurrent ? (
        <StartBubble color={theme.a3} x={focusPoint.x} y={focusPoint.y} onLeft={!mascotOnLeft} />
      ) : null}
    </View>
  );
}

/** Biten yol: koyu alt çizgi, renkli çizgi ve akan beyaz noktalar (hareketi azalt'ta durur). */
function DonePath({ d, theme }: { d: string; theme: CityTheme }) {
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    offset.set(withRepeat(withTiming(-18, { duration: 900, easing: Easing.linear }), -1));
    return () => cancelAnimation(offset);
  }, [offset, reduceMotion]);

  const dotsProps = useAnimatedProps(() => ({ strokeDashoffset: offset.get() }));

  return (
    <>
      <Path d={d} fill="none" stroke={theme.doneSh} strokeWidth={22} strokeLinecap="round" />
      <Path d={d} fill="none" stroke={theme.done} strokeWidth={14} strokeLinecap="round" />
      <AnimatedPath
        d={d}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="2 16"
        opacity={0.9}
        animatedProps={dotsProps}
      />
    </>
  );
}

/** Şu anki düğümün yanında hafifçe zıplayan "BAŞLA!" balonu. Süseldir; etiketi düğüm taşır. */
function StartBubble({
  color,
  x,
  y,
  onLeft,
}: {
  color: string;
  x: number;
  y: number;
  onLeft: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const bob = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    const half = { duration: 650, easing: Easing.inOut(Easing.quad) };
    bob.set(withRepeat(withSequence(withTiming(-6, half), withTiming(0, half)), -1));
    return () => cancelAnimation(bob);
  }, [bob, reduceMotion]);

  const bobStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.get() }] }));
  const gap = CURRENT_NODE_SIZE / 2 + 12;

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.start,
        { top: y - 15 },
        { left: onLeft ? x - gap - START_WIDTH : x + gap },
        bobStyle,
      ]}>
      <View style={[styles.startTail, onLeft ? styles.startTailRight : styles.startTailLeft]} />
      <Text style={[styles.startText, { color }]}>BAŞLA!</Text>
    </Animated.View>
  );
}

const START_WIDTH = 74;

const styles = StyleSheet.create({
  mascot: {
    position: 'absolute',
    pointerEvents: 'box-none',
  },
  bubble: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    marginBottom: 6,
  },
  bubbleBox: {
    alignSelf: 'stretch',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mascotLeft: {
    alignItems: 'flex-start',
    paddingLeft: 8,
  },
  mascotRight: {
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  start: {
    position: 'absolute',
    width: START_WIDTH,
    height: 30,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    boxShadow: '0 6px 14px rgba(30,20,60,0.14)',
  },
  startTail: {
    position: 'absolute',
    top: 10,
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  startTailLeft: {
    left: -4,
  },
  startTailRight: {
    right: -4,
  },
  startText: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 1,
  },
});
