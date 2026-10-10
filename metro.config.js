// https://docs.expo.dev/guides/customizing-metro/
const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// server/ bağımsız bir Node.js projesidir (kendi node_modules'ı var); Metro taramamalı ve izlememeli.
// Yalnızca kökteki server/ klasörünü hedefler (react-dom/server gibi paketlere dokunmaz).
// Windows'ta sürücü harfi "c:" ya da "C:" gelebildiği ve ayraç / ya da \ olabildiği için desen
// büyük/küçük harfe duyarsızdır ve her iki ayracı da kabul eder.
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const serverParts = path.resolve(__dirname, 'server').split(/[\\/]/).map(escapeRegExp);
const serverPattern = new RegExp(`^${serverParts.join('[\\\\/]')}[\\\\/].*$`, 'i');

const existing = config.resolver.blockList;
config.resolver.blockList = [
  ...(Array.isArray(existing) ? existing : existing ? [existing] : []),
  serverPattern,
];

module.exports = config;
