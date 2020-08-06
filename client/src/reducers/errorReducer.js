import { GET_ERROR } from "../saga/types";

const initialState = {
  error: "",
};

const resultReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ERROR:
      return {
        ...state,
        error: action.error.toString(),
      };

    default:
      return state;
  }
};

export default resultReducer;
