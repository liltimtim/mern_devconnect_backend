import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import jwtdecode from "jwt-decode";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import store from "./store";
import "./App.css";
import { setupAxiosDefault, setAuthToken } from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
// check for token
if (localStorage.token) {
  // set auth token
  setAuthToken(localStorage.token);
  // get user info and check current info
  const decoded = jwtdecode(localStorage.token);
  // call the store method dispatch
  store.dispatch(setCurrentUser(decoded));

  // check for expired token
  const currenTime = Date.now() / 1000;
  if (decoded.exp < currenTime) {
    // logout the user
    store.dispatch(logoutUser(null));

    // redirect
    window.location.href = "/login";
  }
}
setupAxiosDefault();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
