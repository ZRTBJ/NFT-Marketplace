import { userSlice } from './slice';
import { getUserNotifications } from 'services/notification/notificationService';

const {
  userLoading,
  setUserDetails,
  setShowSideBar,
  setIsNewUser,
  getNotificationsLoading,
  getNotificationsSuccess,
  getNotificationsError,
  setChainId,
} = userSlice.actions;

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

export const getUserNotification = (isActive) => async (dispatch) => {
  try {
    dispatch(getNotificationsLoading());
    const response = await getUserNotifications(isActive);
    dispatch(getNotificationsSuccess(response));
  } catch (err) {
    dispatch(getNotificationsError());
  }
};
export const setChain = (id) => async (dispatch) => {
  dispatch(setChainId(id));
};
