'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const config_1 = require('@expo/config');
const paths_1 = require('./paths');
function getConfig(env) {
  if (env.config) {
    return env.config;
  }
  const locations = env.locations || paths_1.getPaths(env.projectRoot);
  // Fill all config values with PWA defaults
  return config_1.getConfigForPWA(env.projectRoot, locations.absolute, {
    templateIcon: locations.template.get('icon.png'),
  });
}
exports.default = getConfig;
//# sourceMappingURL=getConfig.js.map
