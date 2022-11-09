import { configureStore } from "@reduxjs/toolkit";
import { notificationSlice } from "./notification";
import { projectSlice } from "./project";
import { userSlice } from "./user";
import { authSlice } from "./auth";

const store = configureStore({
  reducer: {
    projects: projectSlice.reducer,
    user: userSlice.reducer,
    notifications: notificationSlice.reducer,
    auth: authSlice.reducer,
  },
});

export default store;
