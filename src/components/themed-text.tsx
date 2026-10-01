import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle' | 'small' | 'smallBold' | 'link';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? (type === 'link' ? 'primary' : 'text')] },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: 500,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 700,
  },
  subtitle: {
    fontFamily: Fonts.rounded,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 700,
  },
  small: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 700,
  },
  link: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: 700,
  },
});
