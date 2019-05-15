import { ISettings, DEFAULT_SETTING } from '../settings';

export default function srcIndexTsxRender({
  useStyleLoader,

  useSassLoader,
  useLessLoader,
  useStylusLoader
}: ISettings = DEFAULT_SETTING): string {
  let importStyle = '';

  if (useStyleLoader) {
    if (useSassLoader) 
      importStyle = 'import \'./style.scss\';';

    else if (useLessLoader)
      importStyle = 'import \'./style.less\';';

    else if (useStylusLoader)
      importStyle = 'import \'./style.styl\';';

    else 
      importStyle = 'import \'./style.css\';';
  }

  return `${ importStyle }

import * as React from 'react';
import * as ReactDOM from 'react-dom';

const REACT_APP = 'react-app';

ReactDOM.render(
    <div>App</div>,
    document.getElementById(REACT_APP)
);

`;
}
