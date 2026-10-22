import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { clearReward, useReward } from '@/features/game/reward-store';
import { LessonCompleteView } from '@/features/game/rewards/lesson-complete-view';

/** Pırıl'ın notu yoksa (ör. son soru açıklamasız) gösterilen genel cümle. */
const GENERIC_NOTE = "Her hikâye beni Van'a biraz daha yaklaştırıyor. Teşekkür ederim!";

/** Ders tamamlandı (S08Tamamlandi). Veriyi ödül deposundan okur; yoksa ana sayfaya döner. */
export default function LessonCompleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const reward = useReward();

  if (!reward || reward.lessonId !== id) return <Redirect href="/" />;
  const { result } = reward;

  const finish = () => {
    clearReward();
    router.dismissTo('/');
  };

  return (
    <LessonCompleteView
      title={reward.lessonTitle}
      durationSeconds={result.durationSeconds}
      // Ödül yalnızca ilk tamamlanışta: tekrar okumada lokum gösterilmez.
      lokum={result.firstTime ? result.lokum.lesson : null}
      correct={result.firstTryCorrect != null ? { count: result.firstTryCorrect, total: 3 } : null}
      stars={result.stars}
      note={reward.note ?? GENERIC_NOTE}
      onContinue={finish}
    />
  );
}
