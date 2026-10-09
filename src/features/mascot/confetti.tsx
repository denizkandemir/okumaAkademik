import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const CONFETTI_COLORS = ['#2453C9', '#FFB347', '#F7A3B5', '#2FB89A', '#F0662C'] as const;

/** Sabit "rastgele" sayı (0-1): her açılışta aynı desen, render saf kalır. */
function seeded(index: number, salt: number) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

type Piece = {
  color: string;
  /** Yatay başlangıç konumu, alan genişliğine oranla. */
  x: number;
  delay: number;
  duration: number;
  /** Düşerken toplam dönüş, derece. */
  spin: number;
  /** Sağa-sola savrulma, boyuta oranla. */
  drift: number;
  width: number;
  height: number;
  round: boolean;
};

const PIECES: Piece[] = Array.from({ length: 16 }, (_, index) => ({
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
  x: (index + seeded(index, 1)) / 16,
  delay: seeded(index, 2) * 1600,
  duration: 1800 + seeded(index, 3) * 1200,
  spin: (seeded(index, 4) > 0.5 ? 1 : -1) * (180 + seeded(index, 5) * 360),
  drift: (seeded(index, 6) - 0.5) * 0.2,
  width: 0.6 + seeded(index, 7) * 0.5,
  height: 1 + seeded(index, 8) * 0.6,
  round: index % 4 === 0,
}));

/** Konfeti alanı maskottan bu oranda geniştir; parçalar kenarlardan da görünür. */
const FIELD = 1.6;

type ConfettiProps = {
  /** Maskotun boyutu (dp). Konfeti maskotun etrafına ve arkasına yayılır. */
  size: number;
};

/** Maskotun arkasında düşen, dönen konfeti. Ebeveyn hareket azaltıldığında çizmemelidir. */
export function Confetti({ size }: ConfettiProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.field,
        { width: size * FIELD, height: size, left: -(size * (FIELD - 1)) / 2 },
      ]}>
      {PIECES.map((piece, index) => (
        <ConfettiPiece key={index} piece={piece} size={size} />
      ))}
    </View>
  );
}

function ConfettiPiece({ piece, size }: { piece: Piece; size: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withDelay(
        piece.delay,
        withRepeat(withTiming(1, { duration: piece.duration, easing: Easing.linear }), -1, false),
      ),
    );
    return () => cancelAnimation(progress);
  }, [piece, progress]);

  const fieldWidth = size * FIELD;
  const unit = Math.max(size / 160, 0.5);
  const width = 7 * unit * piece.width;
  const height = piece.round ? width : 10 * unit * piece.height;

  const style = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      opacity: p < 0.08 ? p / 0.08 : p > 0.8 ? (1 - p) / 0.2 : 1,
      transform: [
        { translateX: piece.x * fieldWidth + Math.sin(p * Math.PI * 2) * piece.drift * size },
        { translateY: -size * 0.2 + p * size * 1.15 },
        { rotate: `${p * piece.spin}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          width,
          height,
          borderRadius: piece.round ? width / 2 : 2,
          backgroundColor: piece.color,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  field: {
    position: 'absolute',
    top: 0,
  },
  piece: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
  },
});
