import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "redux/slice/notificationSlice";
import projectSlice from "./slice/projectSlice";
import userSlice from "./slice/userSlice";

const store = configureStore({
  reducer: {
    projects: projectSlice,
    user: userSlice,
    notifications: notificationSlice,
  },
});

export default store;
