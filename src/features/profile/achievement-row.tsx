import { RewardRow } from '@/design/components/reward-row';
import { AwardIcon, BookIcon, FlameIcon, MapIcon, StarIcon } from '@/design/icons';
import { colors } from '@/design/tokens';
import type { StatsResponse } from '@/features/game/types';

export type Achievement = StatsResponse['achievements'][number];

/** Kazanılanlar önce; her grubun içinde sunucunun sırası korunur. */
export function sortAchievements(achievements: Achievement[]): Achievement[] {
  return [...achievements].sort((a, b) => Number(b.earned) - Number(a.earned));
}

function AchievementIcon({ id, earned }: { id: string; earned: boolean }) {
  const color = earned ? colors.rewardRow.icon : colors.rewardRow.iconMuted;
  switch (id) {
    case 'ilk-hikaye':
    case 'hikaye-10':
      return <BookIcon color={color} />;
    case 'seri-7':
      return <FlameIcon size={22} color={earned ? colors.flame : color} />;
    case 'uc-yildiz-5':
      return <StarIcon size={22} color={color} stroke={color} />;
    case 'yeni-sehir':
      return <MapIcon color={color} />;
    default:
      return <AwardIcon color={color} />;
  }
}

/**
 * Küçük başarı satırı: kazanıldıysa açıklama, değilse ilerleme ("3 / 10 hikâye"). Kazanılmamışın
 * ikonu soluk; yazılar her durumda tam kontrastlı.
 */
export function AchievementRow({ achievement }: { achievement: Achievement }) {
  const { id, title, description, earned, progress } = achievement;
  const subtitle = earned
    ? description
    : `${progress.current} / ${progress.target} ${progress.unit}`;

  return (
    <RewardRow
      icon={<AchievementIcon id={id} earned={earned} />}
      title={title}
      subtitle={subtitle}
      accessibilityLabel={`${title}. ${earned ? 'Kazanıldı' : `Henüz kazanılmadı, ${subtitle}`}. ${description}.`}
    />
  );
}
