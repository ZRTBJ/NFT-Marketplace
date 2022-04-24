import { createSlice, createSelector } from "@reduxjs/toolkit";
import { getUserProjectListById } from "../services/project/projectService";
const initialState = {
  status: "idle",
  entities: {},
  polls: [],
};

const projectSlice = createSlice({
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

export const { projectLoading, getUserProjectList, addPollList } =
  projectSlice.actions;

export default projectSlice.reducer;

// Thunk function
export const getUserProjects = (payload) => async (dispatch) => {
  dispatch(projectLoading());
  const response = await getUserProjectListById(payload);
  dispatch(getUserProjectList(response.data));
};
