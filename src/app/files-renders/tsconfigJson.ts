import { ISettings, DEFAULT_SETTING } from '../settings';

export default function tsconfigJsonRender({
}: ISettings = DEFAULT_SETTING): string {

  return `{
  "compilerOptions": {
    "outDir": "./dist/",
    "module": "es6",
    "target": "ES2017",
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "Node"
  }
}
`;
}
