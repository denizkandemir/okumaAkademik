import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { ConfirmDialog } from '@/design/components/confirm-dialog';
import { Eyebrow } from '@/design/components/eyebrow';
import { IconButton } from '@/design/components/icon-button';
import { ProgressBar } from '@/design/components/progress-bar';
import { SpeechBubble } from '@/design/components/speech-bubble';
import { CloseIcon } from '@/design/icons';
import { colors, screenPadding, size } from '@/design/tokens';
import { Mascot } from '@/features/mascot/mascot';
import type { MascotPose } from '@/features/mascot/types';
import { useHardwareBack } from '@/hooks/use-hardware-back';

/** Egzersizden çıkış: önceki ekrana (Yolculuk), yoksa Yolculuk'a. */
export const leaveExercise = () => (router.canGoBack() ? router.back() : router.replace('/'));

type ExerciseShellProps = {
  /** Üst başlık, ör. "TEKRARLI OKUMA · 2 / 3" */
  eyebrow: string;
  /** Egzersizin ilerlemesi (0-1). */
  progress: number;
  progressLabel: string;
  children: ReactNode;
  /** Kaydırılan içeriğin altında sabit duran alan (ör. ana düğme). */
  footer?: ReactNode;
  /** `false`: kapatma onay sormaz (ör. henüz başlamadıysa). Varsayılan `true`. */
  confirmClose?: boolean;
};

/**
 * Egzersizlerin ortak ekranı: üst çubuk, kapat (onaylı) ve ilerleme çubuğu, kaydırılan içerik ve
 * isteğe bağlı sabit alt alan. Android geri tuşu da kapatma onayını açar.
 */
export function ExerciseShell({
  eyebrow,
  progress,
  progressLabel,
  children,
  footer,
  confirmClose = true,
}: ExerciseShellProps) {
  const insets = useSafeAreaInsets();
  const [confirmLeave, setConfirmLeave] = useState(false);

  const requestClose = () => (confirmClose ? setConfirmLeave(true) : leaveExercise());
  useHardwareBack(() => {
    requestClose();
    return true;
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader profileLink={false} />
      <View style={styles.toolbar}>
        <IconButton accessibilityLabel="Egzersizi kapat" onPress={requestClose}>
          <CloseIcon />
        </IconButton>
        <ProgressBar progress={progress} accessibilityLabel={progressLabel} style={styles.grow} />
      </View>
      <ScrollView
        style={styles.grow}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: footer ? 16 : insets.bottom + 30 },
        ]}>
        <View style={styles.column}>
          <Eyebrow>{eyebrow}</Eyebrow>
          {children}
        </View>
      </ScrollView>
      {footer ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.column}>{footer}</View>
        </View>
      ) : null}

      <ConfirmDialog
        visible={confirmLeave}
        title="Egzersizi bırakmak istiyor musun?"
        message="Bu egzersiz kaydedilmez; sonra yeniden başlayabilirsin."
        stayLabel="DEVAM ET"
        leaveLabel="BIRAK"
        onStay={() => setConfirmLeave(false)}
        onLeave={() => {
          setConfirmLeave(false);
          leaveExercise();
        }}
      />
    </View>
  );
}

/** Pırıl ve konuşma balonu: egzersizin talimatı ve kısa yönlendirmeler. */
export function PirilHelper({ text, pose = 'talk' }: { text: string; pose?: MascotPose }) {
  return (
    <View style={styles.helper}>
      <Mascot pose={pose} size={84} decorative />
      <SpeechBubble text={text} tail="left" style={styles.bubble} />
    </View>
  );
}

/** Egzersiz metninin başlığı ve soluk açıklaması. */
export function ExerciseHeading({ title, note }: { title: string; note?: string }) {
  return (
    <View style={styles.heading}>
      <AppText variant="title" accessibilityRole="header">
        {title}
      </AppText>
      {note ? (
        <AppText variant="secondary" color={colors.textMuted}>
          {note}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  grow: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: screenPadding,
    paddingTop: 16,
    paddingBottom: 12,
  },
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: 8,
  },
  column: {
    width: '100%',
    maxWidth: size.maxContentWidth,
    alignSelf: 'center',
    gap: 14,
  },
  footer: {
    paddingHorizontal: screenPadding,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  helper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bubble: {
    flex: 1,
  },
  heading: {
    gap: 4,
  },
});
