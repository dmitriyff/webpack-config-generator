import { ISettings } from '../settings';

export default function packageJsonRender({
    useStyleLoader,
    useExtractPlugin,
    useSassLoader,
    useLessLoader,
    useStylusLoader,

    usePugEngine,

    useBabelLoader,
    useTsLoader,

    useFileLoader,
    useUrlLoader,
    useSvgSpriteLoader
}: ISettings): string {

useExtractPlugin = useStyleLoader && useExtractPlugin;

const EXTRACT_PLUGIN = [
    '"mini-css-extract-plugin": "^0.6.0"'
];

const STYLE_LOADER = [
    '"css-loader": "^2.1.1"',
    '"style-loader": "^0.23.0"'
];

const SASS_LOADER = [
    '"node-sass": "^4.9.1"',
    '"sass-loader": "^7.0.3"'
];

const LESS_LOADER = [
    '"less": "^3.5.2"',
    '"less-loader": "^4.1.0"'
];

const STYLUS_LOADER = [
    '"stylus": "^0.54.5"',
    '"stylus-loader": "^3.0.2"'
];

const PUG_HTML_LOADER = [
    '"pug-html-loader": "^1.1.5"'
];

const BABEL_LOADER = [
    '"@babel/core": "^7.4.3"',
    '"@babel/preset-env": "^7.4.3"',
    '"babel-loader": "^8.0.5"'
];

const TS_LOADER = [
    '"ts-loader": "^5.3.3"',
    '"typescript": "^3.4.4"'
];

const FILE_LOADER = [
    '"file-loader": "^1.1.11"'
];

const URL_LOADER = [
    '"url-loader": "^1.0.1"'
];

const RESOLVE_URL_LOADER = [
    '"resolve-url-loader": "^2.3.0"'
];

const SVG_SPRITE_LOADER = [
  '"svg-sprite-loader": "^3.8.0"'
];

let devDependencies = [
    '"html-loader": "^0.5.5"',
    '"html-webpack-plugin": "^3.2.0"',
    '"webpack": "^4.15.0"',
    '"webpack-cli": "^3.0.8"',
    '"webpack-dev-server": "^3.1.4"',
    '"webpack-merge": "^4.1.3"',
    '"optimize-css-assets-webpack-plugin": "^5.0.1"',
    '"uglifyjs-webpack-plugin": "^2.1.2"'
];

useExtractPlugin && devDependencies.push(...EXTRACT_PLUGIN);
useStyleLoader && devDependencies.push(...STYLE_LOADER);
useSassLoader && devDependencies.push(...SASS_LOADER);
useLessLoader && devDependencies.push(...LESS_LOADER);
useStylusLoader && devDependencies.push(...STYLUS_LOADER);

usePugEngine && devDependencies.push(...PUG_HTML_LOADER);

useBabelLoader && devDependencies.push(...BABEL_LOADER);
useTsLoader && devDependencies.push(...TS_LOADER);

useFileLoader && devDependencies.push(...FILE_LOADER);
useUrlLoader && devDependencies.push(...URL_LOADER);
useSvgSpriteLoader && devDependencies.push(...SVG_SPRITE_LOADER);

(useFileLoader || useUrlLoader) && useSassLoader && devDependencies.push(...RESOLVE_URL_LOADER);

	return `{
  "name": "webpack-config-generator",
  "version": "0.0.1",
  "description": "",
  "main": "src/index.js",
  "scripts": {
    "start": "npm run serve:dev",
    "serve:dev": "webpack-dev-server --config ./webpack/webpack.dev.js",
    "build": "npm run build:prod",
    "build:dev": "webpack --config ./webpack/webpack.dev.js",
    "build:prod": "webpack --config ./webpack/webpack.prod.js",
    "watch:dev": "webpack --watch --config ./webpack/webpack.dev.js",
    "watch:prod": "webpack --watch --config ./webpack/webpack.prod.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {},
  "devDependencies": {
    ${ devDependencies.join(',\n    ') }
  }
}
`;

}
