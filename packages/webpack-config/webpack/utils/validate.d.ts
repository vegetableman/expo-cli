import { InputEnvironment, Environment, Report } from '../types';
export declare function validateReport(report: boolean | Report): Report | null;
export declare function validateEnvironment(env: InputEnvironment): Environment;
export declare function warnEnvironmentDeprecation(env: InputEnvironment, warnOnce?: boolean): void;
export declare function _resetWarnings(): void;
