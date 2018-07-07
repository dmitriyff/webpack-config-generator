import './style.scss';

import { BehaviorSubject, Observable, fromEvent, merge, combineLatest } from 'rxjs';
import { map, tap, startWith } from 'rxjs/operators'

const $ = (selector: string): HTMLElement  => {
  return document.querySelector(selector);
}

export interface ISettings {
  entry: string;
  extensions: string[];

  useStyleLoader: boolean;
  useExtractPlugin: boolean;
  useSassLoader: boolean;
  useLessLoader: boolean;
  useStylusLoader: boolean;

  useTemplateEngine: boolean; 
  usePugEngine: boolean;

  useBabelLoader: boolean;
  useTsLoader: boolean;

  useFileLoader: boolean;
  useUrlLoader: boolean;
  urlLimit: number;
  useSvgSpriteLoader: boolean;
}

export const DEFAULT_SETTING: ISettings = {
  entry: 'index.js',
  extensions: ['\'.js\''],

  useStyleLoader: true,
  useExtractPlugin: false,
  useSassLoader: false,
  useLessLoader: false,
  useStylusLoader: false,

  useTemplateEngine: false,
  usePugEngine: false,

  useBabelLoader: false,
  useTsLoader: false,

  useFileLoader: false,
  useUrlLoader: false,
  urlLimit: 8196,
  useSvgSpriteLoader: false
}

export default class SettingsComponent {
  private _settingsSbj: BehaviorSubject<any> = new BehaviorSubject({});
  settings$: Observable<any> = this._settingsSbj.asObservable();

  constructor() {
    console.log('SettingsComponent::constructor');

    // Style preprocessors section.
    const styleLoader = $('#style-loader');
    const useStyleLoader$ = getCheckboxInputObservable('#use-style-loader');
    const useExractPlugin$ = getCheckboxInputObservable('#use-exract-plugin');
    const useSassLoader$ = getCheckboxInputObservable('#use-sass-loader');
    const useLessLoader$ = getCheckboxInputObservable('#use-less-loader');
    const useStylusLoader$ = getCheckboxInputObservable('#use-stylus-loader');
    const styleLoader$ = useStyleLoader$
    .pipe(tap(toggleDisabled(styleLoader)));


    // Template egines section.
    const templateEngine = $('#template-engine');
    const useTemplateEngine$ = getCheckboxInputObservable('#use-template-engine');
    const usePugEngine$ = getCheckboxInputObservable('#use-pug-engine');
    const templateEngine$ = useTemplateEngine$
    .pipe(tap(toggleDisabled(templateEngine)));


    // JavaScript compilers section.
    const useBabelLoader$ = getCheckboxInputObservable('#use-babel-loader');
    const useTsLoader$ = getCheckboxInputObservable('#use-ts-loader');


    // Assets.
    const assetsLoader = $('#assets-loader');
    const useFileLoader$ = getCheckboxInputObservable('#use-file-loader');
    const useUrlLoader$ = getCheckboxInputObservable('#use-url-loader');
    const useSvgSpriteLoader$ = getCheckboxInputObservable('#use-svg-sprite-loader');
    const assetsLoader$ = useFileLoader$
    .pipe(tap(toggleDisabled(assetsLoader))); 

    // Others
    const entry$ = useTsLoader$
    .pipe(map((useTsLoader) => useTsLoader ? 'index.ts' : 'index.js'));
    const extensions$ = useTsLoader$
    .pipe(map((useTsLoader) => useTsLoader ? ['\'.ts\'', '\'.js\''] : ['\'.js\'']));

    merge(
      styleLoader$,
      templateEngine$,
      assetsLoader$
    ).subscribe();


    combineLatest(
      // Style preprocessors.
      useStyleLoader$.pipe(map((useStyleLoader) => ({ useStyleLoader }))),
      useExractPlugin$.pipe(map((useExtractPlugin) => ({ useExtractPlugin }))),
      useSassLoader$.pipe(map((useSassLoader) => ({ useSassLoader }))),
      useLessLoader$.pipe(map((useLessLoader) => ({ useLessLoader }))),
      useStylusLoader$.pipe(map((useStylusLoader) => ({ useStylusLoader }))),
      // Template egines.
      useTemplateEngine$.pipe(map((useTemplateEngine) => ({ useTemplateEngine }))),
      usePugEngine$.pipe(map((usePugEngine) => ({ usePugEngine }))),
      // JavaScript compilers.
      useBabelLoader$.pipe(map((useBabelLoader) => ({ useBabelLoader }))),
      useTsLoader$.pipe(map((useTsLoader) => ({ useTsLoader }))),
      // Assets.
      useFileLoader$.pipe(map((useFileLoader) => ({ useFileLoader }))),
      useUrlLoader$.pipe(map((useUrlLoader) => ({ useUrlLoader }))),
      useSvgSpriteLoader$.pipe(map((useSvgSpriteLoader) => ({ useSvgSpriteLoader }))),
      // Others
      entry$.pipe(map((entry) => ({ entry }))),
      extensions$.pipe(map((extensions) => ({ extensions }))),
    )
    .pipe(map(([...settings]) => Object.assign(DEFAULT_SETTING, ...settings)))
    .pipe(tap((settings) => this._settingsSbj.next(settings)))
    .subscribe();
  }
}

function getCheckboxInputObservable(selector: string): Observable<boolean> {
  const checkbox = $(selector);

  return fromEvent(checkbox, 'input')
    .pipe(map(getInputChecked))
    .pipe(startWith(false));
}

function getInputChecked(event): boolean {
  const input = event.target as HTMLInputElement;
  return input.checked;
}

function toggleDisabled(element: HTMLElement) {
  return function(value) {
    if (value) {
      element.removeAttribute('disabled');
    } else {
      element.setAttribute('disabled', 'disabled');
    }
  }
}
