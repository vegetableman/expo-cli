import { Configuration } from 'webpack';
import { ExpoConfig } from '@expo/config';
import { DevConfiguration, Environment } from './types';
export declare const DEFAULT_GZIP_OPTIONS: {
    test: RegExp;
    filename: string;
    algorithm: string;
    threshold: number;
    minRatio: number;
};
export declare const DEFAULT_BROTLI_OPTIONS: {
    asset: string;
    test: RegExp;
    threshold: number;
    minRatio: number;
};
export default function withCompression(webpackConfig: Configuration | DevConfiguration, env: Environment): Configuration | DevConfiguration;
export declare function addCompressionPlugins(webpackConfig: Configuration | DevConfiguration, config: ExpoConfig): Configuration | DevConfiguration;
