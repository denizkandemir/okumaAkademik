import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { colors, size } from '../tokens';
import { AppText } from './app-text';

export type TextLinkProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
};

/** Altı çizili, ortalı yazı bağlantısı (panoda `.linkbtn`, ör. "Zaten bir yolculuğum var"). */
export function TextLink({ title, accessibilityRole = 'link', ...rest }: TextLinkProps) {
  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={title}
      style={({ pressed }) => [styles.link, pressed && styles.pressed]}
      {...rest}>
      <AppText color={colors.textMuted} align="center" style={styles.text}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    alignSelf: 'center',
    minHeight: size.touch,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    textDecorationLine: 'underline',
  },
});
