'use strict';
var __rest =
  (this && this.__rest) ||
  function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const path_1 = __importDefault(require('path'));
const chalk_1 = __importDefault(require('chalk'));
const fs_extra_1 = __importDefault(require('fs-extra'));
const core_1 = require('@babel/core');
const paths_1 = require('../utils/paths');
const getModule = name => path_1.default.join('node_modules', name);
// Only compile files from the react ecosystem.
const includeModulesThatContainPaths = [
  getModule('react-native'),
  getModule('react-navigation'),
  getModule('expo'),
  getModule('unimodules'),
  getModule('@react'),
  getModule('@expo'),
  getModule('@unimodules'),
  getModule('native-base'),
];
const excludedRootPaths = [
  'node_modules',
  'bower_components',
  '.expo',
  // Prevent transpiling webpack generated files.
  '(webpack)',
];
const parsedPackageNames = [];
// TODO: Bacon: Support internal packages. ex: react/fbjs
function packageNameFromPath(inputPath) {
  const modules = inputPath.split('node_modules/');
  const libAndFile = modules.pop();
  if (!libAndFile) return null;
  if (libAndFile.charAt(0) === '@') {
    const [org, lib] = libAndFile.split('/');
    return org + '/' + lib;
  } else {
    const components = libAndFile.split('/');
    const first = components.shift();
    return first || null;
  }
}
function logPackage(packageName) {
  if (!parsedPackageNames.includes(packageName)) {
    parsedPackageNames.push(packageName);
    console.log(chalk_1.default.cyan('\nCompiling module: ' + chalk_1.default.bold(packageName)));
  }
}
function ensureRoot(possibleProjectRoot) {
  if (typeof possibleProjectRoot === 'string') {
    return path_1.default.resolve(possibleProjectRoot);
  }
  return paths_1.getPossibleProjectRoot();
}
function generateCacheIdentifier(projectRoot, version = '1') {
  const filename = path_1.default.join(projectRoot, 'foobar.js');
  const cacheKey = `babel-cache-${version}-`;
  const partial = core_1.loadPartialConfig({
    filename,
    cwd: projectRoot,
    sourceFileName: filename,
  });
  return `${cacheKey}${JSON.stringify(partial.options)}`;
}
/**
 * A complex babel loader which uses the project's `babel.config.js`
 * to resolve all of the Unimodules which are shipped as ES modules (early 2019).
 */
function createBabelLoader(_a = {}) {
  var {
      /**
       * The webpack mode: `"production" | "development"`
       */
      mode,
      babelProjectRoot,
      include = [],
      verbose,
      platform,
      useCustom,
    } = _a,
    options = __rest(_a, [
      'mode',
      'babelProjectRoot',
      'include',
      'verbose',
      'platform',
      'useCustom',
    ]);
  const ensuredProjectRoot = ensureRoot(babelProjectRoot);
  const modules = [...includeModulesThatContainPaths, ...include];
  const customUse = options.use || {};
  const customUseOptions = customUse.options || {};
  const isProduction = mode === 'production';
  const projectRoot = paths_1.getPossibleProjectRoot();
  let presetOptions = {
    // Explicitly use babel.config.js instead of .babelrc
    babelrc: false,
    // Attempt to use local babel.config.js file for compiling project.
    configFile: true,
  };
  if (
    !fs_extra_1.default.existsSync(path_1.default.join(projectRoot, 'babel.config.js')) &&
    !fs_extra_1.default.existsSync(path_1.default.join(projectRoot, '.babelrc'))
  ) {
    presetOptions = {
      babelrc: false,
      configFile: false,
      presets: [require.resolve('babel-preset-expo')],
    };
  }
  const cacheIdentifier = generateCacheIdentifier(ensuredProjectRoot);
  return Object.assign({ test: /\.(mjs|[jt]sx?)$/ }, options, {
    include(inputPath) {
      for (const possibleModule of modules) {
        if (inputPath.includes(possibleModule)) {
          if (verbose) {
            const packageName = packageNameFromPath(inputPath);
            if (packageName) logPackage(packageName);
          }
          return true;
        }
      }
      // Is inside the project and is not one of designated modules
      if (inputPath.includes(ensuredProjectRoot)) {
        for (const excluded of excludedRootPaths) {
          if (inputPath.includes(excluded)) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    use: Object.assign({}, customUse, {
      loader: require.resolve('babel-loader'),
      options: Object.assign(
        {},
        presetOptions,
        {
          cacheCompression: !isProduction,
          cacheDirectory: path_1.default.join(
            ensuredProjectRoot,
            '.expo',
            'web',
            'cache',
            mode || 'development',
            'babel-loader'
          ),
          cacheIdentifier,
        },
        customUseOptions || {},
        {
          caller: {
            bundler: 'webpack',
            platform,
            mode,
          },
          sourceType: 'unambiguous',
          root: ensuredProjectRoot,
          compact: isProduction,
        }
      ),
    }),
  });
}
exports.default = createBabelLoader;
//# sourceMappingURL=createBabelLoader.js.map
