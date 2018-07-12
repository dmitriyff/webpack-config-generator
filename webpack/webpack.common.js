// Native dependencies.
const path = require('path');

// Webpack dependencies.
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Constants defines.
const srcDir = path.resolve('./src');
const distDir = path.resolve('./docs');

module.exports = (env, {
  sourceMap
}) => {
  const STYLE_LOADER = [
    {
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
        loader: 'css-loader',
        options: {
          sourceMap
        }
      }]
    }, {
      test: /\.scss$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
        loader: 'css-loader',
        options: {
          sourceMap
        }
      }, {
        loader: 'resolve-url-loader'
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true // https://github.com/bholloway/resolve-url-loader/issues/84
        }
      }]
    }
  ];
  const TEMPLATE_LOADER = [
    {
      test: /\.html$/,
      exclude: /node_modules/,
      use: [{
        loader: 'html-loader',
        options: {
            interpolate: 'require',
            attrs: ['img:src', 'source:srcset']
        }
      }]
    }, {
      test: /\.pug$/,
      exclude: /node_modules/,
      use: [{
        loader: 'html-loader',
        options: {
            interpolate: 'require',
            attrs: ['img:src', 'source:srcset']
        }
      }, {
        loader: 'pug-html-loader',
        options: {
          pretty: true,
          exports: false
        }
      }]
    }
  ];
  const COMPILER_LOADER = [
    {
      test: /\.js/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /\.ts/,
      exclude: /node_modules/,
      use: [{
        loader: 'ts-loader'
      }]
    }
  ];
  const ASSETS_LOADER = [
    {
      test: /\.(jpe?g|png|gif|svg)$/,
      use: [{
          loader: 'file-loader',
          options: {
              name: 'assets/img/[name].[hash].[ext]'
          }
      }]
    }
  ];

  return {
    entry: {
      app: path.join(srcDir, 'index.ts')
    },

    output: {
      path: distDir,
      filename: '[name].[hash].js'
    },

    resolve: {
      alias: {
        assets: path.join(srcDir, 'assets')
      },
      extensions: ['.ts', '.js']
    },

    plugins: [
      new HtmlWebPackPlugin({
        template: './src/index.pug',
        filename: './index.html'
      })
    ],

    module: {
      rules: [
        ...STYLE_LOADER,
        ...TEMPLATE_LOADER,
        ...COMPILER_LOADER,
        ...ASSETS_LOADER
      ]
    }
  }
};
