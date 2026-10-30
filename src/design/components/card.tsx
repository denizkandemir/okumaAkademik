import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { colors, radius, size } from '../tokens';

type StaticCardProps = ViewProps & { onPress?: undefined };
type PressableCardProps = Omit<PressableProps, 'style'> & {
  onPress: NonNullable<PressableProps['onPress']>;
  style?: StyleProp<ViewStyle>;
};

export type CardProps = StaticCardProps | PressableCardProps;

/**
 * Kart: köşe 14, 1 dp kenar, `surface` zemin. `onPress` verilirse dokunulabilir olur ve altta 3 dp
 * kalın kenar ("dudak") alır.
 */
export function Card(props: CardProps) {
  if (props.onPress) {
    const { style, accessibilityRole = 'button', ...rest } = props;
    return (
      <Pressable
        accessibilityRole={accessibilityRole}
        style={({ pressed }) => [styles.card, styles.pressable, pressed && styles.pressed, style]}
        {...rest}
      />
    );
  }
  const { style, ...rest } = props;
  return <View style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    padding: 16,
  },
  pressable: {
    borderBottomWidth: size.cardLip,
    borderBottomColor: colors.cardLip,
  },
  pressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
    marginBottom: size.cardLip - 1,
  },
});
