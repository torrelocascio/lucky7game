import { ActionType } from "../types/actionTypes";
import { AuthState, AuthAction, UserData } from "../types/actionTypes";
import { jwtDecode } from "jwt-decode";
import { fetchUserData } from "../services/auth";

const initialState: AuthState = {
  authData: null,
  user: null,
};

const decodeToken = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
    return decoded as UserData;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Initialize state synchronously first
const initializeState = (): AuthState => {
  const token = localStorage.getItem("token");
  console.log('Token from localStorage:', token);
  if (token) {
    const decoded = decodeToken(token);
    console.log('Decoded user data:', decoded);
    if (decoded) {
      // Start with basic user data from token
      return {
        authData: token,
        user: {
          _id: decoded._id,
          name: decoded.name,
          email: decoded.email,
          tokens: 0 // Will be updated when we fetch full user data
        }
      };
    }
  }
  return initialState;
};

const authReducer = (state = initializeState(), action: AuthAction): AuthState => {
  console.log('Auth reducer action:', action);
  switch (action.type) {
    case ActionType.LOGIN:
      console.log('Login action data:', action.data);
      localStorage.setItem("token", action.data.token);
      return {
        ...state,
        authData: action.data.token,
        user: action.data.user,
      };
    case ActionType.LOGOUT:
      localStorage.removeItem("token");
      return {
        authData: null,
        user: null,
      };
    case ActionType.UPDATE_USER:
      console.log('Update user action data:', action.data);
      return {
        ...state,
        user: action.data,
      };
    default:
      return state;
  }
};

export default authReducer; 