-- Egzersiz motoru (A1a): egzersiz türleri, içerik örnekleri (exercise_items) ve egzersiz oturumları
-- (exercise_sessions). Tablo SQL'i `prisma migrate diff` ile üretildi; CHECK kısıtları ve açıklamalar
-- elle eklendi. Lokum bağlantısı ve görünümler sonraki migration'dadır: yeni `lokum_reason` değeri
-- (EXERCISE) aynı işlemde kullanılamaz.

-- CreateEnum
CREATE TYPE "exercise_type" AS ENUM ('TEKRARLI_OKUMA', 'DINLE_SONRA_OKU', 'DINLERKEN_OKU', 'OBEK_OKUMA', 'HIZLI_KELIME', 'PIRIL_ISIGI', 'KOK_EK', 'ANLAMA_STRATEJI', 'LGS_PARAGRAF', 'GORSEL_OKUMA', 'HECE_TOPU');

-- CreateEnum
CREATE TYPE "content_status" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "content_source" AS ENUM ('SEED', 'AI');

-- AlterEnum
ALTER TYPE "lokum_reason" ADD VALUE 'EXERCISE';

-- CreateTable
CREATE TABLE "exercise_items" (
    "id" TEXT NOT NULL,
    "type" "exercise_type" NOT NULL,
    "grade_band" "grade_band" NOT NULL,
    "text_id" TEXT,
    "params" JSONB NOT NULL,
    "data" JSONB NOT NULL,
    "status" "content_status" NOT NULL DEFAULT 'DRAFT',
    "source" "content_source" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "params_used" JSONB NOT NULL,
    "started_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMPTZ(3),
    "duration_seconds" INTEGER NOT NULL DEFAULT 0,
    "wpm_first" DOUBLE PRECISION,
    "wpm_last" DOUBLE PRECISION,
    "comprehension" DOUBLE PRECISION,
    "score" DOUBLE PRECISION,
    "details" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "exercise_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exercise_items_type_grade_band_status_idx" ON "exercise_items"("type", "grade_band", "status");

-- CreateIndex
CREATE INDEX "exercise_sessions_user_id_started_at_idx" ON "exercise_sessions"("user_id", "started_at");

-- AddForeignKey
ALTER TABLE "exercise_items" ADD CONSTRAINT "exercise_items_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "texts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "exercise_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "exercise_items" ADD CONSTRAINT "exercise_items_params_object_check" CHECK (jsonb_typeof("params") = 'object');
ALTER TABLE "exercise_items" ADD CONSTRAINT "exercise_items_data_object_check" CHECK (jsonb_typeof("data") = 'object');
ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_duration_check" CHECK ("duration_seconds" >= 0);
ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_wpm_check" CHECK (
  ("wpm_first" IS NULL OR "wpm_first" > 0) AND ("wpm_last" IS NULL OR "wpm_last" > 0)
);
ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_comprehension_check" CHECK ("comprehension" BETWEEN 0 AND 1);
ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_finished_at_check" CHECK ("finished_at" >= "started_at");

COMMENT ON TYPE "exercise_type" IS 'Egzersiz türü (02-egzersiz-katalogu.md): E1 TEKRARLI_OKUMA, E2 DINLE_SONRA_OKU, E3 DINLERKEN_OKU, E4 OBEK_OKUMA, E5 HIZLI_KELIME, E6 PIRIL_ISIGI, E7 KOK_EK, E8 ANLAMA_STRATEJI, E9 LGS_PARAGRAF, E10 GORSEL_OKUMA, E11 HECE_TOPU';
COMMENT ON TYPE "content_status" IS 'İçeriğin onay durumu: DRAFT, REVIEW, APPROVED (çocuklara yalnızca bu gösterilir), REJECTED';
COMMENT ON TYPE "content_source" IS 'İçeriğin kaynağı: SEED (mevcut metinlerden), AI (yapay zekâ)';

COMMENT ON TABLE "exercise_items" IS 'Bir egzersiz örneği (içerik): türü, sınıf grubu, ayarları ve türüne özel verisi. Ayar ve veri biçimleri türe göre zod ile doğrulanır (src/modules/exercises/types/).';
COMMENT ON COLUMN "exercise_items"."id" IS 'Okunabilir kimlik (slug), ör. "e1-g2-minik-serce"';
COMMENT ON COLUMN "exercise_items"."type" IS 'Egzersiz türü, ör. TEKRARLI_OKUMA';
COMMENT ON COLUMN "exercise_items"."grade_band" IS 'Sınıf grubu, ör. G2';
COMMENT ON COLUMN "exercise_items"."text_id" IS 'Egzersizin dayandığı metin (texts.id); metinsiz egzersizde boş';
COMMENT ON COLUMN "exercise_items"."params" IS 'Türe özel ayarlar (jsonb), ör. {"repeatCount": 3, "goalPercent": 15}';
COMMENT ON COLUMN "exercise_items"."data" IS 'Türe özel veri (jsonb), ör. öbekler, heceler, kelime listesi';
COMMENT ON COLUMN "exercise_items"."status" IS 'Onay durumu; seed içeriği APPROVED';
COMMENT ON COLUMN "exercise_items"."source" IS 'Kaynak: SEED ya da AI';
COMMENT ON COLUMN "exercise_items"."created_at" IS 'Kaydın oluşturulma zamanı';
COMMENT ON COLUMN "exercise_items"."updated_at" IS 'Kaydın son güncellenme zamanı (uygulama tarafından otomatik)';
COMMENT ON CONSTRAINT "exercise_items_params_object_check" ON "exercise_items" IS 'Ayarlar bir JSON nesnesi olmalı';
COMMENT ON CONSTRAINT "exercise_items_data_object_check" ON "exercise_items" IS 'Veri bir JSON nesnesi olmalı';

COMMENT ON TABLE "exercise_sessions" IS 'Bir kullanıcının bir egzersizi bir kez yapması. Başlarken oluşur, bitince ölçülerle güncellenir. Ölçüler sunucuda yeniden doğrulanır; egzersiz okuma ölçümlerine (reading_metrics) girmez.';
COMMENT ON COLUMN "exercise_sessions"."id" IS 'Birincil anahtar (cuid)';
COMMENT ON COLUMN "exercise_sessions"."user_id" IS 'Egzersizi yapan kullanıcı (users.id)';
COMMENT ON COLUMN "exercise_sessions"."item_id" IS 'Yapılan egzersiz örneği (exercise_items.id)';
COMMENT ON COLUMN "exercise_sessions"."params_used" IS 'Bu oturumda kullanılan (etkin) ayarlar (jsonb)';
COMMENT ON COLUMN "exercise_sessions"."started_at" IS 'Egzersizin başladığı zaman; günlük hedef bu zamanın günüyle (Türkiye saati) hesaplanır';
COMMENT ON COLUMN "exercise_sessions"."finished_at" IS 'Egzersizin bittiği zaman; bitmediyse boş. Seri bu zamanın gününe sayılır';
COMMENT ON COLUMN "exercise_sessions"."duration_seconds" IS 'Toplam süre (saniye), ör. 240';
COMMENT ON COLUMN "exercise_sessions"."wpm_first" IS 'İlk okumadaki dakikadaki kelime (1 ondalık), ör. 72.4';
COMMENT ON COLUMN "exercise_sessions"."wpm_last" IS 'Son okumadaki dakikadaki kelime (1 ondalık), ör. 85.1';
COMMENT ON COLUMN "exercise_sessions"."comprehension" IS 'Anlama oranı, ilk denemeye göre (0-1, 2 ondalık), ör. 0.67';
COMMENT ON COLUMN "exercise_sessions"."score" IS 'Türe özel puan (E1: ilk okumaya göre hız değişimi, yüzde), ör. 18';
COMMENT ON COLUMN "exercise_sessions"."details" IS 'Türe özel ayrıntılar (jsonb): cevaplar, okuma süreleri vb.';
COMMENT ON CONSTRAINT "exercise_sessions_duration_check" ON "exercise_sessions" IS 'Süre negatif olamaz';
COMMENT ON CONSTRAINT "exercise_sessions_wpm_check" ON "exercise_sessions" IS 'Hızlar boş ya da pozitif olmalı';
COMMENT ON CONSTRAINT "exercise_sessions_comprehension_check" ON "exercise_sessions" IS 'Anlama 0-1 arası olmalı';
COMMENT ON CONSTRAINT "exercise_sessions_finished_at_check" ON "exercise_sessions" IS 'Bitiş başlangıçtan önce olamaz';
