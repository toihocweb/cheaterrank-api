import { GET_TESTS, GET_TEST, SUBMIT_CODE } from "../saga/types";

const initialState = {
  tests: [],
  currentTest: null,
};

const testReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TESTS:
      return {
        ...state,
        currentTest: { ...action.data[0] },
        tests: [...action.data],
      };
    case GET_TEST:
      const id = action.data;
      const current = state.tests.find((val) => val._id === id);
      return {
        ...state,
        currentTest: { ...current },
      };
    case SUBMIT_CODE:
      const idx = state.tests.findIndex((val) => val._id === action.data._id);

      return {
        ...state,
        tests: [
          ...state.tests.slice(0, idx),
          action.data,
          ...state.tests.slice(idx + 1),
        ],
        currentTest: {
          ...state.currentTest,
          submitted_users: [...action.data.submitted_users],
        },
      };
    default:
      return state;
  }
};

export default testReducer;
