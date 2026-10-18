import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameColors, GameFonts } from '@/features/game/theme';
import type { CompleteLessonResponse, LessonDetailResponse } from '@/features/game/types';
import { GameButton } from '@/features/game/ui/game-button';
import { ChestIcon } from '@/features/game/ui/icons';
import { StarRow } from '@/features/game/ui/star-row';
import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';
import { useApiQuery } from '@/hooks/use-api-query';
import { api, ApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

/** Metin seviyesinin ders kartındaki adı (API: 1 Başlangıç, 2 Orta, 3 İleri). */
const LEVEL_NAMES = { 1: 'Kolay', 2: 'Orta', 3: 'Zor' } as const;
const STEPS = ['Hikâyeyi oku', "Pırıl'ın 3 sorusunu cevapla", 'Yıldızlarını topla'];

/** Ders kartı (S03DersKarti): yolda bir derse dokununca alttan açılan sayfa. */
export default function LessonCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data, error, isLoading, refetch } = useApiQuery<LessonDetailResponse>(
    id ? `/lessons/${encodeURIComponent(id)}` : null,
  );

  return (
    <ScrollView
      style={styles.sheet}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
      {data ? (
        data.lesson.kind === 'chest' ? (
          <ChestCard data={data} />
        ) : (
          <StoryCard data={data} />
        )
      ) : error ? (
        <CardError error={error} onRetry={refetch} />
      ) : isLoading ? (
        <View style={styles.loading} accessible accessibilityLabel="Ders yükleniyor">
          <ActivityIndicator color={PURPLE} size="large" />
        </View>
      ) : null}
    </ScrollView>
  );
}

function StoryCard({ data }: { data: LessonDetailResponse }) {
  const { lesson, text } = data;
  const done = lesson.status === 'done';

  const startReading = () => {
    if (!text) return;
    // Sayfa kapanıp yerine okuma ekranı açılır (sayfanın altına itilmez).
    router.replace({ pathname: '/reading/[id]', params: { id: text.id, lessonId: lesson.id } });
  };

  return (
    <>
      <CardHeader
        chip="OKUMA"
        chipStyle={styles.chipPurple}
        position={lesson.position}
        title={lesson.title}
        pose="read"
      />
      <Text style={styles.summary}>{lesson.summary}</Text>

      <View style={styles.tiles}>
        <InfoTile
          value={text ? `${text.estimatedMinutes} dk` : '–'}
          label="süre"
          colors={TILE_COLORS.time}
        />
        <InfoTile
          value={text ? LEVEL_NAMES[text.level] : '–'}
          label="seviye"
          colors={TILE_COLORS.level}
        />
        <InfoTile
          value={done ? 'Alındı' : `+${lesson.maxLokum}`}
          label="lokum"
          colors={TILE_COLORS.lokum}
        />
      </View>

      {done ? (
        <View style={styles.best}>
          <Text style={styles.bestLabel}>En iyi yıldızın</Text>
          <StarRow filled={lesson.bestStars ?? 0} size={34} />
        </View>
      ) : (
        <View style={styles.steps} accessibilityRole="list">
          {STEPS.map((step, index) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      <GameButton
        variant="purple"
        title={done ? 'TEKRAR OKU' : 'OKUMAYA BAŞLA'}
        accessibilityLabel={done ? 'Tekrar oku' : 'Okumaya başla'}
        onPress={startReading}
        disabled={!text}
        style={styles.action}
      />
    </>
  );
}

function ChestCard({ data }: { data: LessonDetailResponse }) {
  const { lesson } = data;
  const done = lesson.status === 'done';
  const [opening, setOpening] = useState(false);
  const [openError, setOpenError] = useState<string | null>(null);

  const openChest = async () => {
    setOpening(true);
    setOpenError(null);
    try {
      // TODO(P06): sandık açılış animasyonu ve ödül ekranları. Şimdilik dersi bitirip yola dön;
      // ana sayfa odaklanınca tazelenir.
      await api.post<CompleteLessonResponse>(`/lessons/${encodeURIComponent(lesson.id)}/complete`);
      router.back();
    } catch (error) {
      setOpenError(getErrorMessage(error));
      setOpening(false);
    }
  };

  return (
    <>
      <CardHeader
        chip="SANDIK"
        chipStyle={styles.chipGold}
        position={lesson.position}
        title={lesson.title}
        pose="happy"
      />
      <View
        style={styles.chestArt}
        accessible
        accessibilityRole="image"
        accessibilityLabel="Hazine sandığı">
        <ChestIcon size={64} color="#8A5A00" strokeWidth={1.8} />
      </View>
      <Text style={[styles.summary, styles.center]}>
        {done ? 'Bu sandığı açtın! Lokumların kumbarada.' : 'Sandığı aç, lokumları topla!'}
      </Text>
      {openError ? (
        <Text style={styles.error} accessibilityRole="alert">
          {openError}
        </Text>
      ) : null}
      {done ? (
        <GameButton
          variant="white"
          size="md"
          title="Tamam"
          onPress={() => router.back()}
          style={styles.action}
        />
      ) : (
        <GameButton
          variant="gold"
          title="SANDIĞI AÇ"
          accessibilityLabel="Sandığı aç"
          loading={opening}
          onPress={openChest}
          style={styles.action}
        />
      )}
    </>
  );
}

function CardHeader({
  chip,
  chipStyle,
  position,
  title,
  pose,
}: {
  chip: string;
  chipStyle: StyleProp<TextStyle>;
  position: number;
  title: string;
  pose: 'read' | 'happy';
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <View style={styles.chipRow}>
          <Text style={[styles.chip, chipStyle]}>{chip}</Text>
          <Text style={styles.lessonNo}>Ders {position} / 10</Text>
        </View>
        <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
          {title}
        </Text>
      </View>
      {/* Tasarımda sayfanın üstüne taşar; native sayfa kırptığı için içeride, sağ üstte. */}
      <Mascot pose={pose} size={104} />
    </View>
  );
}

type TileColors = { background: string; value: string; label: string };

function InfoTile({ value, label, colors }: { value: string; label: string; colors: TileColors }) {
  return (
    <View
      style={[styles.tile, { backgroundColor: colors.background }]}
      accessible
      accessibilityLabel={`${label}: ${value}`}>
      <Text
        style={[styles.tileValue, { color: colors.value }]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={[styles.tileLabel, { color: colors.label }]}>{label}</Text>
    </View>
  );
}

function CardError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const locked = error instanceof ApiError && (error.status === 403 || error.status === 404);
  return (
    <View style={styles.errorBox}>
      <View style={styles.errorRow}>
        <Mascot pose="think" size={110} />
        <View style={styles.errorBubble}>
          <MascotBubble
            tone="game"
            text={
              locked ? getErrorMessage(error) : `Hımm, dersi açamadım. ${getErrorMessage(error)}`
            }
          />
        </View>
      </View>
      {locked ? (
        <GameButton variant="white" size="md" title="Tamam" onPress={() => router.back()} />
      ) : (
        <GameButton title="TEKRAR DENE" accessibilityLabel="Tekrar dene" onPress={onRetry} />
      )}
    </View>
  );
}

const PURPLE = '#5B34D6';
const TILE_COLORS = {
  time: { background: '#FFF4E8', value: '#C2541B', label: '#7A5A44' },
  level: { background: '#ECFAF2', value: '#1B8A52', label: '#3D6B52' },
  lokum: { background: '#FFEFF4', value: '#B23A62', label: '#7A4258' },
} as const satisfies Record<string, TileColors>;

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: GameColors.white,
  },
  content: {
    flexGrow: 1,
    paddingTop: 22,
    paddingHorizontal: 22,
    gap: 14,
  },
  loading: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  headerText: {
    flex: 1,
    gap: 8,
    paddingTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.8,
    borderRadius: 999,
    overflow: 'hidden',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chipPurple: {
    backgroundColor: '#EDE5FF',
    color: '#4A2BC2',
  },
  chipGold: {
    backgroundColor: '#FFF1CC',
    color: '#7A4E00',
  },
  lessonNo: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 14,
    lineHeight: 19,
    color: GameColors.textLilacSecondary,
  },
  title: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 30,
    lineHeight: 34,
    color: GameColors.warm,
  },
  summary: {
    fontFamily: GameFonts.body,
    fontSize: 16,
    lineHeight: 23,
    color: '#4F4060',
  },
  center: {
    textAlign: 'center',
  },
  tiles: {
    flexDirection: 'row',
    gap: 8,
  },
  tile: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 2,
  },
  tileValue: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 22,
    lineHeight: 28,
  },
  tileLabel: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 12,
    lineHeight: 16,
  },
  steps: {
    gap: 8,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2453C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 14,
    color: GameColors.white,
  },
  stepText: {
    flex: 1,
    fontFamily: GameFonts.bodyBold,
    fontSize: 15,
    lineHeight: 21,
    color: GameColors.warm,
  },
  best: {
    alignItems: 'center',
    gap: 6,
  },
  bestLabel: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 14,
    color: GameColors.textLilacSecondary,
  },
  chestArt: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE7A8',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 0 #E0B24A',
  },
  error: {
    fontFamily: GameFonts.bodyBold,
    fontSize: 14,
    color: '#B42318',
    textAlign: 'center',
  },
  action: {
    marginTop: 'auto',
  },
  errorBox: {
    paddingTop: 12,
    gap: 16,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorBubble: {
    flex: 1,
  },
});
