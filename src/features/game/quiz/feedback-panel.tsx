import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { GameColors, GameFonts } from '../theme';
import { GameButton } from '../ui/game-button';
import { CheckIcon } from '../ui/icons';

type FeedbackPanelProps =
  | {
      kind: 'wrong';
      hint: string;
      onShowText: () => void;
      onRetry: () => void;
      bottomInset: number;
    }
  | {
      kind: 'correct';
      explanation: string;
      lokum: number;
      continueLabel: string;
      loading: boolean;
      error: string | null;
      onContinue: () => void;
      bottomInset: number;
    };

/**
 * Cevaptan sonra alttan gelen panel. Yanlış (S06): turuncu "Hmm, bir daha düşünelim!", ipucu,
 * "Metne bak" ve "TEKRAR DENE". Doğru (S07): yeşil "Harika, doğru!", açıklama, "+5 lokum" ve
 * "DEVAM ET". "Yanlış" kelimesi hiç kullanılmaz.
 */
export function FeedbackPanel(props: FeedbackPanelProps) {
  const correct = props.kind === 'correct';
  const title = correct ? 'Harika, doğru!' : 'Hmm, bir daha düşünelim!';
  const body = correct ? props.explanation : props.hint;

  // Ekran okuyucuya sonucu hemen söyle (iOS'ta canlı bölge yok).
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(`${title} ${body}`);
  }, [title, body]);

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      accessibilityLiveRegion="polite"
      style={[
        styles.panel,
        correct ? styles.correctPanel : styles.wrongPanel,
        { paddingBottom: props.bottomInset + 24 },
      ]}>
      <View style={styles.titleRow}>
        <Animated.View
          entering={ZoomIn.springify()}
          style={[styles.icon, { backgroundColor: correct ? '#1E9E57' : '#C25519' }]}>
          {correct ? (
            <CheckIcon size={22} color={GameColors.white} strokeWidth={3} />
          ) : (
            <Text style={styles.question}>?</Text>
          )}
        </Animated.View>
        <Text
          style={[styles.title, { color: correct ? '#145C35' : '#8F3C0E' }]}
          accessibilityRole="header"
          maxFontSizeMultiplier={1.3}>
          {title}
        </Text>
        {props.kind === 'correct' && props.lokum > 0 ? (
          <Animated.View entering={ZoomIn.delay(150).springify()} style={styles.lokum}>
            <Text style={styles.lokumText}>+{props.lokum} lokum</Text>
          </Animated.View>
        ) : null}
      </View>
      <Text style={[styles.body, { color: correct ? '#1F4A33' : '#5C3311' }]}>{body}</Text>

      {props.kind === 'correct' ? (
        <>
          {props.error ? (
            <Text style={styles.error} accessibilityRole="alert">
              {props.error}
            </Text>
          ) : null}
          <GameButton
            variant="green"
            size="md"
            title={props.continueLabel}
            accessibilityLabel="Devam et"
            loading={props.loading}
            onPress={props.onContinue}
          />
        </>
      ) : (
        <View style={styles.buttons}>
          <GameButton
            variant="white"
            size="md"
            title="Metne bak"
            onPress={props.onShowText}
            style={styles.textButton}
          />
          <GameButton
            variant="orange"
            size="md"
            title="TEKRAR DENE"
            accessibilityLabel="Tekrar dene"
            onPress={props.onRetry}
            style={styles.retryButton}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 22,
    paddingHorizontal: 20,
    gap: 12,
  },
  wrongPanel: {
    backgroundColor: '#FFE9D4',
    boxShadow: '0 -10px 30px rgba(168,78,5,0.15)',
  },
  correctPanel: {
    backgroundColor: '#DDF6E7',
    boxShadow: '0 -10px 30px rgba(30,158,87,0.15)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 22,
    lineHeight: 26,
    color: GameColors.white,
  },
  title: {
    flexShrink: 1,
    fontFamily: GameFonts.headingHeavy,
    fontSize: 24,
    lineHeight: 30,
  },
  lokum: {
    marginLeft: 'auto',
    borderRadius: 999,
    backgroundColor: GameColors.white,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  lokumText: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 14,
    color: '#B23A62',
  },
  body: {
    fontFamily: GameFonts.bodyBold,
    fontSize: 16,
    lineHeight: 23,
  },
  error: {
    fontFamily: GameFonts.bodyBold,
    fontSize: 14,
    color: '#B42318',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  textButton: {
    flex: 1,
  },
  retryButton: {
    flex: 1.4,
  },
});
