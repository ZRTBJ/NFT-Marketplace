import { projectSlice } from './slice';
import { getUserProjectListById } from 'services/project/projectService';

const { projectLoading, getUserProjectList, addPollList } =
  projectSlice.actions;

export const getUserProjects = (payload) => async (dispatch) => {
  dispatch(projectLoading());
  const response = await getUserProjectListById(payload);
  dispatch(getUserProjectList(response.data));
};
