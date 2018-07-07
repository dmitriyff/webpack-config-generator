import { ISettings } from '../settings';

export default function babelrcRender({
}: ISettings): string {

  return `{
  "presets": [
    ["env"]
  ],
  "plugins": [
    ["transform-runtime", {
      "polyfill": false,
      "regenerator": true
    }]
  ]
}
`;
}
