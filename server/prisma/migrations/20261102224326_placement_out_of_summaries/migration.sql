-- Seviye belirleme okumaları öğrenci özetlerinin hız, anlama ve sayı ölçülerine girmez (sonucu
-- user_baselines'ta ayrı tutulur); okuma süresine (read_minutes) sayılır. Günlük hedef ve seri
-- reading_sessions'tan hesaplandığı için onlara da sayılır.
-- v_reading_metrics tüm ölçülen okumaları göstermeye devam eder; sona is_placement eklenir.
-- CREATE OR REPLACE VIEW yalnızca sona kolon ekleyebildiği için mevcut kolonlar aynı sırayla kalır.

CREATE OR REPLACE VIEW "v_reading_metrics" AS
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
  m."rushed",
  EXISTS (SELECT 1 FROM "placement_texts" pt WHERE pt."text_id" = rs."text_id") AS "is_placement"
FROM "reading_metrics" m
JOIN "reading_sessions" rs ON rs."id" = m."reading_session_id"
JOIN "users" u ON u."id" = rs."user_id"
JOIN "texts" t ON t."id" = rs."text_id"
ORDER BY rs."started_at" DESC;

COMMENT ON COLUMN "v_reading_metrics"."is_placement" IS 'Seviye belirleme okuması mı (özetlerin hız, anlama ve sayı ölçülerine girmez)';

CREATE OR REPLACE VIEW "v_student_daily" AS
SELECT
  "username",
  "reading_date",
  round(sum("duration_seconds") / 60.0, 1) AS "read_minutes",
  (count(DISTINCT "text_id") FILTER (WHERE NOT "is_placement"))::integer AS "text_count",
  (count(*) FILTER (WHERE NOT "is_placement"))::integer AS "reading_count",
  round((percentile_cont(0.5) WITHIN GROUP (ORDER BY "words_per_minute") FILTER (WHERE NOT "is_placement"))::numeric, 1) AS "median_wpm",
  round(sum("first_try_correct") FILTER (WHERE NOT "is_placement")::numeric / NULLIF(sum("questions_total") FILTER (WHERE NOT "is_placement"), 0), 2) AS "comprehension",
  (count(*) FILTER (WHERE "rushed" AND NOT "is_placement"))::integer AS "rushed_count"
FROM "v_reading_metrics"
GROUP BY "username", "reading_date"
ORDER BY "username", "reading_date" DESC;

COMMENT ON COLUMN "v_student_daily"."read_minutes" IS 'Biten okumaların süresi (dakika, 1 ondalık; seviye belirleme dahil)';
COMMENT ON COLUMN "v_student_daily"."text_count" IS 'Okunan farklı metin sayısı (seviye belirleme hariç)';
COMMENT ON COLUMN "v_student_daily"."reading_count" IS 'Biten okuma sayısı (seviye belirleme hariç)';
COMMENT ON COLUMN "v_student_daily"."median_wpm" IS 'Dakikadaki kelimenin ortancası (seviye belirleme hariç)';
COMMENT ON COLUMN "v_student_daily"."comprehension" IS 'Anlama: ilk denemede doğru / soru (sorulu okumalar, seviye belirleme hariç); yoksa boş';
COMMENT ON COLUMN "v_student_daily"."rushed_count" IS 'Acele okuma sayısı (seviye belirleme hariç)';

CREATE OR REPLACE VIEW "v_student_weekly" AS
WITH weeks AS (
  SELECT
    "username",
    date_trunc('week', "reading_date")::date AS "week_start",
    round(sum("duration_seconds") / 60.0, 1) AS "read_minutes",
    (count(DISTINCT "text_id") FILTER (WHERE NOT "is_placement"))::integer AS "text_count",
    (count(*) FILTER (WHERE NOT "is_placement"))::integer AS "reading_count",
    round((percentile_cont(0.5) WITHIN GROUP (ORDER BY "words_per_minute") FILTER (WHERE NOT "is_placement"))::numeric, 1) AS "median_wpm",
    round(sum("first_try_correct") FILTER (WHERE NOT "is_placement")::numeric / NULLIF(sum("questions_total") FILTER (WHERE NOT "is_placement"), 0), 2) AS "comprehension",
    (count(*) FILTER (WHERE "rushed" AND NOT "is_placement"))::integer AS "rushed_count"
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

COMMENT ON COLUMN "v_student_weekly"."read_minutes" IS 'Biten okumaların süresi (dakika, 1 ondalık; seviye belirleme dahil)';
COMMENT ON COLUMN "v_student_weekly"."text_count" IS 'Okunan farklı metin sayısı (seviye belirleme hariç)';
COMMENT ON COLUMN "v_student_weekly"."reading_count" IS 'Biten okuma sayısı (seviye belirleme hariç)';
COMMENT ON COLUMN "v_student_weekly"."median_wpm" IS 'Dakikadaki kelimenin ortancası (seviye belirleme hariç)';
COMMENT ON COLUMN "v_student_weekly"."comprehension" IS 'Anlama: ilk denemede doğru / soru (seviye belirleme hariç); sorulu okuma yoksa boş';
COMMENT ON COLUMN "v_student_weekly"."rushed_count" IS 'Acele okuma sayısı (seviye belirleme hariç)';

CREATE OR REPLACE VIEW "v_student_monthly" AS
WITH months AS (
  SELECT
    "username",
    date_trunc('month', "reading_date")::date AS "month_start",
    round(sum("duration_seconds") / 60.0, 1) AS "read_minutes",
    (count(DISTINCT "text_id") FILTER (WHERE NOT "is_placement"))::integer AS "text_count",
    (count(*) FILTER (WHERE NOT "is_placement"))::integer AS "reading_count",
    round((percentile_cont(0.5) WITHIN GROUP (ORDER BY "words_per_minute") FILTER (WHERE NOT "is_placement"))::numeric, 1) AS "median_wpm",
    round(sum("first_try_correct") FILTER (WHERE NOT "is_placement")::numeric / NULLIF(sum("questions_total") FILTER (WHERE NOT "is_placement"), 0), 2) AS "comprehension",
    (count(*) FILTER (WHERE "rushed" AND NOT "is_placement"))::integer AS "rushed_count"
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

COMMENT ON COLUMN "v_student_monthly"."read_minutes" IS 'Biten okumaların süresi (dakika, 1 ondalık; seviye belirleme dahil)';
COMMENT ON COLUMN "v_student_monthly"."text_count" IS 'Okunan farklı metin sayısı (seviye belirleme hariç)';
COMMENT ON COLUMN "v_student_monthly"."reading_count" IS 'Biten okuma sayısı (seviye belirleme hariç)';
COMMENT ON COLUMN "v_student_monthly"."median_wpm" IS 'Dakikadaki kelimenin ortancası (seviye belirleme hariç)';
COMMENT ON COLUMN "v_student_monthly"."comprehension" IS 'Anlama: ilk denemede doğru / soru (seviye belirleme hariç); sorulu okuma yoksa boş';
COMMENT ON COLUMN "v_student_monthly"."rushed_count" IS 'Acele okuma sayısı (seviye belirleme hariç)';
