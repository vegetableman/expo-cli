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
Object.defineProperty(exports, '__esModule', { value: true });
const fs_extra_1 = require('fs-extra');
const path_1 = require('path');
const workbox_webpack_plugin_1 = require('workbox-webpack-plugin');
const loaders_1 = require('./utils/loaders');
const utils_1 = require('./utils');
const defaultInjectManifestOptions = {
  exclude: [
    /\.LICENSE$/,
    /\.map$/,
    /asset-manifest\.json$/,
    // Exclude all apple touch images because they're cached locally after the PWA is added.
    /^\bapple.*\.png$/,
  ],
};
const runtimeCache = {
  handler: 'networkFirst',
  urlPattern: /^https?.*/,
  options: {
    cacheName: 'offlineCache',
    expiration: {
      maxEntries: 200,
    },
  },
};
const defaultGenerateSWOptions = Object.assign({}, defaultInjectManifestOptions, {
  clientsClaim: true,
  skipWaiting: true,
  navigateFallbackBlacklist: [
    // Exclude URLs starting with /_, as they're likely an API call
    new RegExp('^/_'),
    // Exclude URLs containing a dot, as they're likely a resource in
    // public/ and not a SPA route
    new RegExp('/[^/]+\\.[^/]+$'),
  ],
  // @ts-ignore: Webpack throws if `NetworkFirst` is not `networkFirst`
  runtimeCaching: [runtimeCache],
});
function ensureEntryAsync(arg) {
  return __awaiter(this, void 0, void 0, function*() {
    if (typeof arg === 'undefined') {
      throw new Error('Webpack config entry cannot be undefined');
    }
    if (typeof arg === 'function') {
      return ensureEntryAsync(yield arg());
    } else if (typeof arg === 'string') {
      return ensureEntryAsync([arg]);
    } else if (Array.isArray(arg)) {
      return {
        app: arg,
      };
    } else if (loaders_1.isEntry(arg)) {
      return arg;
    }
    throw new Error('Cannot resolve Webpack config entry prop: ' + arg);
  });
}
exports.ensureEntryAsync = ensureEntryAsync;
function withWorkbox(config, options = {}) {
  // Do nothing in dev mode
  if (config.mode !== 'production') {
    return config;
  }
  if (!config.plugins) config.plugins = [];
  const {
    projectRoot,
    autoRegister = true,
    publicUrl = '',
    scope = '/',
    useServiceWorker = true,
    generateSWOptions = {},
    injectManifestOptions = {},
  } = options;
  const locations = utils_1.getPaths(projectRoot);
  const customManifestProps = {
    navigateFallback: path_1.join(publicUrl, 'index.html'),
  };
  if (useServiceWorker) {
    config.plugins.push(
      new workbox_webpack_plugin_1.GenerateSW(
        Object.assign({}, defaultGenerateSWOptions, customManifestProps, generateSWOptions)
      )
    );
  } else {
    const props = Object.assign(
      {},
      defaultInjectManifestOptions,
      customManifestProps,
      injectManifestOptions
    );
    config.plugins.push(
      // @ts-ignore: unused swSrc
      new workbox_webpack_plugin_1.InjectManifest(props)
    );
  }
  const expoEntry = config.entry;
  config.entry = () =>
    __awaiter(this, void 0, void 0, function*() {
      const entries = yield ensureEntryAsync(expoEntry);
      const swPath = path_1.join(locations.production.folder, 'register-service-worker.js');
      if (entries.app && !entries.app.includes(swPath) && autoRegister) {
        const content = (yield fs_extra_1.readFile(
          require.resolve('../web-default/register-service-worker.js'),
          'utf8'
        ))
          .replace('SW_PUBLIC_URL', publicUrl)
          .replace('SW_PUBLIC_SCOPE', scope);
        yield fs_extra_1.ensureDir(locations.production.folder);
        yield fs_extra_1.writeFile(swPath, content, 'utf8');
        if (!Array.isArray(entries.app)) {
          entries.app = [entries.app];
        }
        entries.app.unshift(swPath);
      }
      return entries;
    });
  return config;
}
exports.default = withWorkbox;
//# sourceMappingURL=withWorkbox.js.map
