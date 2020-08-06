import { GET_RESULT, GET_LOADING } from "../saga/types";

const initialState = {
  results: null,
  isLoading: false,
};

const resultReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RESULT:
      return {
        ...state,
        results: action.data,
      };
    case GET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
};

export default resultReducer;
