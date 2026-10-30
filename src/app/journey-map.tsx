import { Redirect } from 'expo-router';

/** Eski yolculuk haritası adresi: yerini Pasaport sekmesi aldı (docs/tasarim, karar 7). */
export default function JourneyMapRedirect() {
  return <Redirect href="/passport" />;
}
