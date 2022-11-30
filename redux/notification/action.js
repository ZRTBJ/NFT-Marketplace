import { notificationSlice } from "./slice";
import {
  ls_AddNotificationData,
  ls_GetAllNotificationData,
} from "util/ApplicationStorage";

const { notificationLoading, setNotificationData } = notificationSlice.actions;

export const getNotificationData = (payload) => async (dispatch) => {
  dispatch(notificationLoading());
  ls_AddNotificationData(payload);
  const data = ls_GetAllNotificationData();
  dispatch(setNotificationData(data));
};
