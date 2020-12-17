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
const chalk_1 = __importDefault(require('chalk'));
const yup = __importStar(require('yup'));
const paths_1 = require('./paths');
const getConfig_1 = __importDefault(require('./getConfig'));
const config_1 = require('./config');
const environmentSchema = yup.object({
  config: yup.object().notRequired(),
  locations: yup.object().notRequired(),
  info: yup.boolean().default(false),
  https: yup.boolean().default(false),
  polyfill: yup.boolean().notRequired(),
  removeUnusedImportExports: yup.boolean().default(false),
  pwa: yup.boolean().notRequired(),
  projectRoot: yup.string().required(),
  mode: yup.mixed().oneOf(['production', 'development', 'none']),
  platform: yup
    .mixed()
    .oneOf(['ios', 'android', 'web'])
    .default('web'),
});
const DEFAULT_REPORT = {
  verbose: false,
  path: 'web-report',
  statsFilename: 'stats.json',
  reportFilename: 'report.html',
};
const reportSchema = yup.object({
  verbose: yup.boolean().default(DEFAULT_REPORT.verbose),
  path: yup.string().default(DEFAULT_REPORT.path),
  statsFilename: yup.string().default(DEFAULT_REPORT.statsFilename),
  reportFilename: yup.string().default(DEFAULT_REPORT.reportFilename),
});
function validateReport(report) {
  const reportConfig = config_1.enableWithPropertyOrConfig(report, DEFAULT_REPORT, true);
  if (!reportConfig) return null;
  const filledReport = reportSchema.validateSync(reportConfig);
  return filledReport;
}
exports.validateReport = validateReport;
function validateEnvironment(env) {
  if (typeof env.projectRoot !== 'string') {
    throw new Error(
      `@expo/webpack-config requires a valid projectRoot string value which points to the root of your project`
    );
  }
  warnEnvironmentDeprecation(env, true);
  const filledEnv = environmentSchema.validateSync(env);
  if (!env.locations) {
    filledEnv.locations = paths_1.getPaths(env.projectRoot);
  }
  if (!env.config) {
    filledEnv.config = getConfig_1.default(filledEnv);
  }
  if (typeof env.report !== 'undefined') {
    filledEnv.report = validateReport(env.report);
  }
  return filledEnv;
}
exports.validateEnvironment = validateEnvironment;
let warned = {};
function shouldWarnDeprecated(config, key, warnOnce) {
  return (!warnOnce || !(key in warned)) && typeof config[key] !== 'undefined';
}
function warnEnvironmentDeprecation(env, warnOnce = false) {
  const warnings = {
    production: 'Please use `mode: "production"` instead.',
    development: 'Please use `mode: "development"` instead.',
    polyfill: '',
  };
  for (const warning of Object.keys(warnings)) {
    if (shouldWarnDeprecated(env, warning, warnOnce)) {
      warned[warning] = true;
      console.warn(
        chalk_1.default.bgYellow.black(
          `The environment property \`${warning}\` is deprecated. ${warnings[warning]}`.trim()
        )
      );
    }
  }
}
exports.warnEnvironmentDeprecation = warnEnvironmentDeprecation;
function _resetWarnings() {
  warned = {};
}
exports._resetWarnings = _resetWarnings;
//# sourceMappingURL=validate.js.map
