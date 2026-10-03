-- schema.prisma'daki `///` açıklamalarını veritabanına yazar; DBeaver, TablePlus, psql (\d+)
-- gibi araçlar tablo ve kolon açıklaması olarak gösterir. Prisma COMMENT'leri yönetmez;
-- schema.prisma'da bir açıklama değişirse yeni bir migration ile burada da güncelleyin.

COMMENT ON TYPE "reading_level" IS 'Metin zorluk seviyesi. API''de sayı olarak döner: BASLANGIC=1, ORTA=2, ILERI=3';

-- users
COMMENT ON TABLE "users" IS 'Uygulamaya kayıtlı öğrenci. Kişisel veri en aza indirilmiştir (e-posta, doğum tarihi yok).';
COMMENT ON COLUMN "users"."id" IS 'Birincil anahtar (cuid), ör. "cmg8x1k2p0000abcd1234efgh"';
COMMENT ON COLUMN "users"."username" IS 'Giriş için kullanıcı adı; her zaman küçük harfe normalize edilir, ör. "ayse.k"';
COMMENT ON COLUMN "users"."password_hash" IS 'Şifrenin argon2id hash''i. Şifrenin kendisi hiçbir yerde saklanmaz.';
COMMENT ON COLUMN "users"."name" IS 'Ekranda gösterilen ad, ör. "Ayşe"';
COMMENT ON COLUMN "users"."grade" IS 'Okuduğu sınıf, 1-8 arası, ör. 3';
COMMENT ON COLUMN "users"."daily_goal_minutes" IS 'Günlük okuma hedefi (dakika), ör. 10';
COMMENT ON COLUMN "users"."created_at" IS 'Kaydın oluşturulma zamanı';
COMMENT ON COLUMN "users"."updated_at" IS 'Kaydın son güncellenme zamanı (uygulama tarafından otomatik)';

-- auth_sessions
COMMENT ON TABLE "auth_sessions" IS 'Giriş (kimlik doğrulama) oturumu; okuma oturumu ile karıştırılmamalı. İstemciye giden opak token saklanmaz, yalnızca SHA-256 hash''i tutulur. Çıkışta veya süresi dolunca silinir.';
COMMENT ON COLUMN "auth_sessions"."id" IS 'Birincil anahtar (cuid)';
COMMENT ON COLUMN "auth_sessions"."token_hash" IS 'Token''ın SHA-256 hash''i (64 karakter hex). Token''ın kendisi saklanmaz.';
COMMENT ON COLUMN "auth_sessions"."user_id" IS 'Oturumun sahibi olan kullanıcı (users.id)';
COMMENT ON COLUMN "auth_sessions"."expires_at" IS 'Oturumun geçersiz olacağı zaman; kullanıldıkça 30 gün ileri kayar';
COMMENT ON COLUMN "auth_sessions"."created_at" IS 'Girişin yapıldığı zaman';
COMMENT ON COLUMN "auth_sessions"."last_used_at" IS 'Oturumun son kullanıldığı zaman (en fazla 5 dakikada bir güncellenir)';

-- texts
COMMENT ON TABLE "texts" IS 'Okuma metni (hikâye). Kullanıcılara sınıflarına uygun olanlar listelenir.';
COMMENT ON COLUMN "texts"."id" IS 'Okunabilir kimlik (slug), ör. "minik-serce"';
COMMENT ON COLUMN "texts"."title" IS 'Metnin başlığı, ör. "Minik Serçe"';
COMMENT ON COLUMN "texts"."level" IS 'Zorluk seviyesi, ör. BASLANGIC';
COMMENT ON COLUMN "texts"."estimated_minutes" IS 'Tahmini okuma süresi (dakika), ör. 3';
COMMENT ON COLUMN "texts"."paragraphs" IS 'Metnin paragrafları, sırasıyla';
COMMENT ON COLUMN "texts"."min_grade" IS 'Metnin uygun olduğu en küçük sınıf (1-8), ör. 1';
COMMENT ON COLUMN "texts"."max_grade" IS 'Metnin uygun olduğu en büyük sınıf (1-8), ör. 4';
COMMENT ON COLUMN "texts"."created_at" IS 'Kaydın oluşturulma zamanı';
COMMENT ON COLUMN "texts"."updated_at" IS 'Kaydın son güncellenme zamanı (uygulama tarafından otomatik)';

-- reading_sessions
COMMENT ON TABLE "reading_sessions" IS 'Bir kullanıcının bir metni bir kez okuması. Metin her açılışta yeni bir kayıt oluşur; okuma sırasında ilerleme ve süre güncellenir.';
COMMENT ON COLUMN "reading_sessions"."id" IS 'Birincil anahtar (cuid)';
COMMENT ON COLUMN "reading_sessions"."user_id" IS 'Okuyan kullanıcı (users.id)';
COMMENT ON COLUMN "reading_sessions"."text_id" IS 'Okunan metin (texts.id), ör. "minik-serce"';
COMMENT ON COLUMN "reading_sessions"."started_at" IS 'Okumanın başladığı zaman; günlük hedef bu zamanın günüyle (Türkiye saati) hesaplanır';
COMMENT ON COLUMN "reading_sessions"."ended_at" IS 'Son ilerleme kaydının zamanı; hiç kaydedilmediyse boş';
COMMENT ON COLUMN "reading_sessions"."duration_seconds" IS 'Toplam okuma süresi (saniye), ör. 185';
COMMENT ON COLUMN "reading_sessions"."progress" IS 'Okuma ilerlemesi, 0 ile 1 arası oran, ör. 0.6 (= %60)';
COMMENT ON COLUMN "reading_sessions"."completed" IS 'Metin sonuna kadar okundu mu';
COMMENT ON COLUMN "reading_sessions"."updated_at" IS 'Kaydın son güncellenme zamanı (uygulama tarafından otomatik)';

-- CHECK kısıtları
COMMENT ON CONSTRAINT "users_grade_range_check" ON "users" IS 'Sınıf 1 ile 8 arasında olmalı';
COMMENT ON CONSTRAINT "users_daily_goal_minutes_positive_check" ON "users" IS 'Günlük hedef 0''dan büyük olmalı';
COMMENT ON CONSTRAINT "users_username_lowercase_check" ON "users" IS 'Kullanıcı adı küçük harfle saklanmalı';
COMMENT ON CONSTRAINT "texts_estimated_minutes_positive_check" ON "texts" IS 'Tahmini süre 0''dan büyük olmalı';
COMMENT ON CONSTRAINT "texts_grade_range_check" ON "texts" IS '1 <= min_grade <= max_grade <= 8';
COMMENT ON CONSTRAINT "reading_sessions_progress_range_check" ON "reading_sessions" IS 'İlerleme 0 ile 1 arasında olmalı';
COMMENT ON CONSTRAINT "reading_sessions_duration_seconds_non_negative_check" ON "reading_sessions" IS 'Süre negatif olamaz';
