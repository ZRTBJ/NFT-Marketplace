import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import NotFound from "../Pages/NotFound";
import Profile from "Pages/Profile";
import ProfileSettings from "Pages/ProfileSettings";
import ProjectCreate from "Pages/ProjectCreate";

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
    path: "/project-create",
    component: ProjectCreate,
    isPrivate: true,
  },

  {
    path: "/*",
    component: NotFound,
    isPrivate: true,
  },
];

export default routes;
