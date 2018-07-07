import './style.scss';

import { default as JSZip } from 'jszip';
import { default as saver } from 'file-saver';

import { Observable, fromEvent } from 'rxjs';

export default class DownloadComponent {
  event$: Observable<any>;

  constructor(
    private _el: HTMLElement,
  ) {
    this.event$ = fromEvent(_el, 'click');
  }

  download(files) {
    const zip = new JSZip();
    
    Object.keys(files).forEach((path) => {
      zip.file(path, files[path]);
    });

    zip.generateAsync({type: "blob"})
    .then(function (content) {
      saver.saveAs(content, "project.zip");
      });
  }
}

