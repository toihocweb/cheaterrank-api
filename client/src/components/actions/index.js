import {
  FETCHING_TESTS,
  GETTING_TEST,
  GETTING_RESULT,
  GETTING_LOADING,
  POSTING_LOGIN,
  SET_CURRENT_USER,
  SET_LOGOUT,
  POST_REGISTER,
  SUBMITTING_CODE,
} from "../../saga/types";

export const fetchingTests = () => {
  return {
    type: FETCHING_TESTS,
  };
};

export const gettingTest = (id) => {
  return {
    type: GETTING_TEST,
    data: id,
  };
};

export const gettingResult = (userCode) => {
  return {
    type: GETTING_RESULT,
    userCode,
  };
};

export const gettingLoading = (isLoading) => {
  return {
    type: GETTING_LOADING,
    isLoading,
  };
};

export const postingLogin = (data) => {
  return {
    type: POSTING_LOGIN,
    data,
  };
};

export const postingRegister = (data) => {
  return {
    type: POST_REGISTER,
    data,
  };
};

export const setCurrentUser = (user) => {
  return {
    type: SET_CURRENT_USER,
    data: user,
  };
};
export const logoutUser = (history) => {
  return {
    type: SET_LOGOUT,
    data: history,
  };
};

export const submittingCode = (data) => {
  return {
    type: SUBMITTING_CODE,
    data,
  };
};
