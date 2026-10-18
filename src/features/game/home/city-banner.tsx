import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GameColors, GameFonts, type CityInfo, type CityTheme, type Gradient } from '../theme';
import { MapIcon } from '../ui/icons';
import { ProgressTrack } from '../ui/progress-track';

type CityBannerProps = {
  theme: CityTheme;
  /** Kartın gradyanı: beyaz yazı okunsun diye koyulaştırılmış başlık gradyanı (READABLE_BANNERS). */
  gradient: Gradient;
  info: CityInfo;
  lessonsDone: number;
  lessonsTotal: number;
  onOpenMap: () => void;
};

/**
 * Şehir başlık kartı (AnaSayfa.dc.html): başlık gradyanı (okunurluk için koyulaştırılmış), 6 dp koyu dudak, "1. DURAK · İSTANBUL",
 * şehir başlığı, ilerleme çubuğu ve harita düğmesi.
 */
export function CityBanner({
  theme,
  gradient: banner,
  info,
  lessonsDone,
  lessonsTotal,
  onOpenMap,
}: CityBannerProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: banner.colors[banner.colors.length - 1],
          boxShadow: `0 6px 0 ${theme.bannerSh}, 0 16px 30px rgba(20,10,50,0.25)`,
        },
      ]}>
      <LinearGradient
        colors={banner.colors}
        start={banner.start}
        end={banner.end}
        style={[StyleSheet.absoluteFill, styles.gradient]}
      />
      <View style={styles.highlight} />
      <View style={styles.topRow}>
        <View style={styles.titles} accessible accessibilityRole="header">
          <Text style={styles.stop}>
            {info.no}. DURAK · {info.upperName}
          </Text>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {info.title}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Yolculuk haritasını aç"
          hitSlop={2}
          onPress={onOpenMap}
          style={({ pressed }) => [styles.mapButton, pressed && styles.mapPressed]}>
          <MapIcon size={24} color={GameColors.white} />
        </Pressable>
      </View>
      <View style={styles.progressRow}>
        <ProgressTrack
          progress={lessonsTotal > 0 ? lessonsDone / lessonsTotal : 0}
          accessibilityLabel={`${info.name}: ${lessonsDone} / ${lessonsTotal} ders tamamlandı`}
          style={styles.track}
        />
        <Text style={styles.count} importantForAccessibility="no">
          {lessonsDone}/{lessonsTotal} ders
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingTop: 12,
    paddingRight: 14,
    paddingBottom: 14,
    paddingLeft: 18,
    gap: 8,
  },
  gradient: {
    borderRadius: 24,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 24,
    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3)',
    pointerEvents: 'none',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titles: {
    flex: 1,
    gap: 1,
  },
  stop: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.8,
    color: GameColors.white,
  },
  title: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 23,
    lineHeight: 28,
    color: GameColors.white,
  },
  mapButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPressed: {
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
  },
  count: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 13,
    lineHeight: 18,
    color: GameColors.white,
  },
});
