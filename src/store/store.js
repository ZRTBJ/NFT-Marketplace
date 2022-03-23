import { configureStore } from "@reduxjs/toolkit";

import projectSlice from "../Slice/projectSlice";

const store = configureStore({
  reducer: {
    projects: projectSlice,
  },
});

export default store;
