import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  entities: {},
  polls: [],
};

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    projectLoading(state, action) {
      state.status = "loading";
    },
    getUserProjectList(state, action) {
      state.entities = action.payload;
      state.status = "complete";
    },
    addPollList(state, action) {
      state.polls.push(action.payload);
      state.status = "complete";
    },
  },
});
