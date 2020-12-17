import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Environment } from '../types';
export default class ExpoHtmlWebpackPlugin extends HtmlWebpackPlugin {
    constructor(env: Environment);
}
