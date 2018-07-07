import './style.scss';

import { default as Prism } from 'prismjs';
import 'prismjs/components/prism-pug';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-stylus';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';

Prism.languages['scss'] = Prism.languages['sass'];
Prism.languages['styl'] = Prism.languages['stylus'];
Prism.languages['babelrc'] = Prism.languages['json'];
Prism.languages['md'] = Prism.languages['markup'];

import { default as showdown } from 'showdown';
const converter = new showdown.Converter();
const classShowdown = 'markdown-body';

import 'github-markdown-css';

export default class CodeView {
  private _codeElement: HTMLElement;

  constructor(
    private _el: HTMLElement,
  ) {
    this._codeElement = _el.querySelector('code');
  }

  next(code: string, ext: string = 'javascript') {
    this._codeElement.classList.remove(classShowdown);

    if (ext === 'md') {
      code = converter.makeHtml(code);
      this._codeElement.classList.add(classShowdown);
      this._codeElement.innerHTML = code;
      return;
    }

    this._codeElement.innerHTML = Prism.highlight(code, Prism.languages[ext], ext);
  }
}
