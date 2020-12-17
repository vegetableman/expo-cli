'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Loader flattening inspired by:
 * https://github.com/preactjs/preact-cli-experiment/tree/7b80623/packages/cli-plugin-legacy-config
 */
const util_1 = require('util');
function findLoader(loaderName, rules) {
  for (const rule of rules) {
    if (
      rule.use &&
      rule.use.loader &&
      (rule.use.loader.includes(`/${loaderName}`) || rule.use.loader.includes(`\\${loaderName}`))
    ) {
      return rule;
    }
  }
  return null;
}
exports.findLoader = findLoader;
function getRulesAsItems(rules) {
  return rules.map((rule, index) => ({
    index,
    rule,
  }));
}
exports.getRulesAsItems = getRulesAsItems;
function getRules(config) {
  const { preLoaders = [], postLoaders = [], rules = [] } = config.module || {};
  return getRulesAsItems(getRulesFromRules([...preLoaders, ...postLoaders, ...rules]));
}
exports.getRules = getRules;
function getRulesFromRules(rules) {
  let output = [];
  for (const rule of rules) {
    if (rule.oneOf) {
      output.push(...getRulesFromRules(rule.oneOf));
    } else {
      output.push(rule);
    }
  }
  return output;
}
exports.getRulesFromRules = getRulesFromRules;
function getLoadersFromRules(rules) {
  const loaders = rules.map(({ rule, index: ruleIndex }) => {
    if (rule.oneOf) {
      return getLoadersFromRules(getRulesAsItems(rule.oneOf));
    }
    return loaderToLoaderItemLoaderPart(rule.loaders || rule.loader || rule.use).map(loader =>
      Object.assign({}, loader, { rule, ruleIndex })
    );
  });
  return loaders.reduce((arr, a) => arr.concat(a), []);
}
exports.getLoadersFromRules = getLoadersFromRules;
function getLoaders(config) {
  const rules = getRules(config);
  return getLoadersFromRules(rules);
}
exports.getLoaders = getLoaders;
function loaderToLoaderItemLoaderPart(loader) {
  if (!loader) return [];
  const loaders = [];
  if (typeof loader === 'function') {
    loaders.push(...loaderToLoaderItemLoaderPart(loader({})));
  } else if (isRuleSetItem(loader)) {
    loaders.push({ loader, loaderIndex: -1 });
  } else if (Array.isArray(loader)) {
    loaders.push(...loader.map((loader, loaderIndex) => ({ loader, loaderIndex })));
  }
  return loaders;
}
function getRulesByMatchingFiles(config, files) {
  const rules = getRules(config);
  let selectedRules = {};
  for (const file of files) {
    selectedRules[file] = rules.filter(({ rule }) => conditionMatchesFile(rule.test, file));
  }
  return selectedRules;
}
exports.getRulesByMatchingFiles = getRulesByMatchingFiles;
function rulesMatchAnyFiles(config, files) {
  const rules = getRulesByMatchingFiles(config, files);
  return Object.keys(rules).some(filename => !!rules[filename].length);
}
exports.rulesMatchAnyFiles = rulesMatchAnyFiles;
function resolveRuleSetUse(rule) {
  if (!rule) return [];
  if (Array.isArray(rule)) {
    const rules = rule;
    let resolved = [];
    for (const rule of rules) {
      resolved = [...resolved, ...resolveRuleSetUse(rule)];
    }
    return resolved;
  } else if (typeof rule === 'string' || isRuleSetLoader(rule)) {
    return [rule];
  } else if (typeof rule === 'function') {
    return resolveRuleSetUse(rule({}));
  }
  return [rule];
}
exports.resolveRuleSetUse = resolveRuleSetUse;
function conditionMatchesFile(condition, file) {
  if (!condition) return false;
  if (util_1.isRegExp(condition)) {
    return condition.test(file);
  } else if (typeof condition === 'string') {
    return file.startsWith(condition);
  } else if (typeof condition === 'function') {
    return Boolean(condition(file));
  } else if (Array.isArray(condition)) {
    return condition.some(c => conditionMatchesFile(c, file));
  }
  return Object.entries(condition)
    .map(([key, value]) => {
      switch (key) {
        case 'test':
          return conditionMatchesFile(value, file);
        case 'include':
          return conditionMatchesFile(value, file);
        case 'exclude':
          return !conditionMatchesFile(value, file);
        case 'and':
          return value.every(c => conditionMatchesFile(c, file));
        case 'or':
          return value.some(c => conditionMatchesFile(c, file));
        case 'not':
          return value.every(c => !conditionMatchesFile(c, file));
        default:
          return true;
      }
    })
    .every(b => b);
}
exports.conditionMatchesFile = conditionMatchesFile;
function getPlugins({ plugins = [] }) {
  return plugins.map((plugin, index) => ({ index, plugin }));
}
exports.getPlugins = getPlugins;
function getPluginsByName(config, name) {
  return getPlugins(config).filter(({ plugin }) => {
    if (plugin && plugin.constructor) {
      return plugin.constructor.name === name;
    }
    return false;
  });
}
exports.getPluginsByName = getPluginsByName;
function isRuleSetItem(loader) {
  return typeof loader === 'string' || typeof loader === 'function' || isRuleSetLoader(loader);
}
exports.isRuleSetItem = isRuleSetItem;
function isRuleSetLoader(loader) {
  return Object.keys(loader).some(k => ['loader', 'options', 'indent', 'query'].includes(k));
}
exports.isRuleSetLoader = isRuleSetLoader;
function isEntry(arg) {
  if (typeof arg !== 'object' || arg === null) {
    return false;
  }
  return Object.values(arg).every(value => {
    if (Array.isArray(value)) {
      return value.every(value => typeof value === 'string');
    }
    return typeof value === 'string';
  });
}
exports.isEntry = isEntry;
//# sourceMappingURL=loaders.js.map
