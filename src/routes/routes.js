import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import NotFound from "../Pages/NotFound";
import Profile from "Pages/Profile";
import ProfileSettings from "Pages/ProfileSettings";
import ProfileProjectList from "Pages/ProfileProjectList";
import ProjectCreate from "Pages/ProjectCreate";
import DraftProjectUpdate from "Pages/DraftProjectUpdate";
import ProjectPoll from "Pages/ProjectEditPoll";
import ProjectEditOutline from "Pages/ProjectEditOutline";
import projectDetails from "Pages/ProjectDetails";

const routes = [
  {
    path: "/login",
    component: Login,
    isPrivate: false,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    isPrivate: true,
  },
  {
    path: "/profile",
    component: Profile,
    isPrivate: false,
  },
  {
    path: "/profile-settings",
    component: ProfileSettings,
    isPrivate: false,
  },
  {
    path: "/profile-project-list",
    component: ProfileProjectList,
    isPrivate: true,
  },
  {
    path: "/project-update/:id",
    component: DraftProjectUpdate,
    isPrivate: true,
  },
  {
    path: "/project-create/",
    component: ProjectCreate,
    isPrivate: true,
  },

  {
    path: "/project-edit/:id/poll",
    component: ProjectPoll,
    isPrivate: true,
  },
  {
    path: "/project-edit/:id/outline",
    component: ProjectEditOutline,
    isPrivate: true,
  },
  {
    path: "/project-details/:id",
    component: projectDetails,
    isPrivate: true,
  },
  {
    path: "/*",
    component: NotFound,
    isPrivate: true,
  },
];

export default routes;
