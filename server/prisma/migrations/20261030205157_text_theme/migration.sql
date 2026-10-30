-- texts.theme: hikâyenin teması (haritada, okuma ekranında ve kitaplıkta etiket).
-- Elle düzenlendi: Prisma kolonu doğrudan NOT NULL eklemeye çalışırdı. Burada kolon önce boş
-- eklenir, mevcut 48 metin seed verisindeki eşlemeyle (prisma/seed-data/*.ts) doldurulur, sonra
-- NOT NULL yapılır. Boş bir veritabanında migration seed'den önce çalışır; UPDATE'ler satır bulmaz.

CREATE TYPE "text_theme" AS ENUM ('ARKADASLIK', 'MERAK', 'KESIF', 'PAYLASMAK', 'CESARET', 'YARDIMLASMA', 'SABIR', 'DOGA', 'AILE', 'HATIRALAR', 'SORUMLULUK', 'IYILIK');

ALTER TABLE "texts" ADD COLUMN "theme" "text_theme";

UPDATE "texts" SET "theme" = 'ARKADASLIK' WHERE "id" IN (
  'pirilin-istanbul-arkadaslari',
  'piril-ve-balonlar'
);
UPDATE "texts" SET "theme" = 'MERAK' WHERE "id" IN (
  'kiz-kulesinin-isiklari',
  'saat-kulesinin-guvercinleri',
  'pirilin-korfez-yolculugu',
  'celsus-kutuphanesinde',
  'piril-ve-ressam',
  'perilerin-bacalari'
);
UPDATE "texts" SET "theme" = 'KESIF' WHERE "id" IN (
  'galatadan-bakinca',
  'boyoz-sabahi',
  'kemeraltinin-kokulari',
  'tiyatroda-bir-fisilti',
  'fircali-kazi',
  'kaleicinde-ipucu-avi',
  'guletle-mavi-yolculuk',
  'bir-gunde-kar-ve-deniz',
  'yerin-altindaki-sehir',
  'gokyuzundeki-haritalar',
  'akdamarin-badem-agaclari'
);
UPDATE "texts" SET "theme" = 'PAYLASMAK' WHERE "id" IN (
  'vapurda-simit',
  'portakal-bahcesi'
);
UPDATE "texts" SET "theme" = 'CESARET' WHERE "id" IN (
  'kordonda-bisiklet',
  'ucan-balon',
  'magara-evde-bir-gece'
);
UPDATE "texts" SET "theme" = 'YARDIMLASMA' WHERE "id" IN (
  'minik-serce',
  'kordonun-martisi'
);
UPDATE "texts" SET "theme" = 'SABIR' WHERE "id" IN (
  'bahcedeki-domatesler',
  'ucurtma-ve-imbat',
  'minik-taslardan-resim',
  'avanosta-comlek'
);
UPDATE "texts" SET "theme" = 'DOGA' WHERE "id" IN (
  'kaybolan-liman',
  'denize-dokulen-selale',
  'ay-isiginda-yolculuk',
  'guvercinlerin-evleri',
  'van-golunun-sirri',
  'inci-kefalinin-yolculugu'
);
UPDATE "texts" SET "theme" = 'AILE' WHERE "id" IN (
  'iki-yakayi-baglayan-kopru',
  'tabak-tabak-van-kahvaltisi',
  'ninemin-kilimi',
  'eve-donus'
);
UPDATE "texts" SET "theme" = 'HATIRALAR' WHERE "id" IN (
  'tasa-yazilmis-mesaj',
  'piril-ve-efesin-kedileri',
  'van-kalesinde-gun-batimi'
);
UPDATE "texts" SET "theme" = 'SORUMLULUK' WHERE "id" IN (
  'kapalicarsida-bir-gun',
  'kayip-anahtar',
  'deniz-feneri',
  'kedilerin-evinde'
);
UPDATE "texts" SET "theme" = 'IYILIK' WHERE "id" IN (
  'tramvayda-bir-yer'
);

ALTER TABLE "texts" ALTER COLUMN "theme" SET NOT NULL;

COMMENT ON TYPE "text_theme" IS 'Hikâyenin teması. API''de Türkçe adıyla döner: ARKADASLIK (Arkadaşlık), MERAK (Merak), KESIF (Keşif), PAYLASMAK (Paylaşmak), CESARET (Cesaret), YARDIMLASMA (Yardımlaşma), SABIR (Sabır), DOGA (Doğa), AILE (Aile), HATIRALAR (Hatıralar), SORUMLULUK (Sorumluluk), IYILIK (İyilik)';
COMMENT ON COLUMN "texts"."theme" IS 'Hikâyenin teması, ör. ARKADASLIK';
