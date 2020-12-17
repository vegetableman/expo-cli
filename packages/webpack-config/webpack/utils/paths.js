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
const config_1 = require('@expo/config');
const find_yarn_workspace_root_1 = __importDefault(require('find-yarn-workspace-root'));
const fs_1 = __importDefault(require('fs'));
const path_1 = __importDefault(require('path'));
const url_1 = __importDefault(require('url'));
const getMode_1 = __importDefault(require('./getMode'));
const possibleMainFiles = [
  'index.web.ts',
  'index.ts',
  'index.web.tsx',
  'index.tsx',
  'src/index.web.ts',
  'src/index.ts',
  'src/index.web.tsx',
  'src/index.tsx',
  'index.web.js',
  'index.js',
  'index.web.jsx',
  'index.jsx',
  'src/index.web.js',
  'src/index.js',
  'src/index.web.jsx',
  'src/index.jsx',
  'node_modules/expo/AppEntry.js',
];
function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}
function getAbsolutePathWithProjectRoot(projectRoot, ...pathComponents) {
  // Simple check if we are dealing with an URL
  if (pathComponents && pathComponents.length === 1 && pathComponents[0].startsWith('http')) {
    return pathComponents[0];
  }
  return path_1.default.resolve(projectRoot, ...pathComponents);
}
exports.getAbsolutePathWithProjectRoot = getAbsolutePathWithProjectRoot;
function getPossibleProjectRoot() {
  return fs_1.default.realpathSync(process.cwd());
}
exports.getPossibleProjectRoot = getPossibleProjectRoot;
function getModulesPath(projectRoot) {
  const workspaceRoot = find_yarn_workspace_root_1.default(path_1.default.resolve(projectRoot)); // Absolute path or null
  if (workspaceRoot) {
    return path_1.default.resolve(workspaceRoot, 'node_modules');
  }
  return path_1.default.resolve(projectRoot, 'node_modules');
}
exports.getModulesPath = getModulesPath;
function parsePaths(projectRoot, nativeAppManifest) {
  const inputProjectRoot = projectRoot || getPossibleProjectRoot();
  function absolute(...pathComponents) {
    return getAbsolutePathWithProjectRoot(inputProjectRoot, ...pathComponents);
  }
  const packageJsonPath = absolute('package.json');
  const modulesPath = getModulesPath(inputProjectRoot);
  const productionPath = absolute(config_1.getWebOutputPath(nativeAppManifest));
  function templatePath(filename = '') {
    const overridePath = absolute('web', filename);
    if (fs_1.default.existsSync(overridePath)) {
      return overridePath;
    }
    return path_1.default.join(__dirname, '../../web-default', filename);
  }
  function getProductionPath(...props) {
    return path_1.default.resolve(productionPath, ...props);
  }
  function getIncludeModule(...props) {
    return path_1.default.resolve(modulesPath, ...props);
  }
  return {
    absolute,
    includeModule: getIncludeModule,
    packageJson: packageJsonPath,
    root: path_1.default.resolve(inputProjectRoot),
    appMain: getEntryPoint(inputProjectRoot),
    modules: modulesPath,
    servedPath: getServedPath(inputProjectRoot),
    template: {
      get: templatePath,
      folder: templatePath(),
      indexHtml: templatePath('index.html'),
      manifest: templatePath('manifest.json'),
      serveJson: templatePath('serve.json'),
      favicon: templatePath('favicon.ico'),
      serviceWorker: templatePath('expo-service-worker.js'),
    },
    production: {
      get: getProductionPath,
      folder: getProductionPath(),
      indexHtml: getProductionPath('index.html'),
      manifest: getProductionPath('manifest.json'),
      serveJson: getProductionPath('serve.json'),
      favicon: getProductionPath('favicon.ico'),
      serviceWorker: getProductionPath('expo-service-worker.js'),
    },
  };
}
function getEntryPoint(projectRoot) {
  const { exp, pkg } = config_1.readConfigJson(projectRoot, true, true);
  /**
   *  The main file is resolved like so:
   * * `app.json` -> `expo.entryPoint`
   * * `package.json` -> `"main"`
   * * `possibleMainFiles`
   */
  if (exp && exp.entryPoint && typeof exp.entryPoint === 'string') {
    return getAbsolutePathWithProjectRoot(projectRoot, exp.entryPoint);
  } else if (pkg) {
    const { main } = pkg;
    if (main && typeof main === 'string') {
      return getAbsolutePathWithProjectRoot(projectRoot, main);
    }
    // Adds support for create-react-app (src/index.js) and react-native-cli (index.js) which don't define a main.
    for (const fileName of possibleMainFiles) {
      const filePath = getAbsolutePathWithProjectRoot(projectRoot, fileName);
      if (fs_1.default.existsSync(filePath)) {
        return filePath;
      }
    }
  }
  return null;
}
exports.getEntryPoint = getEntryPoint;
function getPaths(projectRoot) {
  const { exp } = config_1.readConfigJson(projectRoot, true, true);
  return parsePaths(projectRoot, exp);
}
exports.getPaths = getPaths;
function getPathsAsync(projectRoot) {
  return __awaiter(this, void 0, void 0, function*() {
    let exp;
    try {
      exp = (yield config_1.readConfigJsonAsync(projectRoot, true, true)).exp;
    } catch (error) {}
    return parsePaths(projectRoot, exp);
  });
}
exports.getPathsAsync = getPathsAsync;
function getServedPath(projectRoot) {
  const { pkg } = config_1.readConfigJson(projectRoot, true, true);
  const envPublicUrl = process.env.WEB_PUBLIC_URL;
  // We use `WEB_PUBLIC_URL` environment variable or "homepage" field to infer
  // "public path" at which the app is served.
  // Webpack needs to know it to put the right <script> hrefs into HTML even in
  // single-page apps that may serve index.html for nested URLs like /todos/42.
  // We can't use a relative path in HTML because we don't want to load something
  // like /todos/42/static/js/bundle.7289d.js. We have to know the root.
  const publicUrl = envPublicUrl || pkg.homepage;
  const servedUrl = envPublicUrl || (publicUrl ? url_1.default.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}
exports.getServedPath = getServedPath;
function getPublicPaths(_a) {
  var { projectRoot } = _a,
    env = __rest(_a, ['projectRoot']);
  if (getMode_1.default(env) === 'production') {
    const publicPath = getServedPath(projectRoot);
    return {
      publicPath,
      publicUrl: publicPath.slice(0, -1),
    };
  }
  return { publicUrl: '', publicPath: '/' };
}
exports.getPublicPaths = getPublicPaths;
function getProductionPath(projectRoot) {
  const { exp } = config_1.readConfigJson(projectRoot, true, true);
  return getAbsolutePathWithProjectRoot(projectRoot, config_1.getWebOutputPath(exp));
}
exports.getProductionPath = getProductionPath;
//# sourceMappingURL=paths.js.map
