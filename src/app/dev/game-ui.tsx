import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CITY_IDS,
  CITY_INFO,
  CITY_THEMES,
  GAME_BUTTON_VARIANTS,
  GameBackgrounds,
  GameColors,
  type CityId,
} from '@/features/game/theme';
import { GameButton, GameLinkButton } from '@/features/game/ui/game-button';
import { GameText, type GameTextVariant } from '@/features/game/ui/game-text';
import {
  BackIcon,
  BadgeIcon,
  BookIcon,
  CheckIcon,
  ChestIcon,
  CloseIcon,
  FlameIcon,
  HouseIcon,
  LockIcon,
  LokumIcon,
  MapIcon,
  MicIcon,
  PersonIcon,
  SearchIcon,
  StarIcon,
} from '@/features/game/ui/icons';
import { Panel } from '@/features/game/ui/panel';
import { ProgressFills, ProgressTrack, ProgressTracks } from '@/features/game/ui/progress-track';
import { StarRow } from '@/features/game/ui/star-row';
import { StatChip } from '@/features/game/ui/stat-chip';

const HEADER_OPTIONS = {
  headerShown: true,
  title: 'Oyun arayüzü',
  // Geri butonunda önceki rotanın adı ("(tabs)") yerine "Geri" yazsın.
  headerBackTitle: 'Geri',
};

const TEXT_SAMPLES: { variant: GameTextVariant; text: string }[] = [
  { variant: 'display', text: '8' },
  { variant: 'title', text: 'Harika okudun!' },
  { variant: 'heading', text: "Boğaz'ın Hikâyeleri" },
  { variant: 'body', text: 'Bahçedeki büyük ağacın dalında minik bir serçe yaşardı.' },
  { variant: 'label', text: 'İSTANBUL · DERS 3' },
  { variant: 'caption', text: 'Mor kelimelere dokun, anlamını söyleyeyim!' },
];

const BUTTON_TITLES: Record<(typeof GAME_BUTTON_VARIANTS)[number], string> = {
  blue: 'GİRİŞ YAP',
  purple: 'OKUMAYA BAŞLA',
  green: 'DEVAM ET',
  orange: 'TEKRAR DENE',
  gold: 'SÜPER!',
  teal: "KAPADOKYA'YI KEŞFET",
  white: 'Zaten hesabım var',
};

const ICONS: { name: string; node: ReactNode }[] = [
  { name: 'house', node: <HouseIcon /> },
  { name: 'book', node: <BookIcon /> },
  { name: 'badge', node: <BadgeIcon /> },
  { name: 'person', node: <PersonIcon /> },
  { name: 'map', node: <MapIcon /> },
  { name: 'search', node: <SearchIcon /> },
  { name: 'mic', node: <MicIcon /> },
  { name: 'chest', node: <ChestIcon /> },
  { name: 'lock', node: <LockIcon /> },
  { name: 'check', node: <CheckIcon /> },
  { name: 'close', node: <CloseIcon /> },
  { name: 'back', node: <BackIcon /> },
  { name: 'flame', node: <FlameIcon /> },
  { name: 'star', node: <StarIcon stroke={GameColors.starStroke} /> },
  { name: 'lokum', node: <LokumIcon /> },
];

/** Geliştirici vitrini: tüm oyun bileşenleri ve şehir temaları. Yalnızca __DEV__. */
export default function GameUiShowcaseScreen() {
  if (!__DEV__) {
    return (
      <View style={styles.unavailable}>
        <Stack.Screen options={{ ...HEADER_OPTIONS, title: '' }} />
        <GameText>Bu sayfa kullanılamıyor.</GameText>
      </View>
    );
  }
  return <Showcase />;
}

function Showcase() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [presses, setPresses] = useState(0);
  const [progress, setProgress] = useState(0.3);
  const [starsKey, setStarsKey] = useState(0);

  return (
    <View style={styles.flex}>
      <Stack.Screen options={HEADER_OPTIONS} />
      <LinearGradient
        colors={GameBackgrounds.lilacCream.colors}
        start={GameBackgrounds.lilacCream.start}
        end={GameBackgrounds.lilacCream.end}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 32,
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
          },
        ]}>
        <Section title="GameText">
          {TEXT_SAMPLES.map(({ variant, text }) => (
            <View key={variant} style={styles.sample}>
              <GameText variant="caption" color={GameColors.textSecondary}>
                {variant}
              </GameText>
              <GameText variant={variant}>{text}</GameText>
            </View>
          ))}
        </Section>

        <Section title="GameButton">
          {GAME_BUTTON_VARIANTS.map((variant) => (
            <GameButton
              key={variant}
              variant={variant}
              title={BUTTON_TITLES[variant]}
              onPress={() => setPresses((value) => value + 1)}
            />
          ))}
          <GameText variant="caption" color={GameColors.textSecondary}>
            Basma sayısı: {presses}
          </GameText>
          <GameButton
            size="md"
            variant="orange"
            title="Metne bak"
            onPress={() => setPresses((value) => value + 1)}
          />
          <GameButton
            variant="purple"
            title="BİTİRDİM"
            icon={<CheckIcon size={22} color="#FFFFFF" />}
            onPress={() => setPresses((value) => value + 1)}
          />
          <GameButton
            title="KONTROL ET"
            loading={loading}
            onPress={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1500);
            }}
          />
          <GameButton title="KAPALI" disabled onPress={() => {}} />
          <Link href="/dev/mascot" asChild>
            <GameLinkButton variant="white" title="Link: maskot vitrini" />
          </Link>
        </Section>

        <Section title="StatChip">
          <View style={styles.chipRow}>
            <StatChip kind="level" value={3} />
            <StatChip kind="streak" value={6} />
            <StatChip kind="lokum" value="320" />
          </View>
        </Section>

        <Section title="Panel">
          <Panel>
            <GameText variant="label">lilac (varsayılan)</GameText>
            <GameText>Ders kartı, soru ve okuma ekranlarında.</GameText>
          </Panel>
          <Panel tone="warm">
            <GameText variant="label" color={GameColors.textWarm}>
              warm
            </GameText>
            <GameText color={GameColors.textWarmSecondary}>
              Giriş ve ders sonu ekranlarında.
            </GameText>
          </Panel>
        </Section>

        <Section title="ProgressTrack">
          <LinearGradient
            colors={CITY_THEMES.istanbul.banner.colors}
            start={CITY_THEMES.istanbul.banner.start}
            end={CITY_THEMES.istanbul.banner.end}
            style={styles.banner}>
            <ProgressTrack progress={progress} accessibilityLabel="Durak ilerlemesi" />
          </LinearGradient>
          <ProgressTrack
            progress={progress}
            height={14}
            fill={ProgressFills.purple}
            trackColor={ProgressTracks.cream}
            accessibilityLabel="Soru ilerlemesi"
          />
          <ProgressTrack
            progress={progress}
            fill={ProgressFills.sky}
            trackColor={ProgressTracks.sky}
            accessibilityLabel="Harita ilerlemesi"
          />
          <View style={styles.dark}>
            <ProgressTrack
              progress={progress}
              height={12}
              fill={ProgressFills.mint}
              trackColor={ProgressTracks.onDark}
              accessibilityLabel="Seviye ilerlemesi"
            />
          </View>
          <GameButton
            size="md"
            variant="white"
            title="İlerlemeyi değiştir"
            onPress={() =>
              setProgress((value) => (value >= 1 ? 0 : Math.round((value + 0.2) * 10) / 10))
            }
          />
        </Section>

        <Section title="StarRow">
          {[0, 1, 2, 3].map((count) => (
            <StarRow key={count} filled={count} size={36} />
          ))}
          <StarRow key={starsKey} filled={3} animate />
          <GameButton
            size="md"
            variant="gold"
            title="Yıldızları yeniden oynat"
            onPress={() => setStarsKey((value) => value + 1)}
          />
        </Section>

        <Section title="İkonlar">
          <View style={styles.iconGrid}>
            {ICONS.map(({ name, node }) => (
              <View key={name} style={styles.iconCell}>
                {node}
                <GameText variant="caption" color={GameColors.textSecondary}>
                  {name}
                </GameText>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Şehir temaları">
          {CITY_IDS.map((id) => (
            <CitySwatch key={id} id={id} />
          ))}
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <GameText variant="heading" accessibilityRole="header">
        {title}
      </GameText>
      {children}
    </View>
  );
}

function CitySwatch({ id }: { id: CityId }) {
  const theme = CITY_THEMES[id];
  const info = CITY_INFO[id];
  return (
    <LinearGradient
      colors={theme.ground.colors}
      start={theme.ground.start}
      end={theme.ground.end}
      style={styles.city}>
      <LinearGradient
        colors={theme.banner.colors}
        start={theme.banner.start}
        end={theme.banner.end}
        style={[styles.cityBanner, { boxShadow: `0 6px 0 ${theme.bannerSh}` }]}>
        <GameText variant="label" color="#FFFFFF">
          {info.no}. DURAK · {info.upperName}
        </GameText>
        <GameText variant="heading" color="#FFFFFF">
          {info.title}
        </GameText>
        <GameText variant="caption" color="#FFFFFF">
          Seviye {info.levelFrom}-{info.levelTo} · Pırıl: {info.homePose}
        </GameText>
      </LinearGradient>
      <View style={styles.nodes}>
        <Node
          colors={[theme.d1, theme.d2, theme.d3]}
          lip={theme.dSh}
          label="biten"
          textColor={theme.tx}
        />
        <Node
          colors={[theme.a1, theme.a2, theme.a3]}
          lip={theme.aSh}
          label="aktif"
          textColor={theme.tx}
        />
        <Node
          colors={[theme.l1, theme.l2, theme.l3]}
          lip={theme.lSh}
          label="kilitli"
          textColor={theme.tx}
        />
        <View style={styles.pathSample}>
          <View
            style={[styles.pathBar, { backgroundColor: theme.done, borderColor: theme.doneSh }]}
          />
          <View
            style={[styles.pathBar, { backgroundColor: theme.todo, borderColor: theme.todoDash }]}
          />
          <GameText variant="caption" color={theme.tx}>
            yol
          </GameText>
        </View>
      </View>
      <GameText variant="caption" color={theme.tx}>
        “{info.homeMessage}” · {info.exploreLabel}
      </GameText>
    </LinearGradient>
  );
}

function Node({
  colors,
  lip,
  label,
  textColor,
}: {
  colors: [string, string, string];
  lip: string;
  label: string;
  textColor: string;
}) {
  return (
    <View style={styles.nodeCell}>
      <LinearGradient
        colors={colors}
        start={{ x: 0.3, y: 0.2 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.node, { boxShadow: `0 5px 0 ${lip}` }]}
      />
      <GameText variant="caption" color={textColor}>
        {label}
      </GameText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  unavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingTop: 16,
    gap: 28,
  },
  section: {
    gap: 12,
  },
  sample: {
    gap: 2,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  banner: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
  },
  dark: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    backgroundColor: '#2A1F6E',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconCell: {
    width: 64,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: GameColors.white,
  },
  city: {
    borderRadius: 24,
    padding: 14,
    gap: 12,
  },
  cityBanner: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  nodes: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
  },
  nodeCell: {
    alignItems: 'center',
    gap: 8,
  },
  node: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  pathSample: {
    flex: 1,
    gap: 6,
  },
  pathBar: {
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
  },
});
