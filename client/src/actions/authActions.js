import axios from "axios";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import { setAuthToken } from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

export const registerUser = (data, history) => async dispatch => {
  try {
    let response = await axios.post("/users/register", data);
    history.push("/login");
  } catch (error) {
    dispatch(dispatchErrors(error.response.data));
  }
};

export const loginUser = (data, history) => async dispatch => {
  try {
    let response = await axios.post("/users/login", data);
    const { token } = response.data;
    dispatch(setCurrentUser(response.data));
    // set token to local storage
    localStorage.setItem("token", token);
    // set token to auth header
    setAuthToken(token);
    // decode the token to get user data, set current user with decoded data.
    setCurrentUser(jwt_decode(token));
  } catch (error) {
    dispatch(dispatchErrors(error.response.data));
  }
};

const dispatchErrors = errors => {
  return {
    type: GET_ERRORS,
    payload: errors
  };
};

export const logoutUser = history => dispatch => {
  localStorage.removeItem("token");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  if (history) {
    history.push("/");
  }
};

export const setCurrentUser = data => {
  return {
    type: SET_CURRENT_USER,
    payload: data
  };
};
