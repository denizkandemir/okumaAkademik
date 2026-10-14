import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import { GameColors, GameFonts } from '../theme';
import { GameText } from './game-text';
import { FlameIcon, LokumIcon } from './icons';

export type StatChipKind = 'level' | 'streak' | 'lokum';

export type StatChipProps = {
  kind: StatChipKind;
  /** Gösterilecek değer, ör. 6, "320" ya da "1.980" (binlik ayırıcı veriden gelir). */
  value: number | string;
};

const LABELS: Record<StatChipKind, (value: string) => string> = {
  level: (value) => `Seviye ${value}`,
  streak: (value) => `${value} günlük seri`,
  lokum: (value) => `${value} lokum`,
};

/**
 * Ana sayfanın üst çubuğundaki cam hap (03-ana-sayfa-istanbul.jpg): yıldız para + "Seviye 3",
 * alev + seri, lokum kutusu + lokum. Bilgi gösterir, dokunulamaz.
 */
export function StatChip({ kind, value }: StatChipProps) {
  const text = String(value);
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={LABELS[kind](text)}
      style={[styles.chip, kind === 'level' ? styles.levelPadding : styles.iconPadding]}>
      {kind === 'level' ? (
        <StarCoin />
      ) : kind === 'streak' ? (
        <FlameIcon size={20} />
      ) : (
        <LokumIcon size={20} />
      )}
      <GameText
        variant="label"
        style={kind === 'level' ? styles.levelText : styles.valueText}
        color={
          kind === 'level'
            ? GameColors.chipText
            : kind === 'streak'
              ? GameColors.chipStreakText
              : GameColors.chipLokumText
        }>
        {kind === 'level' ? LABELS.level(text) : text}
      </GameText>
    </View>
  );
}

/** Seviye hapındaki altın para: radyal gradyan üzerinde beyaz yıldız. */
function StarCoin() {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26">
      <Defs>
        <RadialGradient id="coin" cx="35%" cy="30%" r="70%">
          <Stop offset="0" stopColor="#FFF2C4" />
          <Stop offset="0.55" stopColor="#FFC23A" />
          <Stop offset="1" stopColor="#E0920A" />
        </RadialGradient>
      </Defs>
      <Circle cx={13} cy={13} r={13} fill="url(#coin)" />
      <Path
        d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"
        fill="#FFFFFF"
        transform="translate(5 5) scale(0.6667)"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 38,
    paddingVertical: 6,
    paddingRight: 12,
    borderRadius: 999,
    backgroundColor: GameColors.chipBackground,
    boxShadow: GameColors.chipShadow,
  },
  levelPadding: {
    paddingLeft: 7,
  },
  iconPadding: {
    paddingLeft: 9,
    gap: 5,
  },
  levelText: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 14,
    lineHeight: 19,
  },
  valueText: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 15,
    lineHeight: 20,
  },
});
