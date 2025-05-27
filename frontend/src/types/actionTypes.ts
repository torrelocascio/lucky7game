// Action types
export enum ActionType {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    UPDATE_USER = "UPDATE_USER"
  }
  
  // Auth data type
  export interface AuthData {
    token: string;
  }
  
  // Actions interfaces
  export interface LoginAction {
    type: ActionType.LOGIN;
    data: {
      token: string;
      user: UserData;
    };
  }
  
  export interface LogoutAction {
    type: ActionType.LOGOUT;
  }
  
  export interface UpdateUserAction {
    type: ActionType.UPDATE_USER;
    data: UserData;
  }
  
  export type AuthAction = LoginAction | LogoutAction | UpdateUserAction;
  
  // State interfaces
  export interface AuthState {
    authData: string | null;
    user: UserData | null;
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
    tokens: number;
  }