import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "../Slice/projectSlice";
import userSlice from "../Slice/userSlice";

const store = configureStore({
  reducer: {
    projects: projectSlice,
    user: userSlice,
  },
});

export default store;
