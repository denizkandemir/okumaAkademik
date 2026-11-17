/** Doğru cevabın dayanağı: metinden birebir alıntı ya da (ana fikir, başlık gibi) kısa gerekçe. */
export type Evidence = { quote: string } | { reason: string };

export const quote = (text: string): Evidence => ({ quote: text });
export const reason = (text: string): Evidence => ({ reason: text });

/** Bir şehrin onay belgesine özel, seed verisinden çıkarılamayan kısmı. */
export type CityNotes = {
  /** Öğretmenin özellikle bakmasını istediğimiz noktalar */
  reviewPoints: string[];
  /** Metin kimliği → soru sırasıyla kanıtlar */
  evidence: Record<string, Evidence[]>;
};
