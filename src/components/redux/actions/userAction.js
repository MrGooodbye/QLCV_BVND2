import { userLogin } from "../../../services/userService";
import { toast } from "react-toastify";

export const USER_LOGOUT = "USER_LOGOUT";

export const FETCH_USER_LOGIN = "FETCH_USER_LOGIN";
export const FETCH_USER_SUCCESS = "FETCH_USER_LOGIN_SUCCESS";
export const FETCH_USER_ERROR = "FETCH_USER_LOGIN_ERROR";
export const USER_REFRESH = "USER_REFRESH";

export const handleLoginRedux = (dataUser) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_USER_LOGIN });
    let res = await userLogin(dataUser);
    if (res && res.data && +res.data.EC === 2 && res.data.DT) {
      let { userName } = res.data.DT;
      dispatch({
        type: FETCH_USER_SUCCESS,
        data: { userName: userName.trim(), res },
      });
      localStorage.setItem("userName", userName.trim());
      localStorage.setItem("auth", true);
      toast.success(res.data.EM);
      return res; // Trả về kết quả
    }
    if (res && res.data && +res.data.EC === 1) {
      dispatch({
        type: FETCH_USER_ERROR,
      });
      toast.error(res.data.EM);
    }
    if (res && res.data && +res.data.EC === -2) {
      dispatch({
        type: FETCH_USER_ERROR,
      });
      toast.error(res.data.EM);
    }
  };
};

export const handleLogoutRedux = () => {
  return (dispatch, getState) => {
    dispatch({
      type: USER_LOGOUT,
    });
  };
};
export const handleRefresh = () => {
  return (dispatch, getState) => {
    dispatch({
      type: USER_REFRESH,
    });
  };
};
