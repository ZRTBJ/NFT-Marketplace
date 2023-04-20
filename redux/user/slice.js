import { createSlice } from '@reduxjs/toolkit';
import { ls_GetChainID } from 'util/ApplicationStorage';
import { defaultNetworkId } from 'config/networks';
let chainId = ls_GetChainID();

const initialState = {
  status: 'idle',
  userinfo: {},
  loggedIn: false,
  showSidebar: false,
  isNewUser: false,
  notifications: [],
  notificationLoading: false,
  notificationError: false,
  chainId: chainId || defaultNetworkId,
  email: '',
};

export const userSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    userLoading(state, action) {
      state.status = action.payload;
    },
    setUserDetails(state, action) {
      state.userinfo = action.payload;
      state.loggedIn = true;
      state.status = 'idle';
    },
    setShowSideBar(state, action) {
      state.showSidebar = action.payload;
    },
    setIsNewUser(state, action) {
      state.isNewUser = action.payload;
    },
    getNotificationsLoading(state, action) {
      state.notificationLoading = true;
    },
    getNotificationsSuccess(state, action) {
      state.notifications = action.payload;
    },
    getNotificationsError(state, action) {
      state.notificationError = true;
    },
    setChainId(state, action) {
      state.chainId = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
  },
});
