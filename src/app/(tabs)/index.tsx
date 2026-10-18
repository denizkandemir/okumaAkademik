import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { CityBanner } from '@/features/game/home/city-banner';
import { LessonPath, focusIndex } from '@/features/game/home/lesson-path';
import { NODE_SIZE, nodeCenters } from '@/features/game/home/path-layout';
import { READABLE_BANNERS } from '@/features/game/theme';
import type { JourneyResponse } from '@/features/game/types';
import { GameButton } from '@/features/game/ui/game-button';
import { StatChip } from '@/features/game/ui/stat-chip';
import { useJourney } from '@/features/game/use-journey';
import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';
import type { MascotPose } from '@/features/mascot/types';
import { CityScene } from '@/features/scenes/city-scene';
import { SCENE_HEIGHT, SCENE_WIDTH } from '@/features/scenes/scene-kit';
import { getErrorMessage } from '@/lib/errors';

/** Tablet ve web'de ana sayfa bu genişlikte ortalanır. */
const MAX_WIDTH = 520;
/** Başlık kartının sahnenin alt kenarından yukarı taşması (tasarımda 340 − 258). */
const BANNER_OVERLAP = 82;
/** Pırıl'ın kısa ipuçlarının ekranda kalma süresi. */
const TIP_MS = 4000;

type Tip = { text: string; pose: MascotPose };

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const width = Math.min(window.width, MAX_WIDTH);
  const sceneHeight = (width * SCENE_HEIGHT) / SCENE_WIDTH;
  const { data, error, isLoading, refetch, cityId, theme, info } = useJourney();

  const [tip, setTip] = useState<Tip | null>(null);
  useEffect(() => {
    if (!tip) return;
    const timer = setTimeout(() => setTip(null), TIP_MS);
    return () => clearTimeout(timer);
  }, [tip]);

  // Açılışta (ve şehir ya da şu anki ders değişince) şu anki düğüm görünür alanın ortasına gelsin.
  const scrollRef = useRef<ScrollView>(null);
  const scrolledFor = useRef<string | null>(null);
  const focus = data ? focusIndex(data.lessons) : 0;
  const focusKey = data ? `${data.city.id}:${data.lessons[focus]?.id ?? ''}` : null;
  const scrollToFocus = () => {
    if (!data || !focusKey || scrolledFor.current === focusKey) return;
    const point = nodeCenters(data.lessons.length, width)[focus];
    if (!point) return;
    const visibleTop = sceneHeight + NODE_SIZE / 2;
    const visibleBottom = window.height - insets.bottom - BottomTabInset;
    const y = sceneHeight + point.y - (visibleTop + visibleBottom) / 2;
    scrollRef.current?.scrollTo({ y: Math.max(0, y), animated: false });
    scrolledFor.current = focusKey;
  };

  const message = tip ?? homeMessage(data, info.homeMessage, info.homePose);
  const stats = data?.stats;
  const lokumText = stats ? stats.lokum.toLocaleString('tr-TR') : '';

  return (
    <View style={styles.root}>
      <LinearGradient {...theme.ground} style={StyleSheet.absoluteFill} />

      <ScrollView
        ref={scrollRef}
        style={styles.root}
        contentContainerStyle={[
          styles.content,
          { paddingTop: sceneHeight, paddingBottom: insets.bottom + BottomTabInset + 24 },
        ]}
        onContentSizeChange={scrollToFocus}>
        {data ? (
          <LessonPath
            lessons={data.lessons}
            theme={theme}
            width={width}
            mascotPose={message.pose}
            mascotMessage={message.text}
            onOpenLesson={(lesson) =>
              router.push({ pathname: '/lesson/[id]/index', params: { id: lesson.id } })
            }
            onLockedLesson={() => setTip({ text: 'Önce önceki dersi bitirelim!', pose: 'think' })}
          />
        ) : error ? (
          <LoadError message={getErrorMessage(error)} onRetry={refetch} width={width} />
        ) : isLoading ? (
          <PathSkeleton width={width} color={theme.l3} />
        ) : null}
      </ScrollView>

      {/* Sabit üst kısım: yol bunun altından kayar. */}
      <View style={[styles.header, { width, height: sceneHeight }]}>
        <CityScene city={cityId} width={width} />

        <View style={[styles.chips, { top: insets.top + 14 }]}>
          {stats && data ? (
            <>
              <StatChip kind="level" value={data.level} />
              <View style={styles.chipGroup}>
                <StatChip
                  kind="streak"
                  value={stats.streak}
                  accessibilityHint="Pırıl serini anlatır"
                  onPress={() =>
                    setTip({
                      text:
                        stats.streak > 0
                          ? `${stats.streak} gündür her gün okuyorsun. Harikasın!`
                          : 'Bugün bir hikâye oku, serin başlasın!',
                      pose: 'happy',
                    })
                  }
                />
                <StatChip
                  kind="lokum"
                  value={lokumText}
                  accessibilityHint="Pırıl lokumlarını anlatır"
                  onPress={() =>
                    setTip({
                      text: `${lokumText} lokumun var! Her hikâye sana yeni lokum kazandırır.`,
                      pose: 'happy',
                    })
                  }
                />
              </View>
            </>
          ) : null}
        </View>

        <View style={[styles.banner, { top: sceneHeight - BANNER_OVERLAP }]}>
          {data ? (
            <CityBanner
              theme={theme}
              gradient={READABLE_BANNERS[cityId]}
              info={info}
              lessonsDone={data.city.lessonsDone}
              lessonsTotal={data.city.lessonsTotal}
              onOpenMap={() => router.push('/journey-map')}
            />
          ) : (
            <View style={styles.bannerSkeleton} />
          )}
        </View>
      </View>
    </View>
  );
}

/** Pırıl'ın ana sayfa mesajı: bitmiş yolculuk, bugün okudu, seri tehlikede, yoksa şehrin mesajı. */
function homeMessage(
  data: JourneyResponse | undefined,
  cityMessage: string,
  cityPose: MascotPose,
): Tip {
  if (data?.finished) {
    return { text: 'Yolculuğu tamamladın! Hikâyeleri yeniden okuyabilirsin.', pose: 'happy' };
  }
  if (data?.stats.readToday) return { text: 'Bugün harika okudun!', pose: 'happy' };
  if (data?.stats.streakAtRisk) {
    return { text: 'Serini korumak için bir hikâye yeter!', pose: cityPose };
  }
  return { text: cityMessage, pose: cityPose };
}

/** Yükleniyor: gri düğümler ve düşünen Pırıl (başlık kartının iskeleti üstte). */
function PathSkeleton({ width, color }: { width: number; color: string }) {
  const points = nodeCenters(4, width);
  const height = (points[points.length - 1]?.y ?? 0) + NODE_SIZE;
  return (
    <View
      style={{ width, height }}
      accessible
      accessibilityLabel="Yolun yükleniyor"
      accessibilityRole="progressbar">
      {points.map((point, index) => (
        <View
          key={index}
          style={[
            styles.skeletonNode,
            { left: point.x - NODE_SIZE / 2, top: point.y - NODE_SIZE / 2, backgroundColor: color },
          ]}
        />
      ))}
      <View style={styles.skeletonMascot}>
        <Mascot pose="think" size={130} />
      </View>
    </View>
  );
}

function LoadError({
  message,
  onRetry,
  width,
}: {
  message: string;
  onRetry: () => void;
  width: number;
}) {
  return (
    <View style={[styles.error, { width }]}>
      <View style={styles.errorRow}>
        <Mascot pose="think" size={120} />
        <View style={styles.errorBubble}>
          <MascotBubble tone="game" text={`Hımm, yolu açamadım. ${message}`} />
        </View>
      </View>
      <GameButton title="TEKRAR DENE" accessibilityLabel="Tekrar dene" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
  },
  chips: {
    position: 'absolute',
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  banner: {
    position: 'absolute',
    left: 14,
    right: 14,
  },
  bannerSkeleton: {
    height: 92,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  skeletonNode: {
    position: 'absolute',
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    opacity: 0.6,
  },
  skeletonMascot: {
    position: 'absolute',
    left: 14,
    top: 120,
  },
  error: {
    paddingTop: 48,
    paddingHorizontal: 22,
    gap: 20,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorBubble: {
    flex: 1,
  },
});
