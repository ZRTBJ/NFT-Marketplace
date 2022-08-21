import { useEffect, useState } from "react";
import {
  getProjectDetailsById,
  projectLike,
  projectBookmark,
} from "services/project/projectService";
import { getNftListByProjectId } from "services/nft/nftService";
import manImg from "assets/images/projectDetails/man-img.svg";
import bigImg from "assets/images/gallery/big-img.svg";
import { useHistory } from "react-router-dom";

import thumbIcon from "assets/images/profile/card.svg";
import avatar from "assets/images/dummy-img.svg";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import PublishModal from "components/modalDialog/PublishModal";
import ErrorModal from "components/modalDialog/ErrorModal";
import SuccessModal from "components/modalDialog/SuccessModal";
import DeployingProjectModal from "components/modalDialog/DeployingProjectModal";
import { getCollections } from "services/collection/collectionService";
import CreateRightAttachedNFT from "components/modalDialog/CreateRightAttachNFT";
import SalesPageModal from "components/modalDialog/SalesPageModal";

export default function ProjectDetails(props) {
  const history = useHistory();
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
  const [selectedTab, setSelectedTab] = useState(1);
  const [membershipCollectionList, setMembershipCollectionList] = useState([]);
  const [productCollectionList, setProductCollectionList] = useState([]);
  const [rightAttachCollectionList, setRightAttachCollectionList] = useState(
    []
  );
  const [showCreateRANFT, setShowCreateRANFT] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showSalesPageModal, setShowSalesPageModal] = useState(false);
  const [showSalesSuccessModal, setShowSalesSuccessModal] = useState(false);
  const [collectionId, setCollectionId] = useState("");
  const [collectionType, setCollectionType] = useState("");

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
    }
  }, [projectId]);

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
            if (project.urls && project.urls.length > 0) {
              const webLinks = [];
              try {
                const urls = JSON.parse(project.urls);
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
          // if (e.data.length === limit) {
          //   let pageSize = page + 1;
          //   setPage(pageSize);
          //   setHasMore(true);
          // }

          // const cols = membershipCollectionList.concat(e.data);
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
          const rightattachcoll = e.data.filter(
            (col) => col.type === "right_attach"
          );
          if (rightattachcoll) {
            setRightAttachCollectionList(rightattachcoll);
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

  return (
    <>
      <CreateRightAttachedNFT
        show={showCreateRANFT}
        handleClose={() => setShowCreateRANFT(false)}
      />
      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <>
          <section className="grid sm:grid-cols-5 gap-4 mt-6">
            <div className="row-span-2 col-span-2">
              <img
                className="rounded-xl object-cover h-[260px] w-full"
                src={coverImages?.path ? coverImages.path : bigImg}
                alt=""
              />
            </div>
            {project?.assets?.length > 0 &&
              project.assets.map((img, index) => (
                <>
                  {img["asset_purpose"] !== "cover" && (
                    <div key={`dao-image-${index}`}>
                      <img
                        className="rounded-xl object-cover h-[122px] w-full"
                        src={img ? img.path : manImg}
                        alt=""
                      />
                    </div>
                  )}
                </>
              ))}
          </section>
          {/* end gallery */}

          {/* profile information section */}
          <section className="bg-light3 rounded-b-xl mt-4 p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3">
                <div className="flex">
                  <img
                    src={
                      project.assets && project.assets[1]
                        ? project.assets[1].path
                        : manImg
                    }
                    className="rounded-full self-start w-14 h-14 md:w-[98px] object-cover md:h-[98px] bg-color-ass-6"
                    alt="User profile"
                  />
                  <div className="flex-1 min-w-0  px-4">
                    <h1 className="-mt-1 mb-1 md:mb-2 truncate">
                      {project.name}
                    </h1>
                    <p className="text-textLight text-sm">
                      {project?.contract_address
                        ? project.contract_address
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
                className="flex flex-wrap mt-3 items-start md:justify-end md:w-1/3 md:mt-0"
                role="group"
              >
                {links.find((link) => link.title === "linkFacebook") &&
                  links.find((link) => link.title === "linkFacebook").value
                    ?.length > 0 && (
                    <div className="cursor-pointer w-8 h-8 mb-4 bg-primary-900 bg-opacity-20 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-opacity-5">
                      <a
                        href={`${
                          links.find((link) => link.title === "linkFacebook")
                            .value
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fa-brands fa-facebook text-primary-900"></i>
                      </a>
                    </div>
                  )}

                {links.find((link) => link.title === "linkInsta") &&
                  links.find((link) => link.title === "linkInsta").value
                    ?.length > 0 && (
                    <div className="cursor-pointer w-8 h-8 mb-4 bg-primary-900 bg-opacity-20 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-opacity-5">
                      <a
                        href={`${
                          links.find((link) => link.title === "linkInsta").value
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fa-brands fa-instagram text-primary-900"></i>
                      </a>
                    </div>
                  )}

                {links.find((link) => link.title === "linkTwitter") &&
                  links.find((link) => link.title === "linkTwitter").value
                    ?.length > 0 && (
                    <div className="cursor-pointer w-8 h-8 mb-4 bg-primary-900 bg-opacity-20 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-opacity-5">
                      <a
                        href={`${
                          links.find((link) => link.title === "linkTwitter")
                            .value
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fa-brands fa-twitter text-primary-900"></i>
                      </a>
                    </div>
                  )}

                {links.find((link) => link.title === "linkGitub") &&
                  links.find((link) => link.title === "linkGitub").value
                    ?.length > 0 && (
                    <div className="cursor-pointer w-8 h-8 mb-4 bg-primary-900 bg-opacity-20 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-opacity-5">
                      <a
                        href={`${
                          links.find((link) => link.title === "linkGitub").value
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fa-brands fa-github text-primary-900"></i>
                      </a>
                    </div>
                  )}

                {links.find((link) => link.title === "customLinks1") &&
                  links.find((link) => link.title === "customLinks1").value
                    ?.length > 0 && (
                    <div className="cursor-pointer w-8 h-8 mb-4 bg-primary-900 bg-opacity-20 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-opacity-5">
                      <a
                        href={`${
                          links.find((link) => link.title === "customLinks1")
                            .value
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fa-solid fa-globe text-primary-900"></i>
                      </a>
                    </div>
                  )}

                {project?.project_status !== "published" && (
                  <a
                    onClick={() => setShowPublishModal(true)}
                    className="inline-block ml-4 bg-primary-900 px-3 py-2 text-white font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-secondary-800 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                  >
                    Publish
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row pt-5">
              <div className="md:w-2/3">
                <h3>About</h3>
                <p className="text-textLight text-sm">{project.overview}</p>
                <div className="flex items-center mt-3">
                  {project &&
                    project.members &&
                    project.members.length > 0 &&
                    project.members.map((img, index) => (
                      <>
                        {index < 5 && (
                          <img
                            key={`member-img-${index}`}
                            className="rounded-full w-9 h-9 -ml-2 border-2 border-white"
                            src={img.path ? img.path : avatar}
                            alt=""
                          />
                        )}
                      </>
                    ))}
                  {project && project.members && project.members.length > 5 && (
                    <span className="ml-2 bg-primary-900 bg-opacity-5  text-primary-900 rounded p-1 text-xs  ">
                      +{project.members.length - 5}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center flex-wrap mt-3 md:justify-end md:w-1/3  md:mt-0">
                <a className="inline-block ml-4 mb-3 bg-primary-900 bg-opacity-10 p-3 text-primary-900  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-opacity-100 hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                  Transger Funds
                </a>

                <div className="bg-primary-900 ml-3 bg-opacity-10 rounded-md p-3 px-5 relative w-56">
                  <i className="fa-regular fa-arrows-rotate text-textSubtle text-sm  absolute right-2 top-3"></i>
                  <p className=" text-sm text-textSubtle ">Net Worth</p>
                  <h4>1.400.000 MATIC</h4>
                  <p className="text-sm text-textSubtle">($1,400.00)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tab Section */}
          <section className="mb-10">
            <div className="mb-4">
              <ul
                className="flex flex-wrap -mb-px text-sm font-medium text-center"
                id="myTab"
                data-tabs-toggle="#myTabContent"
                role="tablist"
              >
                <li
                  className="mr-2"
                  role="presentation"
                  onClick={() => setSelectedTab(1)}
                >
                  <button
                    className={`inline-block p-4 text-lg rounded-t-lg ${
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
                <li
                  className="mr-2"
                  role="presentation"
                  onClick={() => setSelectedTab(2)}
                >
                  <button
                    className={`inline-block p-4 text-lg rounded-t-lg ${
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
                <li
                  className="mr-2"
                  role="presentation"
                  onClick={() => setSelectedTab(3)}
                >
                  <button
                    className={`inline-block p-4 text-lg rounded-t-lg ${
                      selectedTab === 3
                        ? "border-b-2 border-primary-900 text-primary-900"
                        : "border-transparent text-textSubtle"
                    }  hover:text-primary-900`}
                    id="settings-tab"
                    data-tabs-target="#settings"
                    type="button"
                    role="tab"
                    aria-controls="settings"
                    aria-selected="false"
                  >
                    Rights Attached NFT
                  </button>
                </li>
              </ul>
            </div>

            <div id="myTabContent">
              {/* TAB 1 */}
              {selectedTab === 1 && (
                <section
                  className="grid md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6"
                  id="membership_nft"
                  role="tabpanel"
                  aria-labelledby="membership-nft-tab"
                >
                  {/* Card */}
                  {membershipCollectionList &&
                    membershipCollectionList.length > 0 &&
                    membershipCollectionList.map((collection, index) => (
                      <div
                        className="min-h-[390px] rounded-x"
                        key={`nft-collection-membership-${index}`}
                      >
                        <Link to={`/collection-details/${collection?.id}`}>
                          <img
                            className="rounded-xl h-[276px] object-cover w-full"
                            src={
                              collection &&
                              collection.assets &&
                              collection.assets[0]
                                ? collection.assets[0].path
                                : thumbIcon
                            }
                            alt=""
                          />
                        </Link>
                        <div className="py-5">
                          <div className="flex">
                            <h2 className="pb-2 text-txtblack truncate flex-1 mr-3 m-w-0">
                              {collection.name}
                            </h2>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  const el =
                                    document.getElementById(
                                      "membership-option"
                                    );
                                  el.classList.toggle("hidden");
                                }}
                              >
                                <i className="fa-regular fa-ellipsis-vertical text-textSubtle"></i>
                              </button>
                              {/* Dropdown menu  */}
                              <div
                                id="membership-option"
                                className="z-10 w-48 bg-white border border-divide rounded-md  absolute left-0 top-8 hidden"
                              >
                                <ul className="text-sm">
                                  <li className="border-b border-divide vursor-pointer">
                                    <a className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600">
                                      Sales Page
                                    </a>
                                  </li>
                                  <li className="border-b border-divide">
                                    <a
                                      href="#"
                                      className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                      Edit Collections
                                    </a>
                                  </li>
                                  <li className="border-b border-divide">
                                    <a
                                      href="#"
                                      className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                      Embed Collection
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <p className="mb-3 text-textSubtle text-[13px]">
                            {collection.description &&
                            collection.description.length > 70
                              ? collection.description.substring(0, 67) + "..."
                              : collection.description}
                          </p>
                          <div className="flex items-center">
                            {collection.members &&
                              collection.members.length > 0 &&
                              truncateArray(collection.members).slicedItems.map(
                                (member) => (
                                  <img
                                    src={member.avatar}
                                    alt={member.id}
                                    className="rounded-full w-9 h-9 -ml-2 border-2 border-white"
                                  />
                                )
                              )}
                            {collection.members &&
                              collection.members.length > 3 && (
                                <div className="flex items-center mt-[6px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[26px] h-[26px]">
                                  <p className="text-[12px] text-[#9A5AFF]">
                                    +
                                    {truncateArray(collection.members).restSize}
                                  </p>
                                </div>
                              )}
                          </div>
                          <div className="my-4">
                            <a className="inline-block mr-3 bg-primary-900 p-3 text-white  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer hover:bg-opacity-60 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                              Review
                            </a>
                            {collection.status === "draft" && (
                              <a className="inline-block bg-primary-900 bg-opacity-10 p-3 text-primary-900  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-opacity-100 hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                                Publish
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Create New */}
                  <div className="rounded-xl h-[276px] w-full bg-success-1 bg-opacity-20 flex flex-col items-center justify-center">
                    <i className="fa-solid fa-circle-plus text-success-1 text-2xl mb-2"></i>
                    <p className="text-success-1 text-lg font-black font-satoshi-bold">
                      Create new
                    </p>
                  </div>
                </section>
              )}

              {/* TAB 2 */}
              {selectedTab === 2 && (
                <section
                  className="grid md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6"
                  id="product-nft"
                  role="tabpanel"
                  aria-labelledby="product-nft-tab"
                >
                  {/* Card */}
                  {productCollectionList &&
                    productCollectionList.length > 0 &&
                    productCollectionList.map((collection, index) => (
                      <div
                        className="min-h-[390px] rounded-x"
                        key={`nft-collection-membership-${index}`}
                      >
                        <Link to={`/collection-details/${collection?.id}`}>
                          <img
                            className="rounded-xl h-[276px] object-cover w-full"
                            src={
                              collection &&
                              collection.assets &&
                              collection.assets[0]
                                ? collection.assets[0].path
                                : thumbIcon
                            }
                            alt=""
                          />
                        </Link>
                        <div className="py-5">
                          <div className="flex">
                            <h2 className="pb-2 text-txtblack truncate flex-1 mr-3 m-w-0">
                              {collection.name}
                            </h2>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  const el =
                                    document.getElementById(
                                      "collection-option"
                                    );
                                  el.classList.toggle("hidden");
                                }}
                              >
                                <i className="fa-regular fa-ellipsis-vertical text-textSubtle"></i>
                              </button>
                              {/* Dropdown menu  */}
                              <div
                                id="collection-option"
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
                                    <a
                                      href="#"
                                      className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                      Edit Collections
                                    </a>
                                  </li>
                                  <li className="border-b border-divide">
                                    <a
                                      href="#"
                                      className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                      Embed Collection
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <p className="mb-3 text-textSubtle text-[13px]">
                            {collection.description &&
                            collection.description.length > 70
                              ? collection.description.substring(0, 67) + "..."
                              : collection.description}
                          </p>
                          <div className="flex items-center">
                            {collection.members &&
                              collection.members.length > 0 &&
                              truncateArray(collection.members).slicedItems.map(
                                (member) => (
                                  <img
                                    src={member.avatar}
                                    alt={member.id}
                                    className="rounded-full w-9 h-9 -ml-2 border-2 border-white"
                                  />
                                )
                              )}
                            {collection.members &&
                              collection.members.length > 3 && (
                                <div className="flex items-center mt-[6px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[26px] h-[26px]">
                                  <p className="text-[12px] text-[#9A5AFF]">
                                    +
                                    {truncateArray(collection.members).restSize}
                                  </p>
                                </div>
                              )}
                          </div>
                          <div className="my-4">
                            <a className="inline-block mr-3 bg-primary-900 p-3 text-white  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer hover:bg-opacity-60 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                              Review
                            </a>
                            {collection.status === "draft" && (
                              <a className="inline-block bg-primary-900 bg-opacity-10 p-3 text-primary-900  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-opacity-100 hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                                Publish
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Create New */}
                  <div className="rounded-xl h-[276px] w-full bg-success-1 bg-opacity-20 flex flex-col items-center justify-center">
                    <i className="fa-solid fa-circle-plus text-success-1 text-2xl mb-2"></i>
                    <p className="text-success-1 text-lg font-black font-satoshi-bold">
                      Create new
                    </p>
                  </div>
                </section>
              )}

              {/* TAB 3 */}
              {selectedTab === 3 && (
                <>
                  {(!rightAttachCollectionList ||
                    rightAttachCollectionList.length < 1) && (
                    <section
                      className="p-4"
                      id="right-attached"
                      role="tabpanel"
                      aria-labelledby="right-attached-tab"
                    >
                      <article className=" rounded-xl bg-secondary-900 bg-opacity-20 border border-secondary-900 h-60 flex items-center justify-center p-4 flex-col">
                        <h2 className="text-textBlack mb-3">
                          Enable Right Attached NFT
                        </h2>
                        <p className="mb-4">
                          Create your Right attached NFT and share the royalty
                          fairly with your teams,
                        </p>
                        <a
                          className="inline-block bg-secondary-900 px-4 py-3 text-white font-black text-sm  font-satoshi-bold rounded cursor-pointer  hover:bg-secondary-800 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                          onClick={() => setShowCreateRANFT(true)}
                        >
                          Enable Now
                        </a>
                      </article>
                    </section>
                  )}
                  {rightAttachCollectionList &&
                    rightAttachCollectionList.length > 0 && (
                      <section
                        className="grid md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6"
                        id="right-attached"
                        role="tabpanel"
                        aria-labelledby="right-attached-tab"
                      >
                        {/* Card */}
                        {rightAttachCollectionList &&
                          rightAttachCollectionList.length > 0 &&
                          rightAttachCollectionList.map((collection, index) => (
                            <div
                              className="min-h-[390px] rounded-x"
                              key={`nft-collection-membership-${index}`}
                            >
                              <Link
                                to={`/royality-management/${collection.id}`}
                              >
                                <img
                                  className="rounded-xl h-[276px] object-cover w-full"
                                  src={
                                    collection &&
                                    collection.assets &&
                                    collection.assets[0]
                                      ? collection.assets[0].path
                                      : thumbIcon
                                  }
                                  alt=""
                                />
                              </Link>
                              <div className="py-5">
                                <div className="flex">
                                  <h2 className="pb-2 text-txtblack truncate flex-1 mr-3 m-w-0">
                                    {collection.name}
                                  </h2>
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const el =
                                          document.getElementById(
                                            "rightattach-option"
                                          );
                                        el.classList.toggle("hidden");
                                      }}
                                    >
                                      <i className="fa-regular fa-ellipsis-vertical text-textSubtle"></i>
                                    </button>
                                    {/* Dropdown menu  */}
                                    <div
                                      id="rightattach-option"
                                      className="z-10 w-48 bg-white border border-divide rounded-md  absolute left-0 top-8 hidden"
                                    >
                                      <ul className="text-sm">
                                        <li className="border-b border-divide">
                                          <a
                                            href="#"
                                            className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                                          >
                                            Edit Collections
                                          </a>
                                        </li>
                                        <li className="border-b border-divide">
                                          <a
                                            href="#"
                                            className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                                          >
                                            Embed Collection
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
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
                                <div className="my-4">
                                  <a className="inline-block mr-3 bg-primary-900 p-3 text-white  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer hover:bg-opacity-60 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                                    Review
                                  </a>
                                  {collection.status === "draft" && (
                                    <a className="inline-block bg-primary-900 bg-opacity-10 p-3 text-primary-900  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-opacity-100 hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                                      Publish
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        {/* Create New */}
                        <div
                          className="rounded-xl h-[276px] w-full bg-success-1 bg-opacity-20 flex flex-col items-center justify-center cursor-pointer"
                          onClick={() => setShowCreateRANFT(true)}
                        >
                          <i className="fa-solid fa-circle-plus text-success-1 text-2xl mb-2"></i>
                          <p className="text-success-1 text-lg font-black font-satoshi-bold">
                            Create new
                          </p>
                        </div>
                      </section>
                    )}
                </>
              )}
            </div>
          </section>

          {/* NO DAO */}

          {/* <article className="rounded-xl bg-danger-900 bg-opacity-40 border border-danger-900 h-60 flex items-center justify-center p-4 flex-col">
            <h2 className="text-danger-900 mb-4">
              You haven’t Created DAO yet.
            </h2>
            <a className="inline-block bg-danger-900 px-4 py-3 text-white font-black text-sm font-satoshi-bold rounded cursor-pointer hover:bg-opacity-80 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
              Create Now
            </a>
          </article> */}

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
              }}
              tnxData={tnxData}
              projectId={projectId}
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
            <PublishModal
              handleClose={() => setShowPublishModal(false)}
              publishProject={intiProjectPublish}
              show={showPublishModal}
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
        </>
      )}
    </>
  );
}
