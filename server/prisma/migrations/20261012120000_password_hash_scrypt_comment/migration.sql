-- Şifre hash'i argon2id'den Node'un yerleşik scrypt'ine geçti; kolon açıklaması güncellenir.
COMMENT ON COLUMN "users"."password_hash" IS 'Şifrenin scrypt hash''i. Şifrenin kendisi hiçbir yerde saklanmaz.';
