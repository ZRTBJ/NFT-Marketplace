import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  addNotificationData,
  getAllNotificationData,
} from "util/ApplicationStorage";
import { getUserProjectListById } from "../services/project/projectService";

const notifyData = getAllNotificationData();
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
  addNotificationData(payload);
  const data = getAllNotificationData();
  dispatch(setNotificationData(data));
};
