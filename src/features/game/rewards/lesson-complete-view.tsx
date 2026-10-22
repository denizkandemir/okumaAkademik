import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameColors, GameFonts } from '../theme';
import { GameButton } from '../ui/game-button';
import { StarRow } from '../ui/star-row';
import { LightRays } from './light-rays';

import { Confetti } from '@/features/mascot/confetti';
import { Mascot } from '@/features/mascot/mascot';

const MAX_WIDTH = 480;

/** Okuma süresi "2:14" biçiminde. */
export function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

type LessonCompleteViewProps = {
  /** Hikâyenin başlığı. */
  title: string;
  durationSeconds: number | null;
  /** Kazanılan lokum; `null` ise kutucuk gösterilmez (tekrar oynama, serbest okuma). */
  lokum: number | null;
  /** İlk denemede doğru / toplam; `null` ise gösterilmez (serbest okuma). */
  correct: { count: number; total: number } | null;
  /** Bu oynayıştaki yıldız; `null` ise gösterilmez. */
  stars: number | null;
  /** Pırıl'ın notu; `null` ise kart gösterilmez. */
  note: string | null;
  onContinue: () => void;
};

/**
 * Ders tamamlandı (S08Tamamlandi): sıcak zemin, dönen ışıklar, konfeti, zıplayan Pırıl, istatistik
 * kutucukları, sırayla beliren yıldızlar ve Pırıl'ın notu. Kitaplıktan serbest okumanın sonunda da
 * (lokum, cevap ve yıldız olmadan) kullanılır.
 */
export function LessonCompleteView({
  title,
  durationSeconds,
  lokum,
  correct,
  stars,
  note,
  onContinue,
}: LessonCompleteViewProps) {
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const width = Math.min(window.width, MAX_WIDTH);
  const mascotSize = window.height < 700 ? 190 : 250;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#FFF3E2', '#FFDDB8', '#FFCB98']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.rays, { top: insets.top - 60 }]}>
        <LightRays size={Math.max(600, width * 1.5)} />
      </View>
      {reduceMotion ? null : (
        <View style={[styles.confetti, { top: insets.top }]}>
          <Confetti size={window.width / 1.6} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 28 },
        ]}>
        <View style={[styles.column, { width: width - 40 }]}>
          <View style={styles.mascot}>
            <Mascot
              pose="celebrate"
              size={mascotSize}
              accessibilityLabel="Pırıl sevinçle zıplıyor"
            />
          </View>

          <View style={styles.titles}>
            <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
              Harika okudun!
            </Text>
            <Text style={styles.subtitle}>{title} hikâyesini bitirdin.</Text>
          </View>

          <View style={styles.tiles}>
            {lokum != null ? <StatTile value={`+${lokum}`} label="lokum" color="#A33B5A" /> : null}
            {durationSeconds != null ? (
              <StatTile value={formatDuration(durationSeconds)} label="dakika" color="#2453C9" />
            ) : null}
            {correct ? (
              <StatTile
                value={`${correct.count}/${correct.total}`}
                label="doğru cevap"
                color="#B8461A"
              />
            ) : null}
          </View>

          {stars != null ? (
            <View style={styles.stars}>
              <StarRow filled={stars} animate />
            </View>
          ) : null}

          {note ? (
            <Text style={styles.note}>
              <Text style={styles.noteName}>Pırıl: </Text>
              {note}
            </Text>
          ) : null}

          <View style={styles.spacer} />
          <GameButton title="DEVAM ET" accessibilityLabel="Devam et" onPress={onContinue} />
        </View>
      </ScrollView>
    </View>
  );
}

function StatTile({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={`${value} ${label}`}>
      <Text style={[styles.tileValue, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rays: {
    position: 'absolute',
    alignSelf: 'center',
  },
  confetti: {
    position: 'absolute',
    alignSelf: 'center',
    pointerEvents: 'none',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
  column: {
    flexGrow: 1,
    gap: 16,
  },
  mascot: {
    alignItems: 'center',
  },
  titles: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 40,
    lineHeight: 44,
    color: '#2453C9',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: GameFonts.bodyBold,
    fontSize: 17,
    lineHeight: 24,
    color: GameColors.textWarmSecondary,
    textAlign: 'center',
  },
  tiles: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: GameColors.white,
    boxShadow: GameColors.panelShadowWarm,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 2,
  },
  tileValue: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 28,
    lineHeight: 32,
  },
  tileLabel: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 13,
    lineHeight: 18,
    color: GameColors.textWarmSecondary,
  },
  stars: {
    alignItems: 'center',
  },
  note: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: GameFonts.bodyBold,
    fontSize: 15,
    lineHeight: 21,
    color: GameColors.warm,
    overflow: 'hidden',
  },
  noteName: {
    fontFamily: GameFonts.bodyHeavy,
    color: '#C25519',
  },
  spacer: {
    flexGrow: 1,
    minHeight: 8,
  },
});
