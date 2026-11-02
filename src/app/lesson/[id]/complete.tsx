import { Redirect, useLocalSearchParams } from 'expo-router';

import { continueRewardFlow, nextRewardStep } from '@/features/game/reward-flow';
import { useReward } from '@/features/game/reward-store';
import {
  LessonResultView,
  formatDuration,
  type ResultTile,
} from '@/features/game/rewards/lesson-result-view';
import { useHardwareBack } from '@/hooks/use-hardware-back';

/** Ders sonucu (12-ders-sonucu). Veriyi ödül deposundan okur; yoksa ana sayfaya döner. */
export default function LessonCompleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const reward = useReward();
  // Android geri tuşu ana düğmeyle aynı: seviye/şehir/final ekranları atlanmasın.
  useHardwareBack(() => {
    if (!reward || reward.lessonId !== id) return false;
    continueRewardFlow('complete', reward);
    return true;
  });

  if (!reward || reward.lessonId !== id) return <Redirect href="/" />;
  const { result } = reward;
  const best = reward.bestStars ?? result.stars ?? 0;

  const tiles: ResultTile[] = [];
  // Ödül yalnızca ilk tamamlanışta verilir; tekrar okumada en iyi sonuç gösterilir.
  if (result.firstTime) tiles.push({ value: `+${result.lokum.lesson}`, label: 'lokum' });
  else tiles.push({ value: `${best}/3`, label: 'en iyi yıldız' });
  if (result.firstTryCorrect != null) {
    tiles.push({ value: `${result.firstTryCorrect}/3`, label: 'ilk denemede doğru' });
  }
  if (result.durationSeconds != null) {
    tiles.push({ value: formatDuration(result.durationSeconds), label: 'okuma süresi' });
  }

  // Sırada seviye, şehir ya da final varsa yalnız "ÖDÜLÜMÜ GÖR": ödül yanlışlıkla atlanmasın.
  const hasNext = nextRewardStep('complete', reward) !== null;

  return (
    <LessonResultView
      storyTitle={reward.lessonTitle}
      heading={result.firstTime ? 'Hikâyeye iz bıraktın!' : 'Yeniden okudun!'}
      stars={result.stars}
      tiles={tiles}
      buttonTitle={hasNext ? 'ÖDÜLÜMÜ GÖR' : 'HARİTAYA DÖN'}
      buttonLabel={hasNext ? 'Ödülümü gör' : 'Haritaya dön'}
      onContinue={() => continueRewardFlow('complete', reward)}
    />
  );
}
