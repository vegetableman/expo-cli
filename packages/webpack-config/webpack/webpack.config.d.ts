import { Configuration } from 'webpack';
import { Arguments, DevConfiguration } from './types';
import { Environment } from './types';
export default function (env: Environment, argv?: Arguments): Promise<Configuration | DevConfiguration>;
