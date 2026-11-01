import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CITIES } from '@/design/cities';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { Chip } from '@/design/components/chip';
import { Eyebrow } from '@/design/components/eyebrow';
import { SheetHeader } from '@/design/components/sheet-header';
import { StateView } from '@/design/components/state-view';
import { GiftIcon, StarIcon } from '@/design/icons';
import { colors, size } from '@/design/tokens';
import type { LessonDetailResponse } from '@/features/game/types';
import { Mascot } from '@/features/mascot/mascot';
import { useApiQuery } from '@/hooks/use-api-query';
import { ApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

/** Özet boşsa ders kartında gösterilen açıklama (07-ders-karti). */
const DEFAULT_SUMMARY =
  "Kısa bir hikâye oku. Pırıl'ın üç sorusunu yanıtla. Pasaportunda yeni bir iz bırak.";

/** Kartı kapatır; derin bağlantıyla açıldıysa (geri gidilecek ekran yoksa) ana sayfaya gider. */
function closeCard() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

/** Ders kartı (07-ders-karti): haritada bir derse dokununca alttan açılan sayfa. */
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
      <SheetHeader onClose={closeCard} />
      {data ? (
        data.lesson.kind === 'chest' ? (
          <ChestCard data={data} />
        ) : (
          <StoryCard data={data} />
        )
      ) : error ? (
        <CardError error={error} onRetry={refetch} />
      ) : (
        <StateView
          isLoading={isLoading}
          error={null}
          onRetry={refetch}
          loadingLabel="Ders yükleniyor…"
          mascot={false}
        />
      )}
    </ScrollView>
  );
}

function StoryCard({ data }: { data: LessonDetailResponse }) {
  const { lesson, text, questions } = data;
  const done = lesson.status === 'done';

  const startReading = () => {
    if (!text) return;
    // Sayfa kapanıp yerine okuma ekranı açılır (sayfanın altına itilmez).
    router.replace({ pathname: '/reading/[id]', params: { id: text.id, lessonId: lesson.id } });
  };

  return (
    <>
      <CardHeader data={data} />
      <AppText color={colors.textMuted}>{lesson.summary.trim() || DEFAULT_SUMMARY}</AppText>

      <View style={styles.chips}>
        {text ? <Chip label={`${text.estimatedMinutes} dakika`} /> : null}
        <Chip label={`${questions.length || 3} soru`} />
        <Chip
          label={done ? 'Alındı' : `+${lesson.maxLokum} lokum`}
          accessibilityLabel={done ? 'Lokum alındı' : `${lesson.maxLokum} lokum kazanabilirsin`}
          accessible
        />
      </View>

      {done ? <BestStars stars={lesson.bestStars ?? 0} /> : null}

      <Button
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

  const openChest = () =>
    router.replace({ pathname: '/lesson/[id]/chest', params: { id: lesson.id } });

  return (
    <>
      <CardHeader data={data} />
      <View
        style={styles.chestArt}
        accessible
        accessibilityRole="image"
        accessibilityLabel="Hazine sandığı">
        <GiftIcon size={56} color={colors.node.chest.icon} strokeWidth={2.2} />
      </View>
      <AppText color={colors.textMuted} align="center">
        {done ? 'Bu sandığı açtın! Lokumların kumbarada.' : 'Sandığı aç, lokumları topla!'}
      </AppText>
      {done ? (
        <Button
          title="TAMAM"
          accessibilityLabel="Tamam"
          variant="secondary"
          onPress={closeCard}
          style={styles.action}
        />
      ) : (
        <Button
          title="SANDIĞI AÇ"
          accessibilityLabel="Sandığı aç"
          onPress={openChest}
          style={styles.action}
        />
      )}
    </>
  );
}

/** "İSTANBUL · DERS 3", başlık ve yanında küçük Pırıl (okuyor). */
function CardHeader({ data }: { data: LessonDetailResponse }) {
  const { lesson } = data;
  const cityName = CITIES[lesson.city].name.toLocaleUpperCase('tr-TR');
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Eyebrow>
          {cityName} · DERS {lesson.position}
        </Eyebrow>
        <AppText variant="sheetTitle" accessibilityRole="header" maxFontSizeMultiplier={1.3}>
          {lesson.title}
        </AppText>
      </View>
      <Mascot pose="read" size={72} />
    </View>
  );
}

/** Biten hikâyenin en iyi sonucu: 3 yıldızdan kaçı dolu. */
function BestStars({ stars }: { stars: number }) {
  return (
    <View style={styles.stars} accessible accessibilityLabel={`En iyi sonucun: ${stars} yıldız`}>
      {[1, 2, 3].map((index) =>
        index <= stars ? (
          <StarIcon key={index} size={30} />
        ) : (
          <StarIcon
            key={index}
            size={30}
            color={colors.node.locked.fill}
            stroke={colors.node.locked.lip}
          />
        ),
      )}
    </View>
  );
}

function CardError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const locked = error instanceof ApiError && (error.status === 403 || error.status === 404);
  if (!locked) return <StateView isLoading={false} error={error} onRetry={onRetry} />;
  return (
    <View style={styles.locked} accessibilityLiveRegion="polite">
      <Mascot pose="think" size={96} />
      <AppText variant="heading" align="center">
        {getErrorMessage(error)}
      </AppText>
      <Button title="TAMAM" accessibilityLabel="Tamam" variant="secondary" onPress={closeCard} />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flexGrow: 1,
    gap: 14,
    paddingTop: 6,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 6,
  },
  stars: {
    flexDirection: 'row',
    gap: 6,
  },
  chestArt: {
    alignSelf: 'center',
    width: 112,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: colors.node.chest.fill,
    borderWidth: size.node.edge,
    borderColor: colors.node.edge,
    borderBottomWidth: size.node.chest.lip + 2,
    borderBottomColor: colors.node.chest.lip,
  },
  action: {
    marginTop: 'auto',
  },
  locked: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 24,
  },
});
