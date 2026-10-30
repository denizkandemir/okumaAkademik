import { Screen } from '@/components/screen';
import { JourneyMapPlaceholder } from '@/features/game/journey-map-placeholder';

/** Pasaport sekmesi (21-pasaport). T05'e kadar eski yolculuk haritası yer tutucusunu gösterir. */
export default function PassportScreen() {
  return (
    <Screen withTabBar>
      <JourneyMapPlaceholder />
    </Screen>
  );
}
