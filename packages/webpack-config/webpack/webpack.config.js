'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// @ts-ignore
const webpack_pwa_manifest_plugin_1 = __importDefault(require('@expo/webpack-pwa-manifest-plugin'));
const InterpolateHtmlPlugin_1 = __importDefault(require('react-dev-utils/InterpolateHtmlPlugin'));
const webpack_1 = require('webpack');
// @ts-ignore
const webpack_deep_scope_plugin_1 = __importDefault(require('webpack-deep-scope-plugin'));
// @ts-ignore
const clean_webpack_plugin_1 = __importDefault(require('clean-webpack-plugin'));
// @ts-ignore
const ModuleNotFoundPlugin_1 = __importDefault(require('react-dev-utils/ModuleNotFoundPlugin'));
// @ts-ignore
const pnp_webpack_plugin_1 = __importDefault(require('pnp-webpack-plugin'));
const ModuleScopePlugin_1 = __importDefault(require('react-dev-utils/ModuleScopePlugin'));
const webpack_manifest_plugin_1 = __importDefault(require('webpack-manifest-plugin'));
const WatchMissingNodeModulesPlugin_1 = __importDefault(
  require('react-dev-utils/WatchMissingNodeModulesPlugin')
);
// @ts-ignore
const mini_css_extract_plugin_1 = __importDefault(require('mini-css-extract-plugin'));
const copy_webpack_plugin_1 = __importDefault(require('copy-webpack-plugin'));
const getenv_1 = require('getenv');
const paths_1 = require('./utils/paths');
const createAllLoaders_1 = __importDefault(require('./loaders/createAllLoaders'));
const plugins_1 = require('./plugins');
const utils_1 = require('./utils');
const withOptimizations_1 = __importDefault(require('./withOptimizations'));
const withReporting_1 = __importDefault(require('./withReporting'));
const withCompression_1 = __importDefault(require('./withCompression'));
const path_1 = __importDefault(require('path'));
const createDevServerConfigAsync_1 = __importDefault(require('./createDevServerConfigAsync'));
const config_1 = require('./utils/config');
const getMode_1 = __importDefault(require('./utils/getMode'));
const getConfig_1 = __importDefault(require('./utils/getConfig'));
function createNoJSComponent(message) {
  // from twitter.com
  return `" <form action="location.reload()" method="POST" style="background-color:#fff;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;"><div style="font-size:18px;font-family:Helvetica,sans-serif;line-height:24px;margin:10%;width:80%;"> <p>${message}</p> <p style="margin:20px 0;"> <button type="submit" style="background-color: #4630EB; border-radius: 100px; border: none; box-shadow: none; color: #fff; cursor: pointer; font-weight: bold; line-height: 20px; padding: 6px 16px;">Reload</button> </p> </div> </form> "`;
}
function getDevtool({ production, development }, { devtool }) {
  if (production) {
    // string or false
    if (devtool !== undefined) {
      // When big assets are involved sources maps can become expensive and cause your process to run out of memory.
      return devtool;
    }
    return 'source-map';
  }
  if (development) {
    return 'cheap-module-source-map';
  }
  return false;
}
function getOutput(locations, mode, publicPath) {
  const commonOutput = {
    sourceMapFilename: '[chunkhash].map',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    // We use "/" in development.
    publicPath,
    // Build folder (default `web-build`)
    path: locations.production.folder,
  };
  if (mode === 'production') {
    commonOutput.filename = 'static/js/[name].[contenthash:8].js';
    // There are also additional JS chunk files if you use code splitting.
    commonOutput.chunkFilename = 'static/js/[name].[contenthash:8].chunk.js';
    // Point sourcemap entries to original disk location (format as URL on Windows)
    commonOutput.devtoolModuleFilenameTemplate = info =>
      locations.absolute(info.absoluteResourcePath).replace(/\\/g, '/');
  } else {
    // Add comments that describe the file import/exports.
    // This will make it easier to debug.
    commonOutput.pathinfo = true;
    // Give the output bundle a constant name to prevent caching.
    // Also there are no actual files generated in dev.
    commonOutput.filename = 'static/js/bundle.js';
    // There are also additional JS chunk files if you use code splitting.
    commonOutput.chunkFilename = 'static/js/[name].chunk.js';
    // Point sourcemap entries to original disk location (format as URL on Windows)
    commonOutput.devtoolModuleFilenameTemplate = info =>
      path_1.default.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
  }
  return commonOutput;
}
function default_1(env, argv = {}) {
  return __awaiter(this, void 0, void 0, function*() {
    const config = getConfig_1.default(env);
    const mode = getMode_1.default(env);
    const isDev = mode === 'development';
    const isProd = mode === 'production';
    // Enables deep scope analysis in production mode.
    // Remove unused import/exports
    // override: `env.removeUnusedImportExports`
    const deepScopeAnalysisEnabled = config_1.overrideWithPropertyOrConfig(
      env.removeUnusedImportExports,
      false
      // isProd
    );
    const locations = env.locations || (yield paths_1.getPathsAsync(env.projectRoot));
    const { publicPath, publicUrl } = paths_1.getPublicPaths(env);
    const { build: buildConfig = {}, lang } = config.web;
    const { rootId, babel: babelAppConfig = {} } = buildConfig;
    const { noJavaScriptMessage } = config.web.dangerous;
    const noJSComponent = createNoJSComponent(noJavaScriptMessage);
    const devtool = getDevtool({ production: isProd, development: isDev }, buildConfig);
    const babelProjectRoot = babelAppConfig.root || locations.root;
    const appEntry = [];
    // In solutions like Gatsby the main entry point doesn't need to be known.
    if (locations.appMain) {
      appEntry.push(locations.appMain);
    } else {
      throw new Error(
        `The entry point for your project couldn't be found. Please define it in the package.json main field`
      );
    }
    if (isDev) {
      // https://github.com/facebook/create-react-app/blob/e59e0920f3bef0c2ac47bbf6b4ff3092c8ff08fb/packages/react-scripts/config/webpack.config.js#L144
      // Include an alternative client for WebpackDevServer. A client's job is to
      // connect to WebpackDevServer by a socket and get notified about changes.
      // When you save a file, the client will either apply hot updates (in case
      // of CSS changes), or refresh the page (in case of JS changes). When you
      // make a syntax error, this client will display a syntax error overlay.
      // Note: instead of the default WebpackDevServer client, we use a custom one
      // to bring better experience for Create React App users. You can replace
      // the line below with these two lines if you prefer the stock client:
      // require.resolve('webpack-dev-server/client') + '?/',
      // require.resolve('webpack/hot/dev-server'),
      appEntry.unshift(require.resolve('react-dev-utils/webpackHotDevClient'));
    }
    let webpackConfig = {
      mode,
      entry: {
        app: appEntry,
      },
      // https://webpack.js.org/configuration/other-options/#bail
      // Fail out on the first error instead of tolerating it.
      bail: isProd,
      devtool,
      context: __dirname,
      // configures where the build ends up
      output: getOutput(locations, mode, publicPath),
      plugins: [
        // Delete the build folder
        isProd &&
          new clean_webpack_plugin_1.default([locations.production.folder], {
            root: locations.root,
            dry: false,
            verbose: false,
          }),
        // Copy the template files over
        isProd &&
          new copy_webpack_plugin_1.default([
            {
              from: locations.template.folder,
              to: locations.production.folder,
              // We generate new versions of these based on the templates
              ignore: [
                'expo-service-worker.js',
                'favicon.ico',
                'serve.json',
                'index.html',
                'icon.png',
              ],
            },
            {
              from: locations.template.serveJson,
              to: locations.production.serveJson,
            },
            {
              from: locations.template.favicon,
              to: locations.production.favicon,
            },
            {
              from: locations.template.serviceWorker,
              to: locations.production.serviceWorker,
            },
          ]),
        // Generate the `index.html`
        new plugins_1.ExpoHtmlWebpackPlugin(env),
        // Add variables to the `index.html`
        new InterpolateHtmlPlugin_1.default(plugins_1.ExpoHtmlWebpackPlugin, {
          WEB_PUBLIC_URL: publicPath,
          WEB_TITLE: config.web.name,
          NO_SCRIPT: noJSComponent,
          LANG_ISO_CODE: lang,
          ROOT_ID: rootId,
        }),
        new webpack_pwa_manifest_plugin_1.default(config, {
          publicPath,
          noResources: isDev || !env.pwa,
          filename: locations.production.manifest,
          HtmlWebpackPlugin: plugins_1.ExpoHtmlWebpackPlugin,
        }),
        // This gives some necessary context to module not found errors, such as
        // the requesting resource.
        new ModuleNotFoundPlugin_1.default(locations.root),
        new plugins_1.ExpoDefinePlugin({
          mode,
          publicUrl,
          config,
          productionManifestPath: locations.production.manifest,
        }),
        // This is necessary to emit hot updates (currently CSS only):
        isDev && new webpack_1.HotModuleReplacementPlugin(),
        // If you require a missing module and then `npm install` it, you still have
        // to restart the development server for Webpack to discover it. This plugin
        // makes the discovery automatic so you don't have to restart.
        // See https://github.com/facebook/create-react-app/issues/186
        isDev && new WatchMissingNodeModulesPlugin_1.default(locations.modules),
        isProd &&
          new mini_css_extract_plugin_1.default({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
          }),
        // Generate a manifest file which contains a mapping of all asset filenames
        // to their corresponding output file so that tools can pick it up without
        // having to parse `index.html`.
        new webpack_manifest_plugin_1.default({
          fileName: 'asset-manifest.json',
          publicPath,
        }),
        deepScopeAnalysisEnabled && new webpack_deep_scope_plugin_1.default(),
        new plugins_1.ExpoProgressBarPlugin(),
      ].filter(Boolean),
      module: {
        strictExportPresence: false,
        rules: [
          // Disable require.ensure because it breaks tree shaking.
          { parser: { requireEnsure: false } },
          {
            oneOf: createAllLoaders_1.default(env),
          },
        ].filter(Boolean),
      },
      resolveLoader: {
        plugins: [
          // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
          // from the current package.
          pnp_webpack_plugin_1.default.moduleLoader(module),
        ],
      },
      resolve: {
        alias: config_1.DEFAULT_ALIAS,
        mainFields: ['browser', 'module', 'main'],
        extensions: utils_1.getModuleFileExtensions('web'),
        plugins: [
          // Adds support for installing with Plug'n'Play, leading to faster installs and adding
          // guards against forgotten dependencies and such.
          pnp_webpack_plugin_1.default,
          // Prevents users from importing files from outside of node_modules/.
          // This often causes confusion because we only process files within the root folder with babel.
          // To fix this, we prevent you from importing files out of the root folder -- if you'd like to,
          // please link the files into your node_modules/ and let module-resolution kick in.
          // Make sure your source files are compiled, as they will not be processed in any way.
          new ModuleScopePlugin_1.default(babelProjectRoot, [locations.packageJson]),
        ],
        symlinks: false,
      },
      // Turn off performance processing because we utilize
      // our own (CRA) hints via the FileSizeReporter
      performance: getenv_1.boolish('CI', false) ? false : undefined,
    };
    if (isDev) {
      webpackConfig.devServer = yield createDevServerConfigAsync_1.default(env, argv);
    } else if (isProd) {
      webpackConfig = withCompression_1.default(withOptimizations_1.default(webpackConfig), env);
    }
    return withReporting_1.default(withNodeMocks(webpackConfig), env);
  });
}
exports.default = default_1;
// Some libraries import Node modules but don't use them in the browser.
// Tell Webpack to provide empty mocks for them so importing them works.
function withNodeMocks(webpackConfig) {
  webpackConfig.node = Object.assign({}, webpackConfig.node || {}, {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  });
  return webpackConfig;
}
//# sourceMappingURL=webpack.config.js.map
