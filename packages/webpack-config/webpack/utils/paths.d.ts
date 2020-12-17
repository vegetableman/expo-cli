import { Environment, FilePaths } from '../types';
export declare function getAbsolutePathWithProjectRoot(projectRoot: string, ...pathComponents: string[]): string;
export declare function getPossibleProjectRoot(): string;
export declare function getModulesPath(projectRoot: string): string;
export declare function getEntryPoint(projectRoot: string): string | null;
export declare function getPaths(projectRoot: string): FilePaths;
export declare function getPathsAsync(projectRoot: string): Promise<FilePaths>;
export declare function getServedPath(projectRoot: string): string;
export declare function getPublicPaths({ projectRoot, ...env }: Environment): {
    /**
     * Webpack uses `publicPath` to determine where the app is being served from.
     * It requires a trailing slash, or the file assets will get an incorrect path.
     * In development, we always serve from the root. This makes config easier.
     */
    publicPath: string;
    /**
     * `publicUrl` is just like `publicPath`, but we will provide it to our app
     * as %WEB_PUBLIC_URL% in `index.html` and `process.env.WEB_PUBLIC_URL` in JavaScript.
     * Omit trailing slash as %WEB_PUBLIC_URL%/xyz looks better than %WEB_PUBLIC_URL%xyz.
     */
    publicUrl: string;
};
export declare function getProductionPath(projectRoot: string): string;
