import './style.scss';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators'

export default class TreeView {
  private _fileSbj: BehaviorSubject<string> = new BehaviorSubject(null);
  file$: Observable<any> = this._fileSbj.asObservable();

  constructor(
    private _el: HTMLElement,
    private _tree: string[] = []
  ) {
    this.next(_tree);
    fromEvent(this._el, 'click')
      .pipe(map(({ target }: { target: HTMLElement }) => {
        this.file(target.getAttribute('data-path'));
        return target.getAttribute('data-path');
      }))
      .subscribe();
  }

  render(tree: any) {
    const html = renderTree(tree);
    this._el.innerHTML = html;
  }

  next(list: any) {
    const tree = preRender(list);
    this.render(tree);
  }

  file(filePath: string) {
    this._fileSbj.next(filePath);
  }
}

function preRender(list: string[], tree = {}): any {
  list.sort(order).reverse().reduce((tree, item) => {
    item.split('/').reduce((tree, path) => {
      if (!tree[path]) {
        tree[path] = {};
      }

      return tree[path];
    }, tree);
    
    return tree;
  }, tree);

  return tree;
}

function renderTree(tree: any, path: string = ''): string {
  return Object.keys(tree)
    .reduce((html, name) => {
      const length = Object.keys(tree[name]).length;

      if (length) {
        return html + renderFolder(name, tree[name], path);
      }

      return html + renderFile(name, path);
    }, '');
}

function renderFolder(folderName: string, tree: any, path: string = ''): string {
  path += path ? `/${folderName}` : folderName;
  return `
  <details open>
    <summary class='folder'>${ folderName }</summary>
    ${ renderTree(tree, path) }
  </details>
  `;
}

function renderFile(fileName: string, path: string = ''): string {
  path += path ? '/' : '';
  return `<div class='file' data-path='${ path }${ fileName }'>${ fileName }</div>`;
}

function order(a, b) {
  const aIsFolder = a.match('/');
  const bIsFolder = b.match('/');

  if (aIsFolder && bIsFolder) {
    if(a > b) {
      return -1;
    }

    if (a < b) {
      return 1;
    }

    return 0;
  } else if (aIsFolder) {
    return 1;
  } else if (bIsFolder) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  if (a < b) {
    return -1;
  }

  return 0;
}