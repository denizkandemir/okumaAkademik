import * as Haptics from 'expo-haptics';
import { memo, useEffect } from 'react';
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

import type { JourneyLesson } from '../types';

import { AwardIcon, BookIcon, CheckIcon, GiftIcon, LockIcon } from '@/design/icons';
import { colors, size } from '@/design/tokens';

/** 5. ders sandık, 10. ders şehrin son durağı (madalya). */
const MEDAL_POSITION = 10;

type Look = 'done' | 'current' | 'locked' | 'chest' | 'medal';

/**
 * Düğümün görünümü (README "Harita düğümleri"). Sandık ve madalya, kilitliyken de kendi
 * renklerindedir (panodaki gibi); bitince adaçayı olur ama kendi ikonunu korur.
 */
function lookOf(lesson: JourneyLesson): Look {
  if (lesson.status === 'current') return 'current';
  if (lesson.status === 'done') return 'done';
  if (lesson.kind === 'chest') return lesson.position === MEDAL_POSITION ? 'medal' : 'chest';
  return 'locked';
}

function iconOf(lesson: JourneyLesson, look: Look) {
  const color = colors.node[look].icon;
  const props = { size: 27, color, strokeWidth: 2.8 };
  if (lesson.kind === 'chest') {
    return lesson.position === MEDAL_POSITION ? <AwardIcon {...props} /> : <GiftIcon {...props} />;
  }
  if (look === 'done') return <CheckIcon {...props} />;
  if (look === 'locked') return <LockIcon {...props} />;
  return <BookIcon {...props} />;
}

/** Ekran okuyucu etiketi, ör. "Ders 3, Minik Serçe, şu anki ders" ya da "Ders 1, …, bitti, 3 yıldız". */
export function nodeLabel(lesson: JourneyLesson): string {
  const base = `Ders ${lesson.position}, ${lesson.title}`;
  if (lesson.status === 'current') return `${base}, şu anki ders`;
  if (lesson.status === 'locked') return `${base}, kilitli`;
  return lesson.stars ? `${base}, bitti, ${lesson.stars} yıldız` : `${base}, bitti`;
}

type MapNodeProps = {
  lesson: JourneyLesson;
  /** Merkez (px, harita içinde). */
  x: number;
  y: number;
  onOpen: (lesson: JourneyLesson) => void;
  onLocked: (lesson: JourneyLesson) => void;
};

/**
 * Haritadaki ders düğümü: yarı saydam beyaz kenarlı oval, altta koyu "dudak". Basınca yüz dudağa
 * iner. Şu anki ders bir halkayla çevrilidir ve halka yavaşça nabız atar (hareketi azalt: durur).
 * Kilitli düğüm sallanır ve uyarı titreşimi verir.
 */
export const MapNode = memo(function MapNode({ lesson, x, y, onOpen, onLocked }: MapNodeProps) {
  const look = lookOf(lesson);
  const shape = lesson.kind === 'chest' && lesson.position !== MEDAL_POSITION ? 'chest' : look;
  const { width, height, lip } = size.node[shape === 'chest' ? 'chest' : look];
  const radius = shape === 'chest' ? 18 : height / 2;
  const palette = colors.node[look];
  const locked = lesson.status === 'locked';
  const reduceMotion = useReducedMotion();

  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  const press = () => {
    if (locked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      if (!reduceMotion) {
        shake.set(
          withSequence(
            withTiming(-7, { duration: 50 }),
            withTiming(7, { duration: 70 }),
            withTiming(-5, { duration: 60 }),
            withTiming(0, { duration: 50 }),
          ),
        );
      }
      onLocked(lesson);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onOpen(lesson);
  };

  return (
    <Animated.View
      style={[
        styles.anchor,
        { left: x - width / 2, top: y - height / 2, width, height: height + lip },
        shakeStyle,
      ]}>
      {look === 'current' ? (
        <PulseRing width={width} height={height} radius={radius} animate={!reduceMotion} />
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={nodeLabel(lesson)}
        // Kilitli düğüm de dokunulabilir (Pırıl nedenini söyler); bu yüzden 'disabled' değil.
        accessibilityHint={locked ? 'Neden kilitli olduğunu söyler' : 'Ders kartını açar'}
        hitSlop={8}
        onPress={press}
        style={styles.fill}>
        {({ pressed }) => (
          <>
            <View
              style={[
                styles.layer,
                { top: lip, height, borderRadius: radius, backgroundColor: palette.lip },
              ]}
            />
            <View
              style={[
                styles.layer,
                styles.face,
                {
                  height,
                  borderRadius: radius,
                  backgroundColor: palette.fill,
                  transform: [{ translateY: pressed && !locked ? lip - 1 : 0 }],
                },
              ]}>
              {iconOf(lesson, look)}
            </View>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
});

/** Şu anki dersin halkası: 10 dp dışarıda, açık renkli; yavaşça büyüyüp küçülür. */
function PulseRing({
  width,
  height,
  radius,
  animate,
}: {
  width: number;
  height: number;
  radius: number;
  animate: boolean;
}) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!animate) {
      cancelAnimation(pulse);
      pulse.set(0);
      return;
    }
    pulse.set(
      withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }), -1, true),
    );
    return () => cancelAnimation(pulse);
  }, [animate, pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.get() * 0.06 }],
    opacity: 1 - pulse.get() * 0.35,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ring,
        {
          width: width + 20,
          height: height + 20,
          borderRadius: radius + 10,
        },
        ringStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    zIndex: 3,
  },
  fill: {
    flex: 1,
  },
  layer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: size.node.edge,
    borderColor: colors.node.edge,
  },
  ring: {
    position: 'absolute',
    left: -10,
    top: -10,
    borderWidth: 3,
    borderColor: colors.node.current.ring,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 2,
        color: colors.node.current.ringOutline,
      },
    ],
  },
});
