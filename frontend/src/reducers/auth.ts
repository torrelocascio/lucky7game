import { ActionType, UserData, AuthData } from '../types/actionTypes';
import { AuthAction } from '../types/actionTypes';
import { Reducer } from 'redux';

export interface AuthState {
  authData: AuthData | null;
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  authData: null,
  user: null,
  loading: false,
  error: null
};

const authReducer: Reducer<AuthState, AuthAction> = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.LOGIN:
      localStorage.setItem('profile', JSON.stringify({ ...action.data }));
      return {
        ...state,
        authData: action.data,
        user: null, // Will be populated when token is decoded
        loading: false,
        error: null
      };
    case ActionType.LOGOUT:
      localStorage.clear();
      return {
        ...state,
        authData: null,
        user: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer; 