import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { MascotBubbleProps } from './types';
import { useMascotReducedMotion } from './use-mascot-animations';

import { Fonts, Spacing } from '@/constants/theme';
import { GameColors, GameFonts } from '@/features/game/theme';

const CHAR_MS = 35;
const BUBBLE_COLOR = '#FFFFFF';
const BORDER_COLOR = '#DCE1EC';
const TEXT_COLOR = '#111318';
const TAIL = 14;
const GAME_TAIL = 16;
/** "Pırıl" vurgusu (S01Karsilama #E0702A); beyaz üzerinde 4,5:1 için bir ton koyu. */
const HIGHLIGHT_COLOR = '#C25519';

/**
 * Pırıl'ın konuşma balonu. Metin harf harf yazılır (~35 ms/harf); `onTypingChange` ile ebeveyn
 * yazma sürerken maskotu konuşturabilir. Hareket azaltıldığında metin hemen görünür.
 */
export function MascotBubble({
  text,
  side = 'right',
  tone = 'default',
  size = 'md',
  highlight,
  align = 'left',
  style,
  onTypingChange,
  reduceMotion: reduceMotionOverride,
}: MascotBubbleProps) {
  const game = tone === 'game';
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
      style={[
        styles.bubble,
        game && styles.gameBubble,
        (side === 'top' || side === 'bottom') && styles.top,
        style,
      ]}>
      {/*
        Yazılmamış kısım saydam çizilir: balonun boyutu ve satır kırılımları baştan sabittir,
        metin yazılırken hiçbir şey zıplamaz.
      */}
      <Text
        style={[
          styles.text,
          game && (size === 'lg' ? styles.gameTextLarge : styles.gameText),
          align === 'center' && styles.center,
        ]}>
        {splitHighlight(text, highlight).map((part) => {
          const typed = Math.max(0, Math.min(part.text.length, length - part.start));
          return (
            <Text key={part.start} style={part.highlighted ? styles.highlight : undefined}>
              {part.text.slice(0, typed)}
              <Text style={styles.pending}>{part.text.slice(typed)}</Text>
            </Text>
          );
        })}
      </Text>
      <View
        style={[
          styles.tail,
          game ? gameTailStyles[side] : tailStyles[side],
          game && styles.gameTail,
        ]}
      />
    </View>
  );
}

type TextPart = { text: string; start: number; highlighted: boolean };

/** Metni vurgulanan kelimenin ilk geçtiği yerden en fazla üç parçaya böler. */
function splitHighlight(text: string, highlight?: string): TextPart[] {
  const index = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || index < 0) return [{ text, start: 0, highlighted: false }];
  const end = index + highlight.length;
  return [
    { text: text.slice(0, index), start: 0, highlighted: false },
    { text: highlight, start: index, highlighted: true },
    { text: text.slice(end), start: end, highlighted: false },
  ].filter((part) => part.text.length > 0);
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
  center: {
    textAlign: 'center',
  },
  highlight: {
    color: HIGHLIGHT_COLOR,
  },
  // Oyun tonu: S01Karsilama / S02Giris balonları.
  gameBubble: {
    maxWidth: '100%',
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    boxShadow: '0 10px 24px rgba(201,99,31,0.16)',
  },
  gameText: {
    fontFamily: GameFonts.bodyHeavy,
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 22,
    color: GameColors.warm,
  },
  gameTextLarge: {
    fontFamily: GameFonts.bodyHeavy,
    fontWeight: 'normal',
    fontSize: 17,
    lineHeight: 24,
    color: GameColors.warm,
  },
  gameTail: {
    width: GAME_TAIL,
    height: GAME_TAIL,
    borderRadius: 3,
    borderWidth: 0,
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
const gameTailOffset = -GAME_TAIL / 2;

/** Kenarlıksız oyun balonunun kuyrukları (S02Giris: solda, üstten 30; S01Karsilama: üstte, ortada). */
const gameTailStyles = StyleSheet.create({
  right: { left: gameTailOffset, top: 30 },
  left: { right: gameTailOffset, top: 30 },
  top: { bottom: gameTailOffset, left: '50%', marginLeft: gameTailOffset },
  bottom: { top: gameTailOffset, left: '50%', marginLeft: gameTailOffset },
});

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
  // Balon maskotun altında: kuyruk yukarı bakar.
  bottom: {
    top: tailOffset,
    left: '50%',
    marginLeft: -TAIL / 2,
    borderLeftWidth: 2,
    borderTopWidth: 2,
  },
});
