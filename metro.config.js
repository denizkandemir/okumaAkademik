// https://docs.expo.dev/guides/customizing-metro/
const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// server/ bağımsız bir Node.js projesidir (kendi node_modules'ı var); Metro taramamalı.
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const serverDir = path.resolve(__dirname, 'server');
config.resolver.blockList = [
  ...[config.resolver.blockList ?? []].flat(),
  new RegExp(`^${escapeRegExp(serverDir)}[/\\\\]`),
];

module.exports = config;
