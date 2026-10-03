# Okumatik

İlkokul ve ortaokul öğrencilerine (7-14 yaş) yönelik okuma uygulaması.

- **Mobil/web uygulama** (kök klasör): Expo SDK 57 + Expo Router
- **Backend** (`server/`): Node.js 22+, Fastify, Prisma, PostgreSQL. Kök projeden bağımsızdır,
  kendi `package.json`'u vardır.

## Geliştirme ortamı

Gerekenler:

- **Node.js 22.12+**
- **Docker Desktop** (PostgreSQL veritabanı Docker'da çalışır). Komutları çalıştırmadan önce
  Docker Desktop'ın açık olduğundan emin olun.

### İlk kurulum (bir kez)

**Backend** — `server/` klasöründe:

```bash
cd server
npm install                  # bağımlılıklar + Prisma istemcisi
cp .env.example .env         # varsayılan değerler docker-compose.yml ile uyumludur
npm run db:up                # PostgreSQL'i Docker'da başlatır (okumatik + okumatik_test)
npm run db:migrate           # tabloları oluşturur (migration'ları uygular)
npm run db:seed              # 5 metin + test kullanıcıları (aşağıya bakın)
```

**Uygulama** — kök klasörde:

```bash
npm install
cp .env.example .env         # EXPO_PUBLIC_API_URL
```

Seed'in oluşturduğu kullanıcılar (hepsinin şifresi `1234`):

| Kullanıcı adı | Sınıf | Açıklama                                              |
| ------------- | ----- | ----------------------------------------------------- |
| `deneme`      | 3     | Uygulamayı elle denemek için; okuma geçmişi yok       |
| `elif`        | 2     | Son 7 güne yayılmış okuma geçmişi; günlük hedef 10 dk |
| `kerem`       | 5     | Okuma geçmişi; günlük hedef 15 dk                     |
| `zeynep`      | 7     | Okuma geçmişi; günlük hedef 20 dk                     |

`npm run db:seed` tekrar çalıştırılabilir: kullanıcılar ve metinler güncellenir, örnek okuma
geçmişi bugüne göre yeniden yazılır; uygulamada oluşturduğunuz kayıtlara dokunulmaz.

### Günlük çalıştırma

İki ayrı terminal açın:

| Terminal | Klasör    | Komut                            | Ne yapar                                |
| -------- | --------- | -------------------------------- | --------------------------------------- |
| 1        | `server/` | `npm run db:up` ve `npm run dev` | Veritabanı + API: http://localhost:3000 |
| 2        | kök       | `npx expo start`                 | Uygulama (w: web, a: Android, i: iOS)   |

`npm run db:up` veritabanı zaten çalışıyorsa bir şey yapmaz; Docker Desktop açıksa
veritabanı genelde kendiliğinden başlar. API değişikliklerde kendini yeniden başlatır.
Kontrol: `curl http://localhost:3000/health` → `{"ok":true}`

`EXPO_PUBLIC_API_URL` cihaza göre değişir:

| Nerede çalışıyor    | Adres                                                    |
| ------------------- | -------------------------------------------------------- |
| Web, iOS simülatörü | `http://localhost:3000`                                  |
| Android emülatörü   | `http://10.0.2.2:3000`                                   |
| Fiziksel cihaz      | Bilgisayarın yerel IP'si, ör. `http://192.168.1.20:3000` |

Fiziksel cihazda telefon ve bilgisayar aynı ağda olmalı. Web'den erişilecekse Expo web
adresi `server/.env` içindeki `CORS_ORIGINS`'te bulunmalı (varsayılan `http://localhost:8081`).
`.env` değişikliğinden sonra Expo'yu yeniden başlatın.

### Veritabanını görüntüleme

Tabloların, kolonların ve görünümlerin (view) açıklaması: [server/docs/veritabani.md](server/docs/veritabani.md)

**Prisma Studio** (en kolayı) — `server/` içinde:

```bash
npm run db:studio            # tarayıcıda açılır; tabloları gezip düzenleyebilirsiniz
```

**DBeaver / TablePlus / pgAdmin** — yeni bir PostgreSQL bağlantısı ekleyin:

| Ayar       | Değer       |
| ---------- | ----------- |
| Host       | `localhost` |
| Port       | `5432`      |
| Kullanıcı  | `okumatik`  |
| Şifre      | `okumatik`  |
| Veritabanı | `okumatik`  |

(`okumatik_test` testler içindir ve her testte silinir; orada veri aramayın.)

Tablolar `public` şemasındadır: `users`, `auth_sessions`, `texts`, `reading_sessions`. Kolon
açıklamaları araçların "Comment" alanında görünür. Hazır rapor görünümleri:

```sql
SELECT * FROM v_user_summary;                    -- kullanıcı başına toplam dakika, bitirilen metin
SELECT * FROM v_daily_reading;                   -- gün gün okunan dakika ve hedefe ulaşıldı mı
SELECT * FROM v_reading_history LIMIT 20;        -- son okumalar (metin, seviye, süre, ilerleme)
SELECT * FROM v_daily_reading WHERE username = 'elif';
```

Görünümlerdeki zamanlar Türkiye saatidir. Tablolardaki zaman kolonları saat dilimlidir
(`timestamptz`) ve araç oturumunun saat diliminde gösterilir (varsayılan UTC, `+00`). Türkiye
saatiyle görmek için oturumda `SET TIME ZONE 'Europe/Istanbul';` çalıştırın. Veritabanının
varsayılan saat dilimini değiştirmeyin; ayrıntı için [server/docs/veritabani.md](server/docs/veritabani.md).

### Testler ve kontroller

```bash
# Backend (server/ içinde; PostgreSQL çalışıyor olmalı)
npm run typecheck
npm run lint
npm test                     # okumatik_test veritabanını kullanır ve her testte temizler

# Uygulama (kök klasörde)
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

`okumatik_test` veritabanı, Docker volume'u ilk kez oluşturulurken otomatik açılır. Yoksa:
`docker compose exec postgres createdb -U okumatik okumatik_test` (server/ içinde).

### Sık kullanılan backend komutları

```bash
npm run db:reset             # veritabanını siler (onay ister), migration + seed yeniden çalışır
npx prisma migrate dev --create-only --name <ad>   # şema değişikliğinden sonra yeni migration
npm run db:migrate           # bekleyen migration'ları uygular
npm run db:studio            # veritabanını tarayıcıda incele
npm run build && npm start   # derlenmiş sürümü çalıştır
```

Yeni migration oluştururken üretilen SQL'i uygulamadan önce kontrol edin: Prisma yeniden
adlandırmaları DROP + ADD olarak üretir ve veri kaybettirir; bu durumda `ALTER ... RENAME`
ile elle düzeltin.

## API özeti

Tüm hatalar `{ message, code, fieldErrors? }` biçimindedir; `message` Türkçedir.

| Uç                            | Açıklama                                                  |
| ----------------------------- | --------------------------------------------------------- |
| `POST /auth/register`         | Kayıt → `201 { token, user }`                             |
| `POST /auth/login`            | Giriş → `{ token, user }`                                 |
| `POST /auth/logout`           | Oturumu siler → `204`                                     |
| `GET /me`                     | `{ user }`                                                |
| `GET /me/progress`            | Günlük hedef (Türkiye saatiyle bugün) ve "devam et" metni |
| `GET /texts`                  | Kullanıcının sınıfına uygun metinler (paragraflar hariç)  |
| `GET /texts/:id`              | Metnin tamamı                                             |
| `POST /reading-sessions`      | `{ textId }` → `201 { id }`                               |
| `PATCH /reading-sessions/:id` | `{ progress, durationSeconds, completed }`                |
| `GET /health`                 | `{ ok: true }`                                            |

Kimlik doğrulama `Authorization: Bearer <token>` başlığıyla yapılır. Token opaktır; sunucuda
yalnızca SHA-256 hash'i tutulur ve 30 gün boyunca, kullanıldıkça uzayarak geçerlidir.

## Klasör yapısı

- `src/app/` — Expo Router ekranları (`(auth)`, `(tabs)`, `reading/[id]`)
- `src/features/` — özellik bazlı kod (auth, reading)
- `src/lib/` — API istemcisi ve güvenli depolama sarmalayıcısı
- `src/components/`, `src/hooks/`, `src/constants/` — ortak arayüz parçaları ve tema
- `server/src/` — `app.ts` (Fastify kurulumu), `server.ts` (giriş noktası), `modules/`
  (auth, texts, progress), `plugins/` (auth, hata işleyici, CORS, rate limit)
- `server/prisma/` — şema, migration'lar ve seed
