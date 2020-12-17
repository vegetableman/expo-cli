'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// @ts-ignore
const compression_webpack_plugin_1 = __importDefault(require('compression-webpack-plugin'));
// @ts-ignore
const brotli_webpack_plugin_1 = __importDefault(require('brotli-webpack-plugin'));
const config_1 = require('./utils/config');
const getConfig_1 = __importDefault(require('./utils/getConfig'));
exports.DEFAULT_GZIP_OPTIONS = {
  test: /\.(js|css)$/,
  filename: '[path].gz[query]',
  algorithm: 'gzip',
  threshold: 1024,
  minRatio: 0.8,
};
exports.DEFAULT_BROTLI_OPTIONS = {
  asset: '[path].br[query]',
  test: /\.(js|css)$/,
  threshold: 1024,
  minRatio: 0.8,
};
function withCompression(webpackConfig, env) {
  if (webpackConfig.mode !== 'production') {
    return webpackConfig;
  }
  const config = getConfig_1.default(env);
  return addCompressionPlugins(webpackConfig, config);
}
exports.default = withCompression;
function addCompressionPlugins(webpackConfig, config) {
  const { build = {} } = config.web;
  const gzipConfig = config_1.overrideWithPropertyOrConfig(
    build.gzip,
    exports.DEFAULT_GZIP_OPTIONS,
    true
  );
  const brotliConfig = config_1.enableWithPropertyOrConfig(
    build.brotli,
    exports.DEFAULT_BROTLI_OPTIONS,
    true
  );
  if (!Array.isArray(webpackConfig.plugins)) webpackConfig.plugins = [];
  if (gzipConfig) webpackConfig.plugins.push(new compression_webpack_plugin_1.default(gzipConfig));
  if (brotliConfig) webpackConfig.plugins.push(new brotli_webpack_plugin_1.default(brotliConfig));
  return webpackConfig;
}
exports.addCompressionPlugins = addCompressionPlugins;
//# sourceMappingURL=withCompression.js.map
