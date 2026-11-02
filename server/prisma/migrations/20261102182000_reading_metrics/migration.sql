-- Okuma ölçümleri (A0): biten her okuma için hız ve anlama (reading_metrics) ile rapor görünümleri.
-- Tablo SQL'i `prisma migrate diff` ile üretildi; CHECK kısıtları, açıklamalar ve görünümler elle
-- eklendi. Görünümlerde gün ve hafta Türkiye saatine göredir; hafta pazartesi başlar.
-- Prisma view'ları yönetmez; değiştirmek için yeni bir migration'da CREATE OR REPLACE VIEW kullanın.

-- CreateTable
CREATE TABLE "reading_metrics" (
    "reading_session_id" TEXT NOT NULL,
    "grade_band" "grade_band" NOT NULL,
    "word_count" INTEGER NOT NULL,
    "duration_seconds" INTEGER NOT NULL,
    "words_per_minute" DOUBLE PRECISION,
    "questions_total" INTEGER,
    "first_try_correct" INTEGER,
    "comprehension" DOUBLE PRECISION,
    "rushed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_metrics_pkey" PRIMARY KEY ("reading_session_id")
);

-- AddForeignKey
ALTER TABLE "reading_metrics" ADD CONSTRAINT "reading_metrics_reading_session_id_fkey" FOREIGN KEY ("reading_session_id") REFERENCES "reading_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reading_metrics" ADD CONSTRAINT "reading_metrics_word_count_check" CHECK ("word_count" > 0);
ALTER TABLE "reading_metrics" ADD CONSTRAINT "reading_metrics_duration_check" CHECK ("duration_seconds" >= 0);
ALTER TABLE "reading_metrics" ADD CONSTRAINT "reading_metrics_wpm_check" CHECK (("words_per_minute" IS NULL) = ("duration_seconds" = 0) AND ("words_per_minute" IS NULL OR "words_per_minute" > 0));
ALTER TABLE "reading_metrics" ADD CONSTRAINT "reading_metrics_questions_check" CHECK (
  ("questions_total" IS NULL AND "first_try_correct" IS NULL AND "comprehension" IS NULL)
  OR ("questions_total" > 0 AND "first_try_correct" BETWEEN 0 AND "questions_total" AND "comprehension" BETWEEN 0 AND 1)
);
ALTER TABLE "reading_metrics" ADD CONSTRAINT "reading_metrics_rushed_check" CHECK (NOT "rushed" OR "comprehension" IS NOT NULL);

COMMENT ON TABLE "reading_metrics" IS 'Biten bir okumanın ölçümü (okuma kaydıyla 1:1). Okuma bitince (kitaplık) ve ders bitince (sorularla birlikte) yazılır. Hız hiçbir zaman tek başına gösterilmez; anlamayla birlikte okunur.';
COMMENT ON COLUMN "reading_metrics"."reading_session_id" IS 'Ölçülen okuma (reading_sessions.id); birincil anahtar';
COMMENT ON COLUMN "reading_metrics"."grade_band" IS 'Okuma anında kullanıcının sınıf grubu, ör. G2';
COMMENT ON COLUMN "reading_metrics"."word_count" IS 'Metnin kelime sayısı, ör. 112';
COMMENT ON COLUMN "reading_metrics"."duration_seconds" IS 'Okuma süresi (saniye), ör. 95';
COMMENT ON COLUMN "reading_metrics"."words_per_minute" IS 'Dakikadaki kelime (1 ondalık); süre 0 ise boş, ör. 70.7';
COMMENT ON COLUMN "reading_metrics"."questions_total" IS 'Soru sayısı; kitaplık okumasında boş, ör. 3';
COMMENT ON COLUMN "reading_metrics"."first_try_correct" IS 'İlk denemede doğru cevaplanan soru sayısı (yıldızla aynı kural); kitaplıkta boş, ör. 2';
COMMENT ON COLUMN "reading_metrics"."comprehension" IS 'Anlama oranı, ilk denemeye göre (0-1, 2 ondalık); kitaplıkta boş, ör. 0.67';
COMMENT ON COLUMN "reading_metrics"."rushed" IS 'Acele okuma: hız sınıf grubunun tavanının üstünde ve anlama %60''ın altında';
COMMENT ON COLUMN "reading_metrics"."created_at" IS 'Ölçümün ilk yazıldığı zaman';
COMMENT ON COLUMN "reading_metrics"."updated_at" IS 'Kaydın son güncellenme zamanı (uygulama tarafından otomatik)';
COMMENT ON CONSTRAINT "reading_metrics_word_count_check" ON "reading_metrics" IS 'Kelime sayısı pozitif olmalı';
COMMENT ON CONSTRAINT "reading_metrics_duration_check" ON "reading_metrics" IS 'Süre negatif olamaz';
COMMENT ON CONSTRAINT "reading_metrics_wpm_check" ON "reading_metrics" IS 'Hız yalnızca süre 0 iken boş, aksi halde pozitif';
COMMENT ON CONSTRAINT "reading_metrics_questions_check" ON "reading_metrics" IS 'Soru alanları birlikte boş ya da tutarlı olmalı (doğru ≤ soru, anlama 0-1)';
COMMENT ON CONSTRAINT "reading_metrics_rushed_check" ON "reading_metrics" IS 'Acele işareti yalnızca anlama ölçüldüyse konabilir';

-- Ölçülen her okuma, okunabilir biçimde (diğer özet görünümlerin kaynağı)
CREATE VIEW "v_reading_metrics" AS
SELECT
  u."username",
  (rs."started_at" AT TIME ZONE 'Europe/Istanbul')::date AS "reading_date",
  t."title" AS "text_title",
  rs."text_id",
  m."grade_band",
  m."word_count",
  m."duration_seconds",
  round(m."words_per_minute"::numeric, 1) AS "words_per_minute",
  m."questions_total",
  m."first_try_correct",
  round(m."comprehension"::numeric, 2) AS "comprehension",
  m."rushed"
FROM "reading_metrics" m
JOIN "reading_sessions" rs ON rs."id" = m."reading_session_id"
JOIN "users" u ON u."id" = rs."user_id"
JOIN "texts" t ON t."id" = rs."text_id"
ORDER BY rs."started_at" DESC;

COMMENT ON VIEW "v_reading_metrics" IS 'Ölçülen her okuma (hız ve anlama), en yeniden eskiye';
COMMENT ON COLUMN "v_reading_metrics"."username" IS 'Kullanıcı adı';
COMMENT ON COLUMN "v_reading_metrics"."reading_date" IS 'Okumanın başladığı gün (Türkiye saati)';
COMMENT ON COLUMN "v_reading_metrics"."text_title" IS 'Metin başlığı';
COMMENT ON COLUMN "v_reading_metrics"."text_id" IS 'Metin (texts.id)';
COMMENT ON COLUMN "v_reading_metrics"."grade_band" IS 'Okuma anındaki sınıf grubu';
COMMENT ON COLUMN "v_reading_metrics"."word_count" IS 'Kelime sayısı';
COMMENT ON COLUMN "v_reading_metrics"."duration_seconds" IS 'Okuma süresi (saniye)';
COMMENT ON COLUMN "v_reading_metrics"."words_per_minute" IS 'Dakikadaki kelime (1 ondalık)';
COMMENT ON COLUMN "v_reading_metrics"."questions_total" IS 'Soru sayısı (kitaplıkta boş)';
COMMENT ON COLUMN "v_reading_metrics"."first_try_correct" IS 'İlk denemede doğru (kitaplıkta boş)';
COMMENT ON COLUMN "v_reading_metrics"."comprehension" IS 'Anlama oranı 0-1 (kitaplıkta boş)';
COMMENT ON COLUMN "v_reading_metrics"."rushed" IS 'Acele okuma işareti';

-- Okuma × soru türü: bu okumada türün soruları, ilk cevabı doğru olanlar ve yanlış cevaplar
CREATE VIEW "v_reading_results_by_type" AS
WITH per_question AS (
  SELECT
    qa."reading_session_id",
    qa."question_id",
    (array_agg(qa."correct" ORDER BY qa."created_at", qa."id"))[1] AS "first_correct",
    count(*) FILTER (WHERE NOT qa."correct") AS "wrong"
  FROM "question_attempts" qa
  GROUP BY qa."reading_session_id", qa."question_id"
)
SELECT
  u."username",
  (rs."started_at" AT TIME ZONE 'Europe/Istanbul')::date AS "reading_date",
  t."title" AS "text_title",
  q."type" AS "question_type",
  count(*)::integer AS "questions_answered",
  (count(*) FILTER (WHERE pq."first_correct"))::integer AS "first_try_correct",
  sum(pq."wrong")::integer AS "wrong_attempts",
  rs."id" AS "reading_session_id"
FROM per_question pq
JOIN "questions" q ON q."id" = pq."question_id"
JOIN "reading_sessions" rs ON rs."id" = pq."reading_session_id"
JOIN "users" u ON u."id" = rs."user_id"
JOIN "texts" t ON t."id" = rs."text_id"
GROUP BY u."username", rs."id", rs."started_at", t."title", q."type"
ORDER BY rs."started_at" DESC, q."type";

COMMENT ON VIEW "v_reading_results_by_type" IS 'Okuma ve soru türü başına sonuç; ilk deneme bu okumadaki ilk cevaptır';
COMMENT ON COLUMN "v_reading_results_by_type"."username" IS 'Kullanıcı adı';
COMMENT ON COLUMN "v_reading_results_by_type"."reading_date" IS 'Okumanın başladığı gün (Türkiye saati)';
COMMENT ON COLUMN "v_reading_results_by_type"."text_title" IS 'Metin başlığı';
COMMENT ON COLUMN "v_reading_results_by_type"."question_type" IS 'Soru türü (Q1-Q13)';
COMMENT ON COLUMN "v_reading_results_by_type"."questions_answered" IS 'Bu türde cevaplanan soru sayısı';
COMMENT ON COLUMN "v_reading_results_by_type"."first_try_correct" IS 'İlk cevabı doğru olan soru sayısı';
COMMENT ON COLUMN "v_reading_results_by_type"."wrong_attempts" IS 'Yanlış cevap sayısı (tüm denemeler)';
COMMENT ON COLUMN "v_reading_results_by_type"."reading_session_id" IS 'Okuma kaydı (reading_sessions.id)';

-- Öğrenci × gün özeti (yalnızca biten, ölçülen okumalar)
CREATE VIEW "v_student_daily" AS
SELECT
  "username",
  "reading_date",
  round(sum("duration_seconds") / 60.0, 1) AS "read_minutes",
  count(DISTINCT "text_id")::integer AS "text_count",
  count(*)::integer AS "reading_count",
  round(percentile_cont(0.5) WITHIN GROUP (ORDER BY "words_per_minute")::numeric, 1) AS "median_wpm",
  round(sum("first_try_correct")::numeric / NULLIF(sum("questions_total"), 0), 2) AS "comprehension",
  (count(*) FILTER (WHERE "rushed"))::integer AS "rushed_count"
FROM "v_reading_metrics"
GROUP BY "username", "reading_date"
ORDER BY "username", "reading_date" DESC;

COMMENT ON VIEW "v_student_daily" IS 'Öğrenci ve gün (Türkiye saati) başına biten okumaların özeti';
COMMENT ON COLUMN "v_student_daily"."username" IS 'Kullanıcı adı';
COMMENT ON COLUMN "v_student_daily"."reading_date" IS 'Gün (Türkiye saati)';
COMMENT ON COLUMN "v_student_daily"."read_minutes" IS 'Biten okumaların süresi (dakika, 1 ondalık)';
COMMENT ON COLUMN "v_student_daily"."text_count" IS 'Okunan farklı metin sayısı';
COMMENT ON COLUMN "v_student_daily"."reading_count" IS 'Biten okuma sayısı';
COMMENT ON COLUMN "v_student_daily"."median_wpm" IS 'Dakikadaki kelimenin ortancası';
COMMENT ON COLUMN "v_student_daily"."comprehension" IS 'Anlama: ilk denemede doğru / soru (sorulu okumalar); yoksa boş';
COMMENT ON COLUMN "v_student_daily"."rushed_count" IS 'Acele okuma sayısı';

-- Öğrenci × hafta (pazartesi başlar) özeti ve bir önceki haftaya göre değişim
CREATE VIEW "v_student_weekly" AS
WITH weeks AS (
  SELECT
    "username",
    date_trunc('week', "reading_date")::date AS "week_start",
    round(sum("duration_seconds") / 60.0, 1) AS "read_minutes",
    count(DISTINCT "text_id")::integer AS "text_count",
    count(*)::integer AS "reading_count",
    round(percentile_cont(0.5) WITHIN GROUP (ORDER BY "words_per_minute")::numeric, 1) AS "median_wpm",
    round(sum("first_try_correct")::numeric / NULLIF(sum("questions_total"), 0), 2) AS "comprehension",
    (count(*) FILTER (WHERE "rushed"))::integer AS "rushed_count"
  FROM "v_reading_metrics"
  GROUP BY "username", date_trunc('week', "reading_date")
)
SELECT
  w.*,
  p."read_minutes" AS "prev_read_minutes",
  p."median_wpm" AS "prev_median_wpm",
  p."comprehension" AS "prev_comprehension",
  w."read_minutes" - COALESCE(p."read_minutes", 0) AS "read_minutes_change",
  w."median_wpm" - p."median_wpm" AS "median_wpm_change",
  w."comprehension" - p."comprehension" AS "comprehension_change"
FROM weeks w
LEFT JOIN weeks p ON p."username" = w."username" AND p."week_start" = w."week_start" - 7
ORDER BY w."username", w."week_start" DESC;

COMMENT ON VIEW "v_student_weekly" IS 'Öğrenci ve hafta (pazartesi başlar, Türkiye saati) başına özet; önceki haftaya göre değişim';
COMMENT ON COLUMN "v_student_weekly"."username" IS 'Kullanıcı adı';
COMMENT ON COLUMN "v_student_weekly"."week_start" IS 'Haftanın pazartesisi';
COMMENT ON COLUMN "v_student_weekly"."read_minutes" IS 'Biten okumaların süresi (dakika, 1 ondalık)';
COMMENT ON COLUMN "v_student_weekly"."text_count" IS 'Okunan farklı metin sayısı';
COMMENT ON COLUMN "v_student_weekly"."reading_count" IS 'Biten okuma sayısı';
COMMENT ON COLUMN "v_student_weekly"."median_wpm" IS 'Dakikadaki kelimenin ortancası';
COMMENT ON COLUMN "v_student_weekly"."comprehension" IS 'Anlama: ilk denemede doğru / soru; sorulu okuma yoksa boş';
COMMENT ON COLUMN "v_student_weekly"."rushed_count" IS 'Acele okuma sayısı';
COMMENT ON COLUMN "v_student_weekly"."prev_read_minutes" IS 'Önceki haftanın okuma süresi; o hafta okuma yoksa boş';
COMMENT ON COLUMN "v_student_weekly"."prev_median_wpm" IS 'Önceki haftanın hız ortancası';
COMMENT ON COLUMN "v_student_weekly"."prev_comprehension" IS 'Önceki haftanın anlama oranı';
COMMENT ON COLUMN "v_student_weekly"."read_minutes_change" IS 'Okuma süresindeki değişim (önceki hafta yoksa 0 sayılır)';
COMMENT ON COLUMN "v_student_weekly"."median_wpm_change" IS 'Hız ortancasındaki değişim; önceki hafta yoksa boş';
COMMENT ON COLUMN "v_student_weekly"."comprehension_change" IS 'Anlama oranındaki değişim; önceki hafta yoksa boş';

-- Öğrenci × ay özeti ve bir önceki aya göre değişim
CREATE VIEW "v_student_monthly" AS
WITH months AS (
  SELECT
    "username",
    date_trunc('month', "reading_date")::date AS "month_start",
    round(sum("duration_seconds") / 60.0, 1) AS "read_minutes",
    count(DISTINCT "text_id")::integer AS "text_count",
    count(*)::integer AS "reading_count",
    round(percentile_cont(0.5) WITHIN GROUP (ORDER BY "words_per_minute")::numeric, 1) AS "median_wpm",
    round(sum("first_try_correct")::numeric / NULLIF(sum("questions_total"), 0), 2) AS "comprehension",
    (count(*) FILTER (WHERE "rushed"))::integer AS "rushed_count"
  FROM "v_reading_metrics"
  GROUP BY "username", date_trunc('month', "reading_date")
)
SELECT
  m.*,
  p."read_minutes" AS "prev_read_minutes",
  p."median_wpm" AS "prev_median_wpm",
  p."comprehension" AS "prev_comprehension",
  m."read_minutes" - COALESCE(p."read_minutes", 0) AS "read_minutes_change",
  m."median_wpm" - p."median_wpm" AS "median_wpm_change",
  m."comprehension" - p."comprehension" AS "comprehension_change"
FROM months m
LEFT JOIN months p ON p."username" = m."username" AND p."month_start" = (m."month_start" - interval '1 month')::date
ORDER BY m."username", m."month_start" DESC;

COMMENT ON VIEW "v_student_monthly" IS 'Öğrenci ve ay (Türkiye saati) başına özet; önceki aya göre değişim';
COMMENT ON COLUMN "v_student_monthly"."username" IS 'Kullanıcı adı';
COMMENT ON COLUMN "v_student_monthly"."month_start" IS 'Ayın ilk günü';
COMMENT ON COLUMN "v_student_monthly"."read_minutes" IS 'Biten okumaların süresi (dakika, 1 ondalık)';
COMMENT ON COLUMN "v_student_monthly"."text_count" IS 'Okunan farklı metin sayısı';
COMMENT ON COLUMN "v_student_monthly"."reading_count" IS 'Biten okuma sayısı';
COMMENT ON COLUMN "v_student_monthly"."median_wpm" IS 'Dakikadaki kelimenin ortancası';
COMMENT ON COLUMN "v_student_monthly"."comprehension" IS 'Anlama: ilk denemede doğru / soru; sorulu okuma yoksa boş';
COMMENT ON COLUMN "v_student_monthly"."rushed_count" IS 'Acele okuma sayısı';
COMMENT ON COLUMN "v_student_monthly"."prev_read_minutes" IS 'Önceki ayın okuma süresi; o ay okuma yoksa boş';
COMMENT ON COLUMN "v_student_monthly"."prev_median_wpm" IS 'Önceki ayın hız ortancası';
COMMENT ON COLUMN "v_student_monthly"."prev_comprehension" IS 'Önceki ayın anlama oranı';
COMMENT ON COLUMN "v_student_monthly"."read_minutes_change" IS 'Okuma süresindeki değişim (önceki ay yoksa 0 sayılır)';
COMMENT ON COLUMN "v_student_monthly"."median_wpm_change" IS 'Hız ortancasındaki değişim; önceki ay yoksa boş';
COMMENT ON COLUMN "v_student_monthly"."comprehension_change" IS 'Anlama oranındaki değişim; önceki ay yoksa boş';
