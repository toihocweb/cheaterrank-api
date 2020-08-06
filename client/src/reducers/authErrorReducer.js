import { GET_AUTH_ERROR } from "../saga/types";

const initialState = {
  error: null,
};

const authErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AUTH_ERROR:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};

export default authErrorReducer;
