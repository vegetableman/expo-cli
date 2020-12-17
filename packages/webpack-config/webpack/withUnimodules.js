'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const webpack_merge_1 = __importDefault(require('webpack-merge'));
const path_1 = __importDefault(require('path'));
const Diagnosis = __importStar(require('./utils/Diagnosis'));
const validate_1 = require('./utils/validate');
const loaders_1 = require('./utils/loaders');
const webpack_config_unimodules_1 = __importDefault(require('./webpack.config.unimodules'));
function _findBabelLoader(rules) {
  const loader = loaders_1.findLoader('babel-loader', rules);
  if (!loader)
    throw new Error(
      'Cannot find `babel-loader` generated by `webpack.config.unimodules`. It is likely an Expo issue. Please create a new issue at https://github.com/expo/expo-cli.'
    );
  return loader;
}
// Wrap your existing webpack config with support for Unimodules.
// ex: Storybook `({ config }) => withUnimodules(config)`
function withUnimodules(inputWebpackConfig = {}, env = {}, argv = {}) {
  // @ts-ignore: We should attempt to use the project root that the other config is already using (used for Gatsby support).
  env.projectRoot = env.projectRoot || inputWebpackConfig.context;
  // Attempt to use the input webpack config mode
  env.mode = env.mode || inputWebpackConfig.mode;
  const environment = validate_1.validateEnvironment(env);
  let { supportsFontLoading } = argv;
  // If the args don't specify this then we'll check if the input already supports font loading.
  if (typeof supportsFontLoading === 'undefined') {
    const supportedFonts = ['ttf', 'otf', 'woff'];
    const testFontFileNames = supportedFonts.map(ext =>
      path_1.default.resolve(environment.projectRoot, `cool-font.${ext}`)
    );
    if (loaders_1.rulesMatchAnyFiles(inputWebpackConfig, testFontFileNames)) {
      supportsFontLoading = false;
    }
  }
  const config = webpack_config_unimodules_1.default(
    environment,
    Object.assign({}, argv, { supportsFontLoading })
  );
  // We have to transpile these modules and make them not external too.
  // We have to do this because next.js by default externals all `node_modules`'s js files.
  // Reference:
  // https://github.com/martpie/next-transpile-modules/blob/77450a0c0307e4b650d7acfbc18641ef9465f0da/index.js#L48-L62
  // https://github.com/zeit/next.js/blob/0b496a45e85f3c9aa3cf2e77eef10888be5884fc/packages/next/build/webpack-config.ts#L185-L258
  const babelLoader = _findBabelLoader(config.module.rules);
  // `include` function is from https://github.com/expo/expo-cli/blob/3933f3d6ba65bffec2738ece71b62f2c284bd6e4/packages/webpack-config/webpack/loaders/createBabelLoaderAsync.js#L76-L96
  const includeFunc = babelLoader.include;
  if (inputWebpackConfig.externals) {
    inputWebpackConfig.externals = inputWebpackConfig.externals.map(external => {
      if (typeof external !== 'function') return external;
      return (ctx, req, cb) => {
        const relPath = path_1.default.join('node_modules', req);
        return includeFunc(relPath) ? cb() : external(ctx, req, cb);
      };
    });
  }
  const mixedConfig = webpack_merge_1.default(config, inputWebpackConfig);
  if (environment.info) {
    Diagnosis.reportAsync(mixedConfig, environment);
  }
  return mixedConfig;
}
exports.default = withUnimodules;
//# sourceMappingURL=withUnimodules.js.map
