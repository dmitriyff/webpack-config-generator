import './style.scss';

import { BehaviorSubject, Observable, fromEvent, merge, combineLatest as combine } from 'rxjs';
import { map, tap, startWith, combineLatest } from 'rxjs/operators'

const $ = (selector: string): HTMLElement  => {
  return document.querySelector(selector);
}

export interface ISettings {
  entry?: string;
  extensions?: string[];

  useStyleLoader?: boolean;
  useExtractPlugin?: boolean;
  useSassLoader?: boolean;
  useLessLoader?: boolean;
  useStylusLoader?: boolean;

  useTemplateEngine?: boolean; 
  usePugEngine?: boolean;

  useBabelLoader?: boolean;
  useTsLoader?: boolean;

  useFileLoader?: boolean;
  useUrlLoader?: boolean;
  urlLimit?: number;
  useSvgSpriteLoader?: boolean;

  useReact?: boolean;
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
  useSvgSpriteLoader: false,

  useReact: false
}

export default class SettingsComponent {
  private _settingsSbj: BehaviorSubject<any> = new BehaviorSubject({});
  settings$: Observable<any> = this._settingsSbj.asObservable();

  constructor(private _settings: ISettings = {}) {
    this._settings = {
      ...DEFAULT_SETTING,
      ..._settings
    };

    // Style preprocessors section.
    const styleLoader = $('#style-loader');
    const useStyleLoader$ = getCheckboxObservable('#use-style-loader', this._settings.useStyleLoader);
    const useExractPlugin$ = getCheckboxObservable('#use-exract-plugin', this._settings.useExtractPlugin);
    const useSassLoader$ = getCheckboxObservable('#use-sass-loader', this._settings.useSassLoader);
    const useLessLoader$ = getCheckboxObservable('#use-less-loader', this._settings.useLessLoader);
    const useStylusLoader$ = getCheckboxObservable('#use-stylus-loader', this._settings.useStylusLoader);
    const styleLoader$ = useStyleLoader$
    .pipe(tap(toggleDisabled(styleLoader)));


    // Template egines section.
    const templateEngine = $('#template-engine');
    const useTemplateEngine$ = getCheckboxObservable('#use-template-engine', this._settings.useTemplateEngine);
    const usePugEngine$ = getCheckboxObservable('#use-pug-engine', this._settings.usePugEngine);
    const templateEngine$ = useTemplateEngine$
    .pipe(tap(toggleDisabled(templateEngine)));


    // JavaScript compilers section.
    const useBabelLoader$ = getCheckboxObservable('#use-babel-loader', this._settings.useBabelLoader);
    const useTsLoader$ = getCheckboxObservable('#use-ts-loader', this._settings.useTsLoader);


    // Assets.
    const assetsLoader = $('#assets-loader');
    const useFileLoader$ = getCheckboxObservable('#use-file-loader', this._settings.useFileLoader);
    const useUrlLoader$ = getCheckboxObservable('#use-url-loader', this._settings.useUrlLoader);
    const useSvgSpriteLoader$ = getCheckboxObservable('#use-svg-sprite-loader', this._settings.useSvgSpriteLoader);
    const assetsLoader$ = useFileLoader$
    .pipe(tap(toggleDisabled(assetsLoader))); 

    // Jsx.
    const useReact$ = getCheckboxObservable('#use-react', this._settings.useReact);

    // Others
    const entry$ = useTsLoader$
    .pipe(combineLatest(useReact$))
    .pipe(map(([useTsLoader, useReact]) =>
      (useTsLoader ? 'index.ts' : 'index.js') + (useReact ? 'x' : '')));
    const extensions$ = useTsLoader$
    .pipe(combineLatest(useReact$))
    .pipe(map(([useTsLoader, useReact]) =>
      ['\'.js\'', ...(useReact ? ['\'.jsx\''] : []), 
                  ...(useTsLoader ? ['\'.ts\''] : []),
                  ...(useReact && useTsLoader ? ['\'.tsx\''] : [])
      ]));

    merge(
      styleLoader$,
      templateEngine$,
      assetsLoader$
    ).subscribe();


    combine(
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
      // Jsx,
      useReact$.pipe(map((useReact) => ({ useReact }))),
      // Others
      entry$.pipe(map((entry) => ({ entry }))),
      extensions$.pipe(map((extensions) => ({ extensions }))),
    )
    .pipe(map(([...settings]) => Object.assign(DEFAULT_SETTING, ...settings)))
    .pipe(tap((settings) => this._settingsSbj.next(settings)))
    .subscribe();
  }
}

function getCheckboxObservable(selector: string, value: boolean = false): Observable<boolean> {
  const checkbox = $(selector) as HTMLInputElement;
  checkbox.checked = value;

  return fromEvent(checkbox, 'click')
    .pipe(map(getInputChecked))
    .pipe(startWith(value));
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
