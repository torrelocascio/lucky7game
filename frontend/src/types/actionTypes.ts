// Action types
export enum ActionType {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT"
  }
  
  // Auth data type
  export interface AuthData {
    token: string;
  }
  
  // Actions interfaces
  export interface LoginAction {
    type: ActionType.LOGIN;
    data: AuthData;
  }
  
  export interface LogoutAction {
    type: ActionType.LOGOUT;
  }
  
  export type AuthAction = LoginAction | LogoutAction;
  
  // State interfaces
  export interface AuthState {
    authData: AuthData | null;
    user: UserData | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface RootState {
    auth: AuthState;
  }
  
  // Form data interfaces
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface SignupFormData extends LoginFormData {
    firstName: string;
    lastName: string;
    confirmPassword: string;
  }
  
  export interface PasswordChangeFormData {
    email: string;
    oldPassword: string;
    newPassword: string;
  }
  
  // User interface
  export interface UserData {
    _id: string;
    name: string;
    email: string;
    password: string;
    exp?: number;
    picture?: string;
    tokens?: number;
  }