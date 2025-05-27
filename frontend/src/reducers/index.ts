import { combineReducers, Reducer } from 'redux';
import authReducer, { AuthState } from './auth';

export interface RootState {
  auth: AuthState;
}

const rootReducer: Reducer<RootState> = combineReducers({
  auth: authReducer,
});

export default rootReducer;