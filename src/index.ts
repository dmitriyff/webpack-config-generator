import './style.scss';
import { default as TreeView } from './app/treeview';
import { default as CodeView } from './app/codeview';
import { default as DownloadComponent } from './app/download';
import { default as SettingsComponent } from './app/settings';

import { BehaviorSubject, from, fromEvent, combineLatest, forkJoin, merge } from 'rxjs';
import { tap, switchMap, map, filter, mergeMap, concatMap, take } from 'rxjs/operators'
// import { forkJoin } from 'rxjs/observable/forkJoin';

import {
  getFiles
} from './app/files-renders';


const $ = (selector: string): NodeListOf<HTMLElement>  => {
  return document.querySelectorAll(selector);
}


const codeViewNode = $('.app-codeview')[0];
const codeViewComponent = new CodeView(codeViewNode);


const settingsComponent = new SettingsComponent();


const treeViewNode = $('.app-treeview')[0];
const treeViewComponent = new TreeView(treeViewNode);
const defaultFilePath = location.hash && location.hash.replace('#', '') || 'webpack/webpack.common.js';
treeViewComponent.file(defaultFilePath);


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
  download$
).subscribe();