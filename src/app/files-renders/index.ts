export const emptyRender = ({} = {}) => '';

import { default as packageJsonRender } from './packageJson';

import { default as srcIndexRender } from './srcIndex';
import { default as srcStyleCssRender } from './srcStyleCss';
import { default as srcIndexHtmlRender } from './srcIndexHtml';
import { default as srcIndexPugRender } from './srcIndexPug';
import { default as srcIndexTsxRender } from './srcIndexTsx';
import { default as srcIndexJsxRender } from './srcIndexJsx';

import { default as webpackDevRender } from './webpackDev';
import { default as webpackProdRender } from './webpackProd';
import { default as webpackCommonRender } from './webpackCommon';

import { default as babelrcRender } from './babelrc';
import { default as tsconfigJsonRender } from './tsconfigJson';
import { default as readmemdRender } from './readmemd';

import { ISettings, DEFAULT_SETTING } from '../settings';

export interface IFiles {
  [key: string]: Function
}

export function getFiles({
  useStyleLoader,
  useSassLoader,
  useLessLoader,
  useStylusLoader,

  useTemplateEngine,
  usePugEngine,

  useBabelLoader,
  useTsLoader,

  useReact
}: ISettings = DEFAULT_SETTING): IFiles {
  const files = {
    'webpack/webpack.common.js': webpackCommonRender,
    'webpack/webpack.dev.js': webpackDevRender,
    'webpack/webpack.prod.js': webpackProdRender,

    'package.json': packageJsonRender,
    'README.md': readmemdRender
  };

  if (useStyleLoader) {
    if (useSassLoader) 
      files['src/style.scss'] = srcStyleCssRender;

    else if (useLessLoader)
      files['src/style.less'] = srcStyleCssRender;

    else if (useStylusLoader)
      files['src/style.styl'] = srcStyleCssRender;

    else 
      files['src/style.css'] = srcStyleCssRender;
  }

  if (useTemplateEngine) {
    if (usePugEngine) {
      files['src/index.pug'] = srcIndexPugRender;
    } else {
      files['src/index.html'] = srcIndexHtmlRender;
    }
  } else {
    files['src/index.html'] = srcIndexHtmlRender;
  }

  if (useTsLoader) {
    if (useReact) {
      files['src/index.tsx'] = srcIndexTsxRender;
    } else {
      files['src/index.ts'] = srcIndexRender;
    }
  } else {
    if (useReact) {
      files['src/index.jsx'] = srcIndexJsxRender;
    } else {
      files['src/index.js'] = srcIndexRender;
    }
  }

  if (useBabelLoader) {
    files['.babelrc'] = babelrcRender;
  }

  if (useTsLoader) {
    files['tsconfig.json'] = tsconfigJsonRender;
  }

  return files;
}

import { Observable, BehaviorSubject, from, fromEvent, combineLatest, merge } from 'rxjs';
import { tap, switchMap, map, filter } from 'rxjs/operators'
