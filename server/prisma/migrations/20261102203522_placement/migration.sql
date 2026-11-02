-- Seviye belirleme okuması (A0): grubun metinleri (placement_texts) ve sonuçlar (user_baselines).
-- Tablo SQL'i `prisma migrate dev --create-only` ile üretildi; CHECK kısıtları, açıklamalar ve
-- görünüm değişiklikleri elle eklendi.

-- CreateTable
CREATE TABLE "placement_texts" (
    "grade_band" "grade_band" NOT NULL,
    "position" INTEGER NOT NULL,
    "text_id" TEXT NOT NULL,

    CONSTRAINT "placement_texts_pkey" PRIMARY KEY ("grade_band","position")
);

-- CreateTable
CREATE TABLE "user_baselines" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "grade_band" "grade_band" NOT NULL,
    "words_per_minute" DOUBLE PRECISION NOT NULL,
    "comprehension" DOUBLE PRECISION NOT NULL,
    "measured_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_baselines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "placement_texts_text_id_key" ON "placement_texts"("text_id");

-- CreateIndex
CREATE INDEX "user_baselines_user_id_measured_at_idx" ON "user_baselines"("user_id", "measured_at");

-- AddForeignKey
ALTER TABLE "placement_texts" ADD CONSTRAINT "placement_texts_text_id_fkey" FOREIGN KEY ("text_id") REFERENCES "texts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_baselines" ADD CONSTRAINT "user_baselines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "placement_texts" ADD CONSTRAINT "placement_texts_position_check" CHECK ("position" BETWEEN 1 AND 2);
ALTER TABLE "user_baselines" ADD CONSTRAINT "user_baselines_grade_check" CHECK ("grade" BETWEEN 1 AND 8);
ALTER TABLE "user_baselines" ADD CONSTRAINT "user_baselines_wpm_check" CHECK ("words_per_minute" > 0);
ALTER TABLE "user_baselines" ADD CONSTRAINT "user_baselines_comprehension_check" CHECK ("comprehension" BETWEEN 0 AND 1);

COMMENT ON TABLE "placement_texts" IS 'Seviye belirleme okumasının metni ("Pırıl seni tanımak istiyor!"). Her sınıf grubunda sırayla okunan 2 kısa metin vardır; bu metinler yolculukta ve kitaplıkta görünmez.';
COMMENT ON COLUMN "placement_texts"."grade_band" IS 'Sınıf grubu, ör. G2';
COMMENT ON COLUMN "placement_texts"."position" IS 'Grup içindeki okuma sırası (1-2), ör. 1';
COMMENT ON COLUMN "placement_texts"."text_id" IS 'Okutulan metin (texts.id), ör. "seviye-g2-kutuphanede-bir-gun"';
COMMENT ON CONSTRAINT "placement_texts_position_check" ON "placement_texts" IS 'Her grupta 2 metin: sıra 1 ya da 2';

COMMENT ON TABLE "user_baselines" IS 'Seviye belirleme sonucu: çocuğun başlangıç hızı ve anlaması; gelişim buna göre ölçülür. Tekrar yapılabilir: her sonuç yeni bir satırdır, en yenisi geçerlidir (geçmiş silinmez).';
COMMENT ON COLUMN "user_baselines"."id" IS 'Birincil anahtar (cuid)';
COMMENT ON COLUMN "user_baselines"."user_id" IS 'Ölçülen kullanıcı (users.id)';
COMMENT ON COLUMN "user_baselines"."grade" IS 'Ölçüm anındaki sınıf (1-8), ör. 3';
COMMENT ON COLUMN "user_baselines"."grade_band" IS 'Ölçüm anındaki sınıf grubu, ör. G2';
COMMENT ON COLUMN "user_baselines"."words_per_minute" IS 'İki metnin toplam kelimesi / toplam okuma süresi (dakikadaki kelime, 1 ondalık), ör. 68.4';
COMMENT ON COLUMN "user_baselines"."comprehension" IS 'İlk denemede doğru / soru sayısı (0-1, 2 ondalık), ör. 0.83';
COMMENT ON COLUMN "user_baselines"."measured_at" IS 'Ölçümün yapıldığı zaman';
COMMENT ON CONSTRAINT "user_baselines_grade_check" ON "user_baselines" IS 'Sınıf 1-8 arası olmalı';
COMMENT ON CONSTRAINT "user_baselines_wpm_check" ON "user_baselines" IS 'Hız pozitif olmalı';
COMMENT ON CONSTRAINT "user_baselines_comprehension_check" ON "user_baselines" IS 'Anlama 0-1 arası olmalı';

-- Haftalık ve aylık özete başlangıç ölçümü ve ona göre değişim eklenir. Dönemin sonuna kadar
-- yapılmış en son seviye belirleme kullanılır (sonradan yapılan ölçüm eski dönemleri değiştirmez).
-- CREATE OR REPLACE VIEW yalnızca sona kolon ekleyebildiği için mevcut kolonlar aynı sırayla kalır.
CREATE OR REPLACE VIEW "v_student_weekly" AS
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
  w."comprehension" - p."comprehension" AS "comprehension_change",
  b."wpm" AS "baseline_wpm",
  b."comprehension" AS "baseline_comprehension",
  w."median_wpm" - b."wpm" AS "median_wpm_vs_baseline",
  w."comprehension" - b."comprehension" AS "comprehension_vs_baseline"
FROM weeks w
LEFT JOIN weeks p ON p."username" = w."username" AND p."week_start" = w."week_start" - 7
JOIN "users" u ON u."username" = w."username"
LEFT JOIN LATERAL (
  SELECT
    round(ub."words_per_minute"::numeric, 1) AS "wpm",
    round(ub."comprehension"::numeric, 2) AS "comprehension"
  FROM "user_baselines" ub
  WHERE ub."user_id" = u."id"
    AND (ub."measured_at" AT TIME ZONE 'Europe/Istanbul')::date < w."week_start" + 7
  ORDER BY ub."measured_at" DESC
  LIMIT 1
) b ON true
ORDER BY w."username", w."week_start" DESC;

COMMENT ON COLUMN "v_student_weekly"."baseline_wpm" IS 'Hafta sonuna kadarki en son seviye belirlemenin hızı; yoksa boş';
COMMENT ON COLUMN "v_student_weekly"."baseline_comprehension" IS 'Aynı seviye belirlemenin anlama oranı; yoksa boş';
COMMENT ON COLUMN "v_student_weekly"."median_wpm_vs_baseline" IS 'Hız ortancasının başlangıca göre farkı; başlangıç yoksa boş';
COMMENT ON COLUMN "v_student_weekly"."comprehension_vs_baseline" IS 'Anlama oranının başlangıca göre farkı; başlangıç ya da sorulu okuma yoksa boş';

CREATE OR REPLACE VIEW "v_student_monthly" AS
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
  m."comprehension" - p."comprehension" AS "comprehension_change",
  b."wpm" AS "baseline_wpm",
  b."comprehension" AS "baseline_comprehension",
  m."median_wpm" - b."wpm" AS "median_wpm_vs_baseline",
  m."comprehension" - b."comprehension" AS "comprehension_vs_baseline"
FROM months m
LEFT JOIN months p ON p."username" = m."username" AND p."month_start" = (m."month_start" - interval '1 month')::date
JOIN "users" u ON u."username" = m."username"
LEFT JOIN LATERAL (
  SELECT
    round(ub."words_per_minute"::numeric, 1) AS "wpm",
    round(ub."comprehension"::numeric, 2) AS "comprehension"
  FROM "user_baselines" ub
  WHERE ub."user_id" = u."id"
    AND (ub."measured_at" AT TIME ZONE 'Europe/Istanbul')::date < (m."month_start" + interval '1 month')::date
  ORDER BY ub."measured_at" DESC
  LIMIT 1
) b ON true
ORDER BY m."username", m."month_start" DESC;

COMMENT ON COLUMN "v_student_monthly"."baseline_wpm" IS 'Ay sonuna kadarki en son seviye belirlemenin hızı; yoksa boş';
COMMENT ON COLUMN "v_student_monthly"."baseline_comprehension" IS 'Aynı seviye belirlemenin anlama oranı; yoksa boş';
COMMENT ON COLUMN "v_student_monthly"."median_wpm_vs_baseline" IS 'Hız ortancasının başlangıca göre farkı; başlangıç yoksa boş';
COMMENT ON COLUMN "v_student_monthly"."comprehension_vs_baseline" IS 'Anlama oranının başlangıca göre farkı; başlangıç ya da sorulu okuma yoksa boş';
