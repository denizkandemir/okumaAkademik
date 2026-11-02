-- Soru etiketleri (A0): tür (Q1-Q13), bilişsel düzey ve isteğe bağlı MEB kazanım kodu; şık
-- sayısı 3-4'e gevşer. SQL `prisma migrate diff` ile üretildi, elle düzenlendi: kolonlar önce boş
-- eklenir, mevcut 144 soru seed verisindeki etiketlerle (prisma/seed-data/*.ts; sorular tek tek
-- okunarak etiketlendi) (text_id, position) üzerinden doldurulur, sonra NOT NULL yapılır. Boş bir
-- veritabanında migration seed'den önce çalışır; UPDATE satır bulmaz. Eşleme seed ile aynı olmalı
-- (test/seed-data.test.ts kontrol eder).

-- CreateEnum
CREATE TYPE "question_type" AS ENUM ('BILGI', 'SIRALAMA', 'SOZCUK_ANLAMI', 'NEDEN_SONUC', 'DUYGU_KARAKTER', 'ANA_FIKIR', 'YARDIMCI_FIKIR', 'BASLIK', 'CUMLEDE_ANLAM', 'PARAGRAF_YAPISI', 'SOZEL_MANTIK', 'GORSEL_OKUMA', 'ONCULLU_YORUM');

-- CreateEnum
CREATE TYPE "cognitive_level" AS ENUM ('HATIRLAMA', 'ANLAMA', 'CIKARIM', 'DEGERLENDIRME');

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "cognitive_level" "cognitive_level",
ADD COLUMN     "meb_outcome_code" TEXT,
ADD COLUMN     "type" "question_type";

UPDATE "questions" q
SET "type" = v."type"::"question_type", "cognitive_level" = v."cognitive_level"::"cognitive_level"
FROM (VALUES
  ('vapurda-simit', 1, 'BILGI', 'HATIRLAMA'),
  ('vapurda-simit', 2, 'SOZCUK_ANLAMI', 'ANLAMA'),
  ('vapurda-simit', 3, 'DUYGU_KARAKTER', 'ANLAMA'),
  ('bahcedeki-domatesler', 1, 'BILGI', 'HATIRLAMA'),
  ('bahcedeki-domatesler', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('bahcedeki-domatesler', 3, 'NEDEN_SONUC', 'CIKARIM'),
  ('minik-serce', 1, 'BILGI', 'HATIRLAMA'),
  ('minik-serce', 2, 'BILGI', 'HATIRLAMA'),
  ('minik-serce', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('kiz-kulesinin-isiklari', 1, 'BILGI', 'HATIRLAMA'),
  ('kiz-kulesinin-isiklari', 2, 'CUMLEDE_ANLAM', 'ANLAMA'),
  ('kiz-kulesinin-isiklari', 3, 'NEDEN_SONUC', 'CIKARIM'),
  ('galatadan-bakinca', 1, 'BILGI', 'HATIRLAMA'),
  ('galatadan-bakinca', 2, 'NEDEN_SONUC', 'CIKARIM'),
  ('galatadan-bakinca', 3, 'DUYGU_KARAKTER', 'ANLAMA'),
  ('kapalicarsida-bir-gun', 1, 'BILGI', 'HATIRLAMA'),
  ('kapalicarsida-bir-gun', 2, 'CUMLEDE_ANLAM', 'CIKARIM'),
  ('kapalicarsida-bir-gun', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('iki-yakayi-baglayan-kopru', 1, 'BILGI', 'HATIRLAMA'),
  ('iki-yakayi-baglayan-kopru', 2, 'BILGI', 'HATIRLAMA'),
  ('iki-yakayi-baglayan-kopru', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('pirilin-istanbul-arkadaslari', 1, 'BILGI', 'HATIRLAMA'),
  ('pirilin-istanbul-arkadaslari', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('pirilin-istanbul-arkadaslari', 3, 'DUYGU_KARAKTER', 'CIKARIM'),
  ('saat-kulesinin-guvercinleri', 1, 'BILGI', 'HATIRLAMA'),
  ('saat-kulesinin-guvercinleri', 2, 'SOZEL_MANTIK', 'CIKARIM'),
  ('saat-kulesinin-guvercinleri', 3, 'DUYGU_KARAKTER', 'ANLAMA'),
  ('boyoz-sabahi', 1, 'BILGI', 'HATIRLAMA'),
  ('boyoz-sabahi', 2, 'SOZCUK_ANLAMI', 'ANLAMA'),
  ('boyoz-sabahi', 3, 'NEDEN_SONUC', 'CIKARIM'),
  ('kordonda-bisiklet', 1, 'BILGI', 'HATIRLAMA'),
  ('kordonda-bisiklet', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('kordonda-bisiklet', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('kemeraltinin-kokulari', 1, 'BILGI', 'HATIRLAMA'),
  ('kemeraltinin-kokulari', 2, 'SOZCUK_ANLAMI', 'ANLAMA'),
  ('kemeraltinin-kokulari', 3, 'DUYGU_KARAKTER', 'ANLAMA'),
  ('ucurtma-ve-imbat', 1, 'BILGI', 'HATIRLAMA'),
  ('ucurtma-ve-imbat', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('ucurtma-ve-imbat', 3, 'BILGI', 'ANLAMA'),
  ('tramvayda-bir-yer', 1, 'BILGI', 'HATIRLAMA'),
  ('tramvayda-bir-yer', 2, 'SOZCUK_ANLAMI', 'ANLAMA'),
  ('tramvayda-bir-yer', 3, 'NEDEN_SONUC', 'CIKARIM'),
  ('kordonun-martisi', 1, 'NEDEN_SONUC', 'ANLAMA'),
  ('kordonun-martisi', 2, 'NEDEN_SONUC', 'CIKARIM'),
  ('kordonun-martisi', 3, 'BILGI', 'HATIRLAMA'),
  ('pirilin-korfez-yolculugu', 1, 'BILGI', 'HATIRLAMA'),
  ('pirilin-korfez-yolculugu', 2, 'CUMLEDE_ANLAM', 'CIKARIM'),
  ('pirilin-korfez-yolculugu', 3, 'NEDEN_SONUC', 'CIKARIM'),
  ('celsus-kutuphanesinde', 1, 'BILGI', 'HATIRLAMA'),
  ('celsus-kutuphanesinde', 2, 'SOZCUK_ANLAMI', 'ANLAMA'),
  ('celsus-kutuphanesinde', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('tiyatroda-bir-fisilti', 1, 'BILGI', 'HATIRLAMA'),
  ('tiyatroda-bir-fisilti', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('tiyatroda-bir-fisilti', 3, 'DUYGU_KARAKTER', 'CIKARIM'),
  ('kayip-anahtar', 1, 'BILGI', 'HATIRLAMA'),
  ('kayip-anahtar', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('kayip-anahtar', 3, 'BILGI', 'HATIRLAMA'),
  ('minik-taslardan-resim', 1, 'BILGI', 'HATIRLAMA'),
  ('minik-taslardan-resim', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('minik-taslardan-resim', 3, 'DUYGU_KARAKTER', 'ANLAMA'),
  ('fircali-kazi', 1, 'BILGI', 'HATIRLAMA'),
  ('fircali-kazi', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('fircali-kazi', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('tasa-yazilmis-mesaj', 1, 'BILGI', 'HATIRLAMA'),
  ('tasa-yazilmis-mesaj', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('tasa-yazilmis-mesaj', 3, 'DUYGU_KARAKTER', 'CIKARIM'),
  ('kaybolan-liman', 1, 'BILGI', 'HATIRLAMA'),
  ('kaybolan-liman', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('kaybolan-liman', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('piril-ve-efesin-kedileri', 1, 'BILGI', 'HATIRLAMA'),
  ('piril-ve-efesin-kedileri', 2, 'SOZCUK_ANLAMI', 'ANLAMA'),
  ('piril-ve-efesin-kedileri', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('kaleicinde-ipucu-avi', 1, 'BILGI', 'HATIRLAMA'),
  ('kaleicinde-ipucu-avi', 2, 'SOZCUK_ANLAMI', 'ANLAMA'),
  ('kaleicinde-ipucu-avi', 3, 'DUYGU_KARAKTER', 'ANLAMA'),
  ('guletle-mavi-yolculuk', 1, 'BILGI', 'HATIRLAMA'),
  ('guletle-mavi-yolculuk', 2, 'NEDEN_SONUC', 'CIKARIM'),
  ('guletle-mavi-yolculuk', 3, 'DUYGU_KARAKTER', 'ANLAMA'),
  ('denize-dokulen-selale', 1, 'BILGI', 'HATIRLAMA'),
  ('denize-dokulen-selale', 2, 'CUMLEDE_ANLAM', 'ANLAMA'),
  ('denize-dokulen-selale', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('portakal-bahcesi', 1, 'BILGI', 'HATIRLAMA'),
  ('portakal-bahcesi', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('portakal-bahcesi', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('ay-isiginda-yolculuk', 1, 'BILGI', 'HATIRLAMA'),
  ('ay-isiginda-yolculuk', 2, 'NEDEN_SONUC', 'CIKARIM'),
  ('ay-isiginda-yolculuk', 3, 'NEDEN_SONUC', 'DEGERLENDIRME'),
  ('deniz-feneri', 1, 'BILGI', 'HATIRLAMA'),
  ('deniz-feneri', 2, 'CUMLEDE_ANLAM', 'ANLAMA'),
  ('deniz-feneri', 3, 'NEDEN_SONUC', 'ANLAMA'),
  ('bir-gunde-kar-ve-deniz', 1, 'BILGI', 'HATIRLAMA'),
  ('bir-gunde-kar-ve-deniz', 2, 'NEDEN_SONUC', 'CIKARIM'),
  ('bir-gunde-kar-ve-deniz', 3, 'NEDEN_SONUC', 'CIKARIM'),
  ('piril-ve-ressam', 1, 'BILGI', 'HATIRLAMA'),
  ('piril-ve-ressam', 2, 'SOZCUK_ANLAMI', 'ANLAMA'),
  ('piril-ve-ressam', 3, 'DUYGU_KARAKTER', 'CIKARIM'),
  ('perilerin-bacalari', 1, 'BILGI', 'HATIRLAMA'),
  ('perilerin-bacalari', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('perilerin-bacalari', 3, 'CUMLEDE_ANLAM', 'CIKARIM'),
  ('ucan-balon', 1, 'BILGI', 'HATIRLAMA'),
  ('ucan-balon', 2, 'DUYGU_KARAKTER', 'CIKARIM'),
  ('ucan-balon', 3, 'DUYGU_KARAKTER', 'CIKARIM'),
  ('yerin-altindaki-sehir', 1, 'BILGI', 'HATIRLAMA'),
  ('yerin-altindaki-sehir', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('yerin-altindaki-sehir', 3, 'DUYGU_KARAKTER', 'CIKARIM'),
  ('avanosta-comlek', 1, 'BILGI', 'HATIRLAMA'),
  ('avanosta-comlek', 2, 'SOZCUK_ANLAMI', 'ANLAMA'),
  ('avanosta-comlek', 3, 'BILGI', 'ANLAMA'),
  ('guvercinlerin-evleri', 1, 'BILGI', 'HATIRLAMA'),
  ('guvercinlerin-evleri', 2, 'NEDEN_SONUC', 'CIKARIM'),
  ('guvercinlerin-evleri', 3, 'NEDEN_SONUC', 'CIKARIM'),
  ('gokyuzundeki-haritalar', 1, 'BILGI', 'HATIRLAMA'),
  ('gokyuzundeki-haritalar', 2, 'SOZCUK_ANLAMI', 'ANLAMA'),
  ('gokyuzundeki-haritalar', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('magara-evde-bir-gece', 1, 'BILGI', 'HATIRLAMA'),
  ('magara-evde-bir-gece', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('magara-evde-bir-gece', 3, 'DUYGU_KARAKTER', 'ANLAMA'),
  ('piril-ve-balonlar', 1, 'BILGI', 'HATIRLAMA'),
  ('piril-ve-balonlar', 2, 'NEDEN_SONUC', 'CIKARIM'),
  ('piril-ve-balonlar', 3, 'DUYGU_KARAKTER', 'ANLAMA'),
  ('van-golunun-sirri', 1, 'BILGI', 'HATIRLAMA'),
  ('van-golunun-sirri', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('van-golunun-sirri', 3, 'DUYGU_KARAKTER', 'CIKARIM'),
  ('akdamarin-badem-agaclari', 1, 'BILGI', 'HATIRLAMA'),
  ('akdamarin-badem-agaclari', 2, 'CUMLEDE_ANLAM', 'ANLAMA'),
  ('akdamarin-badem-agaclari', 3, 'BILGI', 'ANLAMA'),
  ('van-kalesinde-gun-batimi', 1, 'BILGI', 'HATIRLAMA'),
  ('van-kalesinde-gun-batimi', 2, 'NEDEN_SONUC', 'CIKARIM'),
  ('van-kalesinde-gun-batimi', 3, 'BILGI', 'ANLAMA'),
  ('tabak-tabak-van-kahvaltisi', 1, 'BILGI', 'HATIRLAMA'),
  ('tabak-tabak-van-kahvaltisi', 2, 'SOZCUK_ANLAMI', 'ANLAMA'),
  ('tabak-tabak-van-kahvaltisi', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('inci-kefalinin-yolculugu', 1, 'BILGI', 'HATIRLAMA'),
  ('inci-kefalinin-yolculugu', 2, 'NEDEN_SONUC', 'ANLAMA'),
  ('inci-kefalinin-yolculugu', 3, 'ANA_FIKIR', 'CIKARIM'),
  ('kedilerin-evinde', 1, 'BILGI', 'HATIRLAMA'),
  ('kedilerin-evinde', 2, 'NEDEN_SONUC', 'CIKARIM'),
  ('kedilerin-evinde', 3, 'BILGI', 'ANLAMA'),
  ('ninemin-kilimi', 1, 'BILGI', 'HATIRLAMA'),
  ('ninemin-kilimi', 2, 'NEDEN_SONUC', 'CIKARIM'),
  ('ninemin-kilimi', 3, 'DUYGU_KARAKTER', 'ANLAMA'),
  ('eve-donus', 1, 'BILGI', 'HATIRLAMA'),
  ('eve-donus', 2, 'NEDEN_SONUC', 'CIKARIM'),
  ('eve-donus', 3, 'BILGI', 'HATIRLAMA')
) AS v ("text_id", "position", "type", "cognitive_level")
WHERE q."text_id" = v."text_id" AND q."position" = v."position";

ALTER TABLE "questions" ALTER COLUMN "type" SET NOT NULL;
ALTER TABLE "questions" ALTER COLUMN "cognitive_level" SET NOT NULL;

-- Şık sayısı 3-4; doğru şık ve seçilen şık şık sayısının içinde.
ALTER TABLE "questions" DROP CONSTRAINT "questions_options_count_check";
ALTER TABLE "questions" DROP CONSTRAINT "questions_correct_index_range_check";
ALTER TABLE "questions" ADD CONSTRAINT "questions_options_count_check" CHECK ("options" IS NOT NULL AND cardinality("options") BETWEEN 3 AND 4);
ALTER TABLE "questions" ADD CONSTRAINT "questions_correct_index_range_check" CHECK ("correct_index" >= 0 AND "correct_index" < cardinality("options"));
ALTER TABLE "question_attempts" DROP CONSTRAINT "question_attempts_choice_index_range_check";
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_choice_index_range_check" CHECK ("choice_index" BETWEEN 0 AND 3);
ALTER TABLE "questions" ADD CONSTRAINT "questions_meb_outcome_code_check" CHECK ("meb_outcome_code" IS NULL OR length(trim("meb_outcome_code")) > 0);

COMMENT ON TYPE "question_type" IS 'Soru türü Q1-Q13 (docs/yapay-zeka/02-egzersiz-katalogu.md §3)';
COMMENT ON TYPE "cognitive_level" IS 'Bilişsel düzey: hatırlama, anlama, çıkarım, değerlendirme';
COMMENT ON TABLE "questions" IS 'Bir metnin anlama sorusu. Her hikâyenin 3 sorusu vardır; her sorunun 3-4 şıkkı ve 1 doğru cevabı.';
COMMENT ON COLUMN "questions"."options" IS '3 ya da 4 şık, ekrandaki sırasıyla (A, B, C, D)';
COMMENT ON COLUMN "questions"."correct_index" IS 'Doğru şıkkın sırası (0''dan başlar, şık sayısından küçük); istemciye gönderilmez';
COMMENT ON COLUMN "questions"."type" IS 'Soru türü, ör. BILGI';
COMMENT ON COLUMN "questions"."cognitive_level" IS 'Bilişsel düzey, ör. HATIRLAMA';
COMMENT ON COLUMN "questions"."meb_outcome_code" IS 'MEB Türkçe dersi öğretim programı kazanım kodu (varsa)';
COMMENT ON COLUMN "question_attempts"."choice_index" IS 'Seçilen şık (0-3)';
COMMENT ON CONSTRAINT "questions_options_count_check" ON "questions" IS '3 ya da 4 şık olmalı';
COMMENT ON CONSTRAINT "questions_correct_index_range_check" ON "questions" IS 'Doğru şık, şıklardan biri olmalı';
COMMENT ON CONSTRAINT "question_attempts_choice_index_range_check" ON "question_attempts" IS 'Seçilen şık 0-3 arasında olmalı';
COMMENT ON CONSTRAINT "questions_meb_outcome_code_check" ON "questions" IS 'Kazanım kodu boş metin olamaz';
