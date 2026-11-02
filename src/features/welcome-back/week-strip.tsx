import { StyleSheet, View } from 'react-native';

import { AppText } from '@/design/components/app-text';
import { CheckIcon } from '@/design/icons';
import { colors, radius } from '@/design/tokens';
import type { StatsResponse } from '@/features/game/types';

/** Pazartesiden pazara; `short` sunucunun gün kısaltması (`weekFrom`). */
const DAYS = [
  { short: 'Pzt', initial: 'P', name: 'Pazartesi' },
  { short: 'Sal', initial: 'S', name: 'Salı' },
  { short: 'Çar', initial: 'Ç', name: 'Çarşamba' },
  { short: 'Per', initial: 'P', name: 'Perşembe' },
  { short: 'Cum', initial: 'C', name: 'Cuma' },
  { short: 'Cmt', initial: 'C', name: 'Cumartesi' },
  { short: 'Paz', initial: 'P', name: 'Pazar' },
] as const;

/** 360 dp genişlikte 7 gün halkayla birlikte (32 + 2×4) sığar. */
const CIRCLE = 32;

type DayState = { done: boolean; today: boolean; future: boolean };

/**
 * `stats.week` son 7 günü (bugün sonda) verir. Bu haftanın pazartesisinden bugüne kadarki günler
 * hep bu 7 günün içindedir; bugünden sonrası henüz gelmemiştir.
 */
function weekDays(week: StatsResponse['week']): DayState[] {
  const todayIndex = DAYS.findIndex((day) => day.short === week[week.length - 1]?.day);
  return DAYS.map((_, index) => {
    if (todayIndex < 0 || index > todayIndex) {
      return { done: false, today: false, future: true };
    }
    const entry = week[week.length - 1 - (todayIndex - index)];
    return { done: entry?.done ?? false, today: index === todayIndex, future: false };
  });
}

function dayLabel(name: string, { done, today, future }: DayState) {
  if (future) return `${name}, henüz gelmedi`;
  return `${name}${today ? ', bugün' : ''}, ${done ? 'okundu' : 'okunmadı'}`;
}

/** Haftanın okuma şeridi (17-geri-donus): okunan günler adaçayı daire ve tik, bugün halkalı. */
export function WeekStrip({ week }: { week: StatsResponse['week'] }) {
  const days = weekDays(week);
  return (
    <View style={styles.card}>
      {DAYS.map((day, index) => {
        const state = days[index] as DayState;
        return (
          <View
            key={day.short}
            style={[styles.day, state.future && styles.future]}
            accessible
            accessibilityLabel={dayLabel(day.name, state)}>
            <AppText variant="mapLabel" color={colors.textMuted} maxFontSizeMultiplier={1.3}>
              {day.initial}
            </AppText>
            <View style={[styles.ring, state.today && styles.ringToday]}>
              <View style={[styles.circle, state.done ? styles.done : styles.empty]}>
                {state.done ? (
                  <CheckIcon size={16} color={colors.node.done.icon} strokeWidth={3} />
                ) : null}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.cardLarge,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  future: {
    opacity: 0.45,
  },
  ring: {
    padding: 2,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  ringToday: {
    borderColor: colors.accent,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: {
    backgroundColor: colors.node.done.fill,
  },
  empty: {
    backgroundColor: colors.chip,
  },
});
