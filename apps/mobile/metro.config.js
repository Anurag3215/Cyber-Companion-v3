const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

const nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
  'D:\\cyber-companion-v3\\node_modules',
  'X:\\node_modules',
];

// Keep Expo default watchFolders and include monorepo root
config.watchFolders = Array.from(new Set([
  ...(config.watchFolders || [projectRoot]),
  monorepoRoot,
  'D:\\cyber-companion-v3',
  'X:\\',
]));

// Resolve node_modules from both local workspace and root
config.resolver.nodeModulesPaths = Array.from(new Set(nodeModulesPaths));
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
