import { ISettings, DEFAULT_SETTING } from '../settings';

export default function webpackDevRender({
  useStyleLoader,
  useExtractPlugin
}:ISettings): string {

useExtractPlugin = useStyleLoader && useExtractPlugin;

let requireExtractPlugin = 
  `const MiniCssExtractPlugin = require('mini-css-extract-plugin');
`;

let addExtractPlugin =
  `new MiniCssExtractPlugin({filename: '[name].css'}),
`;

  return `// Native dependencies.
const path = require('path');

// Webpack dependencies.
const merge = require('webpack-merge');
const commonCfg = require('./webpack.common');
${ useExtractPlugin && requireExtractPlugin || '' }
module.exports = (env, argv) => merge(commonCfg(env, {
  ...argv,
  sourceMap: true
}), {
  mode: 'development',
  devtool: 'source-map',

  plugins: [
    ${ useExtractPlugin && addExtractPlugin || '' }
  ]
});
`;
}
