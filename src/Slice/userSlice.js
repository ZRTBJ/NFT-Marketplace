import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  status: "idle",
  userinfo: {},
  loggedIn: false,
  showSidebar: false,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    userLoading(state, action) {
      state.status = "loading";
    },
    setUserDetails(state, action) {
      state.userinfo = action.payload;
      state.loggedIn = true;
      state.status = "idle";
    },
    setShowSideBar(state, action) {
      state.showSidebar = action;
    },
  },
});

export const { userLoading, setUserDetails, setShowSideBar } =
  userSlice.actions;

export default userSlice.reducer;

// Thunk function
export const setUserInfo = (user) => (dispatch) => {
  dispatch(setUserDetails(user));
};
export const setSideBar = (value) => (dispatch) => {
  dispatch(setShowSideBar(value));
};
