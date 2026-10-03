-- SQL araçlarından hızlı bakış için salt-okunur rapor görünümleri (view).
-- Gün sınırı ve gösterilen zamanlar Türkiye saatine göredir (API'deki günlük hedef hesabıyla aynı);
-- zaman kolonları saniyeye yuvarlanmış, saat dilimsiz yerel saattir, hangi SQL aracında
-- açılırsa açılsın aynı görünür.
-- Şifre hash'i ve token hash'i hiçbir görünümde yer almaz.
-- Prisma view'ları yönetmez; değiştirmek için yeni bir migration'da CREATE OR REPLACE VIEW kullanın.

-- Kullanıcı başına genel özet
CREATE VIEW "v_user_summary" AS
SELECT
  u."username",
  u."name",
  u."grade",
  round(COALESCE(sum(rs."duration_seconds"), 0) / 60.0, 1) AS "total_reading_minutes",
  count(DISTINCT rs."text_id") FILTER (WHERE rs."completed") AS "completed_text_count",
  date_trunc('second', max(COALESCE(rs."ended_at", rs."started_at")) AT TIME ZONE 'Europe/Istanbul') AS "last_read_at"
FROM "users" u
LEFT JOIN "reading_sessions" rs ON rs."user_id" = u."id"
GROUP BY u."id", u."username", u."name", u."grade"
ORDER BY u."username";

COMMENT ON VIEW "v_user_summary" IS 'Kullanıcı başına okuma özeti (tüm zamanlar)';
COMMENT ON COLUMN "v_user_summary"."username" IS 'Kullanıcı adı';
COMMENT ON COLUMN "v_user_summary"."name" IS 'Ad';
COMMENT ON COLUMN "v_user_summary"."grade" IS 'Sınıf (1-8)';
COMMENT ON COLUMN "v_user_summary"."total_reading_minutes" IS 'Toplam okuma süresi (dakika, 1 ondalık)';
COMMENT ON COLUMN "v_user_summary"."completed_text_count" IS 'Sonuna kadar okunan farklı metin sayısı';
COMMENT ON COLUMN "v_user_summary"."last_read_at" IS 'Son okuma zamanı (Türkiye saati); hiç okumadıysa boş';

-- Kullanıcı + gün başına okuma ve günlük hedef
CREATE VIEW "v_daily_reading" AS
SELECT
  u."username",
  (rs."started_at" AT TIME ZONE 'Europe/Istanbul')::date AS "reading_date",
  -- API ile aynı: saniyeler toplanır, tam dakikaya aşağı yuvarlanır.
  (sum(rs."duration_seconds") / 60)::integer AS "read_minutes",
  u."daily_goal_minutes",
  (sum(rs."duration_seconds") / 60) >= u."daily_goal_minutes" AS "goal_reached"
FROM "reading_sessions" rs
JOIN "users" u ON u."id" = rs."user_id"
GROUP BY u."id", u."username", u."daily_goal_minutes", "reading_date"
ORDER BY "reading_date" DESC, u."username";

COMMENT ON VIEW "v_daily_reading" IS 'Kullanıcının her gün (Türkiye saati) okuduğu dakika ve günlük hedefe ulaşıp ulaşmadığı. Yalnızca okuma yapılan günler listelenir.';
COMMENT ON COLUMN "v_daily_reading"."username" IS 'Kullanıcı adı';
COMMENT ON COLUMN "v_daily_reading"."reading_date" IS 'Gün (Türkiye saatine göre, okumanın başladığı gün)';
COMMENT ON COLUMN "v_daily_reading"."read_minutes" IS 'O gün okunan süre (tam dakika, aşağı yuvarlanmış)';
COMMENT ON COLUMN "v_daily_reading"."daily_goal_minutes" IS 'Kullanıcının şu anki günlük hedefi (dakika)';
COMMENT ON COLUMN "v_daily_reading"."goal_reached" IS 'Günlük hedefe ulaşıldı mı';

-- Tüm okuma kayıtları, okunabilir biçimde
CREATE VIEW "v_reading_history" AS
SELECT
  u."username",
  t."title" AS "text_title",
  CASE t."level"
    WHEN 'BASLANGIC' THEN 'Başlangıç'
    WHEN 'ORTA' THEN 'Orta'
    WHEN 'ILERI' THEN 'İleri'
  END AS "level_name",
  date_trunc('second', rs."started_at" AT TIME ZONE 'Europe/Istanbul') AS "started_at",
  date_trunc('second', rs."ended_at" AT TIME ZONE 'Europe/Istanbul') AS "ended_at",
  round(rs."duration_seconds" / 60.0, 1) AS "duration_minutes",
  round(rs."progress" * 100)::integer AS "progress_percent",
  rs."completed"
FROM "reading_sessions" rs
JOIN "users" u ON u."id" = rs."user_id"
JOIN "texts" t ON t."id" = rs."text_id"
ORDER BY rs."started_at" DESC;

COMMENT ON VIEW "v_reading_history" IS 'Tüm okuma kayıtları, en yeniden eskiye';
COMMENT ON COLUMN "v_reading_history"."username" IS 'Kullanıcı adı';
COMMENT ON COLUMN "v_reading_history"."text_title" IS 'Metin başlığı';
COMMENT ON COLUMN "v_reading_history"."level_name" IS 'Seviye adı (Başlangıç, Orta, İleri)';
COMMENT ON COLUMN "v_reading_history"."started_at" IS 'Okumanın başladığı zaman (Türkiye saati)';
COMMENT ON COLUMN "v_reading_history"."ended_at" IS 'Son ilerleme kaydının zamanı (Türkiye saati); hiç kaydedilmediyse boş';
COMMENT ON COLUMN "v_reading_history"."duration_minutes" IS 'Okuma süresi (dakika, 1 ondalık)';
COMMENT ON COLUMN "v_reading_history"."progress_percent" IS 'İlerleme (yüzde, 0-100)';
COMMENT ON COLUMN "v_reading_history"."completed" IS 'Metin sonuna kadar okundu mu';
