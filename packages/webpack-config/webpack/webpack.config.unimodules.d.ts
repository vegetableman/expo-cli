/**
 * A bare webpack config that is required for using
 * react-native-web & Unimodules in the browser.
 *
 * This should be used to inject basic support into systems
 * like react-scripts and storybook.
 */
import { Configuration } from 'webpack';
import { Arguments, DevConfiguration, Environment } from './types';
export default function (env: Environment, argv: Arguments): DevConfiguration | Configuration;
