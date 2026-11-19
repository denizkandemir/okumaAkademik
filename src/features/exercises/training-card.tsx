import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { Eyebrow } from '@/design/components/eyebrow';
import { CheckIcon } from '@/design/icons';
import { colors, radius, screenPadding, size } from '@/design/tokens';
import { EXERCISE_INFO, exerciseTitle } from '@/features/exercises/exercise-info';
import type { TrainingResponse } from '@/features/exercises/types';
import { Mascot } from '@/features/mascot/mascot';
import { useApiQuery } from '@/hooks/use-api-query';

type TrainingCardProps = {
  /** Harita kaydırılınca kart tek satırlık bir hapa küçülür. */
  collapsed: boolean;
  onExpand: () => void;
};

/**
 * "Bugünün antrenmanı" (A1a): bölüm çubuğu ile harita arasında, 1-3 egzersiz, ikonları ve
 * dakikalarıyla; BAŞLA sıradaki bitmemiş egzersizi açar. Hepsi bitince Pırıl sevinir. Harita
 * kaydırılınca hapa küçülür; ders yolunu kapatmaz. Yüklenemezse hiç görünmez.
 */
export function TrainingCard({ collapsed, onExpand }: TrainingCardProps) {
  const { data } = useApiQuery<TrainingResponse>('/me/training/today', { refetchOnFocus: true });
  if (!data || data.items.length === 0) return null;

  const doneCount = data.items.filter((item) => item.done).length;
  const next = data.items.find((item) => !item.done);
  const open = () => {
    if (next) router.push({ pathname: '/exercise/[itemId]', params: { itemId: next.itemId } });
  };

  if (collapsed) {
    const label = data.done
      ? 'Bugünkü antrenman tamam'
      : `Bugünün antrenmanı: ${data.items.length} egzersizden ${doneCount} tanesi bitti`;
    return (
      <View style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label}. Kartı aç`}
          onPress={onExpand}
          hitSlop={6}
          style={({ pressed }) => [styles.chip, pressed && styles.pressed]}>
          {data.done ? <CheckIcon size={16} color={colors.node.done.lip} /> : null}
          <AppText variant="mapLabel" color={colors.accent}>
            {data.done ? 'Antrenman tamam' : `Antrenman · ${doneCount}/${data.items.length}`}
          </AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.bar}>
      <View style={styles.card}>
        {data.done ? (
          <View style={styles.doneRow} accessible accessibilityLabel="Bugünkü antrenman tamam!">
            <Mascot pose="happy" size={56} decorative />
            <View style={styles.grow}>
              <Eyebrow>BUGÜNÜN ANTRENMANI</Eyebrow>
              <AppText variant="heading">Bugünkü antrenman tamam!</AppText>
            </View>
          </View>
        ) : (
          <View style={styles.row}>
            <View style={styles.grow}>
              <Eyebrow>Bugünün antrenmanı · {data.totalMinutes} dk</Eyebrow>
              {data.items.map((item) => {
                const color = item.done ? colors.node.done.lip : colors.accent;
                return (
                  <View
                    key={item.itemId}
                    style={styles.item}
                    accessible
                    accessibilityLabel={`${exerciseTitle(item.type)}, ${item.minutes} dakika${item.done ? ', bitti' : ''}`}>
                    <View style={styles.icon}>
                      {item.done ? (
                        <CheckIcon size={18} color={color} />
                      ) : (
                        EXERCISE_INFO[item.type]?.icon(color)
                      )}
                    </View>
                    <AppText
                      variant="bodyStrong"
                      color={item.done ? colors.textMuted : colors.text}
                      style={item.done && styles.doneText}>
                      {exerciseTitle(item.type)}
                    </AppText>
                    <AppText variant="secondary" color={colors.textMuted}>
                      {item.minutes} dk
                    </AppText>
                  </View>
                );
              })}
            </View>
            <Button
              title="BAŞLA"
              accessibilityLabel={`Başla: ${next ? exerciseTitle(next.type) : ''}`}
              fullWidth={false}
              onPress={open}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: screenPadding,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  card: {
    width: '100%',
    maxWidth: size.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  grow: {
    flex: 1,
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 22,
    alignItems: 'center',
  },
  doneText: {
    textDecorationLine: 'line-through',
  },
  chip: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: size.touch - 12,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.bubble.background,
    borderWidth: 1,
    borderColor: colors.bubble.border,
  },
  pressed: {
    opacity: 0.8,
  },
});
