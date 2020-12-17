import { ExpoConfig } from '@expo/config';
import { Environment } from '../types';
declare function getConfig(env: Environment): ExpoConfig;
export default getConfig;
