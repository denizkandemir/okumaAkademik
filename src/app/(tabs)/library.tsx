import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CITIES, CITY_IDS } from '@/design/cities';
import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { Card } from '@/design/components/card';
import { CityImage } from '@/design/components/city-image';
import { Eyebrow } from '@/design/components/eyebrow';
import { FilterChip } from '@/design/components/filter-chip';
import { Screen } from '@/design/components/screen';
import { StateView } from '@/design/components/state-view';
import { ThemeTag } from '@/design/components/theme-tag';
import { CheckIcon } from '@/design/icons';
import { colors } from '@/design/tokens';
import { Mascot } from '@/features/mascot/mascot';
import type { LibraryText } from '@/features/reading/types';
import { useApiQuery } from '@/hooks/use-api-query';

type Filter = 'all' | 'read';

/** Yolculuk sırası; dersi olmayan metinler sonda. */
function journeyOrder(text: LibraryText) {
  return text.city ? CITY_IDS.indexOf(text.city) : CITY_IDS.length;
}

/** Kitaplık sekmesi (20-kitaplik): süzgeç hapları ve hikâye kartları. */
export default function LibraryScreen() {
  // Ders bitince yeni hikâyeler açılır; sekme bağlı kaldığı için her odaklanmada tazelenir.
  const { data, error, isLoading, refetch } = useApiQuery<{ texts: LibraryText[] }>('/texts', {
    refetchOnFocus: true,
  });
  const [filter, setFilter] = useState<Filter>('all');

  const texts = useMemo(() => {
    if (!data) return [];
    // Sunucu seviyeye göre sıralar; şehir içinde bu sıra korunur (sort kararlıdır).
    const sorted = [...data.texts].sort((a, b) => journeyOrder(a) - journeyOrder(b));
    return filter === 'read' ? sorted.filter((text) => text.read) : sorted;
  }, [data, filter]);

  return (
    <Screen withTabBar header={<AppHeader />}>
      <View style={styles.intro}>
        <Eyebrow>HİKÂYE ÇANTAN</Eyebrow>
        <AppText variant="title" accessibilityRole="header">
          Bir sayfa daha?
        </AppText>
        <AppText variant="secondary" color={colors.textMuted}>
          Sevdiğin bir yere yeniden uğra.
        </AppText>
      </View>

      <View style={styles.filters}>
        <FilterChip
          label="Tüm hikâyeler"
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterChip
          label="Okuduklarım"
          selected={filter === 'read'}
          onPress={() => setFilter('read')}
        />
      </View>

      {/* Tazeleme başarısız olsa da eldeki liste gösterilir; hata yalnızca veri yokken. */}
      <StateView
        isLoading={isLoading}
        error={data ? undefined : error}
        onRetry={refetch}
        loadingLabel="Kitaplığını hazırlıyorum…"
      />

      {data && texts.length === 0 ? (
        filter === 'read' ? (
          <View style={styles.empty}>
            <Mascot pose="read" size={120} decorative />
            <AppText align="center">
              Henüz bitirdiğin bir hikâye yok. Haritadan ilk hikâyeni seçelim mi?
            </AppText>
            <Button title="YOLCULUĞA GİT" onPress={() => router.navigate('/')} />
          </View>
        ) : (
          <AppText color={colors.textMuted}>
            Sınıfına uygun metin henüz yok. Yakında yenileri gelecek!
          </AppText>
        )
      ) : null}

      {texts.map((text) => (
        <StoryCard key={text.id} text={text} />
      ))}
    </Screen>
  );
}

function StoryCard({ text }: { text: LibraryText }) {
  const cityName = text.city ? CITIES[text.city].name : null;
  const meta = cityName
    ? `${cityName} · ${text.estimatedMinutes} dakika`
    : `${text.estimatedMinutes} dakika`;
  const label = `${text.title}. ${meta}. ${text.theme}.${text.read ? ' Okundu.' : ''}`;

  return (
    <Card
      accessibilityLabel={label}
      onPress={() => router.push({ pathname: '/reading/[id]', params: { id: text.id } })}
      style={styles.card}>
      {text.city ? <CityImage city={text.city} style={styles.thumbnail} /> : null}
      <View style={[styles.body, text.read && styles.bodyWithCheck]}>
        <AppText variant="heading">{text.title}</AppText>
        <AppText variant="secondary" color={colors.textMuted}>
          {meta}
        </AppText>
        <ThemeTag label={text.theme} style={styles.tag} />
      </View>
      {text.read ? (
        <View style={styles.check}>
          <CheckIcon size={14} color={colors.node.done.icon} strokeWidth={3} />
        </View>
      ) : null}
    </Card>
  );
}

const CHECK_SIZE = 24;

const styles = StyleSheet.create({
  intro: {
    gap: 8,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  empty: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 12,
  },
  thumbnail: {
    width: 65,
    height: 83,
    borderRadius: 8,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  bodyWithCheck: {
    paddingRight: CHECK_SIZE,
  },
  tag: {
    marginTop: 4,
  },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: CHECK_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.node.done.fill,
  },
});
