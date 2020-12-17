import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { ExpoConfig } from '@expo/config';
import { DevConfiguration, Environment } from './types';
export declare const DEFAULT_REPORTING_OPTIONS: BundleAnalyzerPlugin.Options & {
    verbose?: boolean;
    path: string;
};
export declare function throwDeprecatedConfig({ web }: ExpoConfig): void;
export declare function maybeWarnAboutRebuilds(env: Environment): void;
export default function withReporting(config: Configuration | DevConfiguration, env: Environment): Configuration | DevConfiguration;
