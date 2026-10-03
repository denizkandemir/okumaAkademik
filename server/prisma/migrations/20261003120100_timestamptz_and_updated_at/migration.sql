-- Zaman kolonlarını saat dilimli (timestamptz) yapar ve updated_at kolonlarını ekler.
-- Elle düzenlendi: mevcut değerler Prisma tarafından UTC olarak yazıldığı için
-- "AT TIME ZONE 'UTC'" ile aynı anı gösterecek şekilde dönüştürülür.

ALTER TABLE "users"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC';

ALTER TABLE "auth_sessions"
  ALTER COLUMN "expires_at" TYPE TIMESTAMPTZ(3) USING "expires_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "last_used_at" TYPE TIMESTAMPTZ(3) USING "last_used_at" AT TIME ZONE 'UTC';

ALTER TABLE "texts"
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ(3) USING "created_at" AT TIME ZONE 'UTC';

ALTER TABLE "reading_sessions"
  ALTER COLUMN "started_at" TYPE TIMESTAMPTZ(3) USING "started_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "ended_at" TYPE TIMESTAMPTZ(3) USING "ended_at" AT TIME ZONE 'UTC';

-- updated_at: Prisma (@updatedAt) her güncellemede doldurur. Varsayılan değer, SQL aracından
-- elle eklenen satırlar için de dolu olmasını sağlar. Mevcut satırlar en yakın tahminle doldurulur.
ALTER TABLE "users" ADD COLUMN "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "users" SET "updated_at" = "created_at";

ALTER TABLE "texts" ADD COLUMN "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "texts" SET "updated_at" = "created_at";

ALTER TABLE "reading_sessions" ADD COLUMN "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "reading_sessions" SET "updated_at" = COALESCE("ended_at", "started_at");

-- Not: Veritabanının varsayılan saat dilimi (TimeZone) bilerek değiştirilmez. Prisma'nın pg
-- adapter'ı oturumun UTC olduğunu varsayar (bkz. src/db.ts). SQL araçlarında Türkiye saatiyle
-- görmek için oturumda `SET TIME ZONE 'Europe/Istanbul';` çalıştırın veya v_* görünümlerini
-- kullanın (bkz. docs/veritabani.md).
