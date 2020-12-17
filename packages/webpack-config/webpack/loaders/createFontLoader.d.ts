import { Rule } from 'webpack';
declare function createFontLoader(projectRoot: string, includeModule: (...props: string[]) => string): Rule;
export default createFontLoader;
