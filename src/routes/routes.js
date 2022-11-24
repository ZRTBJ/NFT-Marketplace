import { lazy } from "react";
const NotFound = lazy(() => import("Pages/NotFound"));
const Profile = lazy(() => import("Pages/User/Profile"));
const ProfileSettings = lazy(() => import("Pages/User/ProfileSettings"));
const ProjectCreate = lazy(() => import("Pages/Project/ProjectCreate"));
const CollectionCreate = lazy(() =>
  import("Pages/Collection/CollectionCreate")
);
const projectDetails = lazy(() => import("Pages/Project/ProjectDetails"));
const DetailsNFT = lazy(() => import("Pages/NFT/DetailsNFT"));
const DetailsMintedNFT = lazy(() => import("Pages/NFT/DetailsMintedNFT"));
const EmbedNFT = lazy(() => import("Pages/NFT/Embed/EmbedNFT"));
const EmbedNFTPreview = lazy(() => import("Pages/NFT/Embed/EmbedNFTPreview"));
const CreateDAOandNFT = lazy(() => import("Pages/Project/CreateDAOandNFT"));
const MembershipNFT = lazy(() => import("Pages/NFT/MembershipNFT"));
const CollectionDetail = lazy(() =>
  import("Pages/Collection/CollectionDetail")
);
const ProductNFT = lazy(() => import("Pages/NFT/ProductNFT"));
// const Home = lazy(() => import("Pages/Home/Homepage"));
const List = lazy(() => import("Pages/List"));

const routes = [
  // {
  //   path: "/",
  //   component: Home,
  //   isPrivate: false,
  // },
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
    path: "/minted-nft-details/:nftId/:tokenId",
    component: DetailsMintedNFT,
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
    path: "/*",
    component: NotFound,
    isPrivate: false,
  },
];

export default routes;
