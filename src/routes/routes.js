import NotFound from "Pages/Home/NotFound";
import Profile from "Pages/User/Profile";
import ProfileSettings from "Pages/User/ProfileSettings";
import ProjectCreate from "Pages/Project/ProjectCreate";
import CollectionCreate from "Pages/Collection/CollectionCreate";
import projectDetails from "Pages/Project/ProjectDetails";
import DetailsNFT from "Pages/NFT/DetailsNFT";
import EmbedNFT from "Pages/NFT/Embed/EmbedNFT";
import EmbedNFTPreview from "Pages/NFT/Embed/EmbedNFTPreview";
import CreateDAOandNFT from "Pages/Project/CreateDAOandNFT";
import MembershipNFT from "Pages/NFT/MembershipNFT";
import CollectionDetail from "Pages/Collection/CollectionDetail";
import ProductNFT from "Pages/NFT/ProductNFT";
import Home from "Pages/Home/Homepage";
import List from "Pages/List";
const routes = [
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
    path: "/project-details/:id",
    component: projectDetails,
    isPrivate: false,
  },
  {
    path: "/collection-details/:collectionId",
    component: CollectionDetail,
    isPrivate: false,
  },
  {
    path: "/membershipNFT",
    component: MembershipNFT,
    isPrivate: true,
  },
  {
    path: "/product-nft",
    component: ProductNFT,
    isPrivate: true,
  },
  {
    path: "/nft-details/:type/:id",
    component: DetailsNFT,
    isPrivate: false,
  },
  {
    path: "/embed-nft/:type/:id",
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
    path: "/list/",
    component: List,
    isPrivate: false,
  },
  {
    path: "/:invite",
    component: Home,
    isPrivate: false,
  },
  {
    path: "/*",
    component: NotFound,
    isPrivate: false,
  },
];

export default routes;
