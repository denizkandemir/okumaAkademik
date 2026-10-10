import { Stack } from 'expo-router';
import { use, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { Mascot, MascotSizes, mascotRenderStats } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';
import {
  DEFAULT_MASCOT_DEBUG,
  MascotDebugContext,
  type MascotDebug,
  type MascotFrameEvent,
  type MascotFrameKind,
} from '@/features/mascot/mascot-debug';
import { POSE_ART } from '@/features/mascot/mascot-assets';
import { MASCOT_POSES, type MascotPose } from '@/features/mascot/types';
import { useTheme } from '@/hooks/use-theme';

const SIZES = [MascotSizes.small, MascotSizes.medium, MascotSizes.large] as const;
const BUBBLE_TEXTS = [
  'Merhaba! Ben Pırıl.',
  'Bugün hangi hikâyeyi okuyalım?',
  'Harika gidiyorsun, devam et!',
];

const HEADER_OPTIONS = {
  headerShown: true,
  title: 'Maskot vitrini',
  // Geri butonunda önceki rotanın adı ("(tabs)") yerine "Geri" yazsın.
  headerBackTitle: 'Geri',
};

/** Geliştirici vitrini: tüm pozlar, boyutlar, animasyon ve tanı ayarları. Yalnızca __DEV__. */
export default function MascotShowcaseScreen() {
  if (!__DEV__) {
    return (
      <View style={styles.unavailable}>
        <Stack.Screen options={{ ...HEADER_OPTIONS, title: '' }} />
        <ThemedText>Bu sayfa kullanılamıyor.</ThemedText>
      </View>
    );
  }
  return <Showcase />;
}

function Showcase() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState<number>(MascotSizes.medium);
  const [talking, setTalking] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [useAppleWebpCodec, setUseAppleWebpCodec] = useState(
    DEFAULT_MASCOT_DEBUG.useAppleWebpCodec,
  );
  const [legacyTransformOrigin, setLegacyTransformOrigin] = useState(
    DEFAULT_MASCOT_DEBUG.legacyTransformOrigin,
  );
  const [cycleIndex, setCycleIndex] = useState(0);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [bubbleTalking, setBubbleTalking] = useState(false);

  const cyclePose = MASCOT_POSES[cycleIndex % MASCOT_POSES.length];
  // Kullanıcı açıkça seçmediyse sistem ayarı kullanılır.
  const motion = reduceMotion ? true : undefined;
  const debug: MascotDebug = { useAppleWebpCodec, legacyTransformOrigin, disableImageCache: true };
  // Çözücü ya da pivot değişince kartlar yeniden kurulur: kareler baştan yüklenir, durumlar sıfırlanır.
  const debugKey = `${useAppleWebpCodec}-${legacyTransformOrigin}`;

  return (
    <MascotDebugContext value={debug}>
      <Stack.Screen options={HEADER_OPTIONS} />
      <ScrollView
        style={{ backgroundColor: theme.background }}
        // iOS'ta içerik başlık çubuğunun altında başlar (saydam başlıkta da üst üste binmez).
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + Spacing.five,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
          },
        ]}>
        <View style={styles.inner}>
          <Card>
            <ThemedText type="subtitle">Ayarlar</ThemedText>
            <RenderCounter />

            <ThemedText type="smallBold" themeColor="textSecondary">
              Boyut
            </ThemedText>
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
            <Button
              title={`Pozu değiştir (şimdi: ${cyclePose})`}
              onPress={() => setCycleIndex((value) => value + 1)}
            />

            <ThemedText type="smallBold" themeColor="textSecondary">
              Tanı (eski davranışla karşılaştırma)
            </ThemedText>
            <Toggle
              label="iOS: Apple WebP çözücüsü"
              value={useAppleWebpCodec}
              onChange={setUseAppleWebpCodec}
            />
            <Toggle
              label="Eski pivot (transformOrigin)"
              value={legacyTransformOrigin}
              onChange={setLegacyTransformOrigin}
            />
          </Card>

          <Card>
            <ThemedText type="subtitle">Poz geçişi</ThemedText>
            <View style={styles.center}>
              <Mascot
                key={debugKey}
                pose={cyclePose}
                size={MascotSizes.large}
                talking={talking}
                reduceMotion={motion}
              />
            </View>
          </Card>

          <Card>
            <ThemedText type="subtitle">Balon</ThemedText>
            <View style={styles.bubbleRow}>
              <Mascot
                key={debugKey}
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
              <PoseCard
                key={`${pose}-${debugKey}`}
                pose={pose}
                size={size}
                talking={talking}
                reduceMotion={motion}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </MascotDebugContext>
  );
}

type FrameStatus =
  { state: 'waiting' } | { state: 'loaded'; text: string } | { state: 'error'; text: string };

type PoseCardProps = {
  pose: MascotPose;
  size: number;
  talking: boolean;
  reduceMotion: boolean | undefined;
};

/** Tek poz: kendi "animasyon kapalı" anahtarı ve karelerin yüklenme durumu. */
function PoseCard({ pose, size, talking, reduceMotion }: PoseCardProps) {
  const theme = useTheme();
  const parentDebug = use(MascotDebugContext);
  const [still, setStill] = useState(false);
  const hasOverlay = !!POSE_ART[pose].overlay;
  const [frames, setFrames] = useState<Record<MascotFrameKind, FrameStatus>>({
    base: { state: 'waiting' },
    overlay: { state: 'waiting' },
  });

  const onFrameEvent = (event: MascotFrameEvent) => {
    const status: FrameStatus =
      event.status === 'loaded'
        ? { state: 'loaded', text: `${event.width}×${event.height}` }
        : { state: 'error', text: event.message };
    setFrames((prev) => ({ ...prev, [event.frame]: status }));
  };

  return (
    <View style={[styles.tile, { backgroundColor: theme.backgroundElement }]}>
      <MascotDebugContext value={{ ...parentDebug, onFrameEvent }}>
        <Mascot
          pose={pose}
          size={size}
          talking={talking}
          animated={!still}
          reduceMotion={reduceMotion}
        />
      </MascotDebugContext>
      <ThemedText type="smallBold">{pose}</ThemedText>
      <FrameLine label="temel" status={frames.base} />
      {hasOverlay ? <FrameLine label="2. kare" status={frames.overlay} /> : null}
      <View style={styles.tileToggle}>
        <ThemedText type="small">Animasyon kapalı</ThemedText>
        <Switch
          value={still}
          onValueChange={setStill}
          accessibilityLabel={`${pose} animasyon kapalı`}
        />
      </View>
    </View>
  );
}

function FrameLine({ label, status }: { label: string; status: FrameStatus }) {
  const text =
    status.state === 'waiting'
      ? 'bekleniyor…'
      : status.state === 'loaded'
        ? `yüklendi ${status.text}`
        : `HATA: ${status.text}`;
  return (
    <ThemedText
      type="small"
      themeColor={status.state === 'error' ? 'danger' : 'textSecondary'}
      style={styles.frameLine}>
      {label}: {text}
    </ThemedText>
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
    <ThemedText type="small" testID="render-counter">
      Maskot render sayısı: {stats.total} (son 1 sn: +{stats.perSecond})
    </ThemedText>
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
  unavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: Spacing.three,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
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
    gap: Spacing.one,
    padding: Spacing.three,
    paddingTop: Spacing.five,
    borderRadius: Radius.large,
    minWidth: 160,
  },
  tileToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  frameLine: {
    fontSize: 13,
    lineHeight: 18,
  },
});
