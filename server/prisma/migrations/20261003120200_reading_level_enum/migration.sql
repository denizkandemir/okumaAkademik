-- texts.level: 1/2/3 sayısı yerine okunabilir reading_level enum'u.
-- Elle düzenlendi: Prisma kolonu silip yeniden eklerdi; burada mevcut değerler dönüştürülür.
-- Enum değerlerinin sırası seviye sırasıdır (ORDER BY level yine kolaydan zora sıralar).
-- texts_level_range_check (level BETWEEN 1 AND 3) artık enum tarafından garanti edildiği için kaldırılır.

CREATE TYPE "reading_level" AS ENUM ('BASLANGIC', 'ORTA', 'ILERI');

ALTER TABLE "texts" DROP CONSTRAINT "texts_level_range_check";

ALTER TABLE "texts"
  ALTER COLUMN "level" TYPE "reading_level"
  USING (
    CASE "level"
      WHEN 1 THEN 'BASLANGIC'
      WHEN 2 THEN 'ORTA'
      WHEN 3 THEN 'ILERI'
    END
  )::"reading_level";
