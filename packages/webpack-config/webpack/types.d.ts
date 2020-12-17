import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration, ProxyConfigMap, ProxyConfigArray } from 'webpack-dev-server';
export interface DevConfiguration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}
export declare type AnyConfiguration = DevConfiguration | WebpackConfiguration;
export declare type InputEnvironment = {
    projectRoot?: string;
    platform?: 'ios' | 'android' | 'web';
    info?: boolean;
    https?: boolean;
    production?: boolean;
    development?: boolean;
    config?: {
        [key: string]: any;
    };
    locations?: FilePaths;
    polyfill?: boolean;
    mode?: Mode;
    removeUnusedImportExports?: boolean;
    pwa?: boolean;
    report?: {
        verbose: boolean;
        path: string;
        statsFilename: string;
        reportFilename: string;
    };
};
export declare type Environment = {
    info: boolean;
    https: boolean;
    config: {
        [key: string]: any;
    };
    locations: FilePaths;
    projectRoot: string;
    polyfill?: boolean;
    mode: Mode;
    platform: 'ios' | 'android' | 'web';
    removeUnusedImportExports?: boolean;
    pwa?: boolean;
    report?: Report;
};
export declare type Report = {
    verbose: boolean;
    path: string;
    statsFilename: string;
    reportFilename: string;
};
declare type PathResolver = (...input: string[]) => string;
export interface FilePathsFolder {
    get: PathResolver;
    folder: string;
    indexHtml: string;
    manifest: string;
    serveJson: string;
    favicon: string;
    serviceWorker: string;
}
export interface FilePaths {
    absolute: PathResolver;
    includeModule: PathResolver;
    template: FilePathsFolder;
    production: FilePathsFolder;
    packageJson: string;
    root: string;
    appMain: string | null;
    modules: string;
    servedPath: string;
}
export declare type Mode = 'production' | 'development' | 'none';
export interface Arguments {
    allowedHost?: string;
    proxy?: ProxyConfigMap | ProxyConfigArray;
    [key: string]: any;
}
export {};
