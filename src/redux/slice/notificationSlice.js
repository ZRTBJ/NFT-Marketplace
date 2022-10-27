import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  ls_AddNotificationData,
  ls_GetAllNotificationData,
} from "util/ApplicationStorage";

const notifyData = ls_GetAllNotificationData();
const initialState = {
  status: "idle",
  notificationData: notifyData ? notifyData : [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notificationLoading(state, action) {
      state.status = "loading";
    },
    setNotificationData(state, action) {
      state.notificationData = action.payload;
      state.status = "complete";
    },
  },
});

export const { notificationLoading, setNotificationData } =
  notificationSlice.actions;

export default notificationSlice.reducer;

// Thunk function

export const getNotificationData = (payload) => async (dispatch) => {
  dispatch(notificationLoading());
  ls_AddNotificationData(payload);
  const data = ls_GetAllNotificationData();
  dispatch(setNotificationData(data));
};
