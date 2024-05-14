// import { INCREMENT, DECREMENT } from "./counter.types";
import {
  FETCH_USER_LOGIN,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  USER_LOGOUT,
  USER_REFRESH,
} from "../actions/userAction";

const INITIAL_STATE = {
  user: {
    userName: "",
    auth: null,
  },
  isLoading: false,
  isError: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_LOGIN:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        user: {
          userName: action.data.userName,
          auth: true,
        },
        isLoading: false,
        isError: false,
      };
    case FETCH_USER_ERROR:
      return {
        ...state,
        user: {
          auth: false,
        },
        isLoading: false,
        isError: true,
      };
    case USER_LOGOUT:
      localStorage.removeItem("userName");
      localStorage.removeItem("auth");
      return {
        ...state,
        user: {
          email: "",
          auth: false,
        },

        isLoading: false,
        isError: true,
      };
    case USER_REFRESH:
      return {
        ...state,
        user: {
          userName: localStorage.getItem("userName"),
          auth: true,
        },

        isLoading: false,
        isError: true,
      };
    default:
      return state;
  }
};

export default userReducer;
