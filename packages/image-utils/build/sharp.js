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
const semver_1 = __importDefault(require('semver'));
const spawn_async_1 = __importDefault(require('@expo/spawn-async'));
const SHARP_HELP_PATTERN = /\n\nSpecify --help for available options/g;
function sharpAsync(options, commands = []) {
  return __awaiter(this, void 0, void 0, function*() {
    const bin = yield findSharpBinAsync();
    try {
      const { stdout } = yield spawn_async_1.default(bin, [
        ...getOptions(options),
        ...getCommandOptions(commands),
      ]);
      const outputFilePaths = stdout.trim().split('\n');
      return outputFilePaths;
    } catch (error) {
      if (error.stderr) {
        throw new Error(
          '\nProcessing images using sharp-cli failed: ' +
            error.message +
            '\nOutput: ' +
            error.stderr.replace(SHARP_HELP_PATTERN, '')
        );
      } else {
        throw error;
      }
    }
  });
}
exports.sharpAsync = sharpAsync;
function getOptions(options) {
  const args = [];
  for (const [key, value] of Object.entries(options)) {
    if (value != null && value !== false) {
      if (typeof value === 'boolean') {
        args.push(`--${key}`);
      } else if (typeof value === 'number') {
        args.push(`--${key}`, value.toFixed());
      } else {
        args.push(`--${key}`, value);
      }
    }
  }
  return args;
}
function getCommandOptions(commands) {
  const args = [];
  for (const command of commands) {
    if (command.operation === 'resize') {
      const { operation, width } = command,
        namedOptions = __rest(command, ['operation', 'width']);
      args.push(operation, width.toFixed(), ...getOptions(namedOptions));
    } else {
      const { operation } = command,
        namedOptions = __rest(command, ['operation']);
      args.push(operation, ...getOptions(namedOptions));
    }
    args.push('--');
  }
  return args;
}
let _sharpBin = null;
function findSharpBinAsync() {
  return __awaiter(this, void 0, void 0, function*() {
    if (_sharpBin) {
      return _sharpBin;
    }
    const requiredCliVersion = require('../package.json').optionalDependencies['sharp-cli'];
    try {
      const sharpCliPackage = require('sharp-cli/package.json');
      const libVipsVersion = require('sharp').versions.vips;
      if (
        sharpCliPackage &&
        semver_1.default.satisfies(sharpCliPackage.version, requiredCliVersion) &&
        typeof sharpCliPackage.bin.sharp === 'string' &&
        typeof libVipsVersion === 'string'
      ) {
        _sharpBin = require.resolve(`sharp-cli/${sharpCliPackage.bin.sharp}`);
        return _sharpBin;
      }
    } catch (e) {
      // fall back to global sharp-cli
    }
    let installedCliVersion;
    try {
      installedCliVersion = (yield spawn_async_1.default('sharp', ['--version'])).stdout
        .toString()
        .trim();
    } catch (e) {
      throw notFoundError(requiredCliVersion);
    }
    if (!semver_1.default.satisfies(installedCliVersion, requiredCliVersion)) {
      showVersionMismatchWarning(requiredCliVersion, installedCliVersion);
    }
    _sharpBin = 'sharp';
    return _sharpBin;
  });
}
function notFoundError(requiredCliVersion) {
  return new Error(
    `This command requires version ${requiredCliVersion} of \`sharp-cli\`. \n` +
      `You can install it using \`npm install -g sharp-cli@${requiredCliVersion}\`. \n` +
      '\n' +
      'For prerequisites, see: https://sharp.dimens.io/en/stable/install/#prerequisites'
  );
}
let versionMismatchWarningShown = false;
function showVersionMismatchWarning(requiredCliVersion, installedCliVersion) {
  if (versionMismatchWarningShown) {
    return;
  }
  console.warn(
    `Warning: This command requires version ${requiredCliVersion} of \`sharp-cli\`. \n` +
      `Currently installed version: "${installedCliVersion}" \n` +
      `Required version: "${requiredCliVersion}" \n` +
      `You can install it using \`npm install -g sharp-cli@${requiredCliVersion}\`. \n` +
      '\n' +
      'For prerequisites, see: https://sharp.dimens.io/en/stable/install/#prerequisites'
  );
  versionMismatchWarningShown = true;
}
//# sourceMappingURL=sharp.js.map
