-- Tablo, kolon, index ve kısıt adlarını snake_case'e çevirir; Session tablosu auth_sessions olur
-- ("okuma oturumu" ile karışmasın). Elle yazıldı: Prisma'nın ürettiği DROP TABLE/CREATE TABLE
-- yerine yalnızca RENAME kullanılır, veri kaybolmaz. Hedef adlar Prisma'nın @@map/@map
-- sonrası beklediği varsayılan adlarla aynıdır (ör. reading_sessions_user_id_started_at_idx).

-- users
ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "users" RENAME COLUMN "passwordHash" TO "password_hash";
ALTER TABLE "users" RENAME COLUMN "dailyGoalMinutes" TO "daily_goal_minutes";
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "users" RENAME CONSTRAINT "User_pkey" TO "users_pkey";
ALTER INDEX "User_username_key" RENAME TO "users_username_key";
ALTER TABLE "users" RENAME CONSTRAINT "User_grade_check" TO "users_grade_range_check";
ALTER TABLE "users" RENAME CONSTRAINT "User_dailyGoalMinutes_check" TO "users_daily_goal_minutes_positive_check";
ALTER TABLE "users" RENAME CONSTRAINT "User_username_lowercase_check" TO "users_username_lowercase_check";

-- auth_sessions (eski adı Session)
ALTER TABLE "Session" RENAME TO "auth_sessions";
ALTER TABLE "auth_sessions" RENAME COLUMN "tokenHash" TO "token_hash";
ALTER TABLE "auth_sessions" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "auth_sessions" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "auth_sessions" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "auth_sessions" RENAME COLUMN "lastUsedAt" TO "last_used_at";
ALTER TABLE "auth_sessions" RENAME CONSTRAINT "Session_pkey" TO "auth_sessions_pkey";
ALTER TABLE "auth_sessions" RENAME CONSTRAINT "Session_userId_fkey" TO "auth_sessions_user_id_fkey";
ALTER INDEX "Session_tokenHash_key" RENAME TO "auth_sessions_token_hash_key";
ALTER INDEX "Session_userId_idx" RENAME TO "auth_sessions_user_id_idx";

-- texts
ALTER TABLE "Text" RENAME TO "texts";
ALTER TABLE "texts" RENAME COLUMN "estimatedMinutes" TO "estimated_minutes";
ALTER TABLE "texts" RENAME COLUMN "minGrade" TO "min_grade";
ALTER TABLE "texts" RENAME COLUMN "maxGrade" TO "max_grade";
ALTER TABLE "texts" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "texts" RENAME CONSTRAINT "Text_pkey" TO "texts_pkey";
ALTER TABLE "texts" RENAME CONSTRAINT "Text_level_check" TO "texts_level_range_check";
ALTER TABLE "texts" RENAME CONSTRAINT "Text_estimatedMinutes_check" TO "texts_estimated_minutes_positive_check";
ALTER TABLE "texts" RENAME CONSTRAINT "Text_grade_range_check" TO "texts_grade_range_check";

-- reading_sessions
ALTER TABLE "ReadingSession" RENAME TO "reading_sessions";
ALTER TABLE "reading_sessions" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "reading_sessions" RENAME COLUMN "textId" TO "text_id";
ALTER TABLE "reading_sessions" RENAME COLUMN "startedAt" TO "started_at";
ALTER TABLE "reading_sessions" RENAME COLUMN "endedAt" TO "ended_at";
ALTER TABLE "reading_sessions" RENAME COLUMN "durationSeconds" TO "duration_seconds";
ALTER TABLE "reading_sessions" RENAME CONSTRAINT "ReadingSession_pkey" TO "reading_sessions_pkey";
ALTER TABLE "reading_sessions" RENAME CONSTRAINT "ReadingSession_userId_fkey" TO "reading_sessions_user_id_fkey";
ALTER TABLE "reading_sessions" RENAME CONSTRAINT "ReadingSession_textId_fkey" TO "reading_sessions_text_id_fkey";
ALTER INDEX "ReadingSession_userId_startedAt_idx" RENAME TO "reading_sessions_user_id_started_at_idx";
ALTER TABLE "reading_sessions" RENAME CONSTRAINT "ReadingSession_progress_check" TO "reading_sessions_progress_range_check";
ALTER TABLE "reading_sessions" RENAME CONSTRAINT "ReadingSession_durationSeconds_check" TO "reading_sessions_duration_seconds_non_negative_check";
