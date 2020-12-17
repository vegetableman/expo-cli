'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const getConfig_1 = __importDefault(require('../utils/getConfig'));
const getMode_1 = __importDefault(require('../utils/getMode'));
const paths_1 = require('../utils/paths');
const createBabelLoader_1 = __importDefault(require('./createBabelLoader'));
const createFontLoader_1 = __importDefault(require('./createFontLoader'));
// This is needed for webpack to import static images in JavaScript files.
// "url" loader works like "file" loader except that it embeds assets
// smaller than specified limit in bytes as data URLs to avoid requests.
// A missing `test` is equivalent to a match.
// TODO: Bacon: Move SVG
exports.imageLoaderRule = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: require.resolve('url-loader'),
    options: {
      // Inline resources as Base64 when there is less reason to parallelize their download. The
      // heuristic we use is whether the resource would fit within a TCP/IP packet that we would
      // send to request the resource.
      //
      // An Ethernet MTU is usually 1500. IP headers are 20 (v4) or 40 (v6) bytes and TCP
      // headers are 40 bytes. HTTP response headers vary and are around 400 bytes. This leaves
      // about 1000 bytes for content to fit in a packet.
      limit: 1000,
      name: 'static/media/[name].[hash:8].[ext]',
    },
  },
};
// "file" loader makes sure those assets get served by WebpackDevServer.
// When you `import` an asset, you get its (virtual) filename.
// In production, they would get copied to the `build` folder.
// This loader doesn't use a "test" so it will catch all modules
// that fall through the other loaders.
exports.fallbackLoaderRule = {
  loader: require.resolve('file-loader'),
  // Exclude `js` files to keep "css" loader working as it injects
  // its runtime that would otherwise be processed through "file" loader.
  // Also exclude `html` and `json` extensions so they get processed
  // by webpacks internal loaders.
  // Excludes: js, jsx, ts, tsx, html, json
  exclude: [/\.(mjs|[jt]sx?)$/, /\.html$/, /\.json$/],
  options: {
    name: 'static/media/[name].[hash:8].[ext]',
  },
};
exports.styleLoaderRule = {
  test: /\.(css)$/,
  use: [require.resolve('style-loader'), require.resolve('css-loader')],
};
function createAllLoaders(env) {
  const config = getConfig_1.default(env);
  const mode = getMode_1.default(env);
  const { platform = 'web' } = env;
  const locations = env.locations || paths_1.getPaths(env.projectRoot);
  return getAllLoaderRules(config, mode, locations, platform);
}
exports.default = createAllLoaders;
function getBabelLoaderRuleFromEnv(env) {
  const config = getConfig_1.default(env);
  const mode = getMode_1.default(env);
  const { platform = 'web' } = env;
  const locations = env.locations || paths_1.getPaths(env.projectRoot);
  return getBabelLoaderRule(locations.root, config, mode, platform);
}
exports.getBabelLoaderRuleFromEnv = getBabelLoaderRuleFromEnv;
function getBabelLoaderRule(
  projectRoot,
  { web: { build: { babel = {} } = {} } = {} },
  mode,
  platform = 'web'
) {
  const { root, verbose, include, use } = babel;
  const babelProjectRoot = root || projectRoot;
  return createBabelLoader_1.default({
    mode,
    platform,
    babelProjectRoot,
    verbose,
    include,
    use,
  });
}
exports.getBabelLoaderRule = getBabelLoaderRule;
function getHtmlLoaderRule(exclude) {
  return {
    test: /\.html$/,
    use: [require.resolve('html-loader')],
    exclude,
  };
}
exports.getHtmlLoaderRule = getHtmlLoaderRule;
function getAllLoaderRules(config, mode, { root, includeModule, template }, platform = 'web') {
  return [
    getHtmlLoaderRule(template.folder),
    exports.imageLoaderRule,
    getBabelLoaderRule(root, config, mode, platform),
    createFontLoader_1.default(root, includeModule),
    exports.styleLoaderRule,
    // This needs to be the last loader
    exports.fallbackLoaderRule,
  ].filter(Boolean);
}
exports.getAllLoaderRules = getAllLoaderRules;
//# sourceMappingURL=createAllLoaders.js.map
