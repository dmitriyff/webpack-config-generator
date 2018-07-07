import { ISettings, DEFAULT_SETTING } from '../settings';

export default function webpackCommonRender({
  entry,
  extensions,

  useStyleLoader,
  useExtractPlugin,
  useSassLoader,
  useLessLoader,
  useStylusLoader,

  useTemplateEngine,
  usePugEngine,

  useBabelLoader,
  useTsLoader,

  useFileLoader,
  useUrlLoader,
  urlLimit,
  useSvgSpriteLoader
}:ISettings): string {

// Assets loaders.
const FILE_LOADER = `{
      test: /\\.(jpe?g|png|gif${ useSvgSpriteLoader ? '' : '|svg' })$/,
      use: [{
          loader: 'file-loader',
          options: {
              name: 'assets/img/[name].[hash].[ext]'
          }
      }]
    }`;

const URL_LOADER = `{
      test: /\\.(jpe?g|png|gif${ useSvgSpriteLoader ? '' : '|svg' })$/,
      use: [{
          loader: 'url-loader',
          options: {
              limit: ${ urlLimit },
              name: 'assets/img/[name].[hash].[ext]',
              fallback: 'file-loader'
          }
      }]
    }`;

const SVG_SPRITE_LOADER = `{
      test: /\\.svg$/,
      use: [{
          loader: 'svg-sprite-loader'
      }]
    }`;

const RESOLVE_URL_LOADER = `{
        loader: 'resolve-url-loader'
      }, `;

const assetsLoaders = [];
const useAssetsLoader = useFileLoader || useUrlLoader;
useFileLoader = useFileLoader && !useUrlLoader;
useFileLoader && assetsLoaders.push(FILE_LOADER);
useUrlLoader && assetsLoaders.push(URL_LOADER);
useSvgSpriteLoader && assetsLoaders.push(SVG_SPRITE_LOADER);

let alias = useAssetsLoader ? `alias: {
        assets: path.join(srcDir, 'assets')
      },` : '';

const ASSETS_LOADER = `const ASSETS_LOADER = [
    ${ assetsLoaders.join(', ') }
  ];
`;

// Style preprocessors.
useExtractPlugin = useStyleLoader && useExtractPlugin;
const USE_EXTRACT_LOADER = `{
        loader: ${ useExtractPlugin ? 'MiniCssExtractPlugin.loader' : '\'style-loader\'' }
      }`;

let requireExtractPlugin = 
    `const MiniCssExtractPlugin = require('mini-css-extract-plugin');
`;

const USE_CSS_LODER = `{
        loader: 'css-loader',
        options: {
          sourceMap
        }
      }`;

const CSS_LOADER = `{
      test: /\\.css$/,
      use: [${ 
        USE_EXTRACT_LOADER
      }, ${
        USE_CSS_LODER
      }]
    }`;

const SASS_LOADER = `{
      test: /\\.scss$/,
      use: [${
        USE_EXTRACT_LOADER
      }, ${
        USE_CSS_LODER
      }, ${ useAssetsLoader ? RESOLVE_URL_LOADER : ''}{
        loader: 'sass-loader',
        options: {
          sourceMap${ useAssetsLoader ? ': true' : '' }
        }
      }]
    }`;

const LESS_LOADER = `{
      test: /\\.less$/,
      use: [${
        USE_EXTRACT_LOADER
      }, ${
        USE_CSS_LODER
      }, {
        loader: 'less-loader',
        options: {
          sourceMap
        }
      }]
    }`;

const STYLUS_LOADER = `{
      test: /\\.styl$/,
      use: [${
        USE_EXTRACT_LOADER
      }, ${
        USE_CSS_LODER
      }, {
        loader: 'stylus-loader',
        options: {
          sourceMap
        }
      }]
    }`;


const styleLoaders = [CSS_LOADER];
useSassLoader && styleLoaders.push(SASS_LOADER);
useLessLoader && styleLoaders.push(LESS_LOADER);
useStylusLoader && styleLoaders.push(STYLUS_LOADER);

const STYLE_LOADER = `const STYLE_LOADER = [
    ${ styleLoaders.join(', ') }
  ];
`;

// Template engines.
const USE_HTML_LOADER = `{
        loader: 'html-loader',
        options: {
            interpolate: 'require',
            attrs: ['img:src', 'source:srcset']
        }
      }`;

const HTML_LOADER = `{
      test: /\\.html$/,
      exclude: /node_modules/,
      use: [${ USE_HTML_LOADER }]
    }`;

const PUG_LOADER = `{
      test: /\\.pug$/,
      exclude: /node_modules/,
      use: [${ USE_HTML_LOADER }, {
        loader: 'pug-html-loader',
        options: {
          pretty: true,
          exports: false
        }
      }]
    }`;


const templateLoaders = [HTML_LOADER];
usePugEngine && templateLoaders.push(PUG_LOADER);

const TEMPLATE_LOADER = `const TEMPLATE_LOADER = [
    ${ templateLoaders.join(', ') }
  ];
`;

// JavaScript compilers.
const BABEL_LOADER = `{
      test: /\\.js/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader'
      }]
    }`;

const TS_LOADER = `{
      test: /\\.ts/,
      exclude: /node_modules/,
      use: [{
        loader: 'ts-loader'
      }]
    }`;

const compilerLoaders = [];
const useCompiler = useBabelLoader || useTsLoader;
useBabelLoader && compilerLoaders.push(BABEL_LOADER);
useTsLoader && compilerLoaders.push(TS_LOADER);

const COMPILER_LOADER = `const COMPILER_LOADER = [
    ${ compilerLoaders.join(', ') }
  ];
`;

// Add loaders to rules.
const rules = [];
useStyleLoader && rules.push('...STYLE_LOADER');
useTemplateEngine && rules.push('...TEMPLATE_LOADER');
useCompiler && rules.push('...COMPILER_LOADER');
useAssetsLoader && rules.push('...ASSETS_LOADER');

const loaders = [];
useStyleLoader && loaders.push(STYLE_LOADER);
useTemplateEngine && loaders.push(TEMPLATE_LOADER);
useCompiler && loaders.push(COMPILER_LOADER);
useAssetsLoader && loaders.push(ASSETS_LOADER);

  return `// Native dependencies.
const path = require('path');

// Webpack dependencies.
const HtmlWebPackPlugin = require('html-webpack-plugin');
${ useExtractPlugin && requireExtractPlugin || '' }
// Constants defines.
const srcDir = path.resolve('./src');
const distDir = path.resolve('./dist');

module.exports = (env, {
  sourceMap
}) => {
  ${ loaders.join('  ') }
  return {
    entry: {
      app: path.join(srcDir, '${ entry }')
    },

    output: {
      path: distDir,
      filename: '[name].[hash].js'
    },

    resolve: {
      ${ alias }
      extensions: [${ extensions.join(', ') }]
    },

    plugins: [
      new HtmlWebPackPlugin({
        template: './src/${ usePugEngine && 'index.pug' || 'index.html' }',
        filename: './index.html'
      })
    ],

    module: {
      rules: [
        ${ rules.join(',\n        ') }
      ]
    }
  }
};
`;
}
