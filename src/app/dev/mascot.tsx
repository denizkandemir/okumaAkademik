import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { Mascot, MascotSizes, mascotRenderStats } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';
import { MASCOT_POSES, type MascotPose } from '@/features/mascot/types';
import { useTheme } from '@/hooks/use-theme';

const SIZES = [MascotSizes.small, MascotSizes.medium, MascotSizes.large] as const;
const BUBBLE_TEXTS = [
  'Merhaba! Ben Pırıl.',
  'Bugün hangi hikâyeyi okuyalım?',
  'Harika gidiyorsun, devam et!',
];

/** Geliştirici vitrini: tüm pozlar, boyutlar ve animasyon ayarları. Yalnızca __DEV__. */
export default function MascotShowcaseScreen() {
  if (!__DEV__) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: true, title: '' }} />
        <ThemedText>Bu sayfa kullanılamıyor.</ThemedText>
      </Screen>
    );
  }
  return <Showcase />;
}

function Showcase() {
  const [size, setSize] = useState<number>(MascotSizes.medium);
  const [talking, setTalking] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [bubbleTalking, setBubbleTalking] = useState(false);
  const [taps, setTaps] = useState(0);

  const cyclePose = MASCOT_POSES[cycleIndex % MASCOT_POSES.length];
  // Kullanıcı açıkça seçmediyse sistem ayarı kullanılır.
  const motion = reduceMotion ? true : undefined;

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: 'Maskot vitrini' }} />

      <RenderCounter />

      <Card>
        <ThemedText type="subtitle">Ayarlar</ThemedText>
        <View style={styles.row}>
          {SIZES.map((preset) => (
            <Chip
              key={preset}
              label={`${preset} dp`}
              selected={size === preset}
              onPress={() => setSize(preset)}
            />
          ))}
        </View>
        <Toggle label="Konuşuyor (talk)" value={talking} onChange={setTalking} />
        <Toggle
          label="Hareketi azalt (simülasyon)"
          value={reduceMotion}
          onChange={setReduceMotion}
        />
        <Toggle label="Animasyon açık (animated)" value={animated} onChange={setAnimated} />
      </Card>

      <Card>
        <ThemedText type="subtitle">Poz geçişi</ThemedText>
        <View style={styles.center}>
          <Mascot
            pose={cyclePose}
            size={MascotSizes.large}
            talking={talking}
            animated={animated}
            reduceMotion={motion}
            onPress={() => setTaps((value) => value + 1)}
          />
        </View>
        <ThemedText themeColor="textSecondary" style={styles.centerText}>
          {cyclePose} · dokunma: {taps}
        </ThemedText>
        <Button title="Pozu değiştir" onPress={() => setCycleIndex((value) => value + 1)} />
      </Card>

      <Card>
        <ThemedText type="subtitle">Balon</ThemedText>
        <View style={styles.bubbleRow}>
          <Mascot
            pose="talk"
            size={MascotSizes.medium}
            talking={bubbleTalking}
            reduceMotion={motion}
          />
          <MascotBubble
            text={BUBBLE_TEXTS[bubbleIndex % BUBBLE_TEXTS.length]}
            onTypingChange={setBubbleTalking}
            reduceMotion={motion}
          />
        </View>
        <Button
          title="Yeni cümle"
          variant="secondary"
          onPress={() => setBubbleIndex((value) => value + 1)}
        />
      </Card>

      <View style={styles.grid}>
        {MASCOT_POSES.map((pose) => (
          <PoseTile
            key={pose}
            pose={pose}
            size={size}
            talking={talking}
            animated={animated}
            reduceMotion={motion}
          />
        ))}
      </View>
    </Screen>
  );
}

type PoseTileProps = {
  pose: MascotPose;
  size: number;
  talking: boolean;
  animated: boolean;
  reduceMotion: boolean | undefined;
};

function PoseTile({ pose, size, talking, animated, reduceMotion }: PoseTileProps) {
  const theme = useTheme();
  return (
    <View style={[styles.tile, { backgroundColor: theme.backgroundElement }]}>
      <Mascot
        pose={pose}
        size={size}
        talking={talking}
        animated={animated}
        reduceMotion={reduceMotion}
      />
      <ThemedText type="smallBold">{pose}</ThemedText>
    </View>
  );
}

/**
 * Maskot bileşenlerinin commit sayısını saniyede bir gösterir. Animasyonlar UI thread'de
 * çalıştığından ayarlara dokunulmadıkça artış 0 olmalıdır. (Sayaç yalnızca kendini yeniler.)
 */
function RenderCounter() {
  const [stats, setStats] = useState({ total: mascotRenderStats.commits, perSecond: 0 });
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        total: mascotRenderStats.commits,
        perSecond: mascotRenderStats.commits - prev.total,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card>
      <ThemedText type="smallBold" testID="render-counter">
        Maskot render sayısı: {stats.total} (son 1 sn: +{stats.perSecond})
      </ThemedText>
    </Card>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggle}>
      <ThemedText style={styles.toggleLabel}>{label}</ThemedText>
      <Switch value={value} onValueChange={onChange} accessibilityLabel={label} />
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : theme.background,
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}>
      <ThemedText type="smallBold" style={{ color: selected ? theme.onPrimary : theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    minHeight: MinTouchSize,
  },
  toggleLabel: {
    flexShrink: 1,
  },
  chip: {
    minHeight: MinTouchSize,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    borderWidth: 2,
  },
  center: {
    alignItems: 'center',
    paddingTop: Spacing.five,
  },
  centerText: {
    textAlign: 'center',
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    justifyContent: 'center',
  },
  tile: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    paddingTop: Spacing.five,
    borderRadius: Radius.large,
  },
});
