import { combineReducers } from 'redux';
import { notificationSlice } from './notification';
import { projectSlice } from './project';
import { userSlice } from './user';
import { authSlice } from './auth';

const reducers = combineReducers({
  projects: projectSlice.reducer,
  user: userSlice.reducer,
  notifications: notificationSlice.reducer,
  auth: authSlice.reducer,
});

export default reducers;
