import { ISettings, DEFAULT_SETTING } from '../settings';

export default function webpackProdRender({
  useStyleLoader,
  useExtractPlugin
}:ISettings): string {

useExtractPlugin = useStyleLoader && useExtractPlugin;

let requireExtractPlugin = 
  `const MiniCssExtractPlugin = require('mini-css-extract-plugin');
`;

let addExtractPlugin =
  `new MiniCssExtractPlugin({filename: '[name].[hash].css'}),
`;

  return `// Native dependencies.
const path = require('path');

// Webpack dependencies.
const merge = require('webpack-merge');
const commonCfg = require('./webpack.common');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
${ useExtractPlugin && requireExtractPlugin || '' }
module.exports = (env, argv) => merge(commonCfg(env, {
  ...argv,
  sourceMap: false
}), {
  mode: 'production',
  bail: true,

  plugins: [
    ${ useExtractPlugin && addExtractPlugin || '' }
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
});
`;
}
