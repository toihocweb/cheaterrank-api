import { combineReducers } from "redux";
import testReducer from "./testReducer";
import resultReducer from "./resultReducer";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import authErrorReducer from "./authErrorReducer";

const rootReducer = combineReducers({
  testReducer,
  resultReducer,
  errorReducer,
  authReducer,
  authErrorReducer,
});

export default rootReducer;
