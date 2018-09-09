import { TEST_DISPATCH } from "./types";
export const registerUser = data => {
  return {
    type: TEST_DISPATCH,
    payload: data
  };
};
