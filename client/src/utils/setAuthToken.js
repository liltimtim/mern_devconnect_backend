import axios from "axios";

export const setupAxiosDefault = () => {
  // axios.defaults.baseURL = "http://localhost:5000/api";
};

export const setAuthToken = token => {
  if (token) {
    // apply to every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};
