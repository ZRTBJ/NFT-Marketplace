import { userSlice } from './slice';
const { userLoading, setUserDetails, setShowSideBar, setIsNewUser } =
  userSlice.actions;

export const setUserInfo = (user) => (dispatch) => {
  dispatch(setUserDetails(user));
};
export const setSideBar = (value) => (dispatch) => {
  dispatch(setShowSideBar(value));
};
export const setUserLoading = (value) => (dispatch) => {
  dispatch(userLoading(value));
};

export const handleNewUser = (value) => (dispatch) => {
  dispatch(setIsNewUser(value));
};
