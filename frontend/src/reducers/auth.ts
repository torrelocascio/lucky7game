import { UserData } from '../types/actionTypes';
import { AnyAction } from 'redux';

export interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

const authReducer = (state: AuthState = initialState, action: AnyAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer; 