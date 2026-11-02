-- Sınıf grubu varyantları (A0): bir hikâye dersinin metni sınıf grubuna göre farklı olabilir.
-- lessons.text_id yerine lesson_texts (lesson_id, grade_band, text_id) gelir. SQL `prisma migrate
-- diff` ile üretildi; veri taşıma elle eklendi: mevcut 48 bağlantı, kolon silinmeden önce G2
-- varyantı olarak kopyalanır. Ders kimlikleri değişmez.
-- Metin ölçüleri (word_count, sentence_count, avg_sentence_length, atesman_score) seed'de
-- src/lib/readability.ts ile hesaplanır; seed'den önce boştur.

-- CreateEnum
CREATE TYPE "grade_band" AS ENUM ('G1', 'G2', 'G3', 'G4');

-- CreateTable
CREATE TABLE "lesson_texts" (
    "lesson_id" TEXT NOT NULL,
    "grade_band" "grade_band" NOT NULL,
    "text_id" TEXT NOT NULL,

    CONSTRAINT "lesson_texts_pkey" PRIMARY KEY ("lesson_id","grade_band")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_texts_text_id_key" ON "lesson_texts"("text_id");

-- AddForeignKey
ALTER TABLE "lesson_texts" ADD CONSTRAINT "lesson_texts_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_texts" ADD CONSTRAINT "lesson_texts_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "texts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Veri taşıma: mevcut hikâye metinleri G2 varyantıdır.
INSERT INTO "lesson_texts" ("lesson_id", "grade_band", "text_id")
SELECT "id", 'G2', "text_id" FROM "lessons" WHERE "text_id" IS NOT NULL;

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_text_id_fkey";

-- DropIndex
DROP INDEX "lessons_text_id_key";

-- AlterTable (lessons_story_text_check da kolonla birlikte düşer)
ALTER TABLE "lessons" DROP COLUMN "text_id";

-- AlterTable
ALTER TABLE "texts" ADD COLUMN     "atesman_score" DOUBLE PRECISION,
ADD COLUMN     "avg_sentence_length" DOUBLE PRECISION,
ADD COLUMN     "sentence_count" INTEGER,
ADD COLUMN     "word_count" INTEGER;

ALTER TABLE "texts" ADD CONSTRAINT "texts_word_count_check" CHECK ("word_count" IS NULL OR "word_count" > 0);
ALTER TABLE "texts" ADD CONSTRAINT "texts_sentence_count_check" CHECK ("sentence_count" IS NULL OR "sentence_count" > 0);
ALTER TABLE "texts" ADD CONSTRAINT "texts_avg_sentence_length_check" CHECK ("avg_sentence_length" IS NULL OR "avg_sentence_length" > 0);

COMMENT ON TYPE "grade_band" IS 'Sınıf grubu: G1 = 1-2, G2 = 3-4, G3 = 5-6, G4 = 7-8. sınıf';
COMMENT ON TABLE "lesson_texts" IS 'Bir hikâye dersinin bir sınıf grubundaki metni. Grubun metni yoksa G2 metni okutulur.';
COMMENT ON COLUMN "lesson_texts"."lesson_id" IS 'Ders (lessons.id), ör. "istanbul-03-minik-serce"';
COMMENT ON COLUMN "lesson_texts"."grade_band" IS 'Sınıf grubu, ör. G2';
COMMENT ON COLUMN "lesson_texts"."text_id" IS 'Bu grupta okutulan metin (texts.id), ör. "minik-serce"; bir metin tek bir derse aittir';
COMMENT ON COLUMN "texts"."word_count" IS 'Kelime sayısı (src/lib/readability.ts ile hesaplanır), ör. 112';
COMMENT ON COLUMN "texts"."sentence_count" IS 'Cümle sayısı, ör. 14';
COMMENT ON COLUMN "texts"."avg_sentence_length" IS 'Ortalama cümle uzunluğu (kelime / cümle, 2 ondalık), ör. 8.0';
COMMENT ON COLUMN "texts"."atesman_score" IS 'Ateşman okunabilirlik puanı (1 ondalık; yüksek = kolay), ör. 78.4';
COMMENT ON CONSTRAINT "texts_word_count_check" ON "texts" IS 'Kelime sayısı pozitif olmalı';
COMMENT ON CONSTRAINT "texts_sentence_count_check" ON "texts" IS 'Cümle sayısı pozitif olmalı';
COMMENT ON CONSTRAINT "texts_avg_sentence_length_check" ON "texts" IS 'Ortalama cümle uzunluğu pozitif olmalı';
