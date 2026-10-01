-- Uygulama doğrulamasına ek olarak veritabanı düzeyinde güvence.
ALTER TABLE "User" ADD CONSTRAINT "User_grade_check" CHECK ("grade" BETWEEN 1 AND 8);
ALTER TABLE "User" ADD CONSTRAINT "User_dailyGoalMinutes_check" CHECK ("dailyGoalMinutes" > 0);
ALTER TABLE "User" ADD CONSTRAINT "User_username_lowercase_check" CHECK ("username" = lower("username"));

ALTER TABLE "Text" ADD CONSTRAINT "Text_level_check" CHECK ("level" BETWEEN 1 AND 3);
ALTER TABLE "Text" ADD CONSTRAINT "Text_estimatedMinutes_check" CHECK ("estimatedMinutes" > 0);
ALTER TABLE "Text" ADD CONSTRAINT "Text_grade_range_check" CHECK ("minGrade" BETWEEN 1 AND 8 AND "maxGrade" BETWEEN "minGrade" AND 8);

ALTER TABLE "ReadingSession" ADD CONSTRAINT "ReadingSession_progress_check" CHECK ("progress" >= 0 AND "progress" <= 1);
ALTER TABLE "ReadingSession" ADD CONSTRAINT "ReadingSession_durationSeconds_check" CHECK ("durationSeconds" >= 0);
