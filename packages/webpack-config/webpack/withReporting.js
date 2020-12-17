'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// @ts-ignore
const clean_webpack_plugin_1 = __importDefault(require('clean-webpack-plugin'));
const webpack_bundle_analyzer_1 = require('webpack-bundle-analyzer');
const chalk_1 = __importDefault(require('chalk'));
const config_1 = require('./utils/config');
const getConfig_1 = __importDefault(require('./utils/getConfig'));
const getMode_1 = __importDefault(require('./utils/getMode'));
const paths_1 = require('./utils/paths');
exports.DEFAULT_REPORTING_OPTIONS = {
  analyzerMode: 'static',
  defaultSizes: 'gzip',
  generateStatsFile: true,
  openAnalyzer: false,
  verbose: false,
  path: 'web-report',
  statsFilename: 'stats.json',
  reportFilename: 'report.html',
};
function throwDeprecatedConfig({ web = {} }) {
  const { build = {} } = web;
  if (typeof build.report !== 'undefined') {
    throw new Error(
      'expo.web.build.report is deprecated. Please extend webpack.config.js and use env.report instead.'
    );
  }
}
exports.throwDeprecatedConfig = throwDeprecatedConfig;
function maybeWarnAboutRebuilds(env) {
  const mode = getMode_1.default(env);
  if (mode === 'development') {
    console.log(
      chalk_1.default.bgYellow
        .black`Generating a report, this will add noticeably more time to rebuilds.`
    );
  }
}
exports.maybeWarnAboutRebuilds = maybeWarnAboutRebuilds;
function withReporting(config, env) {
  throwDeprecatedConfig(getConfig_1.default(env));
  const reportConfig = config_1.enableWithPropertyOrConfig(
    env.report,
    exports.DEFAULT_REPORTING_OPTIONS,
    true
  );
  if (!reportConfig) {
    return config;
  }
  const { absolute, root } = env.locations || paths_1.getPaths(env.projectRoot);
  if (reportConfig.verbose) {
    maybeWarnAboutRebuilds(env);
  }
  const reportDir = reportConfig.path;
  if (!Array.isArray(config.plugins)) config.plugins = [];
  config.plugins.push(
    // Delete the report folder
    new clean_webpack_plugin_1.default([absolute(reportDir)], {
      root,
      dry: false,
      verbose: reportConfig.verbose,
    }),
    // Generate the report.html and stats.json
    new webpack_bundle_analyzer_1.BundleAnalyzerPlugin(
      Object.assign({}, reportConfig, {
        logLevel: reportConfig.verbose ? 'info' : 'silent',
        statsFilename: absolute(reportDir, reportConfig.statsFilename),
        reportFilename: absolute(reportDir, reportConfig.reportFilename),
      })
    )
  );
  return config;
}
exports.default = withReporting;
//# sourceMappingURL=withReporting.js.map
