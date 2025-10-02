const { getDefaultConfig } = require('expo/metro-config');

/**
 * Use a config padrão do Expo. Evita customizações que podem quebrar TurboModules
 * no Expo Go. Se precisar customizar, faça incrementalmente.
 */
module.exports = getDefaultConfig(__dirname);