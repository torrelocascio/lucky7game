import { combineReducers, Reducer } from 'redux';
import authReducer from './auth';
import { RootState, AuthAction } from '../types/actionTypes';

export type { RootState };

const rootReducer = combineReducers({
  auth: authReducer
}) as unknown as Reducer<RootState, AuthAction>;

export default rootReducer;