import 'regenerator-runtime/runtime.js';
// Import the roboto font required for the proper styling of material-ui.
// Doing it here avoids downloading it from the CDN.
import 'fontsource-roboto';

import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '~/components/app';

if (ENV_IS_PRODUCTION) {
  console.log('Production mode!');
}

ReactDOM.render(<App />, document.getElementById('root'));
