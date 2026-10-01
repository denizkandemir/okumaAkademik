import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';

export default function HomeScreen() {
  return (
    <Screen withTabBar>
      <ThemedText type="title">Ana Sayfa</ThemedText>
    </Screen>
  );
}
