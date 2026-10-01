# Okumatik

İlkokul ve ortaokul öğrencilerine (7-14 yaş) yönelik okuma uygulaması.

- **Mobil/web uygulama** (kök klasör): Expo SDK 57 + Expo Router
- **Backend** (`server/`): Node.js 22+, Fastify, Prisma, PostgreSQL. Kök projeden bağımsızdır,
  kendi `package.json`'u vardır.

## Geliştirme ortamı

Gerekenler: Node.js 22.12+, Docker (PostgreSQL için).

### 1. Backend

```bash
cd server
npm install                  # Prisma istemcisini de üretir
cp .env.example .env
npm run db:up                # PostgreSQL'i Docker'da başlatır (okumatik + okumatik_test)
npm run db:migrate           # migration'ları uygular
npm run db:seed              # 5 metin + test kullanıcısı: deneme / 1234
npm run dev                  # http://localhost:3000 (değişikliklerde yeniden başlar)
```

Kontrol: `curl http://localhost:3000/health` → `{"ok":true}`

### 2. Uygulama

Ayrı bir terminalde, kök klasörde:

```bash
npm install
cp .env.example .env         # EXPO_PUBLIC_API_URL
npx expo start               # w: web, a: Android, i: iOS
```

`EXPO_PUBLIC_API_URL` cihaza göre değişir:

| Nerede çalışıyor    | Adres                                                    |
| ------------------- | -------------------------------------------------------- |
| Web, iOS simülatörü | `http://localhost:3000`                                  |
| Android emülatörü   | `http://10.0.2.2:3000`                                   |
| Fiziksel cihaz      | Bilgisayarın yerel IP'si, ör. `http://192.168.1.20:3000` |

Fiziksel cihazda telefon ve bilgisayar aynı ağda olmalı. Web'den erişilecekse Expo web
adresi `server/.env` içindeki `CORS_ORIGINS`'te bulunmalı (varsayılan `http://localhost:8081`).
`.env` değişikliğinden sonra Expo'yu yeniden başlatın.

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
npm run db:reset             # veritabanını sıfırlar, migration + seed yeniden çalışır
npx prisma migrate dev --name <ad>   # şema değişikliğinden sonra yeni migration
npx prisma studio            # veritabanını tarayıcıda incele
npm run build && npm start   # derlenmiş sürümü çalıştır
```

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
