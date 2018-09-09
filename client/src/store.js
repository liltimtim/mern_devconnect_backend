import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
const middleware = [thunk];

const whichCompose = () => {
  if (window.navigator.userAgent.includes("Chrome")) {
    compose(
      applyMiddleware(...middleware),
      // Implements the Chrome redux tools extension
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  } else {
    compose(applyMiddleware(...middleware));
  }
};

const store = createStore(
  reducers,
  {},
  compose(applyMiddleware(...middleware))
);

export default store;
