import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { useState, type ComponentType, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CITIES } from '@/design/cities';
import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { Card } from '@/design/components/card';
import { Chip } from '@/design/components/chip';
import { ConfirmDialog } from '@/design/components/confirm-dialog';
import { Eyebrow } from '@/design/components/eyebrow';
import { FeedbackPanel } from '@/design/components/feedback-panel';
import { IconButton } from '@/design/components/icon-button';
import { OptionCard, type OptionState } from '@/design/components/option-card';
import { ProgressBar } from '@/design/components/progress-bar';
import { RewardRow } from '@/design/components/reward-row';
import { SheetHeader } from '@/design/components/sheet-header';
import { SpeechBubble } from '@/design/components/speech-bubble';
import { StatTile } from '@/design/components/stat-tile';
import { StateView } from '@/design/components/state-view';
import { TabBar, TabBarItem } from '@/design/components/tab-bar';
import { TextField } from '@/design/components/text-field';
import { ThemeTag } from '@/design/components/theme-tag';
import { ToggleRow } from '@/design/components/toggle-row';
import { CONTRAST_MIN, contrastRatio } from '@/design/contrast';
import {
  AwardIcon,
  BackIcon,
  BookIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  FlameIcon,
  GiftIcon,
  LockIcon,
  LokumIcon,
  MapIcon,
  SlidersIcon,
  StarIcon,
  UserIcon,
  type IconProps,
} from '@/design/icons';
import { colors, radius, screenPadding, type, type TypeVariant } from '@/design/tokens';
import { CITY_IDS } from '@/features/game/theme';

const HEADER_OPTIONS = {
  headerShown: true,
  // SDK 58'de iOS 26+ başlığı varsayılan saydam; opak kalsın.
  headerTransparent: false,
  title: 'Tasarım vitrini',
  // Geri butonunda önceki rotanın adı ("(tabs)") yerine "Geri" yazsın.
  headerBackTitle: 'Geri',
};

/** `colors` ağacını "primary.face" gibi adlarla düz bir listeye çevirir. */
function flattenColors(node: object, prefix = ''): { name: string; value: string }[] {
  return Object.entries(node).flatMap(([key, value]) =>
    typeof value === 'string'
      ? [{ name: prefix + key, value }]
      : flattenColors(value as object, `${prefix}${key}.`),
  );
}
const SWATCHES = flattenColors(colors);

const TYPE_SAMPLES: Record<TypeVariant, string> = {
  brand: 'okumatik',
  display: 'Hoş geldin!',
  title: 'Merhaba, Ayşe!',
  cityTitle: 'İstanbul',
  sheetTitle: 'Minik Serçe',
  question: 'Serçenin yuvasına ne olmuştu?',
  heading: 'Şehir mühürlerin',
  body: 'Bahçedeki büyük ağacın dalında minik bir serçe yaşardı.',
  bodyStrong: 'Rüzgârda dağılmıştı.',
  secondary: 'İlk hikâyeni tamamlayınca açılır.',
  eyebrow: '1. durak · seviye 3',
  button: 'HADİ OKUYALIM',
  tab: 'Yolculuk',
  mapLabel: 'Arkadaşlık · 2 dk',
  reading: 'Sabah güneşi Galata Kulesi’nin taşlarını ısıtıyordu.',
  landmark: "Boğaz'a doğru",
  certificateName: 'Ayşe Yılmaz',
};

const ICONS: { name: string; Icon: ComponentType<IconProps> }[] = [
  { name: 'Map', Icon: MapIcon },
  { name: 'Book', Icon: BookIcon },
  { name: 'Award', Icon: AwardIcon },
  { name: 'User', Icon: UserIcon },
  { name: 'Lock', Icon: LockIcon },
  { name: 'Check', Icon: CheckIcon },
  { name: 'Gift', Icon: GiftIcon },
  { name: 'Back', Icon: BackIcon },
  { name: 'Close', Icon: CloseIcon },
  { name: 'Sliders', Icon: SlidersIcon },
  { name: 'Clock', Icon: ClockIcon },
  { name: 'Eye', Icon: EyeIcon },
  { name: 'EyeOff', Icon: EyeOffIcon },
];

const OPTION_STATES: OptionState[] = ['default', 'selected', 'correct', 'wrong', 'disabled'];

const TAB_ITEMS = [
  { label: 'Yolculuk', Icon: MapIcon },
  { label: 'Kitaplık', Icon: BookIcon },
  { label: 'Pasaport', Icon: AwardIcon },
  { label: 'Profil', Icon: UserIcon },
];

/** Geliştirici vitrini: tasarım token'ları ve ortak bileşenler. Yalnızca __DEV__. */
export default function DesignShowcaseScreen() {
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
  const [presses, setPresses] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(1 / 3);
  const [selected, setSelected] = useState<string | null>(null);
  const [reminder, setReminder] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View style={styles.flex}>
      <Stack.Screen options={HEADER_OPTIONS} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 32,
            paddingLeft: insets.left + screenPadding,
            paddingRight: insets.right + screenPadding,
          },
        ]}>
        <Section title="Renkler">
          <AppText variant="secondary" color={colors.textMuted}>
            Kontrast: zemin (background) ve kart (surface) üzerinde. Metin için en az{' '}
            {CONTRAST_MIN.text}:1, büyük metin ve ikon için {CONTRAST_MIN.icon}:1.
          </AppText>
          {SWATCHES.map(({ name, value }) => (
            <Swatch key={name} name={name} value={value} />
          ))}
        </Section>

        <Section title="Yazı ölçeği">
          {(Object.keys(TYPE_SAMPLES) as TypeVariant[]).map((variant) => (
            <View key={variant} style={styles.sample}>
              <AppText variant="secondary" color={colors.textMuted}>
                {variant} · {type[variant].fontSize}/{type[variant].lineHeight}
              </AppText>
              <AppText
                variant={variant}
                color={variant === 'reading' ? colors.readingText : undefined}>
                {TYPE_SAMPLES[variant]}
              </AppText>
            </View>
          ))}
        </Section>

        <Section title="İkonlar">
          <View style={styles.wrap}>
            {ICONS.map(({ name, Icon }) => (
              <View key={name} style={styles.iconCell}>
                <Icon />
                <AppText variant="secondary" color={colors.textMuted}>
                  {name}
                </AppText>
              </View>
            ))}
            <View style={styles.iconCell}>
              <StarIcon />
              <AppText variant="secondary" color={colors.textMuted}>
                Star
              </AppText>
            </View>
            <View style={styles.iconCell}>
              <FlameIcon />
              <AppText variant="secondary" color={colors.textMuted}>
                Flame
              </AppText>
            </View>
            <View style={styles.iconCell}>
              <LokumIcon />
              <AppText variant="secondary" color={colors.textMuted}>
                Lokum
              </AppText>
            </View>
          </View>
        </Section>

        <Section title="AppHeader">
          <View style={styles.bleed}>
            <AppHeader />
          </View>
        </Section>

        <Section title="Button">
          <Button
            title={`HADİ OKUYALIM (${presses})`}
            onPress={() => setPresses((count) => count + 1)}
          />
          <Button title="BİLDİRİMİ GÖR" variant="secondary" onPress={() => {}} />
          <Button title="KONTROL ET" disabled onPress={() => {}} />
          <Button
            title="DEVAM ET"
            loading={loading}
            onPress={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1500);
            }}
          />
          <Button title="İÇERİĞİ KADAR" fullWidth={false} onPress={() => {}} />
        </Section>

        <Section title="IconButton">
          <View style={styles.row}>
            <IconButton accessibilityLabel="Geri" onPress={() => {}}>
              <BackIcon />
            </IconButton>
            <IconButton accessibilityLabel="Ayarlar" onPress={() => {}}>
              <SlidersIcon />
            </IconButton>
            <IconButton accessibilityLabel="Şehirler" onPress={() => {}}>
              <MapIcon />
            </IconButton>
            <IconButton shape="round" accessibilityLabel="Kapat" onPress={() => {}}>
              <CloseIcon size={20} strokeWidth={2.2} />
            </IconButton>
          </View>
        </Section>

        <Section title="Card, Chip, ThemeTag, Eyebrow">
          <Card>
            <Eyebrow>Bölüm 01</Eyebrow>
            <AppText variant="heading">Galata&apos;dan Boğaz&apos;a</AppText>
            <ThemeTag label="Arkadaşlık" style={styles.tagGap} />
          </Card>
          <Card onPress={() => {}} accessibilityLabel="Dokunulabilir kart">
            <AppText variant="bodyStrong">Dokunulabilir kart</AppText>
            <AppText variant="secondary" color={colors.textMuted}>
              Altta 3 dp kalın kenar; basınca iner.
            </AppText>
          </Card>
          <View style={styles.row}>
            <Chip label="2 dk" />
            <Chip label="3 soru" />
            <Chip label="+20 lokum" icon={<LokumIcon size={16} />} />
          </View>
        </Section>

        <Section title="ProgressBar">
          <ProgressBar progress={progress} accessibilityLabel="3 sorudan ilerleme" />
          <ProgressBar progress={2 / 6} height={4} accessibilityLabel="6 dersten 2'si tamamlandı" />
          <Button
            title="İLERLET"
            variant="secondary"
            onPress={() => setProgress((value) => (value >= 1 ? 0 : value + 1 / 3))}
          />
        </Section>

        <Section title="OptionCard">
          {OPTION_STATES.map((state, index) => (
            <OptionCard
              key={state}
              letter={String.fromCharCode(65 + index)}
              text={`${state} durumu`}
              state={state}
            />
          ))}
          <AppText variant="secondary" color={colors.textMuted}>
            Seçilebilir:
          </AppText>
          {['Rüzgârda dağılmıştı.', 'Büyümüştü.'].map((text, index) => {
            const letter = String.fromCharCode(65 + index);
            return (
              <OptionCard
                key={letter}
                letter={letter}
                text={text}
                state={selected === letter ? 'selected' : 'default'}
                onPress={() => setSelected(letter)}
              />
            );
          })}
        </Section>

        <Section title="FeedbackPanel">
          <FeedbackPanel
            tone="wrong"
            title="Bir daha bakalım mı?"
            text="İpucunu metinde bulabilirsin. Her deneme öğrenmenin bir parçası."
          />
          <FeedbackPanel
            tone="right"
            title="Harika!"
            text="Serçenin yuvası rüzgârda dağılmıştı."
            extra="+5 lokum"
          />
        </Section>

        <Section title="SheetHeader">
          <View style={styles.sheet}>
            <SheetHeader onClose={() => {}} />
            <Eyebrow>Hikâye · 2 dk</Eyebrow>
            <AppText variant="sheetTitle">Minik Serçe</AppText>
          </View>
        </Section>

        <Section title="StatTile, RewardRow">
          <View style={styles.row}>
            <StatTile value={0} label="hikâye okundu" />
            <StatTile value={560} label="lokum" />
            <StatTile value={9} label="gün serisi" />
          </View>
          <RewardRow
            icon={<BookIcon color={colors.rewardRow.icon} />}
            title="İlk sayfa"
            subtitle="İlk hikâyeni tamamlayınca açılır."
          />
          <RewardRow
            icon={<GiftIcon color={colors.rewardRow.icon} />}
            title="+30 lokum"
            subtitle="Sandık"
          />
        </Section>

        <Section title="SpeechBubble">
          <SpeechBubble text="HADİ OKUYALIM" tone="accent" tail="bottom" />
          <SpeechBubble text="Yeni bir hikâye bizi bekliyor." tail="left" />
          <SpeechBubble text="Kuyruk sağda." tail="right" />
          <SpeechBubble text="Kuyruk üstte." tail="top" />
        </Section>

        <Section title="TextField">
          <TextField label="Adın" placeholder="Ayşe" />
          <TextField label="Kullanıcı adı" defaultValue="ayse" error="Bu kullanıcı adı alınmış." />
          <TextField label="Şifre" secure defaultValue="okuma123" />
          <TextField
            label="Okuma saati"
            defaultValue="19:30"
            trailing={<ClockIcon size={20} color={colors.textMuted} />}
          />
        </Section>

        <Section title="ToggleRow">
          <ToggleRow label="Okuma hatırlatması" value={reminder} onValueChange={setReminder} />
          <ToggleRow label="Kapalı ve devre dışı" value={false} onValueChange={() => {}} disabled />
        </Section>

        <Section title="ConfirmDialog">
          <Button title="PENCEREYİ AÇ" variant="secondary" onPress={() => setDialogOpen(true)} />
          <ConfirmDialog
            visible={dialogOpen}
            title="Okumayı bırakmak istiyor musun?"
            message="Kaldığın yerden yeniden başlarsın."
            stayLabel="OKUMAYA DEVAM"
            leaveLabel="BIRAK"
            onStay={() => setDialogOpen(false)}
            onLeave={() => setDialogOpen(false)}
          />
        </Section>

        <Section title="StateView">
          <StateView isLoading error={null} onRetry={() => {}} />
          <StateView
            isLoading={false}
            error={new Error('Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.')}
            onRetry={() => {}}
          />
        </Section>

        <Section title="TabBar">
          <View style={styles.bleed}>
            <TabBar>
              {TAB_ITEMS.map(({ label, Icon }, index) => (
                <TabBarItem
                  key={label}
                  label={label}
                  Icon={Icon}
                  isFocused={activeTab === index}
                  onPress={() => setActiveTab(index)}
                />
              ))}
            </TabBar>
          </View>
        </Section>

        <Section title="Şehirler">
          {CITY_IDS.map((id) => {
            const city = CITIES[id];
            return (
              <View key={id} style={styles.cityCard}>
                <Image
                  source={city.background}
                  contentFit="cover"
                  recyclingKey={id}
                  style={styles.cityImage}
                  accessibilityIgnoresInvertColors
                />
                <View style={styles.cityInfo}>
                  <Eyebrow>
                    {city.number}. durak · Pırıl: {city.homePose}
                  </Eyebrow>
                  <AppText variant="cityTitle">{city.name}</AppText>
                  <AppText variant="bodyStrong">{city.chapterTitle}</AppText>
                  <AppText variant="secondary" color={colors.textMuted}>
                    {city.tagline} · {city.locative} · {city.accusative}
                  </AppText>
                  <AppText variant="landmark" color={colors.landmark}>
                    {city.landmarkNote}
                  </AppText>
                </View>
              </View>
            );
          })}
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="heading" accessibilityRole="header">
        {title}
      </AppText>
      {children}
    </View>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  const onBackground = contrastRatio(value, colors.background);
  const onSurface = contrastRatio(value, colors.surface);
  return (
    <View
      style={styles.swatch}
      accessible
      accessibilityLabel={`${name}, ${value}, zeminde ${onBackground.toFixed(1)} kontrast`}>
      <View style={[styles.swatchColor, { backgroundColor: value }]} />
      <View style={styles.swatchText}>
        <AppText variant="bodyStrong">{name}</AppText>
        <AppText variant="secondary" color={colors.textMuted}>
          {value} · zemin {onBackground.toFixed(2)} · kart {onSurface.toFixed(2)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  unavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: 16,
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sample: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconCell: {
    width: 76,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  bleed: {
    marginHorizontal: -screenPadding,
  },
  tagGap: {
    marginTop: 8,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 22,
    gap: 6,
  },
  swatch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  swatchColor: {
    width: 44,
    height: 44,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  swatchText: {
    flex: 1,
  },
  cityCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.cardLarge,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  cityImage: {
    width: '100%',
    height: 140,
  },
  cityInfo: {
    padding: 14,
    gap: 2,
  },
});
