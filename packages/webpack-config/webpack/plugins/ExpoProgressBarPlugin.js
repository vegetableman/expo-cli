'use strict';
/**
 * Fork of https://github.com/clessg/progress-bar-webpack-plugin
 * but with TS
 */
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const chalk_1 = __importDefault(require('chalk'));
const progress_1 = __importDefault(require('progress'));
const webpack_1 = require('webpack');
class ExpoProgressBarPlugin extends webpack_1.ProgressPlugin {
  constructor() {
    const stream = process.stderr;
    const enabled = stream && stream.isTTY;
    if (!enabled) {
      super();
      return;
    }
    var barLeft = chalk_1.default.bold('[');
    var barRight = chalk_1.default.bold(']');
    var preamble = chalk_1.default.cyan.bold('  build ') + barLeft;
    //`[:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`
    var barFormat = preamble + ':bar' + barRight + chalk_1.default.magenta.bold(' :percent');
    var summary = true;
    const barOptions = {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: 100,
      clear: false,
    };
    const bar = new progress_1.default(barFormat, barOptions);
    let running = false;
    let startTime = 0;
    let lastPercent = 0;
    super((percent, msg) => {
      if (!running && lastPercent !== 0) {
        stream.write('\n');
      }
      var newPercent = Math.floor(percent * barOptions.width);
      if (lastPercent < newPercent || newPercent === 0) {
        bar.update(percent, {
          msg,
        });
        lastPercent = newPercent;
      }
      if (!running) {
        running = true;
        startTime = Date.now();
        lastPercent = 0;
      } else if (percent === 1) {
        var now = Date.now();
        var buildTime = (now - startTime) / 1000 + 's';
        bar.terminate();
        if (summary) {
          stream.write(chalk_1.default.green.bold('Build completed in ' + buildTime + '\n\n'));
        }
        running = false;
      }
    });
  }
}
exports.default = ExpoProgressBarPlugin;
//# sourceMappingURL=ExpoProgressBarPlugin.js.map