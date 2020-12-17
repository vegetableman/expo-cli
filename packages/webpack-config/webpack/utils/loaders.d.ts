import { Configuration, RuleSetCondition, RuleSetLoader, RuleSetRule, RuleSetUse, RuleSetUseItem, Entry } from 'webpack';
import { DevConfiguration } from '../types';
declare type AnyConfiguration = Configuration | DevConfiguration;
interface RuleItem {
    rule: RuleSetRule;
    index: number;
}
declare type ResolvedRuleSet = string | RuleSetLoader;
interface PluginItem {
    plugin: object;
    index: number;
}
interface LoaderItem {
    rule: RuleSetRule;
    ruleIndex: number;
    loader: RuleSetUseItem;
    loaderIndex: number;
}
export declare function findLoader(loaderName: string, rules: RuleSetRule[]): RuleSetRule | null;
export declare function getRulesAsItems(rules: RuleSetRule[]): RuleItem[];
export declare function getRules(config: AnyConfiguration): RuleItem[];
export declare function getRulesFromRules(rules: RuleSetRule[]): RuleSetRule[];
export declare function getLoadersFromRules(rules: RuleItem[]): LoaderItem[];
export declare function getLoaders(config: AnyConfiguration): LoaderItem[];
export declare function getRulesByMatchingFiles(config: AnyConfiguration, files: string[]): {
    [key: string]: RuleItem[];
};
export declare function rulesMatchAnyFiles(config: AnyConfiguration, files: string[]): boolean;
export declare function resolveRuleSetUse(rule?: RuleSetUse | RuleSetUse[]): ResolvedRuleSet[];
export declare function conditionMatchesFile(condition: RuleSetCondition | undefined, file: string): boolean;
export declare function getPlugins({ plugins }: AnyConfiguration): PluginItem[];
export declare function getPluginsByName(config: AnyConfiguration, name: string): PluginItem[];
export declare function isRuleSetItem(loader: RuleSetUse): loader is RuleSetUseItem;
export declare function isRuleSetLoader(loader: RuleSetUse): loader is RuleSetLoader;
export declare function isEntry(arg: any): arg is Entry;
export {};
