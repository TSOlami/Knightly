// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add additional Reanimated configuration
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

module.exports = config;