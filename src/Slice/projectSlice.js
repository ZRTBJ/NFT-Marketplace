import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  addProjectDeployData,
  getAllProjectDeployData,
} from "util/ApplicationStorage";
import { getUserProjectListById } from "../services/project/projectService";

const deployData = getAllProjectDeployData();
const initialState = {
  status: "idle",
  entities: {},
  polls: [],
  projectDeploy: deployData ? deployData : [],
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
    setProjectDeployData(state, action) {
      state.projectDeploy = action.payload;
      state.status = "complete";
    },
  },
});

export const {
  projectLoading,
  getUserProjectList,
  addPollList,
  setProjectDeployData,
} = projectSlice.actions;

export default projectSlice.reducer;

// Thunk function
export const getUserProjects = (payload) => async (dispatch) => {
  dispatch(projectLoading());
  const response = await getUserProjectListById(payload);
  dispatch(getUserProjectList(response.data));
};

export const getProjectDeploy = (payload) => async (dispatch) => {
  dispatch(projectLoading());
  addProjectDeployData(payload);
  const data = getAllProjectDeployData();
  dispatch(setProjectDeployData(data));
};
