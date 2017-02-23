import { createStore } from 'redux';

// Centralized application state
// For more information visit http://redux.js.org/
const initialState = {
  mode: null,
  recognitionCategory: null,
  emergencyLevel: null,
  criterionObject: null,
  selectedCriterionState: null,
  overviewPageStyle: 0,
  highestClassification: "No Emergency",
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
              };
    case 'SET_OVERVIEW_PAGE_STYLE':
      return {...state, overviewPageStyle: action.overviewPageStyle};
    case 'SET_HIGHEST_CLASSIFICATION':

      var text = state.highestClassification;
      if(action.highestClassification === "General Emergency") {
        text = action.highestClassification;
      }
      else if (action.highestClassification === "Site Area Emergency") {
        if (text !== "General Emergency") {
          text = action.highestClassification;
        }
      }
      else if (action.highestClassification === "Alert") {
        if (text !== "General Emergency" && text !== "Site Area Emergency") {
          text = action.highestClassification;
        }
      }
      else if (action.highestClassification === "Unusual Event") {
        if (text === "No Emergency") {
          text = action.highestClassification;
        }
      }
      return {...state, highestClassification: text};
    case 'RESET_HIGHEST_CLASSIFICATION':
      return {...state, highestClassification: "No Emergency"};
    default:
      return state;
  }
});



export default store;
