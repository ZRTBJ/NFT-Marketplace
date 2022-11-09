import { useEffect, useState } from "react";
import {
  getProjectDetailsById,
  projectLike,
  projectBookmark,
  getNewWorth,
} from "services/project/projectService";
import { getNftListByProjectId } from "services/nft/nftService";
import manImg from "assets/images/projectDetails/man-img.svg";
import bigImg from "assets/images/gallery/big-img.svg";
import { useHistory } from "react-router-dom";

import thumbIcon from "assets/images/profile/card.svg";
import avatar from "assets/images/dummy-img.svg";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import PublishProjectModal from "Pages/Project/ProjectDetails/Deploy/PublishProjectModal";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import DeployingProjectModal from "Pages/Project/ProjectDetails/Deploy/DeployingProjectModal";
import { getCollections } from "services/collection/collectionService";
import SalesPageModal from "Pages/Collection/SaleSetting/SalesPageModal";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { walletAddressTruncate } from "util/WalletUtils";
import LeavingSite from "Pages/Project/ProjectDetails/Components/LeavingSite";
import CollectionTab from "Pages/Project/ProjectDetails/CollectionTab/CollectionTab";
import SalesSettingsTab from "Pages/Project/ProjectDetails/SalesSettingTab/SalesSettingTab";
import SalesSuccessModal from "Pages/Collection/SaleSetting/SalesSuccessModal";
import RoyaltySplitter from "./RoyaltySplitter/RoyaltySplitter";
import { NETWORKS } from "config/networks";
import NetworkHandlerModal from "components/Modals/NetworkHandlerModal";
import { getCurrentNetworkId } from "util/MetaMask";
import tickSvg from "assets/images/icons/tick.svg";

export default function ProjectDetails(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  SwiperCore.use([Autoplay]);

  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState({});
  const projectId = props.match.params.id;
  const [coverImages, setCoverImages] = useState({});
  const userInfo = useSelector((state) => state.user.userinfo);
  // nft list
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [nftList, setNftList] = useState([]);
  const [links, setLinks] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [tnxData, setTnxData] = useState({});
  const [publishStep, setPublishStep] = useState(1);
  const [selectedTab, setSelectedTab] = useState(3);
  const [membershipCollectionList, setMembershipCollectionList] = useState([]);
  const [productCollectionList, setProductCollectionList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showSalesPageModal, setShowSalesPageModal] = useState(false);
  const [showSalesSuccessModal, setShowSalesSuccessModal] = useState(false);
  const [collectionId, setCollectionId] = useState("");
  const [collectionType, setCollectionType] = useState("");
  const [showTransferFundModal, setShowTransferFundModal] = useState(false);
  const [fnId, setFnId] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [collection, setCollection] = useState();
  const [newWorth, setNetWorth] = useState({
    balance: 0,
    currency: "",
    balanceUSD: 0,
  });
  const [showNetworkHandler, setShowNetworkHandler] = useState(false);
  const fileUploadNotification = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const [setupData, setSetupData] = useState("");

  async function fetchData() {
    if (hasMore) {
      setHasMore(false);
      // setIsLoading(true);
      await fetchNftList();
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (projectId && !isLoading) {
      projectDetails(projectId);
      getProjectNetWorth();
    }
  }, [projectId]);

  const getProjectNetWorth = () => {
    setBalanceLoading(true);
    getNewWorth(projectId).then((resp) => {
      if (resp.code === 0) {
        setBalanceLoading(false);
        setNetWorth({
          balance: resp.balance,
          currency: resp.currency,
          balanceUSD: resp.balance_usd,
        });
      } else {
        setBalanceLoading(false);
        setNetWorth({ balance: 0, currency: "", balanceUSD: 0 });
      }
    });
  };

  useEffect(() => {
    getCollectionList();
  }, []);

  async function projectDetails(pid) {
    setIsLoading(true);
    await getProjectDetailsById({ id: pid })
      .then((res) => {
        if (res.code === 0) {
          setProject(res.project);
          if (res?.project?.assets && res?.project?.assets.length > 0) {
            setCoverImages(
              res.project.assets.find((img) => img["asset_purpose"] === "cover")
            );
            if (res.project.urls && res.project.urls.length > 0) {
              const webLinks = [];
              try {
                const urls = JSON.parse(res.project.urls);
                for (let url of urls) {
                  webLinks.push({
                    title: Object.values(url)[0],
                    value: Object.values(url)[2],
                  });
                }
              } catch {}
              setLinks(webLinks);
            }
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function LikeProject(value) {
    setIsLoading(true);
    const request = new FormData();
    request.append("like", value);
    projectLike(projectId, request)
      .then((res) => {
        if (res.code === 0) {
        }
        setIsLoading(false);
        projectDetails(projectId);
        fetchNftList();
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function BookmarkProject(value) {
    setIsLoading(true);
    const request = new FormData();
    request.append("bookmark", value);
    projectBookmark(projectId, request)
      .then((res) => {
        if (res.code === 0) {
        }
        setIsLoading(false);
        projectDetails(projectId);
        fetchNftList();
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function changeImagePreview(image) {
    setCoverImages(image);
  }

  async function fetchNftList() {
    let payload = {
      projectId: projectId,
      page: page,
      perPage: limit,
    };
    // setIsLoading(true);
    await getNftListByProjectId(payload)
      .then((e) => {
        if (e.code === 0 && e.nfts !== null) {
          if (e.nfts.length === limit) {
            let pageSize = page + 1;
            setPage(pageSize);
            setHasMore(true);
          }
          e.nfts.forEach((element) => {
            element.isNft = true;
          });
          const nfts = nftList.concat(e.nfts);
          setNftList(nfts);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  async function intiProjectPublish() {
    setShowPublishModal(false);
    if (project.project_status === "publishing") {
      setPublishStep(1);
      setShowDeployModal(true);
    } else {
      setShowDeployModal(true);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById("copied-message");
    copyEl.classList.toggle("hidden");
    setTimeout(() => {
      copyEl.classList.toggle("hidden");
    }, 2000);
  }

  async function getCollectionList() {
    setIsLoading(true);
    await getCollections("project", projectId, page, limit)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          setCollection(e);
          const membershipcoll = e.data.filter(
            (col) => col.type === "membership"
          );

          if (membershipcoll) {
            setMembershipCollectionList(membershipcoll);
          }
          const productcoll = e.data.filter((col) => col.type === "product");
          if (productcoll) {
            setProductCollectionList(productcoll);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  const truncateArray = (members) => {
    let slicedItems = members.slice(0, 3);
    return { slicedItems, restSize: members.length - slicedItems.length };
  };

  useEffect(() => {
    // file upload web socket
    const projectDeployStatus = fileUploadNotification.find(
      (x) => x.function_uuid === fnId
    );
    if (projectDeployStatus && projectDeployStatus.data) {
      setIsLoading(false);
    } else {
    }
  }, [fileUploadNotification]);

  const handlePublishModal = async () => {
    let networkId = await getCurrentNetworkId();
    if (Number(project?.blockchain) === networkId) {
      setShowPublishModal(true);
    } else {
      setShowNetworkHandler(true);
    }
  };

  return (
    <>
      {isLoading && <div className="loading"></div>}
      {showNetworkHandler && (
        <NetworkHandlerModal
          show={showNetworkHandler}
          handleClose={() => setShowNetworkHandler(false)}
          projectNetwork={project?.blockchain}
        />
      )}
      {!isLoading && (
        <div className="mx-4">
          {/* dekstop gallery */}
          <section className=" hidden md:grid md:grid-cols-5 gap-4 mt-6">
            <div className="row-span-2 col-span-2">
              <img
                className="rounded-xl object-cover h-[260px] w-full"
                src={coverImages?.path ? coverImages.path : bigImg}
                alt=""
              />
            </div>
            {project?.assets?.length > 0 &&
              project.assets.map((img, index) => (
                <div key={`dao-image-${index}`}>
                  {img["asset_purpose"] !== "cover" && (
                    <div>
                      <img
                        className="rounded-xl object-cover h-[122px] w-full"
                        src={img ? img.path : manImg}
                        alt=""
                      />
                    </div>
                  )}
                </div>
              ))}
          </section>

          {/* mobile gallery */}
          <Swiper
            navigation={false}
            modules={[Navigation]}
            className="md:hidden mt-4 mb-6"
          >
            <SwiperSlide className="!w-[212px] mx-2">
              <img
                className="rounded-xl object-cover h-[124px] w-full"
                src={coverImages?.path ? coverImages.path : bigImg}
                alt=""
              />
            </SwiperSlide>
            {project?.assets?.length > 0 &&
              project.assets.map((img, index) => (
                <div key={`dao-image-${index}`}>
                  {img["asset_purpose"] !== "cover" && (
                    <div>
                      <SwiperSlide className="!w-[212px] mx-4">
                        <img
                          className="rounded-xl object-cover h-[124px] w-full"
                          src={img ? img.path : manImg}
                          alt=""
                        />
                      </SwiperSlide>
                    </div>
                  )}
                </div>
              ))}
          </Swiper>

          {/* end gallery */}
          {/* profile information section */}
          <div className="bg-[#122478]/[0.03]  rounded-xl mt-4 pt-4 px-4 md:py-8 md:px-6">
            <div className="flex flex-col md:flex-row ">
              <div className="md:w-2/3 ">
                <div className="flex">
                  <img
                    src={coverImages?.path ? coverImages.path : bigImg}
                    className="rounded-full self-start w-14 h-14 md:w-[98px] object-cover md:h-[98px] bg-color-ass-6"
                    alt="User profile"
                  />
                  <div className="flex-1 min-w-0  px-4">
                    <div className="flex items-center mb-1 md:mb-2">
                      <h2 className="truncate">{project.name}</h2>
                      {project?.project_status === "published" && (
                        <img className="ml-1 mt-1" src={tickSvg} alt="" />
                      )}
                    </div>

                    <p className="text-textLight text-sm ">
                      {project?.contract_address
                        ? walletAddressTruncate(project.contract_address)
                        : "Smart Contract not released"}
                      <i
                        className={`fa-solid fa-copy ml-2 ${
                          project?.contract_address
                            ? "cursor-pointer"
                            : "cursor-not-allowed"
                        }`}
                        disabled={!project?.contract_address}
                        onClick={() =>
                          copyToClipboard(project?.contract_address)
                        }
                      ></i>
                      <span id="copied-message" className="hidden ml-2">
                        Copied !
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="flex flex-wrap mt-5 items-start md:justify-end md:w-1/3 md:mt-0"
                role="group"
              >
                <div className="flex items-center">
                  {project &&
                    project.members &&
                    project.members.length > 0 &&
                    project.members.map((img, index) => (
                      <div key={`member-img-${index}`}>
                        {index < 5 && (
                          <img
                            className="rounded-full object-cover w-9 h-9 mr-2 border-2 border-white"
                            src={img.avatar ? img.avatar : avatar}
                            alt=""
                          />
                        )}
                      </div>
                    ))}
                  {project && project.members && project.members.length > 5 && (
                    <span className="ml-2 bg-primary-900 bg-opacity-5  text-primary-900 rounded p-1 text-xs  ">
                      +{project.members.length - 5}
                    </span>
                  )}
                </div>
                {links.find((link) => link.title === "linkFacebook") &&
                  links.find((link) => link.title === "linkFacebook").value
                    ?.length > 0 && (
                    <div className="social-icon-button cursor-pointer w-9 h-9 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 md:ml-4">
                      <a
                        href={`${
                          links.find((link) => link.title === "linkFacebook")
                            .value
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fa-brands fa-facebook gradient-text"></i>
                      </a>
                    </div>
                  )}

                {links.find((link) => link.title === "linkInsta") &&
                  links.find((link) => link.title === "linkInsta").value
                    ?.length > 0 && (
                    <div className="social-icon-button cursor-pointer w-9 h-9 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4">
                      <a
                        href={`${
                          links.find((link) => link.title === "linkInsta").value
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fa-brands fa-instagram gradient-text"></i>
                      </a>
                    </div>
                  )}
                {links.find((link) => link.title === "linkTwitter") &&
                  links.find((link) => link.title === "linkTwitter").value
                    ?.length > 0 && (
                    <div className="social-icon-button cursor-pointer w-9 h-9 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4">
                      <a
                        href={`${
                          links.find((link) => link.title === "linkTwitter")
                            .value
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fa-brands fa-twitter gradient-text"></i>
                      </a>
                    </div>
                  )}
                {links.find((link) => link.title === "linkGithub") &&
                  links.find((link) => link.title === "linkGithub").value
                    ?.length > 0 && (
                    <div className="social-icon-button cursor-pointer w-9 h-9 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4">
                      <a
                        href={`${
                          links.find((link) => link.title === "linkGithub")
                            .value
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fa-brands fa-github gradient-text"></i>
                      </a>
                    </div>
                  )}
                {links.find((link) => link.title === "customLinks1") &&
                  links.find((link) => link.title === "customLinks1").value
                    ?.length > 0 && (
                    <div className="social-icon-button cursor-pointer w-9 h-9 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4">
                      <a
                        href={`${
                          links.find((link) => link.title === "customLinks1")
                            .value
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fa-solid fa-globe gradient-text"></i>
                      </a>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row  md:pt-5">
              <div className="md:flex-1">
                <h3>About</h3>
                {project.overview ? (
                  <div className="whitespace-pre-line text-textLight text-sm break-all">
                    {project.overview}
                  </div>
                ) : (
                  <p className="text-textLight text-sm">
                    Please add description to show here
                  </p>
                )}
                <div className="flex mt-4 mb-4 md:mb-0 md:mt-[50px]">
                  {project?.is_owner && (
                    <>
                      {project?.project_status === "published" ? (
                        <>
                          <button
                            onClick={() => setShowTransferFundModal(true)}
                            className="contained-button w-[120px] text-center !px-0 mr-4 cursor-pointer font-satoshi-bold cursor-pointer"
                          >
                            Transfer Funds
                          </button>
                          <Link to={`/project-create?id=${project?.id}`}>
                            <button className="outlined-button w-[120px] text-center !px-0 mr-4 cursor-pointer font-satoshi-bold cursor-pointer">
                              <span className="gradient-text">Edit</span>
                            </button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handlePublishModal}
                            className="contained-button w-[120px] text-center !px-0 mr-4 cursor-pointer font-satoshi-bold cursor-pointer"
                          >
                            Publish
                          </button>
                          <Link to={`/project-create?id=${project?.id}`}>
                            <button className="outlined-button w-[120px] text-center !px-0 mr-4 cursor-pointer font-satoshi-bold cursor-pointer">
                              <span className="gradient-text">Edit</span>
                            </button>
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="md:flex md:items-center pb-4 md:pb-0 md:justify-center md:self-end md:flex-wrap mt-3 md:justify-end  md:mt-0">
                {project?.project_status === "published" ? (
                  <div className="bg-[#122478]/[0.05]  md:mt-4 md:ml-3  rounded-md py-4 px-4 relative w-full md:min-w-[260px]">
                    <div className="flex">
                      <p className=" text-textSubtle mt-1">
                        Net Worth{" "}
                        <i
                          onClick={getProjectNetWorth}
                          className={`fa-regular fa-arrows-rotate text-textSubtle text-sm ${
                            balanceLoading ? "fa-spin" : ""
                          } cursor-pointer`}
                        ></i>
                      </p>
                      <div className="ml-auto">
                        <p className="pb-0 text-black font-black text-[16px] md:text-[20px] ">
                          {newWorth?.balance}{" "}
                          {newWorth?.currency?.toUpperCase()}
                        </p>
                        <p className="text-sm  mt-0 text-textSubtle">
                          (${newWorth.balanceUSD.toFixed(2)})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-1">
                      <p className=" text-textSubtle mt-1">Collections</p>
                      <div className="ml-auto">
                        <p className="text-black mr-3 text-black font-black text-[16px] md:text-[20px]">
                          {collection?.total}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className=" text-textSubtle mt-1">BlockChain</p>
                      <div className="ml-auto">
                        <img
                          src={NETWORKS[Number(project?.blockchain)].icon}
                          className="ml-2 h-[24px] w-[24px] object-cover rounded-full"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="text-right mt-2">
                      <p className="text-sm	 mt-1">
                        Powered by{" "}
                        <Link
                          className="ml-1 font-bold"
                          to="https://www.coingecko.com/"
                        >
                          CoinGecko
                        </Link>
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {/* Tab Section */}
          <section className="mb-10 mt-4">
            <div className="mb-4">
              <ul
                className="flex flex-wrap  border-b  border-b-[2px] text-sm font-medium text-center "
                id="myTab"
                data-tabs-toggle="#myTabContent"
                role="tablist"
              >
                {membershipCollectionList.length > 0 ? (
                  <li
                    className="mr-2"
                    role="presentation"
                    onClick={() => setSelectedTab(1)}
                  >
                    <button
                      className={`inline-block py-2 md:p-4 md:text-lg rounded-t-lg ${
                        selectedTab === 1
                          ? "border-b-2 border-primary-900 text-primary-900"
                          : "border-transparent text-textSubtle"
                      } hover:text-primary-600`}
                      id="membership_nft"
                      data-tabs-target="#membership_nft"
                      type="button"
                      role="tab"
                      aria-controls="MembershipNFT"
                      aria-selected="true"
                    >
                      Membership NFT
                    </button>
                  </li>
                ) : null}
                {productCollectionList.length > 0 ? (
                  <li
                    className="mr-2"
                    role="presentation"
                    onClick={() => setSelectedTab(2)}
                  >
                    <button
                      className={`inline-block  py-2 md:p-4 md:text-lg rounded-t-lg ${
                        selectedTab === 2
                          ? "border-b-2 border-primary-900 text-primary-900"
                          : "border-transparent text-textSubtle"
                      } hover:text-primary-900`}
                      id="dashboard-tab"
                      data-tabs-target="#dashboard"
                      type="button"
                      role="tab"
                      aria-controls="dashboard"
                      aria-selected="false"
                    >
                      Product NFT
                    </button>
                  </li>
                ) : null}
                <li
                  className="mr-2"
                  role="presentation"
                  onClick={() => setSelectedTab(3)}
                >
                  <button
                    className={`inline-block  py-2 md:p-4 md:text-lg rounded-t-lg ${
                      selectedTab === 3
                        ? "border-b-2 border-primary-900 text-primary-900"
                        : "border-transparent text-textSubtle"
                    } hover:text-primary-900`}
                    id="dashboard-tab"
                    data-tabs-target="#dashboard"
                    type="button"
                    role="tab"
                    aria-controls="dashboard"
                    aria-selected="false"
                  >
                    Collections
                  </button>
                </li>
                {project?.is_owner && (
                  <li
                    className="mr-2"
                    role="presentation"
                    onClick={() => setSelectedTab(4)}
                  >
                    <button
                      className={`inline-block  py-2 md:p-4 md:text-lg rounded-t-lg ${
                        selectedTab === 4
                          ? "border-b-2 border-primary-900 text-primary-900"
                          : "border-transparent text-textSubtle"
                      } hover:text-primary-900`}
                      id="dashboard-tab"
                      data-tabs-target="#dashboard"
                      type="button"
                      role="tab"
                      aria-controls="dashboard"
                      aria-selected="false"
                    >
                      Royalty Splitter
                    </button>
                  </li>
                )}
                {project?.is_owner && (
                  <li
                    className="mr-2"
                    role="presentation"
                    onClick={() => setSelectedTab(5)}
                  >
                    <button
                      className={`inline-block  py-2 md:p-4 md:text-lg rounded-t-lg ${
                        selectedTab === 5
                          ? "border-b-2 border-primary-900 text-primary-900"
                          : "border-transparent text-textSubtle"
                      } hover:text-primary-900`}
                      id="dashboard-tab"
                      data-tabs-target="#dashboard"
                      type="button"
                      role="tab"
                      aria-controls="dashboard"
                      aria-selected="false"
                    >
                      Sales Settings
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <div id="myTabContent">
              {/* TAB 1 */}
              {selectedTab === 1 && (
                <section
                  className="flex flex-wrap  mb-6"
                  id="membership_nft"
                  role="tabpanel"
                  aria-labelledby="membership-nft-tab"
                >
                  <>
                    {project?.is_owner && (
                      <div className="h-[156px] w-[140px] md:h-[276px]  md:w-[276px] mb-4 mx-2">
                        <Link
                          to={`/collection-create/?dao_id=${projectId}&type=membership`}
                        >
                          <div className="h-full rounded-xl gradient-border bg-opacity-20 flex flex-col items-center justify-center">
                            <i className="fa-solid fa-circle-plus gradient-text text-2xl mb-2"></i>
                            <p className="gradient-text text-lg font-black font-satoshi-bold">
                              Create new
                            </p>
                          </div>
                        </Link>
                      </div>
                    )}

                    {/* Card */}

                    {membershipCollectionList &&
                      membershipCollectionList.length > 0 &&
                      membershipCollectionList.map((collection, index) => {
                        let image = collection?.assets?.find(
                          (asset) => asset.asset_purpose === "logo"
                        );
                        return (
                          <div
                            className="md:min-h-[390px] mx-2 md:mr-4 w-[140px]  md:w-[276px]  rounded-x"
                            key={`nft-collection-membership-${index}`}
                          >
                            <Link to={`/collection-details/${collection?.id}`}>
                              <img
                                className="rounded-xl h-[156px] w-[140px] md:h-[276px] md:w-[276px] object-cover "
                                src={image?.path ? image.path : thumbIcon}
                                alt=""
                              />
                            </Link>
                            <div className="py-5">
                              <div className="flex">
                                <h2 className="pb-2 text-txtblack break-all md:truncate flex-1 mr-3 m-w-0">
                                  {collection.name}
                                </h2>
                              </div>
                              <p className="mb-3 text-textSubtle text-[13px]">
                                {collection.description &&
                                collection.description.length > 70
                                  ? collection.description.substring(0, 67) +
                                    "..."
                                  : collection.description}
                              </p>
                              <div className="flex items-center">
                                {collection.members &&
                                  collection.members.length > 0 &&
                                  truncateArray(
                                    collection.members
                                  ).slicedItems.map((member) => (
                                    <img
                                      key={member.id}
                                      src={member.avatar}
                                      alt={member.id}
                                      className="rounded-full w-9 h-9 -ml-2 border-2 border-white"
                                    />
                                  ))}
                                {collection.members &&
                                  collection.members.length > 3 && (
                                    <div className="flex items-center mt-[6px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[26px] h-[26px]">
                                      <p className="text-[12px] text-[#9A5AFF]">
                                        +
                                        {
                                          truncateArray(collection.members)
                                            .restSize
                                        }
                                      </p>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </>
                </section>
              )}

              {/* TAB 2 */}
              {selectedTab === 2 && (
                <section
                  className="flex flex-wrap  mb-6"
                  id="product-nft"
                  role="tabpanel"
                  aria-labelledby="product-nft-tab"
                >
                  {/* Create New */}
                  {project?.is_owner && (
                    <div className="h-[156px] w-[140px] md:h-[276px]  md:w-[276px] mb-4 mx-2">
                      <Link
                        to={`/collection-create/?dao_id=${projectId}&type=product`}
                      >
                        <div className="h-full rounded-xl gradient-border bg-opacity-20 flex flex-col items-center justify-center">
                          <i className="fa-solid fa-circle-plus gradient-text text-2xl mb-2"></i>
                          <p className="gradient-text text-lg font-black font-satoshi-bold">
                            Create new
                          </p>
                        </div>
                      </Link>
                    </div>
                  )}
                  {/* Card */}
                  {productCollectionList &&
                    productCollectionList.length > 0 &&
                    productCollectionList.map((collection, index) => {
                      let image = collection?.assets?.find(
                        (asset) => asset.asset_purpose === "logo"
                      );
                      return (
                        <div
                          className="md:min-h-[390px] mx-2 md:mr-4 w-[140px]  md:w-[276px]  rounded-x"
                          key={`nft-collection-membership-${index}`}
                        >
                          <Link to={`/collection-details/${collection?.id}`}>
                            <img
                              className="rounded-xl h-[156px] w-[140px] md:h-[276px] md:w-[276px] object-cover "
                              src={image?.path ? image.path : thumbIcon}
                              alt=""
                            />
                          </Link>
                          <div className="py-5">
                            <div className="flex">
                              <h2 className="pb-2 text-txtblack break-all md:truncate flex-1 mr-3 m-w-0">
                                {collection.name}
                              </h2>
                              <div className="relative">
                                {/* Hide dropdown menu <button
                                type="button"
                                onClick={() => {
                                  const el = document.getElementById(
                                    `collection-option-${index}`
                                  );
                                  el.classList.toggle("hidden");
                                }}
                              >
                                {project?.is_owner && (
                                  <i className="fa-regular fa-ellipsis-vertical text-textSubtle"></i>
                                )}
                              </button> */}
                                {/* Dropdown menu  */}
                                {project?.is_owner && (
                                  <div
                                    id={`collection-option-${index}`}
                                    className="z-10 w-48 bg-white border border-divide rounded-md  absolute left-0 top-8 hidden"
                                  >
                                    <ul className="text-sm">
                                      <li className="border-b border-divide cursor-pointer">
                                        <a
                                          onClick={() => {
                                            setShowSalesPageModal(true);
                                            setCollectionId(collection?.id);
                                            setCollectionType("product");
                                          }}
                                          className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                          Sales Page
                                        </a>
                                      </li>
                                      <li className="border-b border-divide">
                                        <Link
                                          to={`/collection-create/?id=${collection?.id}`}
                                          className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                          Edit Collections
                                        </Link>
                                      </li>
                                      <li className="border-b border-divide">
                                        <a
                                          href="#"
                                          className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                          Connect right-attach NFT
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="mb-3 text-textSubtle text-[13px]">
                              {collection.description &&
                              collection.description.length > 70
                                ? collection.description.substring(0, 67) +
                                  "..."
                                : collection.description}
                            </p>
                            <div className="flex items-center">
                              {collection.members &&
                                collection.members.length > 0 &&
                                truncateArray(
                                  collection.members
                                ).slicedItems.map((member) => (
                                  <img
                                    key={member.id}
                                    src={member.avatar}
                                    alt={member.id}
                                    className="rounded-full w-9 h-9 -ml-2 border-2 border-white"
                                  />
                                ))}
                              {collection.members &&
                                collection.members.length > 3 && (
                                  <div className="flex items-center mt-[6px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[26px] h-[26px]">
                                    <p className="text-[12px] text-[#9A5AFF]">
                                      +
                                      {
                                        truncateArray(collection.members)
                                          .restSize
                                      }
                                    </p>
                                  </div>
                                )}
                            </div>
                            {/* <div className="my-4">
                            <a className="inline-block mr-3 bg-primary-900 p-3 text-white  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer hover:bg-opacity-60 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                              Review
                            </a>
                            {collection.status === 'draft' &&
                              project?.is_owner && (
                                <a className='inline-block bg-primary-900 bg-opacity-10 p-3 text-primary-900  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-opacity-100 hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>
                                  Publish
                                </a>
                              )}
                          </div> */}
                          </div>
                        </div>
                      );
                    })}
                </section>
              )}

              {/* collection tab start */}
              {selectedTab === 3 && (
                <CollectionTab projectOwner={project?.is_owner}></CollectionTab>
              )}
              {/* collection tab end */}
              {/* Royalty Splitter tab start */}
              {selectedTab === 4 && (
                <RoyaltySplitter projectNetwork={project?.blockchain} />
              )}
              {/* Royalty Splitter tab end */}
              {/* Sales Setting tab start */}
              {selectedTab === 5 && (
                <SalesSettingsTab projectNetwork={project?.blockchain} />
              )}
              {/* sales setting tab end */}
            </div>
          </section>
          {showDeployModal && (
            <DeployingProjectModal
              show={showDeployModal}
              handleClose={(status) => {
                setShowDeployModal(status);
                projectDetails(projectId);
              }}
              errorClose={(msg) => {
                setErrorMsg(msg);
                setShowDeployModal(false);
                setShowErrorModal(true);
                projectDetails(projectId);
              }}
              tnxData={tnxData}
              projectId={projectId}
              projectName={project.name}
              publishStep={publishStep}
            />
          )}
          {showSuccessModal && (
            <SuccessModal
              handleClose={() => setShowSuccessModal(false)}
              show={showSuccessModal}
            />
          )}
          {showErrorModal && (
            <ErrorModal
              title={"DAO Publish failed !"}
              message={`${errorMsg}`}
              handleClose={() => {
                setShowErrorModal(false);
                setErrorMsg(null);
              }}
              show={showErrorModal}
            />
          )}
          {showPublishModal && (
            <PublishProjectModal
              handleClose={() => setShowPublishModal(false)}
              publishProject={intiProjectPublish}
              show={showPublishModal}
              type="DAO"
            />
          )}
          {showSalesPageModal && (
            <SalesPageModal
              show={showSalesPageModal}
              collectionId={`${collectionId}`}
              collectionType={`${collectionType}`}
              handleClose={() => setShowSalesPageModal(false)}
              successClose={() => {
                setShowSalesPageModal(false);
                setShowSalesSuccessModal(true);
              }}
            />
          )}

          {showSalesSuccessModal && (
            <SuccessModal
              message={"Sale information updated successfully"}
              subMessage={"You can mint NFT now"}
              buttonText={"Close"}
              handleClose={() => {
                setShowSalesSuccessModal(false);
                getCollectionList();
              }}
              show={showSalesSuccessModal}
            />
          )}
          {showTransferFundModal && (
            <LeavingSite
              network={project.blockchain}
              treasuryAddress={project.treasury_wallet}
              show={showTransferFundModal}
              handleClose={() => setShowTransferFundModal(false)}
            />
          )}
        </div>
      )}
    </>
  );
}
