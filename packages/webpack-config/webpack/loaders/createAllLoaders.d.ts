import { Rule } from 'webpack';
import { ExpoConfig } from '@expo/config';
import { Environment, Mode, FilePaths } from '../types';
export declare const imageLoaderRule: Rule;
export declare const fallbackLoaderRule: Rule;
export declare const styleLoaderRule: Rule;
export default function createAllLoaders(env: Environment): Rule[];
export declare function getBabelLoaderRuleFromEnv(env: Environment): Rule;
export declare function getBabelLoaderRule(projectRoot: string, { web: { build: { babel } } }: ExpoConfig, mode: Mode, platform?: string): Rule;
export declare function getHtmlLoaderRule(exclude: string): Rule;
export declare function getAllLoaderRules(config: ExpoConfig, mode: Mode, { root, includeModule, template }: FilePaths, platform?: string): Rule[];
