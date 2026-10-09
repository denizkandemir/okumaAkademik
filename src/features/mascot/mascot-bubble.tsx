import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { MascotBubbleProps } from './types';
import { useMascotReducedMotion } from './use-mascot-animations';

import { Fonts, Spacing } from '@/constants/theme';

const CHAR_MS = 35;
const BUBBLE_COLOR = '#FFFFFF';
const BORDER_COLOR = '#DCE1EC';
const TEXT_COLOR = '#111318';
const TAIL = 14;

/**
 * Pırıl'ın konuşma balonu. Metin harf harf yazılır (~35 ms/harf); `onTypingChange` ile ebeveyn
 * yazma sürerken maskotu konuşturabilir. Hareket azaltıldığında metin hemen görünür.
 */
export function MascotBubble({
  text,
  side = 'right',
  onTypingChange,
  reduceMotion: reduceMotionOverride,
}: MascotBubbleProps) {
  const reduceMotion = useMascotReducedMotion(reduceMotionOverride);
  const [typing, setTyping] = useState({ text: '', length: 0 });
  // Metin değiştiyse daktilo baştan başlar (render sırasında sıfırlanır, ek effect gerekmez).
  if (typing.text !== text) setTyping({ text, length: 0 });
  const length = reduceMotion ? text.length : typing.length;
  const isTyping = length < text.length;

  useEffect(() => {
    if (!isTyping) return;
    const timer = setTimeout(() => setTyping({ text, length: nextLength(text, length) }), CHAR_MS);
    return () => clearTimeout(timer);
  }, [text, length, isTyping]);

  const onTypingChangeRef = useRef(onTypingChange);
  useEffect(() => {
    onTypingChangeRef.current = onTypingChange;
  });
  useEffect(() => {
    onTypingChangeRef.current?.(isTyping);
  }, [isTyping]);
  useEffect(() => () => onTypingChangeRef.current?.(false), []);

  return (
    <View
      accessible
      accessibilityLabel={text}
      accessibilityLiveRegion="polite"
      style={[styles.bubble, side === 'top' && styles.top]}>
      {/*
        Yazılmamış kısım saydam çizilir: balonun boyutu ve satır kırılımları baştan sabittir,
        metin yazılırken hiçbir şey zıplamaz.
      */}
      <Text style={styles.text}>
        {text.slice(0, length)}
        <Text style={styles.pending}>{text.slice(length)}</Text>
      </Text>
      <View style={[styles.tail, tailStyles[side]]} />
    </View>
  );
}

/** Boşlukları beklemeden geçer ki yazım ritmi düzgün olsun. */
function nextLength(text: string, length: number) {
  let next = length + 1;
  while (next < text.length && text[next - 1] === ' ') next += 1;
  return next;
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: 210,
    flexShrink: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    backgroundColor: BUBBLE_COLOR,
    boxShadow: '0 4px 12px rgba(17, 19, 24, 0.12)',
  },
  top: {
    alignSelf: 'center',
  },
  text: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
    color: TEXT_COLOR,
  },
  pending: {
    color: 'transparent',
  },
  // Kenarlıklı, 45° döndürülmüş kare; içteki yarısı balonun kenarlığını örter, dıştaki köşe kuyruk olur.
  tail: {
    position: 'absolute',
    width: TAIL,
    height: TAIL,
    backgroundColor: BUBBLE_COLOR,
    borderColor: BORDER_COLOR,
    transform: [{ rotate: '45deg' }],
  },
});

const tailOffset = -TAIL / 2 - 1;

const tailStyles = StyleSheet.create({
  // Balon maskotun sağında: kuyruk sola bakar.
  right: {
    left: tailOffset,
    top: 20,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  // Balon maskotun solunda: kuyruk sağa bakar.
  left: {
    right: tailOffset,
    top: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  // Balon maskotun üstünde: kuyruk aşağı bakar.
  top: {
    bottom: tailOffset,
    left: '50%',
    marginLeft: -TAIL / 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
});
