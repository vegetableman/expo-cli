import { Configuration } from 'webpack';
import { Arguments, DevConfiguration, InputEnvironment } from './types';
export default function withUnimodules(inputWebpackConfig?: DevConfiguration | Configuration, env?: InputEnvironment, argv?: Arguments): DevConfiguration | Configuration;
