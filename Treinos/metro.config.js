const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configurações específicas para resolver problemas de TurboModules
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configuração para resolver problemas com PlatformConstants
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Configuração para melhor compatibilidade com Expo SDK 52
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Configuração para resolver problemas de cache
config.resetCache = true;

module.exports = config;