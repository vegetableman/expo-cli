'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const html_webpack_plugin_1 = __importDefault(require('html-webpack-plugin'));
const utils_1 = require('../utils');
const config_1 = require('../utils/config');
const DEFAULT_MINIFY = {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
};
class ExpoHtmlWebpackPlugin extends html_webpack_plugin_1.default {
  constructor(env) {
    const locations = env.locations || utils_1.getPaths(env.projectRoot);
    const config = utils_1.getConfig(env);
    const isProduction = utils_1.getMode(env) === 'production';
    const { name, build = {} } = config.web;
    /**
     * The user can disable minify with
     * `web.minifyHTML = false || {}`
     */
    const minify = config_1.overrideWithPropertyOrConfig(
      isProduction ? build.minifyHTML : false,
      DEFAULT_MINIFY
    );
    // Generates an `index.html` file with the <script> injected.
    super({
      // The file to write the HTML to.
      filename: locations.production.indexHtml,
      // The title to use for the generated HTML document.
      title: name,
      // Pass a html-minifier options object to minify the output.
      // https://github.com/kangax/html-minifier#options-quick-reference
      minify,
      // The `webpack` require path to the template.
      template: locations.template.indexHtml,
    });
  }
}
exports.default = ExpoHtmlWebpackPlugin;
//# sourceMappingURL=ExpoHtmlWebpackPlugin.js.map
