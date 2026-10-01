# Okumatik

İlkokul ve ortaokul öğrencilerine (7-14 yaş) yönelik okuma uygulaması. Expo (SDK 57) + Expo Router.

## Başlangıç

```bash
npm install
cp .env.example .env   # EXPO_PUBLIC_API_URL değerini düzenleyin
npx expo start
```

## Komutlar

```bash
npx expo start      # geliştirme sunucusu
npx expo lint       # ESLint + Prettier
npx tsc --noEmit    # tip kontrolü
npx expo-doctor     # bağımlılık/yapılandırma kontrolü
```

## Klasör yapısı

- `src/app/` — Expo Router ekranları (`(auth)`, `(tabs)`, `reading/[id]`)
- `src/features/` — özellik bazlı kod (auth, reading)
- `src/lib/` — API istemcisi ve güvenli depolama sarmalayıcısı
- `src/components/`, `src/hooks/`, `src/constants/` — ortak arayüz parçaları ve tema
