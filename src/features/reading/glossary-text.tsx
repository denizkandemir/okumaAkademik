import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { GameFonts } from '@/features/game/theme';

export type GlossaryEntry = { word: string; meaning: string };

type Segment = { text: string; entry?: GlossaryEntry };

/** Harf ya da rakam mı (Türkçe harfler dahil; büyük/küçük hâli olan her karakter harftir). */
function isWordChar(char: string | undefined) {
  if (!char) return false;
  return char.toLocaleLowerCase('tr') !== char.toLocaleUpperCase('tr') || /[0-9]/.test(char);
}

/**
 * Paragrafı, sözlükteki kelimelerin metinde yazıldığı gibi ve tek başına geçtiği yerlerden böler.
 * Uzun kelimeler önce aranır; çakışan eşleşmeler atlanır.
 */
export function splitGlossary(paragraph: string, glossary: readonly GlossaryEntry[]): Segment[] {
  const matches: { start: number; end: number; entry: GlossaryEntry }[] = [];
  const entries = [...glossary].sort((a, b) => b.word.length - a.word.length);
  for (const entry of entries) {
    if (!entry.word) continue;
    let from = 0;
    for (;;) {
      const start = paragraph.indexOf(entry.word, from);
      if (start < 0) break;
      const end = start + entry.word.length;
      from = end;
      const isolated = !isWordChar(paragraph[start - 1]) && !isWordChar(paragraph[end]);
      const overlaps = matches.some((match) => start < match.end && end > match.start);
      if (isolated && !overlaps) matches.push({ start, end, entry });
    }
  }
  matches.sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start > cursor) segments.push({ text: paragraph.slice(cursor, match.start) });
    segments.push({ text: paragraph.slice(match.start, match.end), entry: match.entry });
    cursor = match.end;
  }
  if (cursor < paragraph.length) segments.push({ text: paragraph.slice(cursor) });
  return segments;
}

type GlossaryTextProps = {
  paragraph: string;
  glossary: readonly GlossaryEntry[];
  style: StyleProp<TextStyle>;
  onWordPress: (entry: GlossaryEntry) => void;
};

/** Sözlük kelimeleri mor ve noktalı altı çizili, dokunulabilir (S04Okuma). */
export function GlossaryText({ paragraph, glossary, style, onWordPress }: GlossaryTextProps) {
  return (
    <Text style={style}>
      {splitGlossary(paragraph, glossary).map((segment, index) => {
        const { entry } = segment;
        return entry ? (
          <Text
            key={index}
            accessibilityRole="link"
            accessibilityHint="Pırıl anlamını söyler"
            suppressHighlighting={false}
            onPress={() => onWordPress(entry)}
            style={styles.word}>
            {segment.text}
          </Text>
        ) : (
          segment.text
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  word: {
    fontFamily: GameFonts.bodyHeavy,
    color: '#4A2BC2',
    backgroundColor: '#EDE5FF',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: '#4A2BC2',
  },
});
