import { SET_CURRENT_USER, SUBMIT_CODE } from "../saga/types";
const initialState = {
  currentUser: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.data,
      };

    default:
      return state;
  }
};

export default authReducer;
