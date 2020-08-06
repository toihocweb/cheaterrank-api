import { put, all, takeLatest, delay } from "redux-saga/effects";
import {
  FETCHING_TESTS,
  GETTING_TEST,
  GET_TESTS,
  GET_TEST,
  GET_RESULT,
  GETTING_RESULT,
  GET_LOADING,
  GETTING_LOADING,
  GET_ERROR,
  POSTING_LOGIN,
  GET_AUTH_ERROR,
  SET_CURRENT_USER,
  SET_LOGOUT,
  POST_REGISTER,
  SUBMITTING_CODE,
  SUBMIT_CODE,
} from "./types";
import { getTests } from "./getTests";
import { getResults } from "./getResults";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import { login, register } from "./auth";
import { submit } from "./submit";

function* getAllTests() {
  try {
    const data = yield getTests();
    yield put({ type: GET_TESTS, data });
  } catch (error) {}
}

function* getTest(action) {
  try {
    yield put({ type: GET_RESULT, result: null });
    yield put({ type: GET_ERROR, error: "" });
    yield put({ type: GET_TEST, data: action.data });
  } catch (error) {}
}

function* getResult(action) {
  yield put({ type: GET_ERROR, error: "" });
  try {
    let data = yield getResults(action.userCode);
    if (typeof data === "object") {
      yield put({ type: GET_RESULT, data });
      yield delay(1000);
      yield put({ type: GET_LOADING, isLoading: false });
    } else {
      if (data === undefined) {
        yield put({
          type: GET_ERROR,
          error: "Có lỗi xảy ra! Kiểm tra return hoặc rơi vào vòng lặp vô hạn",
        });
        yield put({ type: GET_RESULT, results: null });
      }
      yield put({ type: GET_ERROR, error: data });
      yield put({ type: GET_RESULT, results: null });
      yield put({ type: GET_LOADING, isLoading: false });
    }
  } catch (error) {
    yield delay(1000);
    yield put({ type: GET_LOADING, isLoading: false });
  }
}

function* getLoading(action) {
  try {
    yield put({ type: GET_LOADING, isLoading: action.isLoading });
  } catch (error) {}
}

function* postLogin(action) {
  try {
    const res = yield login(action.data);
    // Save to localStorage
    const { token } = res;
    // Set token to ls
    localStorage.setItem("jwtToken", token);
    // Set token to Auth header
    setAuthToken(token);
    // Decode token to get user data
    const decoded = jwt_decode(token);
    yield put({ type: SET_CURRENT_USER, data: decoded });
    yield put({ type: GET_AUTH_ERROR, error: null });
    const { history } = action.data;
    history.push("/");
  } catch (error) {
    yield put({ type: GET_AUTH_ERROR, error: error.response.data });
  }
}
function* postRegister(action) {
  try {
    yield register(action.data);
    yield put({ type: GET_AUTH_ERROR, error: null });
    const { history } = action.data;
    history.push("/login");
  } catch (error) {
    yield put({ type: GET_AUTH_ERROR, error: error.response.data });
  }
}

function* submitCode(action) {
  try {
    const res = yield submit(action.data);
    if (res.code === 201) {
      yield put({ type: SUBMIT_CODE, data: res.data });
    } else {
      yield put({ type: GET_ERROR, error: "some thing wrong" });
    }
  } catch (error) {}
}

function* setLogout(action) {
  try {
    // Remove token from localStorage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticated to false
    yield put({ type: SET_CURRENT_USER, data: null });
    action.data.push("/login");
  } catch (error) {}
}

function* rootSaga() {
  yield all([
    takeLatest(FETCHING_TESTS, getAllTests),
    takeLatest(GETTING_TEST, getTest),
    takeLatest(GETTING_RESULT, getResult),
    takeLatest(GETTING_LOADING, getLoading),
    takeLatest(POSTING_LOGIN, postLogin),
    takeLatest(POST_REGISTER, postRegister),
    takeLatest(SET_LOGOUT, setLogout),
    takeLatest(SUBMITTING_CODE, submitCode),
  ]);
}

export default rootSaga;
