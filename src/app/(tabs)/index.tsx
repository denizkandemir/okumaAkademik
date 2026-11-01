import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type ScrollViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { CITIES } from '@/design/cities';
import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { StateView } from '@/design/components/state-view';
import { colors, radius, size } from '@/design/tokens';
import { ChapterBar } from '@/features/game/home/chapter-bar';
import { CityPreviewSheet } from '@/features/game/home/city-preview-sheet';
import { JourneyMap, focusIndex, type PirilMessage } from '@/features/game/home/journey-map';
import { CITY_MAP_LAYOUTS, mapGeometry } from '@/features/game/home/map-layout';
import type { NextStop } from '@/features/game/home/next-stop-card';
import { CITY_IDS, type CityId } from '@/features/game/theme';
import type { JourneyLesson, JourneyResponse } from '@/features/game/types';
import { useJourney } from '@/features/game/use-journey';

/** Tablet ve web'de harita bu genişlikte ortalanır. */
const MAX_WIDTH = 520;
/** Pırıl'ın kısa ipuçlarının ekranda kalma süresi. */
const TIP_MS = 4000;

function isCityId(value: unknown): value is CityId {
  return typeof value === 'string' && (CITY_IDS as readonly string[]).includes(value);
}

/**
 * Yolculuk sekmesi (01-06-yolculuk): üst çubuk, bölüm çubuğu ve şehrin boyalı haritası.
 * `?city=<id>` ile açılmış (ör. Pasaport'tan) başka bir şehrin haritası da gösterilebilir.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const width = Math.min(window.width, MAX_WIDTH);

  const params = useLocalSearchParams<{ city?: string }>();
  const requested = isCityId(params.city) ? params.city : undefined;
  const { data, error, isLoading, refetch, cityId, currentCity } = useJourney(requested);
  const viewingOther = requested !== undefined && requested !== currentCity;
  const city = CITIES[cityId];

  const [tip, setTip] = useState<PirilMessage | null>(null);
  useEffect(() => {
    if (!tip) return;
    const timer = setTimeout(() => setTip(null), TIP_MS);
    return () => clearTimeout(timer);
  }, [tip]);

  const [preview, setPreview] = useState<CityId | null>(null);

  // Açılışta (ve şehir ya da şu anki ders değişince) şu anki düğüm görünür alanın üst üçte
  // birine gelsin.
  const scrollRef = useRef<ScrollViewInstance>(null);
  const viewportHeight = useRef(0);
  const scrolledFor = useRef<string | null>(null);
  /** Harita (yükleniyor ya da hata değil) çizilip ölçüldü mü. */
  const mapMeasured = useRef(false);
  const geometry = useMemo(
    () => (data ? mapGeometry(CITY_MAP_LAYOUTS[data.city.id], width) : null),
    [data, width],
  );
  const focus = data ? focusIndex(data.lessons) : 0;
  const focusKey = data ? `${data.city.id}:${data.lessons[focus]?.id ?? ''}` : null;
  const scrollToFocus = useCallback(() => {
    if (!geometry || !focusKey || scrolledFor.current === focusKey) return;
    const point = geometry.points[focus];
    if (!point || viewportHeight.current === 0) return;
    const y = point.y - viewportHeight.current / 3;
    scrollRef.current?.scrollTo({ y: Math.max(0, y), animated: false });
    scrolledFor.current = focusKey;
  }, [geometry, focusKey, focus]);
  // Her şehirde 10 ders olduğundan yeni şehirde ya da ders ilerleyince içerik boyu değişmez,
  // onContentSizeChange tetiklenmez; odak değişince buradan kaydırılır (hata taraması, bulgu 9).
  // Harita henüz ölçülmediyse (ilk açılış, yükleniyordan haritaya geçiş) onContentSizeChange
  // kaydırır.
  useEffect(() => {
    if (mapMeasured.current) scrollToFocus();
  }, [scrollToFocus]);
  const onContentSizeChange = () => {
    mapMeasured.current = data !== undefined;
    scrollToFocus();
  };
  const onLayout = (event: LayoutChangeEvent) => {
    viewportHeight.current = event.nativeEvent.layout.height;
    scrollToFocus();
  };

  const openLesson = useCallback((lesson: JourneyLesson) => {
    router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } });
  }, []);
  const showLocked = useCallback(() => {
    setTip({ text: 'Önce önceki dersi bitirelim.', pose: 'think' });
  }, []);

  const message = useMemo(() => tip ?? pirilMessage(data), [tip, data]);
  const nextStop = useMemo(() => (data ? nextStopOf(data) : null), [data]);
  const previewLocked =
    preview !== null && data?.cities.find((entry) => entry.id === preview)?.status === 'locked';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader />
      <ChapterBar number={city.number} name={city.name} level={data?.level} />
      {viewingOther ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Şu anki durağa dön"
          onPress={() => router.setParams({ city: undefined })}
          hitSlop={6}
          style={styles.backChip}>
          <AppText variant="mapLabel" color={colors.accent}>
            Şu anki durağa dön
          </AppText>
        </Pressable>
      ) : null}

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + BottomTabInset }]}
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}>
        {data && nextStop ? (
          <JourneyMap
            city={data.city.id}
            width={width}
            lessons={data.lessons}
            lessonsDone={data.city.lessonsDone}
            lessonsTotal={data.city.lessonsTotal}
            message={message}
            nextStop={nextStop}
            onOpenLesson={openLesson}
            onLockedLesson={showLocked}
            onPreviewCity={setPreview}
          />
        ) : (
          <View style={[styles.state, { width }]}>
            <StateView
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
              loadingLabel="Yolun hazırlanıyor…"
            />
          </View>
        )}
      </ScrollView>

      <CityPreviewSheet city={preview} locked={previewLocked} onClose={() => setPreview(null)} />
    </View>
  );
}

/** Pırıl'ın haritadaki cümlesi ve pozu (T01-yolculuk). */
function pirilMessage(data: JourneyResponse | undefined): PirilMessage {
  if (!data) return { text: 'Yeni bir hikâye bizi bekliyor.', pose: 'idle' };
  const pose = CITIES[data.city.id].homePose;
  if (data.finished) {
    return { text: 'Yolculuğu tamamladık! Sertifikan seni bekliyor.', pose: 'celebrate' };
  }
  const current = data.lessons.find((lesson) => lesson.status === 'current');
  if (!current) return { text: 'Bu şehri bitirdin! Sıradaki durak seni bekliyor.', pose };
  if (current.kind === 'chest') return { text: 'Bir sandık buldum! Hadi açalım.', pose };
  return { text: 'Yeni bir hikâye bizi bekliyor.', pose };
}

/** Haritanın sonundaki kart: sonraki şehir, Van'da son durak, yolculuk bitince bitti. */
function nextStopOf(data: JourneyResponse): NextStop {
  const next = CITY_IDS[CITY_IDS.indexOf(data.city.id) + 1];
  if (data.finished) return { kind: 'finished', city: next ?? null };
  return next ? { kind: 'next', city: next } : { kind: 'last' };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.map.ground,
  },
  content: {
    alignItems: 'center',
  },
  state: {
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  backChip: {
    alignSelf: 'center',
    minHeight: size.touch - 12,
    justifyContent: 'center',
    marginVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.bubble.background,
    borderWidth: 1,
    borderColor: colors.bubble.border,
  },
});
