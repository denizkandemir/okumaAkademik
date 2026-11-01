import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { CityId } from '../theme';
import type { JourneyLesson } from '../types';
import { CITY_MAP_LAYOUTS, mapGeometry, toPixels } from './map-layout';
import { MapNode } from './map-node';
import { NextStopCard, type NextStop } from './next-stop-card';

import { CITIES } from '@/design/cities';
import { AppText } from '@/design/components/app-text';
import { Eyebrow } from '@/design/components/eyebrow';
import { ProgressBar } from '@/design/components/progress-bar';
import { SpeechBubble } from '@/design/components/speech-bubble';
import { colors, radius, size } from '@/design/tokens';
import { Mascot } from '@/features/mascot/mascot';
import type { MascotPose } from '@/features/mascot/types';

/** Sandık açılınca kazanılan lokum (README "Oyun kuralları"). */
export const CHEST_LOKUM = 30;

/** Odak dersi: şu anki ders; yoksa (şehir bitti) son biten ders. */
export function focusIndex(lessons: JourneyLesson[]): number {
  const current = lessons.findIndex((lesson) => lesson.status === 'current');
  if (current >= 0) return current;
  return Math.max(0, lessons.map((lesson) => lesson.status).lastIndexOf('done'));
}

export type PirilMessage = { text: string; pose: MascotPose };

type JourneyMapProps = {
  city: CityId;
  width: number;
  lessons: JourneyLesson[];
  lessonsDone: number;
  lessonsTotal: number;
  message: PirilMessage;
  nextStop: NextStop;
  onOpenLesson: (lesson: JourneyLesson) => void;
  onLockedLesson: (lesson: JourneyLesson) => void;
  onPreviewCity: (city: CityId) => void;
};

/**
 * Boyalı şehir haritası (01-06-yolculuk): arka plan, açık renkli geçiş, kum yolu, 10 düğüm,
 * bölüm kartı, Pırıl ve balonu, yer notu ve "Sonraki durak" kartı. Geometri yalnızca şehir ve
 * genişlik değişince hesaplanır; kaydırma bu bileşeni yeniden çizdirmez.
 */
export const JourneyMap = memo(function JourneyMap({
  city,
  width,
  lessons,
  lessonsDone,
  lessonsTotal,
  message,
  nextStop,
  onOpenLesson,
  onLockedLesson,
  onPreviewCity,
}: JourneyMapProps) {
  const layout = CITY_MAP_LAYOUTS[city];
  const design = CITIES[city];
  const geometry = useMemo(() => mapGeometry(layout, width), [layout, width]);
  const { height, points, path } = geometry;

  const focus = focusIndex(lessons);
  const focusLesson = lessons[focus];
  const focusPoint = points[focus];
  const landmark = toPixels(layout.landmark, geometry);

  return (
    <View style={[styles.map, { width, height }]}>
      <Image
        source={design.background}
        contentFit="cover"
        contentPosition="center"
        recyclingKey={city}
        transition={150}
        style={StyleSheet.absoluteFill}
        accessible={false}
      />
      <LinearGradient
        colors={colors.map.wash}
        locations={[0, 0.25, 0.7, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d={path}
          fill="none"
          stroke={colors.map.road}
          strokeWidth={29}
          strokeLinecap="round"
          opacity={0.9}
        />
        <Path
          d={path}
          fill="none"
          stroke={colors.map.roadDots}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="1 13"
          opacity={0.7}
        />
      </Svg>

      <View
        style={[styles.titleCard, layout.title === 'left' ? styles.titleLeft : styles.titleRight]}>
        <Eyebrow>BÖLÜM {String(design.number).padStart(2, '0')}</Eyebrow>
        <AppText variant="heading" accessibilityRole="header">
          {design.chapterTitle}
        </AppText>
        <ProgressBar
          progress={lessonsTotal ? lessonsDone / lessonsTotal : 0}
          height={4}
          accessibilityLabel={`${design.name}: ${lessonsTotal} dersten ${lessonsDone} tanesi tamamlandı`}
          style={styles.titleProgress}
        />
        <AppText variant="secondary" color={colors.textMuted}>
          {lessonsDone} / {lessonsTotal} ders tamamlandı
        </AppText>
      </View>

      <AppText
        variant="landmark"
        color={colors.landmark}
        importantForAccessibility="no"
        accessibilityElementsHidden
        style={[styles.landmark, { left: landmark.x, top: landmark.y }]}>
        {design.landmarkNote}
      </AppText>

      {focusLesson && focusPoint ? (
        <>
          <Piril point={focusPoint} width={width} height={height} message={message} />
          {focusLesson.status === 'current' ? (
            <CurrentLabels lesson={focusLesson} point={focusPoint} height={height} />
          ) : null}
        </>
      ) : null}

      {lessons.map((lesson, index) => {
        const point = points[index];
        return point ? (
          <MapNode
            key={lesson.id}
            lesson={lesson}
            x={point.x}
            y={point.y}
            onOpen={onOpenLesson}
            onLocked={onLockedLesson}
          />
        ) : null;
      })}

      {/* Alttan konumlanır: büyük yazıda kart yukarı doğru büyür, haritanın dışına taşmaz. */}
      <View style={styles.nextStop}>
        <NextStopCard nextStop={nextStop} onPreview={onPreviewCity} />
      </View>
    </View>
  );
});

/** Pırıl, odak düğümünün daha geniş tarafında; balonu üstünde. Dokununca kendi tepkisini verir. */
function Piril({
  point,
  width,
  height,
  message,
}: {
  point: { x: number; y: number };
  width: number;
  height: number;
  message: PirilMessage;
}) {
  const mascotSize = Math.min(120, Math.round(width * 0.28));
  const side = point.x < width / 2 ? 'right' : 'left';
  const gap = size.node.current.width / 2 + 16;
  const rawLeft = side === 'right' ? point.x + gap : point.x - gap - mascotSize;
  const left = Math.max(4, Math.min(width - mascotSize - 4, rawLeft));
  const top = point.y - mascotSize * 0.35;

  return (
    <>
      <View
        style={[
          styles.pirilBubble,
          { bottom: height - top + 2, maxWidth: width * 0.44 },
          side === 'right' ? { right: 12 } : { left: 12 },
        ]}>
        <SpeechBubble text={message.text} tail="bottom" />
      </View>
      <View style={[styles.piril, { left, top }]}>
        <Mascot pose={message.pose} size={mascotSize} />
      </View>
    </>
  );
}

/**
 * Şu anki dersin etiketleri: üstte "HADİ OKUYALIM" / "SANDIĞI AÇ", altta "<tema> · n dk" ya da
 * "+30 lokum". Düğümün kendi etiketi aynı bilgiyi taşıdığı için ekran okuyucudan gizlidir.
 */
function CurrentLabels({
  lesson,
  point,
  height,
}: {
  lesson: JourneyLesson;
  point: { x: number; y: number };
  height: number;
}) {
  const node = size.node.current;
  const tag =
    lesson.kind === 'chest'
      ? `+${CHEST_LOKUM} lokum`
      : lesson.theme && lesson.estimatedMinutes
        ? `${lesson.theme} · ${lesson.estimatedMinutes} dk`
        : null;

  return (
    <>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[
          styles.centered,
          { left: point.x - LABEL_BOX / 2, bottom: height - (point.y - node.height / 2 - 14) },
        ]}>
        <SpeechBubble
          text={lesson.kind === 'chest' ? 'SANDIĞI AÇ' : 'HADİ OKUYALIM'}
          tone="accent"
          tail="bottom"
        />
      </View>
      {tag ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.centered,
            { left: point.x - LABEL_BOX / 2, top: point.y + node.height / 2 + node.lip + 14 },
          ]}>
          <View style={styles.tag}>
            <AppText variant="mapLabel" color={colors.map.tagText} numberOfLines={1}>
              {tag}
            </AppText>
          </View>
        </View>
      ) : null}
    </>
  );
}

/** Etiketleri düğüm merkezine ortalamak için kullanılan kutunun genişliği. */
const LABEL_BOX = 220;

const styles = StyleSheet.create({
  map: {
    overflow: 'hidden',
    backgroundColor: colors.map.ground,
  },
  titleCard: {
    position: 'absolute',
    top: 20,
    maxWidth: 230,
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: colors.map.titleCard,
    borderWidth: 1,
    borderColor: colors.map.titleCardBorder,
    borderRadius: radius.card,
    zIndex: 4,
  },
  titleLeft: {
    left: 20,
  },
  titleRight: {
    right: 20,
  },
  titleProgress: {
    marginVertical: 4,
  },
  landmark: {
    position: 'absolute',
    maxWidth: 100,
  },
  piril: {
    position: 'absolute',
    zIndex: 2,
  },
  pirilBubble: {
    position: 'absolute',
    zIndex: 5,
  },
  centered: {
    position: 'absolute',
    width: LABEL_BOX,
    alignItems: 'center',
    zIndex: 4,
  },
  tag: {
    backgroundColor: colors.map.tag,
    borderRadius: radius.badge,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  nextStop: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 20,
    zIndex: 4,
  },
});
