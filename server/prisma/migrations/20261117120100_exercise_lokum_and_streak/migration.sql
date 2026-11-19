-- Egzersiz motoru (A1a), 2. kısım: egzersiz lokumu, seri ve günlük süre.
-- - lokum_entries.exercise_session_id: EXERCISE satırının egzersizi (tekil: bir egzersize bir ödül).
-- - v_user_journey: bitirilen egzersizin günü de seriye sayılır (src/lib/journey.ts ile aynı kural).
-- - v_daily_reading: o gün başlayan egzersizlerin süresi de günlük okumaya sayılır (/me/progress ile
--   aynı hesap). Egzersizler reading_metrics'e ve v_student_* özetlerine girmez.
-- - v_exercise_sessions: egzersizlerin okunabilir hâli.
-- CREATE OR REPLACE VIEW kolonları aynı sırayla korur.

-- AlterTable
ALTER TABLE "lokum_entries" ADD COLUMN "exercise_session_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "lokum_entries_exercise_session_id_key" ON "lokum_entries"("exercise_session_id");

-- AddForeignKey
ALTER TABLE "lokum_entries" ADD CONSTRAINT "lokum_entries_exercise_session_id_fkey" FOREIGN KEY ("exercise_session_id") REFERENCES "exercise_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "lokum_entries" ADD CONSTRAINT "lokum_entries_exercise_session_check" CHECK (
  "exercise_session_id" IS NULL OR "reason" = 'EXERCISE'
);

COMMENT ON TYPE "lokum_reason" IS 'Lokum kazanma sebebi: LESSON (hikâye), CHEST (sandık), LEVEL_UP (seviye atlama), CITY_UNLOCK (yeni şehir), EXERCISE (egzersiz, günde en fazla 3)';
COMMENT ON COLUMN "lokum_entries"."exercise_session_id" IS 'EXERCISE satırlarında ödülü doğuran egzersiz (exercise_sessions.id); diğerlerinde boş';
COMMENT ON CONSTRAINT "lokum_entries_exercise_session_check" ON "lokum_entries" IS 'Egzersiz yalnızca EXERCISE satırlarında dolu olabilir';

CREATE OR REPLACE VIEW "v_daily_reading" AS
WITH "activity" AS (
  SELECT "user_id", "started_at", "duration_seconds" FROM "reading_sessions"
  UNION ALL
  SELECT "user_id", "started_at", "duration_seconds" FROM "exercise_sessions"
)
SELECT
  u."username",
  (a."started_at" AT TIME ZONE 'Europe/Istanbul')::date AS "reading_date",
  -- API ile aynı: saniyeler toplanır, tam dakikaya aşağı yuvarlanır.
  (sum(a."duration_seconds") / 60)::integer AS "read_minutes",
  u."daily_goal_minutes",
  (sum(a."duration_seconds") / 60) >= u."daily_goal_minutes" AS "goal_reached"
FROM "activity" a
JOIN "users" u ON u."id" = a."user_id"
GROUP BY u."id", u."username", u."daily_goal_minutes", "reading_date"
ORDER BY "reading_date" DESC, u."username";

COMMENT ON VIEW "v_daily_reading" IS 'Kullanıcının her gün (Türkiye saati) okuduğu dakika (okumalar ve egzersizler) ve günlük hedefe ulaşıp ulaşmadığı. Yalnızca okuma yapılan günler listelenir.';
COMMENT ON COLUMN "v_daily_reading"."read_minutes" IS 'O gün okunan süre: okumalar ve egzersizler (tam dakika, aşağı yuvarlanmış)';

CREATE OR REPLACE VIEW "v_user_journey" AS
WITH "completed" AS (
  SELECT "user_id", count(*)::integer AS "lesson_count"
  FROM "lesson_completions"
  GROUP BY "user_id"
),
"lokum" AS (
  SELECT "user_id", sum("amount")::integer AS "balance"
  FROM "lokum_entries"
  GROUP BY "user_id"
),
-- Okumanın bitirildiği gün: son kayıt anı (ended_at), yoksa başlangıç. Bitirilen egzersizler de sayılır.
"reading_days" AS (
  SELECT DISTINCT
    "user_id",
    (COALESCE("ended_at", "started_at") AT TIME ZONE 'Europe/Istanbul')::date AS "day"
  FROM "reading_sessions"
  WHERE "completed"
  UNION
  SELECT
    "user_id",
    ("finished_at" AT TIME ZONE 'Europe/Istanbul')::date AS "day"
  FROM "exercise_sessions"
  WHERE "finished_at" IS NOT NULL
),
-- Art arda günler aynı gruba düşer (gün - sıra numarası sabittir).
"runs" AS (
  SELECT "user_id", max("day") AS "last_day", count(*)::integer AS "length"
  FROM (
    SELECT "user_id", "day", "day" - (row_number() OVER (PARTITION BY "user_id" ORDER BY "day"))::integer AS "grp"
    FROM "reading_days"
  ) AS "numbered"
  GROUP BY "user_id", "grp"
),
"current_runs" AS (
  SELECT "user_id", "length"
  FROM "runs"
  WHERE "last_day" >= (now() AT TIME ZONE 'Europe/Istanbul')::date - 1
),
"last_read" AS (
  SELECT "user_id", max(COALESCE("ended_at", "started_at")) AS "at"
  FROM "reading_sessions"
  GROUP BY "user_id"
)
SELECT
  u."username",
  u."name",
  u."grade",
  COALESCE(c."lesson_count", 0) AS "completed_lesson_count",
  lv."level",
  (ARRAY['İstanbul', 'İzmir', 'Efes', 'Antalya', 'Kapadokya', 'Van'])[(lv."level" - 1) / 5 + 1] AS "current_city",
  COALESCE(l."balance", 0) AS "lokum_balance",
  COALESCE(cr."length", 0) AS "current_streak",
  date_trunc('second', lr."at" AT TIME ZONE 'Europe/Istanbul') AS "last_read_at"
FROM "users" u
LEFT JOIN "completed" c ON c."user_id" = u."id"
LEFT JOIN "lokum" l ON l."user_id" = u."id"
LEFT JOIN "current_runs" cr ON cr."user_id" = u."id"
LEFT JOIN "last_read" lr ON lr."user_id" = u."id"
CROSS JOIN LATERAL (SELECT LEAST(30, 1 + COALESCE(c."lesson_count", 0) / 2) AS "level") lv
ORDER BY u."username";

COMMENT ON COLUMN "v_user_journey"."current_streak" IS 'Şu anki seri (gün; bitirilen okuma ya da egzersiz); bugün okunmadıysa dünden sayılır';

CREATE VIEW "v_exercise_sessions" AS
SELECT
  u."username",
  (es."started_at" AT TIME ZONE 'Europe/Istanbul')::date AS "exercise_date",
  ei."type" AS "exercise_type",
  ei."id" AS "item_id",
  ei."grade_band",
  t."title" AS "text_title",
  date_trunc('second', es."started_at" AT TIME ZONE 'Europe/Istanbul') AS "started_at",
  date_trunc('second', es."finished_at" AT TIME ZONE 'Europe/Istanbul') AS "finished_at",
  round(es."duration_seconds" / 60.0, 1) AS "duration_minutes",
  es."wpm_first",
  es."wpm_last",
  es."comprehension",
  es."score",
  COALESCE(le."amount", 0) AS "lokum"
FROM "exercise_sessions" es
JOIN "users" u ON u."id" = es."user_id"
JOIN "exercise_items" ei ON ei."id" = es."item_id"
LEFT JOIN "texts" t ON t."id" = ei."text_id"
LEFT JOIN "lokum_entries" le ON le."exercise_session_id" = es."id"
ORDER BY es."started_at" DESC;

COMMENT ON VIEW "v_exercise_sessions" IS 'Egzersizler, en yeniden eskiye (okunabilir hâli)';
COMMENT ON COLUMN "v_exercise_sessions"."username" IS 'Kullanıcı adı';
COMMENT ON COLUMN "v_exercise_sessions"."exercise_date" IS 'Gün (Türkiye saatine göre, egzersizin başladığı gün)';
COMMENT ON COLUMN "v_exercise_sessions"."exercise_type" IS 'Egzersiz türü, ör. TEKRARLI_OKUMA';
COMMENT ON COLUMN "v_exercise_sessions"."item_id" IS 'Egzersiz örneği (exercise_items.id)';
COMMENT ON COLUMN "v_exercise_sessions"."grade_band" IS 'Örneğin sınıf grubu';
COMMENT ON COLUMN "v_exercise_sessions"."text_title" IS 'Dayandığı metnin başlığı; metinsizse boş';
COMMENT ON COLUMN "v_exercise_sessions"."started_at" IS 'Başlangıç (Türkiye saati)';
COMMENT ON COLUMN "v_exercise_sessions"."finished_at" IS 'Bitiş (Türkiye saati); bitmediyse boş';
COMMENT ON COLUMN "v_exercise_sessions"."duration_minutes" IS 'Süre (dakika, 1 ondalık)';
COMMENT ON COLUMN "v_exercise_sessions"."wpm_first" IS 'İlk okumadaki dakikadaki kelime';
COMMENT ON COLUMN "v_exercise_sessions"."wpm_last" IS 'Son okumadaki dakikadaki kelime';
COMMENT ON COLUMN "v_exercise_sessions"."comprehension" IS 'Anlama oranı (0-1), ilk denemeye göre';
COMMENT ON COLUMN "v_exercise_sessions"."score" IS 'Türe özel puan (E1: hız değişimi, yüzde)';
COMMENT ON COLUMN "v_exercise_sessions"."lokum" IS 'Bu egzersizle kazanılan lokum (günde en fazla 3 egzersiz ödüllenir)';
