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
      state.status = action.payload;
    },
    setUserDetails(state, action) {
      state.userinfo = action.payload;
      state.loggedIn = true;
      state.status = "idle";
    },
    setShowSideBar(state, action) {
      state.showSidebar = action.payload;
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
export const setUserLoading = (value) => (dispatch) => {
  dispatch(userLoading(value));
};
