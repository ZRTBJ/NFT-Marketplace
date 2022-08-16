import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import NotFound from "../Pages/NotFound";
import Profile from "Pages/Profile";
import ProfileSettings from "Pages/ProfileSettings";
import ProfileProjectList from "Pages/ProfileProjectList";
import ProjectCreate from "Pages/ProjectCreate";
import CollectionCreate from "Pages/CollectionCreate";
import DraftProjectUpdate from "Pages/DraftProjectUpdate";
import ProjectPoll from "Pages/ProjectEditPoll";
import ProjectEditOutline from "Pages/ProjectEditOutline";
import ProjectEditTop from "Pages/ProjectEditTop";
import projectDetails from "Pages/ProjectDetails";
import AllProject from "Pages/AllProject";
import MintNFT from "Pages/MintNNFT";
import DetailsNFT from "Pages/DetailsNFT";
import EmbedNFT from "Pages/EmbedNFT";
import EmbedNFTPreview from "Pages/EmbedNFTPreview";
import CreateDAOandNFT from "Pages/CreateDAOandNFT";
import RoyalityManagement from "Pages/RoyalityManagement";
import MembershipNFT from "Pages/MembershipNFT";

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
    path: "/profile/:id",
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
    path: "/collection-create/",
    component: CollectionCreate,
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
    path: "/project-edit/:id/project-top",
    component: ProjectEditTop,
    isPrivate: true,
  },
  {
    path: "/project-details/:id",
    component: projectDetails,
    isPrivate: false,
  },
  {
    path: "/all-project",
    component: AllProject,
    isPrivate: false,
  },
  {
    path: "/:id/mint-nft",
    component: MintNFT,
    isPrivate: true,
  },
  {
    path: "/membershipNFT",
    component: MembershipNFT,
    isPrivate: true,
  },
  {
    path: "/:id/nft-details",
    component: DetailsNFT,
    isPrivate: false,
  },
  {
    path: "/embed/:id",
    component: EmbedNFT,
    isPrivate: false,
  },
  {
    path: "/embed-nft/preview/:id",
    component: EmbedNFTPreview,
    isPrivate: false,
  },
  {
    path: "/create",
    component: CreateDAOandNFT,
    isPrivate: true,
  },
  {
    path: "/royality-management",
    component: RoyalityManagement,
    isPrivate: true,
  },
  {
    path: "/*",
    component: NotFound,
    isPrivate: false,
  },
];

export default routes;
