import './style.scss';
import { default as TreeView } from './app/treeview';
import { default as CodeView } from './app/codeview';
import { default as DownloadComponent } from './app/download';
import { default as SettingsComponent, ISettings } from './app/settings';

import { BehaviorSubject, from, fromEvent, combineLatest, forkJoin, merge } from 'rxjs';
import { tap, switchMap, map, filter, mergeMap, concatMap, take, skip } from 'rxjs/operators'
// import { forkJoin } from 'rxjs/observable/forkJoin';

import {
  getFiles
} from './app/files-renders';


const $ = (selector: string): NodeListOf<HTMLElement>  => {
  return document.querySelectorAll(selector);
}


const codeViewNode = $('.app-codeview')[0];
const codeViewComponent = new CodeView(codeViewNode);

const settings = {};
const urlParams = new URLSearchParams(window.location.search);
for (let [key, value] of urlParams) {
  settings[key] = value;
}
const settingsComponent = new SettingsComponent(settings);


const treeViewNode = $('.app-treeview')[0];
const treeViewComponent = new TreeView(treeViewNode);
const defaultFilePath = location.hash && location.hash.replace('#', '') || 'webpack/webpack.common.js';
treeViewComponent.file(defaultFilePath);

const updateQuerySettings = (settings: ISettings) => {
  const urlParams = new URLSearchParams(location.search);

  Object.keys(settings).forEach((key) => {
    if (settings[key]) {
      urlParams.set(key, settings[key]);
    } else {
      urlParams.delete(key);
    }
  });

  const search = urlParams.toString();
  const url = `/?${ search }${ location.hash }`;

  history.replaceState(settings, 'Webpack Config Generator', url);
}

const updateQuerySettings$ = settingsComponent.settings$
.pipe(skip(1))
.pipe(tap(updateQuerySettings));

const filesList$ = settingsComponent.settings$
.pipe(map((settings) => getFiles(settings)));

const updateTreeView$ = filesList$
.pipe(tap((files) => treeViewComponent.next(Object.keys(files))));


const currentFile$ = combineLatest(filesList$, treeViewComponent.file$)
.pipe(filter(([files, filePath]) => !!files[filePath]))
.pipe(map(([files, filePath]) => filePath))
.pipe(tap((filePath) => location.hash = filePath));


const renderFile$ = combineLatest(filesList$, currentFile$, settingsComponent.settings$)
.pipe(filter(([files, filePath]) => !!files[filePath]))
.pipe(tap(([files, filePath, settings]) => {
  codeViewComponent.next(files[filePath](settings), filePath.match(/\.(\w+)$/)[1]);
}));


const filesWithSettings$ = combineLatest(filesList$, settingsComponent.settings$)


const downloadAction = ([files, settings]) => {
  const res = Object.keys(files).reduce((res, filePath) => {
    res[filePath] = files[filePath](settings);
    return res;
  }, {});

  downloadComponent.download(res);
}


const downloadNode = $('.app-download')[0];
const downloadComponent = new DownloadComponent(downloadNode);
const download$ = downloadComponent.event$
.pipe(switchMap(() => filesWithSettings$.pipe(take(1))))
.pipe(tap(downloadAction));


merge(
  renderFile$,
  updateTreeView$,
  download$,
  updateQuerySettings$
).subscribe();