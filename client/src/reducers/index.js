// Root Reducer
import { combineReducers } from "redux";
import { auth } from "./authReducer";
import { errorReducer } from "./errorReducer";
export default combineReducers({
  auth,
  errors: errorReducer
});
