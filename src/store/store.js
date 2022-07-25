import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "Slice/notificationSlice";
import projectSlice from "../Slice/projectSlice";
import userSlice from "../Slice/userSlice";

const store = configureStore({
  reducer: {
    projects: projectSlice,
    user: userSlice,
    notifications: notificationSlice,
  },
});

export default store;
