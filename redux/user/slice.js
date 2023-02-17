import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  status: 'idle',
  userinfo: {},
  loggedIn: false,
  showSidebar: false,
  isNewUser: false,
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
  },
});
