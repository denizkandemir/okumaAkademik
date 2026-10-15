-- Oyun modeli: dersler, sorular, kelime anlamları, cevaplar, ders tamamlama ve lokum defteri.
-- Tablolar Prisma tarafından üretildi; sondaki CHECK ve COMMENT satırları elle eklendi.

-- CreateEnum
CREATE TYPE "city" AS ENUM ('ISTANBUL', 'IZMIR', 'EFES', 'ANTALYA', 'KAPADOKYA', 'VAN');

-- CreateEnum
CREATE TYPE "lesson_kind" AS ENUM ('STORY', 'CHEST');

-- CreateEnum
CREATE TYPE "lokum_reason" AS ENUM ('LESSON', 'CHEST', 'LEVEL_UP', 'CITY_UNLOCK');

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "city" "city" NOT NULL,
    "position" INTEGER NOT NULL,
    "kind" "lesson_kind" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "text_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "text_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "options" TEXT[],
    "correct_index" INTEGER NOT NULL,
    "hint" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "glossary_entries" (
    "id" TEXT NOT NULL,
    "text_id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,

    CONSTRAINT "glossary_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "reading_session_id" TEXT NOT NULL,
    "choice_index" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_completions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "reading_session_id" TEXT,
    "stars" INTEGER,
    "best_stars" INTEGER,
    "completed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lokum_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" "lokum_reason" NOT NULL,
    "lesson_id" TEXT,
    "level" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lokum_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lessons_text_id_key" ON "lessons"("text_id");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_city_position_key" ON "lessons"("city", "position");

-- CreateIndex
CREATE UNIQUE INDEX "questions_text_id_position_key" ON "questions"("text_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "glossary_entries_text_id_word_key" ON "glossary_entries"("text_id", "word");

-- CreateIndex
CREATE INDEX "question_attempts_reading_session_id_question_id_idx" ON "question_attempts"("reading_session_id", "question_id");

-- CreateIndex
CREATE INDEX "question_attempts_user_id_idx" ON "question_attempts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_completions_user_id_lesson_id_key" ON "lesson_completions"("user_id", "lesson_id");

-- CreateIndex
CREATE INDEX "lokum_entries_user_id_idx" ON "lokum_entries"("user_id");

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "texts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "texts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "glossary_entries" ADD CONSTRAINT "glossary_entries_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "texts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_reading_session_id_fkey" FOREIGN KEY ("reading_session_id") REFERENCES "reading_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_completions" ADD CONSTRAINT "lesson_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_completions" ADD CONSTRAINT "lesson_completions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_completions" ADD CONSTRAINT "lesson_completions_reading_session_id_fkey" FOREIGN KEY ("reading_session_id") REFERENCES "reading_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lokum_entries" ADD CONSTRAINT "lokum_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lokum_entries" ADD CONSTRAINT "lokum_entries_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------------------------
-- Elle eklendi: CHECK kısıtları ve açıklamalar (Prisma bunları yönetmez).
-- Seviye, şehir ve seri saklanmaz; tamamlanan derslerden ve okumalardan türetilir
-- (bkz. src/lib/journey.ts ve v_user_journey).
-- ---------------------------------------------------------------------------------------------

-- CHECK kısıtları
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_position_range_check" CHECK ("position" BETWEEN 1 AND 10);
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_story_text_check" CHECK (("kind" = 'STORY') = ("text_id" IS NOT NULL));

ALTER TABLE "questions" ADD CONSTRAINT "questions_position_range_check" CHECK ("position" BETWEEN 1 AND 3);
ALTER TABLE "questions" ADD CONSTRAINT "questions_options_count_check" CHECK ("options" IS NOT NULL AND cardinality("options") = 3);
ALTER TABLE "questions" ADD CONSTRAINT "questions_correct_index_range_check" CHECK ("correct_index" BETWEEN 0 AND 2);

ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_choice_index_range_check" CHECK ("choice_index" BETWEEN 0 AND 2);

ALTER TABLE "lesson_completions" ADD CONSTRAINT "lesson_completions_stars_range_check" CHECK ("stars" BETWEEN 1 AND 3);
ALTER TABLE "lesson_completions" ADD CONSTRAINT "lesson_completions_best_stars_check" CHECK (
  ("stars" IS NULL) = ("best_stars" IS NULL)
  AND ("best_stars" IS NULL OR "best_stars" BETWEEN "stars" AND 3)
);

ALTER TABLE "lokum_entries" ADD CONSTRAINT "lokum_entries_amount_positive_check" CHECK ("amount" > 0);
ALTER TABLE "lokum_entries" ADD CONSTRAINT "lokum_entries_level_check" CHECK (
  ("reason" = 'LEVEL_UP') = ("level" IS NOT NULL) AND ("level" IS NULL OR "level" BETWEEN 2 AND 30)
);

-- Enum'lar
COMMENT ON TYPE "city" IS 'Yolculuğun durakları, sırasıyla: ISTANBUL, IZMIR, EFES, ANTALYA, KAPADOKYA, VAN. API''de küçük harfli kimlik (istanbul, ...)';
COMMENT ON TYPE "lesson_kind" IS 'Ders türü: STORY (hikâye: oku + 3 soru), CHEST (hazine sandığı)';
COMMENT ON TYPE "lokum_reason" IS 'Lokum kazanma sebebi: LESSON (hikâye), CHEST (sandık), LEVEL_UP (seviye atlama), CITY_UNLOCK (yeni şehir)';

-- lessons
COMMENT ON TABLE "lessons" IS 'Yolculuktaki ders (yoldaki düğüm). Her şehirde 10 ders vardır; 5. ve 10. ders sandık, diğerleri hikâyedir. Dersler şehir sırası, sonra sıra numarasıyla tek tek açılır.';
COMMENT ON COLUMN "lessons"."id" IS 'Okunabilir kimlik (slug), ör. "istanbul-03-minik-serce"';
COMMENT ON COLUMN "lessons"."city" IS 'Dersin bulunduğu şehir, ör. ISTANBUL';
COMMENT ON COLUMN "lessons"."position" IS 'Şehir içindeki sıra (1-10), ör. 3';
COMMENT ON COLUMN "lessons"."kind" IS 'Ders türü: STORY (hikâye) veya CHEST (sandık)';
COMMENT ON COLUMN "lessons"."title" IS 'Ders kartındaki başlık, ör. "Minik Serçe"';
COMMENT ON COLUMN "lessons"."summary" IS 'Ders kartındaki tek cümlelik özet';
COMMENT ON COLUMN "lessons"."text_id" IS 'Hikâyenin metni (texts.id); hikâyelerde zorunlu, sandıklarda boş';
COMMENT ON COLUMN "lessons"."created_at" IS 'Kaydın oluşturulma zamanı';
COMMENT ON COLUMN "lessons"."updated_at" IS 'Kaydın son güncellenme zamanı (uygulama tarafından otomatik)';

-- questions
COMMENT ON TABLE "questions" IS 'Bir metnin anlama sorusu. Her hikâyenin 3 sorusu vardır; her sorunun 3 şıkkı ve 1 doğru cevabı.';
COMMENT ON COLUMN "questions"."id" IS 'Birincil anahtar (cuid)';
COMMENT ON COLUMN "questions"."text_id" IS 'Sorunun ait olduğu metin (texts.id), ör. "minik-serce"';
COMMENT ON COLUMN "questions"."position" IS 'Metin içindeki sıra (1-3)';
COMMENT ON COLUMN "questions"."prompt" IS 'Soru, ör. "Rüzgâr esince Pıtır''ın yuvasına ne oldu?"';
COMMENT ON COLUMN "questions"."options" IS 'Tam olarak 3 şık, ekrandaki sırasıyla (A, B, C)';
COMMENT ON COLUMN "questions"."correct_index" IS 'Doğru şıkkın sırası (0-2); istemciye gönderilmez';
COMMENT ON COLUMN "questions"."hint" IS 'Yanlış cevaptan sonra gösterilen ipucu';
COMMENT ON COLUMN "questions"."explanation" IS 'Doğru cevaptan sonra gösterilen açıklama';
COMMENT ON COLUMN "questions"."created_at" IS 'Kaydın oluşturulma zamanı';
COMMENT ON COLUMN "questions"."updated_at" IS 'Kaydın son güncellenme zamanı (uygulama tarafından otomatik)';

-- glossary_entries
COMMENT ON TABLE "glossary_entries" IS 'Metindeki bir kelimenin çocuk diliyle anlamı; okurken kelimeye dokununca gösterilir.';
COMMENT ON COLUMN "glossary_entries"."id" IS 'Birincil anahtar (cuid)';
COMMENT ON COLUMN "glossary_entries"."text_id" IS 'Kelimenin geçtiği metin (texts.id)';
COMMENT ON COLUMN "glossary_entries"."word" IS 'Kelime, metinde yazıldığı gibi, ör. "yuvası"';
COMMENT ON COLUMN "glossary_entries"."meaning" IS 'Tek cümlelik, çocuk dostu anlam';

-- question_attempts
COMMENT ON TABLE "question_attempts" IS 'Bir soruya verilen tek bir cevap. Şıkka her dokunuş bir satırdır; yıldız ve lokum, bir okuma içinde soruya verilen ilk cevabın doğru olup olmadığına göre hesaplanır.';
COMMENT ON COLUMN "question_attempts"."id" IS 'Birincil anahtar (cuid)';
COMMENT ON COLUMN "question_attempts"."user_id" IS 'Cevaplayan kullanıcı (users.id)';
COMMENT ON COLUMN "question_attempts"."question_id" IS 'Cevaplanan soru (questions.id)';
COMMENT ON COLUMN "question_attempts"."reading_session_id" IS 'Cevabın verildiği okuma (reading_sessions.id)';
COMMENT ON COLUMN "question_attempts"."choice_index" IS 'Seçilen şık (0-2)';
COMMENT ON COLUMN "question_attempts"."correct" IS 'Seçilen şık doğru muydu';
COMMENT ON COLUMN "question_attempts"."created_at" IS 'Cevabın verildiği zaman';

-- lesson_completions
COMMENT ON TABLE "lesson_completions" IS 'Kullanıcının bir dersi bitirmesi. İlk tamamlama satırı oluşturur ve ödül verir; tekrar oynamak yalnızca en iyi yıldızı yükseltebilir.';
COMMENT ON COLUMN "lesson_completions"."id" IS 'Birincil anahtar (cuid)';
COMMENT ON COLUMN "lesson_completions"."user_id" IS 'Dersi bitiren kullanıcı (users.id)';
COMMENT ON COLUMN "lesson_completions"."lesson_id" IS 'Bitirilen ders (lessons.id)';
COMMENT ON COLUMN "lesson_completions"."reading_session_id" IS 'İlk tamamlamadaki okuma (reading_sessions.id); sandıklarda boş';
COMMENT ON COLUMN "lesson_completions"."stars" IS 'İlk tamamlamada kazanılan yıldız (1-3); sandıklarda boş';
COMMENT ON COLUMN "lesson_completions"."best_stars" IS 'Tekrar oynamalar dahil en iyi yıldız (1-3); sandıklarda boş';
COMMENT ON COLUMN "lesson_completions"."completed_at" IS 'Dersin ilk bitirildiği zaman';
COMMENT ON COLUMN "lesson_completions"."updated_at" IS 'Kaydın son güncellenme zamanı (uygulama tarafından otomatik)';

-- lokum_entries
COMMENT ON TABLE "lokum_entries" IS 'Lokum defteri: her kazanç bir satırdır. Bakiye, kullanıcının satırlarının toplamıdır (users tablosunda bakiye kolonu yoktur).';
COMMENT ON COLUMN "lokum_entries"."id" IS 'Birincil anahtar (cuid)';
COMMENT ON COLUMN "lokum_entries"."user_id" IS 'Lokumu kazanan kullanıcı (users.id)';
COMMENT ON COLUMN "lokum_entries"."amount" IS 'Kazanılan lokum (> 0), ör. 20';
COMMENT ON COLUMN "lokum_entries"."reason" IS 'Kazanma sebebi, ör. LESSON';
COMMENT ON COLUMN "lokum_entries"."lesson_id" IS 'Kazancı doğuran ders (lessons.id); ders silinirse boş kalır';
COMMENT ON COLUMN "lokum_entries"."level" IS 'LEVEL_UP satırlarında ulaşılan seviye (2-30); diğerlerinde boş';
COMMENT ON COLUMN "lokum_entries"."created_at" IS 'Kazanç zamanı';

-- CHECK kısıtlarının açıklamaları
COMMENT ON CONSTRAINT "lessons_position_range_check" ON "lessons" IS 'Sıra 1 ile 10 arasında olmalı';
COMMENT ON CONSTRAINT "lessons_story_text_check" ON "lessons" IS 'Hikâyenin metni olmalı, sandığın metni olmamalı';
COMMENT ON CONSTRAINT "questions_position_range_check" ON "questions" IS 'Sıra 1 ile 3 arasında olmalı';
COMMENT ON CONSTRAINT "questions_options_count_check" ON "questions" IS 'Tam olarak 3 şık olmalı';
COMMENT ON CONSTRAINT "questions_correct_index_range_check" ON "questions" IS 'Doğru şık 0, 1 veya 2 olmalı';
COMMENT ON CONSTRAINT "question_attempts_choice_index_range_check" ON "question_attempts" IS 'Seçilen şık 0, 1 veya 2 olmalı';
COMMENT ON CONSTRAINT "lesson_completions_stars_range_check" ON "lesson_completions" IS 'Yıldız 1 ile 3 arasında olmalı';
COMMENT ON CONSTRAINT "lesson_completions_best_stars_check" ON "lesson_completions" IS 'En iyi yıldız, ilk yıldızdan az olamaz; sandıkta ikisi de boş';
COMMENT ON CONSTRAINT "lokum_entries_amount_positive_check" ON "lokum_entries" IS 'Lokum miktarı 0''dan büyük olmalı';
COMMENT ON CONSTRAINT "lokum_entries_level_check" ON "lokum_entries" IS 'Seviye yalnızca LEVEL_UP satırlarında ve 2-30 arasında';
