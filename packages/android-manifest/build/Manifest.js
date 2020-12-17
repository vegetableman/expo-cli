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
const fs_extra_1 = __importDefault(require('fs-extra'));
const libxmljs_1 = require('libxmljs');
const os_1 = require('os');
const path_1 = __importDefault(require('path'));
const USES_PERMISSION = 'uses-permission';
function manipulateAttributeInTag(doc, attribute, tag, manipulate) {
  const elements = doc.find(`//${tag}`);
  return elements.map(element => {
    const targetAttribute = element.attr(attribute);
    if (targetAttribute) {
      return manipulate(targetAttribute);
    }
    return null;
  });
}
exports.manipulateAttributeInTag = manipulateAttributeInTag;
function createPermission(doc, name) {
  const permission = new libxmljs_1.Element(doc, USES_PERMISSION);
  permission.attr({ 'android:name': name });
  return permission;
}
exports.createPermission = createPermission;
function removePermissions(doc, permissionNames) {
  const targetNames = permissionNames ? permissionNames.map(ensurePermissionNameFormat) : null;
  for (const attribute of getPermissionAttributes(doc)) {
    if (targetNames) {
      if (targetNames.includes(attribute.value())) {
        // continue to iterate in case there are duplicates
        attribute.remove();
      }
    } else {
      attribute.remove();
    }
  }
}
exports.removePermissions = removePermissions;
function addPermission(doc, permission) {
  const elements = doc.find(`//${USES_PERMISSION}`);
  if (elements.length) {
    return elements[elements.length - 1].addNextSibling(permission);
  }
  getRoot(doc).addChild(permission);
  return;
}
exports.addPermission = addPermission;
function ensurePermissions(doc, permissionNames) {
  const permissions = getPermissions(doc);
  const results = {};
  for (const permissionName of permissionNames) {
    const targetName = ensurePermissionNameFormat(permissionName);
    if (!permissions.includes(targetName)) {
      const permissionElement = createPermission(doc, targetName);
      addPermission(doc, permissionElement);
      results[permissionName] = true;
    } else {
      results[permissionName] = false;
    }
  }
  return results;
}
exports.ensurePermissions = ensurePermissions;
function ensurePermission(doc, permissionName) {
  const permissions = getPermissions(doc);
  const targetName = ensurePermissionNameFormat(permissionName);
  if (!permissions.includes(targetName)) {
    const permissionElement = createPermission(doc, targetName);
    addPermission(doc, permissionElement);
    return true;
  }
  return false;
}
exports.ensurePermission = ensurePermission;
function getRoot(doc) {
  const root = doc.root();
  if (!root) throw new Error('no root');
  return root;
}
exports.getRoot = getRoot;
function findAttributeInTag(doc, attribute, tag) {
  const values = manipulateAttributeInTag(doc, attribute, tag, attribute => {
    return attribute;
  });
  return values.filter(value => value !== null);
}
exports.findAttributeInTag = findAttributeInTag;
function ensurePermissionNameFormat(permissionName) {
  if (permissionName.includes('.')) {
    const com = permissionName.split('.');
    const name = com.pop();
    return [...com, name.toUpperCase()].join('.');
  } else {
    // If shorthand form like `WRITE_CONTACTS` is provided, expand it to `android.permission.WRITE_CONTACTS`.
    return ensurePermissionNameFormat(`android.permission.${permissionName}`);
  }
}
exports.ensurePermissionNameFormat = ensurePermissionNameFormat;
function getPermissionAttributes(doc) {
  const tags = [];
  // newly added permissions are found with `android:name` instead of `name` (?)
  for (const id of ['name', 'android:name']) {
    tags.push(...findAttributeInTag(doc, id, 'uses-permission'));
  }
  return tags;
}
exports.getPermissionAttributes = getPermissionAttributes;
function getPermissions(doc) {
  return getPermissionAttributes(doc).map(element => element.value());
}
exports.getPermissions = getPermissions;
function logManifest(doc) {
  console.log(getRoot(doc).toString());
}
exports.logManifest = logManifest;
const stringTimesN = (n, char) => Array(n + 1).join(char);
function format(manifest, { indentLevel = 2, newline = os_1.EOL } = {}) {
  let xmlInput;
  if (typeof manifest === 'string') {
    xmlInput = manifest;
  } else if (manifest.toString) {
    xmlInput = manifest.toString();
  } else {
    throw new Error(`@expo/android-manifest: invalid manifest value passed in: ${manifest}`);
  }
  const indentString = stringTimesN(indentLevel, ' ');
  let formatted = '';
  const regex = /(>)(<)(\/*)/g;
  const xml = xmlInput.replace(regex, `$1${newline}$2$3`);
  let pad = 0;
  xml
    .split(/\r?\n/)
    .map(line => line.trim())
    .forEach(line => {
      let indent = 0;
      if (line.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (line.match(/^<\/\w/)) {
        // Somehow istanbul doesn't see the else case as covered, although it is. Skip it.
        /* istanbul ignore else  */
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (line.match(/^<\w([^>]*[^\/])?>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }
      const padding = stringTimesN(pad, indentString);
      formatted += padding + line + newline; // eslint-disable-line prefer-template
      pad += indent;
    });
  return formatted.trim();
}
exports.format = format;
function writeAndroidManifestAsync(manifestPath, manifest) {
  return __awaiter(this, void 0, void 0, function*() {
    yield fs_extra_1.default.ensureDir(path_1.default.dirname(manifestPath));
    yield fs_extra_1.default.writeFile(manifestPath, manifest);
  });
}
exports.writeAndroidManifestAsync = writeAndroidManifestAsync;
function getProjectAndroidManifestPathAsync(projectDir) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const shellPath = path_1.default.join(projectDir, 'android');
      if ((yield fs_extra_1.default.stat(shellPath)).isDirectory()) {
        const manifestPath = path_1.default.join(shellPath, 'app/src/main/AndroidManifest.xml');
        if ((yield fs_extra_1.default.stat(manifestPath)).isFile()) {
          return manifestPath;
        }
      }
    } catch (error) {}
    return null;
  });
}
exports.getProjectAndroidManifestPathAsync = getProjectAndroidManifestPathAsync;
function readAsync(manifestPath) {
  return __awaiter(this, void 0, void 0, function*() {
    const contents = yield fs_extra_1.default.readFile(manifestPath, {
      encoding: 'utf8',
      flag: 'r',
    });
    const manifest = libxmljs_1.parseXml(contents);
    return manifest;
  });
}
exports.readAsync = readAsync;
function persistAndroidPermissionsAsync(projectDir, permissions) {
  return __awaiter(this, void 0, void 0, function*() {
    const manifestPath = yield getProjectAndroidManifestPathAsync(projectDir);
    // The Android Manifest takes priority over the app.json
    if (!manifestPath) {
      return false;
    }
    const manifest = yield readAsync(manifestPath);
    removePermissions(manifest);
    const results = ensurePermissions(manifest, permissions);
    if (Object.values(results).reduce((prev, current) => prev && current, true) === false) {
      const failed = Object.keys(results).filter(key => !results[key]);
      throw new Error(
        `Failed to write the following permissions to the native AndroidManifest.xml: ${failed.join(
          ', '
        )}`
      );
    }
    yield writeAndroidManifestAsync(manifestPath, manifest);
    return true;
  });
}
exports.persistAndroidPermissionsAsync = persistAndroidPermissionsAsync;
// TODO(Bacon): link to resources about required permission prompts
exports.UnimodulePermissions = {
  'android.permission.ACCESS_COARSE_LOCATION': 'ACCESS_COARSE_LOCATION',
  'android.permission.ACCESS_FINE_LOCATION': 'ACCESS_FINE_LOCATION',
  'android.permission.CAMERA': 'CAMERA',
  'android.permission.MANAGE_DOCUMENTS': 'MANAGE_DOCUMENTS',
  'android.permission.READ_CONTACTS': 'READ_CONTACTS',
  'android.permission.READ_CALENDAR': 'READ_CALENDAR',
  'android.permission.WRITE_CALENDAR': 'WRITE_CALENDAR',
  'android.permission.READ_EXTERNAL_STORAGE': 'READ_EXTERNAL_STORAGE',
  'android.permission.READ_PHONE_STATE': 'READ_PHONE_STATE',
  'android.permission.RECORD_AUDIO': 'RECORD_AUDIO',
  'android.permission.USE_FINGERPRINT': 'USE_FINGERPRINT',
  'android.permission.VIBRATE': 'VIBRATE',
  'android.permission.WAKE_LOCK': 'WAKE_LOCK',
  'android.permission.WRITE_EXTERNAL_STORAGE': 'WRITE_EXTERNAL_STORAGE',
  'com.anddoes.launcher.permission.UPDATE_COUNT': 'com.anddoes.launcher.permission.UPDATE_COUNT',
  'com.android.launcher.permission.INSTALL_SHORTCUT':
    'com.android.launcher.permission.INSTALL_SHORTCUT',
  'com.google.android.c2dm.permission.RECEIVE': 'com.google.android.c2dm.permission.RECEIVE',
  'com.google.android.gms.permission.ACTIVITY_RECOGNITION':
    'com.google.android.gms.permission.ACTIVITY_RECOGNITION',
  'com.google.android.providers.gsf.permission.READ_GSERVICES':
    'com.google.android.providers.gsf.permission.READ_GSERVICES',
  'com.htc.launcher.permission.READ_SETTINGS': 'com.htc.launcher.permission.READ_SETTINGS',
  'com.htc.launcher.permission.UPDATE_SHORTCUT': 'com.htc.launcher.permission.UPDATE_SHORTCUT',
  'com.majeur.launcher.permission.UPDATE_BADGE': 'com.majeur.launcher.permission.UPDATE_BADGE',
  'com.sec.android.provider.badge.permission.READ':
    'com.sec.android.provider.badge.permission.READ',
  'com.sec.android.provider.badge.permission.WRITE':
    'com.sec.android.provider.badge.permission.WRITE',
  'com.sonyericsson.home.permission.BROADCAST_BADGE':
    'com.sonyericsson.home.permission.BROADCAST_BADGE',
};
//# sourceMappingURL=Manifest.js.map
