import { Stack } from 'expo-router';
import { use, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { Card } from '@/design/components/card';
import { FilterChip } from '@/design/components/filter-chip';
import { ToggleRow } from '@/design/components/toggle-row';
import { colors, radius, screenPadding, size, space } from '@/design/tokens';
import { Mascot, MascotSizes, mascotRenderStats } from '@/features/mascot/mascot';
import {
  DEFAULT_MASCOT_DEBUG,
  MascotDebugContext,
  type MascotDebug,
  type MascotFrameEvent,
  type MascotFrameKind,
} from '@/features/mascot/mascot-debug';
import { POSE_ART } from '@/features/mascot/mascot-assets';
import { MASCOT_POSES, type MascotPose } from '@/features/mascot/types';

const SIZES = [MascotSizes.small, MascotSizes.medium, MascotSizes.large] as const;

const HEADER_OPTIONS = {
  headerShown: true,
  // SDK 58'de iOS 26+ başlığı varsayılan saydam; opak kalsın.
  headerTransparent: false,
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
        <AppText>Bu sayfa kullanılamıyor.</AppText>
      </View>
    );
  }
  return <Showcase />;
}

function Showcase() {
  const insets = useSafeAreaInsets();
  const [mascotSize, setMascotSize] = useState<number>(MascotSizes.medium);
  const [talking, setTalking] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [useAppleWebpCodec, setUseAppleWebpCodec] = useState(
    DEFAULT_MASCOT_DEBUG.useAppleWebpCodec,
  );
  const [legacyTransformOrigin, setLegacyTransformOrigin] = useState(
    DEFAULT_MASCOT_DEBUG.legacyTransformOrigin,
  );
  const [cycleIndex, setCycleIndex] = useState(0);

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
        style={styles.screen}
        // iOS'ta içerik başlık çubuğunun altında başlar (saydam başlıkta da üst üste binmez).
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + space.xxl,
            paddingLeft: insets.left + screenPadding,
            paddingRight: insets.right + screenPadding,
          },
        ]}>
        <View style={styles.inner}>
          <Card style={styles.card}>
            <AppText variant="heading">Ayarlar</AppText>
            <RenderCounter />

            <AppText variant="bodyStrong" color={colors.textMuted}>
              Boyut
            </AppText>
            <View style={styles.row}>
              {SIZES.map((preset) => (
                <FilterChip
                  key={preset}
                  label={`${preset} dp`}
                  selected={mascotSize === preset}
                  onPress={() => setMascotSize(preset)}
                />
              ))}
            </View>

            <ToggleRow label="Konuşuyor (talk)" value={talking} onValueChange={setTalking} />
            <ToggleRow
              label="Hareketi azalt (simülasyon)"
              value={reduceMotion}
              onValueChange={setReduceMotion}
            />
            <Button
              title={`POZU DEĞİŞTİR (ŞİMDİ: ${cyclePose})`}
              accessibilityLabel={`Pozu değiştir, şimdi ${cyclePose}`}
              onPress={() => setCycleIndex((value) => value + 1)}
            />

            <AppText variant="bodyStrong" color={colors.textMuted}>
              Tanı (eski davranışla karşılaştırma)
            </AppText>
            <ToggleRow
              label="iOS: Apple WebP çözücüsü"
              value={useAppleWebpCodec}
              onValueChange={setUseAppleWebpCodec}
            />
            <ToggleRow
              label="Eski pivot (transformOrigin)"
              value={legacyTransformOrigin}
              onValueChange={setLegacyTransformOrigin}
            />
          </Card>

          <Card style={styles.card}>
            <AppText variant="heading">Poz geçişi</AppText>
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

          <View style={styles.grid}>
            {MASCOT_POSES.map((pose) => (
              <PoseCard
                key={`${pose}-${debugKey}`}
                pose={pose}
                size={mascotSize}
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
    <View style={styles.tile}>
      <MascotDebugContext value={{ ...parentDebug, onFrameEvent }}>
        <Mascot
          pose={pose}
          size={size}
          talking={talking}
          animated={!still}
          reduceMotion={reduceMotion}
        />
      </MascotDebugContext>
      <AppText variant="bodyStrong">{pose}</AppText>
      <FrameLine label="temel" status={frames.base} />
      {hasOverlay ? <FrameLine label="2. kare" status={frames.overlay} /> : null}
      <ToggleRow label={`${pose}: animasyon kapalı`} value={still} onValueChange={setStill} />
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
    <AppText
      variant="secondary"
      color={status.state === 'error' ? colors.danger : colors.textMuted}>
      {label}: {text}
    </AppText>
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
    <AppText variant="secondary" testID="render-counter">
      Maskot render sayısı: {stats.total} (son 1 sn: +{stats.perSecond})
    </AppText>
  );
}

const styles = StyleSheet.create({
  unavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  screen: {
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: space.md,
  },
  inner: {
    width: '100%',
    maxWidth: size.maxContentWidth,
    gap: space.md,
  },
  card: {
    gap: space.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  center: {
    alignItems: 'center',
    paddingTop: space.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.md,
    justifyContent: 'center',
  },
  tile: {
    alignItems: 'center',
    gap: space.xxs,
    padding: space.md,
    paddingTop: space.xxl,
    borderRadius: radius.cardLarge,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    width: 180,
  },
});
