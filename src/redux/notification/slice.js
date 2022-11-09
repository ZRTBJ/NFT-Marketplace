import { createSlice } from "@reduxjs/toolkit";
import { ls_GetAllNotificationData } from "util/ApplicationStorage";

const notifyData = ls_GetAllNotificationData();
const initialState = {
  status: "idle",
  notificationData: notifyData ? notifyData : [],
};

export const notificationSlice = createSlice({
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
