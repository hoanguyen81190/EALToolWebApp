/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { createStore } from 'redux';

// Centralized application state
// For more information visit http://redux.js.org/
const initialState = {
  mode: null,
  recognitionCategory: null,
  emergencyLevel: null,
  criterionObject: null
};

const store = createStore((state = initialState, action) => {
  // TODO: Add action handlers (aka "reducers")
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, mode: action.mode, recognitionCategory: action.recognitionCategory, emergencyLevel: action.emergencyLevel, criterionObject: action.criterionObject};
    default:
      return state;
  }


});



export default store;
