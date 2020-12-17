import { Rule } from 'webpack';
import { Mode } from '../types';
/**
 * A complex babel loader which uses the project's `babel.config.js`
 * to resolve all of the Unimodules which are shipped as ES modules (early 2019).
 */
export default function createBabelLoader({ 
/**
 * The webpack mode: `"production" | "development"`
 */
mode, babelProjectRoot, include, verbose, platform, useCustom, ...options }?: {
    useCustom?: boolean;
    mode?: Mode;
    babelProjectRoot?: string;
    include?: string[];
    verbose?: boolean;
    [key: string]: any;
}): Rule;
