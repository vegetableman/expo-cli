import { Entry } from 'webpack';
import { GenerateSWOptions, InjectManifestOptions } from 'workbox-webpack-plugin';
import { AnyConfiguration } from './types';
export declare type OfflineOptions = {
    projectRoot?: string;
    serviceWorkerPath?: string;
    autoRegister?: boolean;
    dev?: boolean;
    publicUrl?: string;
    scope?: string;
    useServiceWorker?: boolean;
    generateSWOptions?: GenerateSWOptions;
    injectManifestOptions?: InjectManifestOptions;
};
export declare function ensureEntryAsync(arg: any): Promise<Entry>;
export default function withWorkbox(config: AnyConfiguration, options?: OfflineOptions): AnyConfiguration;
