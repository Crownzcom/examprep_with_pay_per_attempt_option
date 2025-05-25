// store.js
import { createStore } from "redux";
import quizReducer from "./reducers";

const store = createStore(
  quizReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

// store.js
// import { createStore, combineReducers } from "redux";
// import quizReducer from "./reducers"; // PLE reducer
// import uceQuizReducer from "../features/quiz/quizSlice"; // UCE slice

// // Combine the reducers
// const rootReducer = combineReducers({
//   quiz: quizReducer, // Reducer for PLE
//   uceQuiz: uceQuizReducer, // Reducer for UCE
// });

// // Create the Redux store
// const store = createStore(
//   rootReducer,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Enable Redux DevTools
// );

// export default store;
