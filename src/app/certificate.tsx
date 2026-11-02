import * as Sharing from 'expo-sharing';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import { CITIES } from '@/design/cities';
import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { Eyebrow } from '@/design/components/eyebrow';
import { IconButton } from '@/design/components/icon-button';
import { StateView } from '@/design/components/state-view';
import { BackIcon, SparkleIcon } from '@/design/icons';
import { colors, radius, screenPadding, size } from '@/design/tokens';
import { useAuth } from '@/features/auth/auth-context';
import type { StatsResponse } from '@/features/game/types';
import { useApiQuery } from '@/hooks/use-api-query';

const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

/** "27 Ekim 2026" (Intl desteğine bağlı kalmadan). */
function formatDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

const CITY_NAMES = Object.values(CITIES).map((city) => city.name);
const CITY_LINES = [CITY_NAMES.slice(0, 3).join(' · '), CITY_NAMES.slice(3).join(' · ')];

/**
 * Okuma kâşifi sertifikası (25-sertifika). Altı şehir bitince kart PNG olarak paylaşılabilir;
 * öncesinde "ÖNİZLEME" şeridiyle gösterilir ve düğme kapalıdır. Çocuğun adı yalnızca cihazdaki
 * oturumdan okunur.
 */
export default function CertificateScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: stats, error, isLoading, refetch } = useApiQuery<StatsResponse>('/me/stats');
  const cardRef = useRef<ViewInstance>(null);
  const [sharing, setSharing] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);

  const name = user?.name.trim() || 'Okuma kâşifi';
  const finished = !!stats?.finished;
  // Bitiş tarihi: son okumanın günü; yoksa bugün.
  const date = formatDate(finished && stats?.lastReadAt ? new Date(stats.lastReadAt) : new Date());

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const share = async () => {
    if (sharing) return;
    setSharing(true);
    setShareFailed(false);
    try {
      if (!(await Sharing.isAvailableAsync())) throw new Error('Paylaşım kullanılamıyor');
      const uri = await captureRef(cardRef, { format: 'png', quality: 1, result: 'tmpfile' });
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        UTI: 'public.png',
        dialogTitle: 'Sertifikanı paylaş',
      });
    } catch {
      setShareFailed(true);
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader profileLink={false} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}>
        <View style={styles.column}>
          <View style={styles.toolbar}>
            <IconButton accessibilityLabel="Geri" onPress={goBack}>
              <BackIcon />
            </IconButton>
          </View>

          {!stats ? (
            <StateView
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
              loadingLabel="Sertifikanı hazırlıyorum…"
            />
          ) : (
            <>
              <View
                ref={cardRef}
                collapsable={false}
                style={styles.card}
                accessible
                // Ekranın tek başlığı sertifikanın kendisi; başlıklar arasında gezinirken bulunsun.
                accessibilityRole="header"
                accessibilityLabel={`${finished ? '' : 'Önizleme. '}Okuma kâşifi sertifikası, ${name}, ${date}`}>
                <View style={styles.cardInner}>
                  <Eyebrow align="center">OKUMATİK</Eyebrow>
                  <SparkleIcon size={32} color={colors.certificate.name} />
                  <Eyebrow align="center">OKUMA KAŞİFİ SERTİFİKASI</Eyebrow>
                  <AppText
                    variant="certificateName"
                    color={colors.certificate.name}
                    align="center"
                    style={styles.name}>
                    {name}
                  </AppText>
                  <AppText variant="secondary" color={colors.textMuted} align="center">
                    Pırıl&apos;la altı şehrin hikâyelerini keşfetmeye, merak etmeye ve öğrenmeye
                    adım attın.
                  </AppText>
                  <SparkleIcon size={32} color={colors.certificate.name} filled />
                  <View>
                    {CITY_LINES.map((line) => (
                      <AppText
                        key={line}
                        variant="secondary"
                        color={colors.textMuted}
                        align="center">
                        {line}
                      </AppText>
                    ))}
                  </View>
                  <AppText variant="bodyStrong" color={colors.text} align="center">
                    {date}
                  </AppText>
                </View>
                {finished ? null : (
                  <View style={styles.ribbon} pointerEvents="none">
                    <Eyebrow color={colors.primary.text} align="center" maxFontSizeMultiplier={1.3}>
                      ÖNİZLEME
                    </Eyebrow>
                  </View>
                )}
              </View>

              <Button
                title="SERTİFİKAYI İNDİR"
                accessibilityLabel="Sertifikayı indir ya da paylaş"
                disabled={!finished}
                loading={sharing}
                onPress={share}
              />
              {finished ? null : (
                <AppText color={colors.textMuted} align="center">
                  Altı şehri bitirince senin olacak.
                </AppText>
              )}
              {shareFailed ? (
                <AppText color={colors.danger} align="center" accessibilityLiveRegion="polite">
                  Sertifikayı hazırlayamadım. Tekrar dener misin?
                </AppText>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_OUTLINE = 5;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: 20,
  },
  column: {
    width: '100%',
    maxWidth: size.maxContentWidth,
    alignSelf: 'center',
    gap: 20,
  },
  toolbar: {
    flexDirection: 'row',
  },
  // Panodaki çift kenar: dışta açık "outline", içte altın çizgi.
  card: {
    marginHorizontal: 6,
    padding: CARD_OUTLINE,
    borderRadius: radius.button + CARD_OUTLINE,
    backgroundColor: colors.certificate.outer,
    overflow: 'hidden',
  },
  cardInner: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 27,
    paddingHorizontal: 18,
    borderRadius: radius.button,
    borderWidth: 2,
    borderColor: colors.certificate.border,
    backgroundColor: colors.certificate.background,
  },
  name: {
    marginVertical: 4,
  },
  ribbon: {
    position: 'absolute',
    top: 26,
    right: -44,
    width: 180,
    paddingVertical: 6,
    backgroundColor: colors.primary.face,
    transform: [{ rotate: '45deg' }],
  },
});
