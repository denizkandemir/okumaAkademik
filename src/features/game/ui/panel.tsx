import { StyleSheet, View, type ViewProps } from 'react-native';

import { GameColors } from '../theme';

export type PanelProps = ViewProps & {
  /**
   * Gölge tonu: `lilac` mor-krem ekranlarda (ders kartı, soru), `warm` krem ekranlarda
   * (giriş, ders sonu). Varsayılan `lilac`.
   */
  tone?: 'lilac' | 'warm';
};

/** Beyaz yuvarlak kart (köşe 22, yumuşak gölge); birçok ekranda içerik kabı. */
export function Panel({ tone = 'lilac', style, ...rest }: PanelProps) {
  return (
    <View
      style={[
        styles.panel,
        { boxShadow: tone === 'warm' ? GameColors.panelShadowWarm : GameColors.panelShadow },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: GameColors.white,
    borderRadius: 22,
    padding: 16,
    gap: 12,
  },
});
