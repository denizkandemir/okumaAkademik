// https://docs.expo.dev/guides/customizing-metro/
const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// server/ bağımsız bir Node.js projesidir (kendi node_modules'ı var); Metro taramamalı ve izlememeli.
// Yalnızca kökteki server/ klasörünü hedefler (react-dom/server gibi paketlere dokunmaz).
// Windows'ta sürücü harfi "c:" ya da "C:" gelebildiği ve ayraç / ya da \ olabildiği için desen
// büyük/küçük harfe duyarsızdır ve her iki ayracı da kabul eder. Expo tüm blockList desenlerini
// tek bir RegExp'te birleştirir ve farklı bayraklara (ör. /i) izin vermez; bu yüzden harf
// duyarsızlığı bayrakla değil, her harf için [cC] gibi bir sınıfla sağlanır.
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const caseless = (value) =>
  escapeRegExp(value).replace(/[a-z]/gi, (c) => `[${c.toLowerCase()}${c.toUpperCase()}]`);
const serverParts = path.resolve(__dirname, 'server').split(/[\\/]/).map(caseless);
const serverPattern = new RegExp(`^${serverParts.join('[\\\\/]')}[\\\\/].*$`);

const existing = config.resolver.blockList;
config.resolver.blockList = [
  ...(Array.isArray(existing) ? existing : existing ? [existing] : []),
  serverPattern,
];

module.exports = config;
