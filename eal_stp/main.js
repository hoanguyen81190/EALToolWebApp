/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
//require('offline-plugin/runtime').install();

import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import { Provider } from 'react-redux';

import store from './core/store';
import router from './core/router';
import history from './core/history';

import {eALDocument} from './database-loader';


//Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     // Install ServiceWorker
//   console.log(navigator.serviceWorker);
//   navigator.serviceWorker.register('./service-worker.js').then(() => {
//   }).catch((err) => {
//     // Installation failed
//     console.log('ServiceWorker registration failed, error:', err);
//   });
// } else {
//   // No ServiceWorker Support
//   console.log('ServiceWorker is not supported in this browser');
// }

let routes = require('./routes.json'); // Loaded with utils/routes-loader.js
const container = document.getElementById('container');

function renderComponent(component) {
  ReactDOM.render(<Provider store={store}>{component}</Provider>, container);
}

// Find and render a web page matching the current URL path,
// if such page is not found then render an error page (see routes.json, core/router.js)
function render(location) {
  router.resolve(routes, location)
    .then(renderComponent)
    .catch(error => router.resolve(routes, { ...location, error }).then(renderComponent));
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/ReactJSTraining/history/tree/master/docs#readme
history.listen(render);
render(history.getCurrentLocation());

// Eliminates the 300ms delay between a physical tap
// and the firing of a click event on mobile browsers
// https://github.com/ftlabs/fastclick
FastClick.attach(document.body);

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./routes.json', () => {
    routes = require('./routes.json'); // eslint-disable-line global-require
    render(history.getCurrentLocation());
  });
}

require('offline-plugin/runtime').install();
