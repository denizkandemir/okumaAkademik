import { LinearGradient } from 'expo-linear-gradient';
import { Link, router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { MinTouchSize } from '@/constants/theme';
import { GameBackgrounds, GameColors, GameFonts } from '@/features/game/theme';
import { BackButton } from '@/features/game/ui/back-button';
import { GameText } from '@/features/game/ui/game-text';
import { EyeIcon, EyeOffIcon } from '@/features/game/ui/icons';
import { Panel } from '@/features/game/ui/panel';
import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';
import type { MascotPose } from '@/features/mascot/types';

/** Formun en geniş hâli; tablet ve web'de ortalanır. */
const MAX_WIDTH = 480;
const SIDE_PADDING = 20;
/** Tasarımdaki maskot boyutu (390 dp genişlikte). */
const MASCOT_SIZE = 200;

type AuthFormLayoutProps = {
  pose: MascotPose;
  /** Yalnızca `talk` pozunda: balon yazılırken ağız oynar. */
  talking?: boolean;
  bubble: string;
  onBubbleTypingChange?: (typing: boolean) => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
};

/**
 * Giriş ve kayıt ekranlarının ortak düzeni (S02Giris): sıcak krem zemin, geri düğmesi, Pırıl ve
 * konuşma balonu, beyaz form paneli, altta bağlantı. Klavye açılınca içerik kaydırılabilir kalır.
 */
export function AuthFormLayout({
  pose,
  talking,
  bubble,
  onBubbleTypingChange,
  title,
  children,
  footer,
}: AuthFormLayoutProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, MAX_WIDTH) - SIDE_PADDING * 2;
  // Dar ekranlarda balon için yer kalsın: maskot en fazla içerik genişliğinin yarısı.
  const mascotSize = Math.min(MASCOT_SIZE, Math.round(contentWidth * 0.5));

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/welcome');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <WarmBackground />
      <ScrollView
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 },
        ]}>
        <View style={styles.inner}>
          <BackButton onPress={goBack} />

          <View style={styles.mascotRow}>
            <Mascot pose={pose} size={mascotSize} talking={talking} />
            <View style={styles.bubbleColumn}>
              <MascotBubble
                tone="game"
                side="right"
                text={bubble}
                onTypingChange={onBubbleTypingChange}
              />
            </View>
          </View>

          <Panel tone="warm" style={styles.panel}>
            <GameText variant="title" color={TITLE_COLOR} style={styles.title}>
              {title}
            </GameText>
            {children}
          </Panel>

          <View style={styles.spacer} />
          {footer}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type AuthFooterLinkProps = {
  prompt: string;
  label: string;
  href: Href;
};

/** "Hesabın yok mu? Kayıt ol" satırı; bağlantı ekranı değiştirir (geri yığını büyümez). */
export function AuthFooterLink({ prompt, label, href }: AuthFooterLinkProps) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{prompt}</Text>
      <Link href={href} replace asChild>
        <Pressable accessibilityRole="link" style={styles.footerLink}>
          <Text style={styles.footerLinkText}>{label}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

type PasswordVisibilityButtonProps = {
  visible: boolean;
  onToggle: () => void;
};

/** Şifre alanının sağındaki göz düğmesi (44×44; dokunma alanı 48). */
export function PasswordVisibilityButton({ visible, onToggle }: PasswordVisibilityButtonProps) {
  const Icon = visible ? EyeOffIcon : EyeIcon;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Şifreyi gizle' : 'Şifreyi göster'}
      hitSlop={2}
      onPress={onToggle}
      style={({ pressed }) => [styles.eyeButton, pressed && styles.eyePressed]}>
      <Icon size={22} color={GameColors.textWarmSecondary} />
    </Pressable>
  );
}

/** Krem gradyan ve iki bulanık renk lekesi (mavi solda, turuncu sağda). Süsleme amaçlıdır. */
function WarmBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <View
      style={[StyleSheet.absoluteFill, styles.noTouch]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <LinearGradient {...GameBackgrounds.cream} style={StyleSheet.absoluteFill} />
      {/* CSS'teki filter: blur(55px) yerine kenara doğru sönen radyal gradyan. */}
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id="blob-blue" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#A9C1FF" stopOpacity={0.45} />
            <Stop offset="0.55" stopColor="#A9C1FF" stopOpacity={0.3} />
            <Stop offset="1" stopColor="#A9C1FF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="blob-orange" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFB067" stopOpacity={0.45} />
            <Stop offset="0.55" stopColor="#FFB067" stopOpacity={0.3} />
            <Stop offset="1" stopColor="#FFB067" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={50} cy={190} r={185} fill="url(#blob-blue)" />
        <Circle cx={width - 50} cy={380} r={175} fill="url(#blob-orange)" />
      </Svg>
    </View>
  );
}

/** Form başlığı (S02Giris #2453C9). */
const TITLE_COLOR = '#2453C9';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  noTouch: {
    pointerEvents: 'none',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: SIDE_PADDING,
  },
  inner: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MAX_WIDTH - SIDE_PADDING * 2,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginLeft: -14,
  },
  bubbleColumn: {
    flex: 1,
    paddingTop: 26,
    marginLeft: -10,
  },
  panel: {
    marginTop: 22,
    borderRadius: 26,
    paddingVertical: 22,
    paddingHorizontal: 20,
    gap: 16,
    boxShadow: '0 16px 34px rgba(150,80,30,0.14)',
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
  },
  spacer: {
    flexGrow: 1,
    minHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: GameFonts.bodyBold,
    fontSize: 16,
    color: GameColors.textWarmSecondary,
  },
  footerLink: {
    minHeight: MinTouchSize,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  eyeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyePressed: {
    backgroundColor: 'rgba(107,86,71,0.1)',
  },
  footerLinkText: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 16,
    color: TITLE_COLOR,
    textDecorationLine: 'underline',
  },
});
