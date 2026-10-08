let getDefaultConfig;
try {
  getDefaultConfig = require('expo/metro-config').getDefaultConfig;
} catch {
  getDefaultConfig = require('@react-native/metro-config').getDefaultConfig;
}

const path = require('path');
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);
config.watchFolders = [monorepoRoot];

module.exports = config;
