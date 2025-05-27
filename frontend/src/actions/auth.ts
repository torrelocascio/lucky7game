import { ActionType } from "../types/actionTypes";
import { fetchUserData } from "../services/auth";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../reducers";

export const fetchUserDataAction = (): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = await fetchUserData(token);
      if (userData) {
        dispatch({ type: ActionType.UPDATE_USER, data: userData });
      }
    }
  };
}; 