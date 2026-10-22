import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, Share, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useAuth } from '@/features/auth/auth-context';
import { continueRewardFlow } from '@/features/game/reward-flow';
import { useReward } from '@/features/game/reward-store';
import { ConfettiLayer } from '@/features/game/rewards/celebration';
import { GameColors, GameFonts } from '@/features/game/theme';
import type { StatsResponse } from '@/features/game/types';
import { GameButton } from '@/features/game/ui/game-button';
import { CloseIcon, StarIcon } from '@/features/game/ui/icons';
import { SquareButton } from '@/features/game/ui/square-button';
import { Mascot } from '@/features/mascot/mascot';
import { CityScene } from '@/features/scenes/city-scene';
import { SCENE_HEIGHT, SCENE_WIDTH } from '@/features/scenes/scene-kit';
import { useApiQuery } from '@/hooks/use-api-query';

const MAX_WIDTH = 520;
const CITY_COUNT = 6;

/**
 * Final (S15VanFinal): Pırıl evine döndü. Okuma kâşifi sertifikası, toplamlar GET /me/stats'tan.
 * Ödül akışında `finished` ise açılır; sonra profilden de açılabilir.
 */
export default function FinaleScreen() {
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const { user } = useAuth();
  const reward = useReward();
  const { data: stats } = useApiQuery<StatsResponse>('/me/stats');
  const width = Math.min(window.width, MAX_WIDTH);
  const sceneHeight = (width * SCENE_HEIGHT) / SCENE_WIDTH;
  const mascotSize = window.height < 700 ? 170 : 220;
  const name = user?.name.trim() || 'Okuma kâşifi';
  const stories = stats?.storiesDone;
  const minutes = stats?.minutesTotal;

  const close = () => {
    if (reward?.result.finished) continueRewardFlow('finale', reward);
    else if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const share = () => {
    const totals =
      stories != null && minutes != null
        ? ` ${stories} hikâye okudu ve ${minutes.toLocaleString('tr-TR')} dakika kitap başında kaldı.`
        : '';
    Share.share({
      message: `${name}, Okumatik'te Pırıl'ı İstanbul'dan Van'a kadar hikâyelerle taşıdı ve Okuma Kâşifi Sertifikası kazandı!${totals}`,
    }).catch(() => {});
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#7CC4FF', '#9ED07A', '#E3F6D8', '#FFF6E2']}
        locations={[0, 0.4, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.scene, { width }]}>
        <CityScene city="van" width={width} />
        <LinearGradient
          colors={['rgba(158,208,122,0)', '#CFEDBE']}
          style={[styles.fade, { height: (60 * sceneHeight) / SCENE_HEIGHT }]}
        />
      </View>
      <ConfettiLayer top={insets.top} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
        ]}>
        <View style={[styles.column, { width: width - 36 }]}>
          <View style={styles.closeRow}>
            <SquareButton accessibilityLabel="Kapat" lip="#B9DDA4" onPress={close}>
              <CloseIcon size={20} color={GameColors.textWarmSecondary} />
            </SquareButton>
          </View>

          <View style={styles.ribbonRow}>
            <View style={styles.ribbon}>
              <LinearGradient
                colors={['#4F7BF2', '#2453C9']}
                style={[StyleSheet.absoluteFill, styles.ribbonFill]}
              />
              <Text
                style={styles.ribbonText}
                accessibilityRole="header"
                maxFontSizeMultiplier={1.3}>
                Eve hoş geldin, Pırıl!
              </Text>
            </View>
          </View>

          <View style={[styles.mascot, { marginTop: Math.max(16, sceneHeight - 230) }]}>
            <Mascot pose="happy" size={mascotSize} accessibilityLabel="Pırıl evinde, çok mutlu" />
          </View>

          <View style={styles.certificate}>
            <View style={styles.certificateRing} />
            <View style={styles.coin}>
              <Svg width={54} height={54} style={StyleSheet.absoluteFill}>
                <Defs>
                  <RadialGradient id="cert-coin" cx="35%" cy="28%" r="75%">
                    <Stop offset="0" stopColor="#FFF2C4" />
                    <Stop offset="0.55" stopColor="#FFC23A" />
                    <Stop offset="1" stopColor="#D98A00" />
                  </RadialGradient>
                </Defs>
                <Rect width={54} height={54} rx={27} fill="url(#cert-coin)" />
              </Svg>
              <StarIcon size={28} fill={GameColors.white} />
            </View>
            <Text style={styles.certLabel}>OKUMA KÂŞİFİ SERTİFİKASI</Text>
            <Text style={styles.certName}>{name}</Text>
            <Text style={styles.certText}>
              Pırıl&apos;ı İstanbul&apos;dan Van&apos;a kadar hikâyelerle taşıdı.
            </Text>
            <View style={styles.totals}>
              <Total value={String(CITY_COUNT)} label="şehir" />
              <Total value={stories != null ? String(stories) : '–'} label="hikâye" />
              <Total
                value={minutes != null ? minutes.toLocaleString('tr-TR') : '–'}
                label="dakika"
              />
            </View>
          </View>

          <View style={styles.spacer} />
          <GameButton
            title="SERTİFİKAMI AİLEME GÖNDER"
            accessibilityLabel="Sertifikamı aileme gönder"
            onPress={share}
          />
          <Text style={styles.next}>Yeni macera yakında: Pırıl&apos;ın arkadaşları!</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Total({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.total} accessible accessibilityLabel={`${value} ${label}`}>
      <Text style={styles.totalValue}>{value}</Text>
      <Text style={styles.totalLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scene: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
  column: {
    flexGrow: 1,
    gap: 12,
  },
  closeRow: {
    flexDirection: 'row',
  },
  ribbonRow: {
    alignItems: 'center',
  },
  ribbon: {
    borderRadius: 22,
    paddingTop: 6,
    paddingBottom: 4,
    paddingHorizontal: 22,
    boxShadow: '0 5px 0 #183A99, 0 12px 24px rgba(20,40,90,0.3)',
  },
  ribbonFill: {
    borderRadius: 22,
  },
  ribbonText: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 28,
    lineHeight: 34,
    color: GameColors.white,
    textAlign: 'center',
  },
  mascot: {
    alignItems: 'center',
  },
  certificate: {
    borderRadius: 24,
    backgroundColor: '#FFFDF6',
    borderWidth: 3,
    borderColor: '#E8B13A',
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 14px 30px rgba(120,80,20,0.18)',
  },
  certificateRing: {
    position: 'absolute',
    top: 4,
    right: 4,
    bottom: 4,
    left: 4,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F3D58A',
    pointerEvents: 'none',
  },
  coin: {
    position: 'absolute',
    right: 14,
    top: -22,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 14px rgba(120,80,20,0.3)',
  },
  certLabel: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 12,
    letterSpacing: 1.9,
    color: '#8A5C0C',
    textAlign: 'center',
  },
  certName: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 34,
    lineHeight: 40,
    color: '#2453C9',
    textAlign: 'center',
  },
  certText: {
    fontFamily: GameFonts.bodyBold,
    fontSize: 15,
    lineHeight: 21,
    color: '#4A3A20',
    textAlign: 'center',
  },
  totals: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 4,
  },
  total: {
    alignItems: 'center',
  },
  totalValue: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 24,
    lineHeight: 28,
    color: '#C25519',
  },
  totalLabel: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 12,
    color: '#6B5A3A',
  },
  spacer: {
    flexGrow: 1,
    minHeight: 12,
  },
  next: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 15,
    lineHeight: 21,
    color: '#3D6B52',
    textAlign: 'center',
    paddingVertical: 10,
  },
});
