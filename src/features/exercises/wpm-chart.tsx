import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import { AppText } from '@/design/components/app-text';
import { colors, fonts, radius } from '@/design/tokens';

const WIDTH = 320;
const HEIGHT = 170;
const PAD = { left: 24, right: 24, top: 26, bottom: 30 };

type WpmChartProps = {
  /** Her okumanın dakikadaki kelimesi, sırasıyla. */
  speeds: number[];
  /** Toplam okuma sayısı (x ekseni bu kadar bölünür). */
  slots: number;
  /** Hedef çizgisi (dakikadaki kelime). */
  goal: number;
};

/**
 * E1 hedef grafiği: her okumanın hızı bir nokta, noktalar bir çizgiyle bağlı; kesikli çizgi hedef
 * (ilk okumanın %10-20 üstü). Ekran okuyucu değerleri tek cümleyle okur.
 */
export function WpmChart({ speeds, slots, goal }: WpmChartProps) {
  const values = [...speeds, goal];
  const top = Math.max(...values) * 1.12;
  const bottom = Math.max(0, Math.min(...values) * 0.75);
  const x = (index: number) =>
    PAD.left + (slots <= 1 ? 0 : (index * (WIDTH - PAD.left - PAD.right)) / (slots - 1));
  const y = (value: number) =>
    PAD.top + ((top - value) * (HEIGHT - PAD.top - PAD.bottom)) / Math.max(1, top - bottom);

  const points = speeds.map((speed, index) => `${x(index)},${y(speed)}`).join(' ');
  const label = `Okuma hızların: ${speeds
    .map((speed, index) => `${index + 1}. okuma dakikada ${Math.round(speed)} kelime`)
    .join(', ')}. Hedef dakikada ${Math.round(goal)} kelime.`;

  return (
    <View style={styles.card} accessible accessibilityRole="image" accessibilityLabel={label}>
      <Svg width="100%" height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <Line
          x1={PAD.left - 10}
          x2={WIDTH - PAD.right + 10}
          y1={y(goal)}
          y2={y(goal)}
          stroke={colors.node.chest.lip}
          strokeWidth={2}
          strokeDasharray="6 5"
        />
        <SvgText
          x={WIDTH - PAD.right + 10}
          y={y(goal) - 7}
          textAnchor="end"
          fontSize={12}
          fontFamily={fonts.sansExtraBold}
          fill={colors.node.chest.icon}>
          {`Hedef ${Math.round(goal)}`}
        </SvgText>
        {speeds.length > 1 ? (
          <Polyline points={points} fill="none" stroke={colors.progress.fill} strokeWidth={3} />
        ) : null}
        {Array.from({ length: slots }, (_, index) => (
          <SvgText
            key={`x-${index}`}
            x={x(index)}
            y={HEIGHT - 8}
            textAnchor="middle"
            fontSize={12}
            fontFamily={fonts.sansBold}
            fill={colors.textMuted}>
            {`${index + 1}. okuma`}
          </SvgText>
        ))}
        {speeds.map((speed, index) => (
          <Circle
            key={`p-${index}`}
            cx={x(index)}
            cy={y(speed)}
            r={6}
            fill={colors.node.done.fill}
            stroke={colors.white}
            strokeWidth={2}
          />
        ))}
        {speeds.map((speed, index) => (
          <SvgText
            key={`v-${index}`}
            x={x(index)}
            y={y(speed) - 11}
            textAnchor="middle"
            fontSize={13}
            fontFamily={fonts.sansExtraBold}
            fill={colors.text}>
            {String(Math.round(speed))}
          </SvgText>
        ))}
      </Svg>
      <AppText variant="secondary" color={colors.textMuted} align="center">
        Dakikadaki kelime
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
  },
});
