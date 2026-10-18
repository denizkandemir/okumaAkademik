import AppTabs from '@/components/app-tabs';
import { CurrentCityProvider } from '@/features/game/current-city';

export default function TabLayout() {
  return (
    <CurrentCityProvider>
      <AppTabs />
    </CurrentCityProvider>
  );
}
