import { Configuration } from 'webpack';
import { Arguments, DevConfiguration, InputEnvironment } from './types';
export default function (env: InputEnvironment, argv?: Arguments): Promise<Configuration | DevConfiguration>;
