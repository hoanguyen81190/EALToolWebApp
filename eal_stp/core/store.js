import { createStore } from 'redux';

// Centralized application state
// For more information visit http://redux.js.org/
const initialState = {
  mode: null,
  recognitionCategory: null,
  emergencyLevel: null,
  criterionObject: null,
  selectedCriterionState: null,
  hours: 0,
  minutes: 0,
  seconds: 0
};

const store = createStore((state = initialState, action) => {
  // TODO: Add action handlers (aka "reducers")
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, mode: action.mode,
        recognitionCategory: action.recognitionCategory,
        emergencyLevel: action.emergencyLevel,
        criterionObject: action.criterionObject};
    case 'SET_CRITERION_STATE':
      return {...state, selectedCriterionState: action.criterionState};
    case 'SET_TIME':
      return {...state,
                hours: action.hours,
                minutes: action.minutes,
                seconds: action.seconds
              }

    default:
      return state;
  }
});



export default store;
