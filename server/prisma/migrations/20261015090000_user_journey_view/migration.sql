-- Kullanıcının yolculuk özeti (salt-okunur rapor görünümü).
-- Seviye, şehir ve seri saklanmaz; burada src/lib/journey.ts ile aynı kurallarla türetilir:
--   seviye = 1 + ⌊tamamlanan ders / 2⌋, en fazla 30; her şehir 5 seviye (1-5 İstanbul, ... 26-30 Van);
--   seri = Türkiye saatine göre art arda, en az bir okumanın bitirildiği gün sayısı. Bugün henüz
--   okunmadıysa seri dünden sayılır; dünden de okuma yoksa 0'dır.
-- Prisma view'ları yönetmez; değiştirmek için yeni bir migration'da CREATE OR REPLACE VIEW kullanın.

CREATE VIEW "v_user_journey" AS
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
-- Okumanın bitirildiği gün: son kayıt anı (ended_at), yoksa başlangıç.
"reading_days" AS (
  SELECT DISTINCT
    "user_id",
    (COALESCE("ended_at", "started_at") AT TIME ZONE 'Europe/Istanbul')::date AS "day"
  FROM "reading_sessions"
  WHERE "completed"
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

COMMENT ON VIEW "v_user_journey" IS 'Kullanıcı başına yolculuk özeti: tamamlanan ders, seviye, şehir, lokum bakiyesi ve seri (hepsi türetilmiş)';
COMMENT ON COLUMN "v_user_journey"."username" IS 'Kullanıcı adı';
COMMENT ON COLUMN "v_user_journey"."name" IS 'Ad';
COMMENT ON COLUMN "v_user_journey"."grade" IS 'Sınıf (1-8)';
COMMENT ON COLUMN "v_user_journey"."completed_lesson_count" IS 'Bitirilen farklı ders sayısı (sandıklar dahil)';
COMMENT ON COLUMN "v_user_journey"."level" IS 'Seviye: 1 + tamamlanan ders / 2 (aşağı yuvarlanır), en fazla 30';
COMMENT ON COLUMN "v_user_journey"."current_city" IS 'Seviyeye göre bulunduğu şehir';
COMMENT ON COLUMN "v_user_journey"."lokum_balance" IS 'Lokum bakiyesi (lokum_entries toplamı)';
COMMENT ON COLUMN "v_user_journey"."current_streak" IS 'Şu anki seri (gün); bugün okunmadıysa dünden sayılır';
COMMENT ON COLUMN "v_user_journey"."last_read_at" IS 'Son okuma zamanı (Türkiye saati); hiç okumadıysa boş';
