import { useState, useEffect } from "react";
import "assets/css/profile.css";
import DefaultProfilePicture from "assets/images/defaultProfile.svg";
import DefaultProjectLogo from "assets/images/profile/defaultProjectLogo.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import DAOCard from "components/DAOCard";
import NFTCard from "components/NFTCard";
import styles from "Pages/CreateDAOandNFT/style.module.css";
import { Navigation } from "swiper";
import ProfileImage from "assets/images/createDAO/user.svg";
import NFTSample from "assets/images/createDAO/nft-sample.svg";
import { getUserProjectListById } from "services/project/projectService";
import {
  getUserInfo,
  getRoyalties,
  claimRoyalty,
} from "services/User/userService";
import { Link, useParams } from "react-router-dom";
import SuccessModal from "components/modalDialog/SuccessModal";
import { getUserCollections } from "services/collection/collectionService";
import thumbIcon from "assets/images/cover-default.svg";
import ErrorModal from "components/modalDialog/ErrorModal";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "Slice/notificationSlice";
import { walletAddressTruncate } from "util/walletAddressTruncate";

const Profile = () => {
  const dispatch = useDispatch();
  SwiperCore.use([Autoplay]);
  // User general data start
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [royaltyEarned, setRoyaltyEarned] = useState({});
  const [sncList, setsncList] = useState([]);
  const socialLinks = [
    { title: "linkInsta", icon: "instagram", value: "" },
    { title: "linkReddit", icon: "reddit", value: "" },
    { title: "linkTwitter", icon: "twitter", value: "" },
    { title: "linkFacebook", icon: "facebook", value: "" },
    { title: "webLink1", icon: "link", value: "" },
  ];

  const [projectList, setProjectList] = useState([]);
  const [projectListPageNumber, setProjectListPageNumber] = useState(1);
  const [projectListLimit, setProjectListLimit] = useState(10);
  const [projectListHasMoreData, setprojectListHasMoreData] = useState(false);
  // project List End
  // Collection start
  const [collectionList, setCollectionList] = useState([]);
  const [collectionListPageNumber, setCollectionListPageNumber] = useState(1);
  const [collectionListLimit, setCollectionListLimit] = useState(10);
  // collection end
  // Royalties start
  const [royaltiesListSortBy, setRoyaltiesListSortBy] = useState("default");
  const royaltiesSortByList = [
    { id: 1, name: "Revenue" },
    { id: 2, name: "Name" },
    { id: 3, name: "Percentage" },
  ];
  const [royaltiesList, setRoyaltiesList] = useState([
    {
      id: 1,
      project_name: "asdsadsdsa asdsadsdsd sdsadsdsad asdasdsdsds",
      collection_name: "asdsd sdsdsd asdsadsd sdsadasds sads dsdsad ",
      royalty_percent: 10,
      is_owner: true,
      earnable_amount: 100,
    },
    {
      id: 2,
      project_name: "asdsadsdsa ",
      collection_name: "asdsd sdsdsd asdsadsd sdsadasds sads dsdsad ",
      royalty_percent: 10,
      is_owner: false,
      earnable_amount: 100,
    },
  ]);
  const [royaltyId, setRoyaltyId] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [totalRoyality, setTotalRoyality] = useState(0);
  async function onRoyaltiesListSort(e) {
    setRoyaltiesListSortBy(e.target.value);
    let oldRoyalties = [...royaltiesList];
    const sorted = oldRoyalties.reverse();
    setRoyaltiesList(sorted);
  }
  // Royalties End

  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileUploadNotification = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const settings = {
    320: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 15,
    },
    1536: {
      slidesPerView: 5,
      spaceBetween: 15,
    },
  };

  const daosettings = {
    320: {
      slidesPerView: 2,
      spaceBetween: 100,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 100,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 100,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 100,
    },
    1536: {
      slidesPerView: 5,
      spaceBetween: 100,
    },
  };

  // function start
  async function userInfo() {
    await getUserInfo(id)
      .then((response) => {
        setUser(response.user);
        setRoyaltyEarned(response.royalty_earned);
        setWalletAddress(response.user.eao);
        if (response.user["web"]) {
          try {
            const webs = JSON.parse(response.user["web"]);
            const weblist = [...webs].map((e) => ({
              title: Object.keys(e)[0],
              url: Object.values(e)[0],
            }));
            const sociallinks = JSON.parse(response.user["social"]);
            const sncs = [...sociallinks].map((e) => ({
              title: Object.keys(e)[0],
              url: Object.values(e)[0],
            }));
            setsncList(sncs.concat(weblist));
          } catch {
            setsncList([]);
          }
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  async function getUserRoyaltiesInfo() {
    await getRoyalties(id).then((res) => {
      // console.log(res.royalties);
      setRoyaltiesList(res.royalties);
    });
  }

  async function getProjectList() {
    let payload = {
      id: id,
      page: projectListPageNumber,
      perPage: projectListLimit,
    };
    await getUserProjectListById(payload)
      .then((e) => {
        if (e.data !== null) {
          setProjectList(e.data);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }
  async function calculateTotalRoyalties() {
    const sum = royaltiesList
      .map((item) => item.earnable_amount)
      .reduce((prev, curr) => prev + curr, 0);
    setTotalRoyality(sum);
  }
  async function claimAllRoyalty() {
    setShowSuccessModal(true);
  }
  async function getCollectionList() {
    const payload = {
      id: id,
      page: 1,
      limit: 10,
    };
    await getUserCollections(payload)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          setCollectionList(e.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }
  const truncateArray = (members) => {
    let slicedItems = members.slice(0, 3);
    return { slicedItems, restSize: members.length - slicedItems.length };
  };
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById("copied-message");
    copyEl.classList.toggle("hidden");
    setTimeout(() => {
      copyEl.classList.toggle("hidden");
    }, 2000);
  }
  async function claimRoyaltyById(id) {
    setIsLoading(true);
    const request = new FormData();
    request.append("collection_uid", id);
    await claimRoyalty(request)
      .then((res) => {
        if (res.code === 0) {
          setRoyaltyId(res.id);
          setIsLoading(false);
          const notificationData = {
            projectId: id,
            etherscan: "",
            function_uuid: id,
            data: "",
          };
          dispatch(getNotificationData(notificationData));
        } else {
          setIsLoading(false);
          setErrorModal(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setErrorModal(true);
      });
  }
  // useEffect(() => {
  //   // file upload web socket
  //   const projectDeployStatus = fileUploadNotification.find(
  //     (x) => x.function_uuid === jobId
  //   );
  //   if (projectDeployStatus && projectDeployStatus.data) {
  //     const data = JSON.parse(projectDeployStatus.data);
  //     if (data.Data["assetId"] && data.Data["assetId"].length > 0) {
  //       if (!savingNFT && !isNFTSaved) {
  //         setSavingNFT(true);
  //         saveNFTDetails(data.Data["assetId"]);
  //       }
  //     } else {
  //       setSavingNFT(false);
  //     }
  //   }
  // }, [fileUploadNotification]);
  useEffect(() => {
    userInfo();
  }, []);
  useEffect(() => {
    setUser(user);
    setWalletAddress(user.eao);
  }, [user]);
  useEffect(() => {
    getUserRoyaltiesInfo();
    calculateTotalRoyalties();
  }, []);
  useEffect(() => {
    getProjectList();
  }, []);
  useEffect(() => {
    getCollectionList();
  }, []);

  return (
    <>
      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <div className="container mx-auto">
          {/* profile information section */}
          <div className="lg:flex items-center">
            <div className="mt-[30px] md:flex-[70%] mx-3  bg-white-shade-900 rounded-lg p-[13px] md:p-[25px] shadow-lg md:flex">
              <div className="flex">
                <img
                  src={user.avatar === "" ? DefaultProfilePicture : user.avatar}
                  className="rounded-lg w-[102px] object-cover h-[102px]"
                  alt={"profile"}
                />
                <div className="pl-[20px]">
                  <div className="break-all text-txtblack mb-2 text-[14px] font-black md:text-[18px]">
                    {user.display_name}
                  </div>
                  <div className="text-[13px] text-textSubtle mb-2">
                    {user?.eoa && walletAddressTruncate(user.eoa)}
                    <i
                      onClick={() => {
                        copyToClipboard(user.eoa);
                      }}
                      className="fa-solid  fa-copy cursor-pointer pl-[6px]"
                    ></i>
                    <span id="copied-message" className="hidden ml-2">
                      Copied !
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <i className="fa-solid fa-map-pin mr-[7px] text-danger-1 text-[12px]"></i>
                    <span className="text-[13px] text-txtblack">
                      {user.area}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fa-solid fa-briefcase mr-[7px] text-danger-1 text-[12px]"></i>
                    <span className="text-[13px] text-txtblack">
                      {user.job}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5  md:ml-auto">
                <div className="flex flex-wrap">
                  {sncList &&
                    sncList.map((snc, index) => (
                      <div key={`snc-${index}`}>
                        {snc.url !== "" && (
                          <div
                            key={`snc-${index}`}
                            className="cursor-pointer mr-2 w-[44px] h-[44px] mb-4 bg-primary-900/[.09] flex justify-center  items-center rounded-md "
                          >
                            {snc.title.toLowerCase().match("weblink") ? (
                              <div className="">
                                <a
                                  href={snc.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <i
                                    className="fa fa-link text-[20px] gradient-text mt-1"
                                    aria-hidden="true"
                                  ></i>
                                </a>
                              </div>
                            ) : (
                              <a
                                href={snc.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <i
                                  className={`fa-brands fa-${
                                    socialLinks.find(
                                      (x) => x.title === snc.title
                                    ).icon
                                  } text-[20px] gradient-text text-white-shade-900 mt-1`}
                                ></i>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                <div className="ml-auto">
                  <Link to="/profile-settings">
                    <button className="rounded  social-icon-button text-primary-900 px-4 py-2">
                      <span>Edit</span>{" "}
                      <i className="fa-solid  fa-pen-to-square ml-2"></i>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="md:flex-[30%]  mt-[30px] px-6 rounded-lg mx-3 p-[13px] md:p-[20px] text-white-shade-900 shadow-lg gradient-background rounded-lg">
              <div className=" md:mt-[24px] text-[18px] font-black ">
                Total Earned Amount
              </div>
              <div className="font-black text-[28px]  md:mt-[8px]">
                ${royaltyEarned.total_earn}
              </div>
              <div className=" md:mt-[8px] flex flex-wrap align-center">
                <div className="bg-success-1 h-[26px] w-[26px]  rounded-full">
                  <i className="fa-solid fa-up text-[#FFFF] ml-1.5  mt-[3px] text-[20px]"></i>
                </div>
                <div className="text-[14px] ml-2">
                  Last month earned ${royaltyEarned.last_month_earn}
                </div>
              </div>
            </div>
          </div>
          {/* Royalties Table */}
          <div className=" mt-[20px] mx-3 mb-[36px] pt-[30px] shadow-lg px-4  pb-[35px] bg-white-shade-900 rounded-xl">
            <div className="flex  items-center mb-[24px]">
              <div className="text-[24px] text-txtblack font-black ">
                Royalties
              </div>
              <div className="ml-auto  text-[18px]">
                <span className="text-txtblack mr-2 hidden  md:inline-block">
                  Total Royalties:
                </span>
                <span className="text-txtblack font-black">
                  ${royaltiesList.length > 0 ? totalRoyality : `0`}
                </span>
              </div>
              {royaltiesList.length > 0 && (
                <>
                  <button
                    onClick={claimAllRoyalty}
                    className="contained-button font-bold py-1 px-3 rounded ml-3"
                  >
                    Claim All Royalties
                  </button>
                  {/* <select
                    className="hidden md:block w-[120PX] h-[32px] ml-3 bg-white-shade-900 pl-2 outline-none text-textSubtle border border-[#C7CEE5]"
                    value={royaltiesListSortBy}
                    onChange={onRoyaltiesListSort}
                  >
                    <option disabled value={"default"} defaultValue>
                      Sort By
                    </option>
                    {royaltiesSortByList.map((e) => (
                      <option key={e.id} value={e.name}>
                        {e.name}
                      </option>
                    ))}
                  </select> */}
                </>
              )}
            </div>
            {/* table for desktop */}
            <div className="hidden md:block">
              {royaltiesList.length > 0 ? (
                <div className="overflow-x-auto relative mt-[54px]">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-textSubtle text-[12px] ">
                        <th scope="col" className="px-5">
                          Icon
                        </th>
                        <th scope="col" className="px-5">
                          Project Name
                        </th>
                        <th scope="col" className="px-5">
                          Collection Name
                        </th>
                        <th scope="col" className="px-5">
                          Percentage
                        </th>
                        <th scope="col" className="px-5">
                          Role
                        </th>
                        <th scope="col" className="px-5">
                          Earnable Amount
                        </th>
                        <th scope="col" className="px-5">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {royaltiesList.map((r, index) => (
                        <tr
                          key={r.index}
                          className={`${
                            index < royaltiesList.length - 1 ? "border-b" : ""
                          } text-left text-txtblack text-[14px]`}
                        >
                          <td className="py-4 px-5">
                            <img
                              src={DefaultProjectLogo}
                              className="h-[34px] w-[34px] object-cover rounded-full"
                              alt={r.project_name + "logo"}
                            />
                          </td>
                          <td className="py-4 px-5 font-black ">
                            {r.project_name}
                          </td>
                          <td className="py-4 px-5 font-black ">
                            {r.collection_name}
                          </td>
                          <td className="py-4 px-5">{r.royalty_percent}</td>
                          <td
                            className={`py-4 px-5  ${
                              r.is_owner ? "text-info-1" : " text-success-1"
                            }`}
                          >
                            {r.is_owner ? "Owner" : "Member"}
                          </td>
                          <td className="py-4 px-5">${r.earnable_amount}</td>
                          <td className="py-4 px-5">
                            <button
                              onClick={() => claimRoyaltyById(r.id)}
                              className="bg-primary-900/[.20] h-[32px] w-[57px] rounded text-primary-900"
                            >
                              Claim
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center ">
                  <h2 className="text-textSubtle mb-6">
                    You don't have any Royalty yet
                  </h2>
                </div>
              )}
            </div>
            {/* table for mobile */}
            <div className="md:hidden">
              {royaltiesList.length > 0 ? (
                <div>
                  {royaltiesList.map((r, index) => (
                    <div
                      key={index}
                      className={`my-8 py-7  ${
                        index < royaltiesList.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className={`flex   items-center mb-8 `}>
                        <div className={"flex  items-center"}>
                          <img
                            src={DefaultProjectLogo}
                            className="h-[34px] w-[34px] object-cover rounded-full"
                            alt={r.project_name + "logo"}
                          />
                          <div className="mx-4 font-black ">
                            {r.project_name}
                          </div>
                        </div>
                        <button
                          onClick={() => claimRoyaltyById(r.id)}
                          className="bg-primary-900/[.20] ml-auto px-3 py-1 rounded text-primary-900"
                        >
                          Claim
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div>Percentage</div>
                          <div className="text-center">{r.royalty_percent}</div>
                        </div>
                        <div>
                          <div>Role</div>
                          <div
                            className={`text-centre ${
                              r.is_owner ? "text-info-1" : " text-success-1"
                            }`}
                          >
                            {r.is_owner ? "Owner" : "Member"}
                          </div>
                        </div>
                        <div>
                          <div>Earnable Amount</div>
                          <div className="text-center">
                            ${r.earnable_amount}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // <div className="overflow-x-auto relative mb-[54px]">
                //   <table className="w-full text-left">
                //     <thead>
                //       <tr className="text-textSubtle text-[12px] ">
                //         <th scope="col" className="px-5">
                //           Percentage
                //         </th>
                //         <th scope="col" className="px-5">
                //           Role
                //         </th>
                //         <th scope="col" className="px-5">
                //           Earnable Amount
                //         </th>
                //       </tr>
                //     </thead>
                //     <tbody>
                //       {royaltiesList.map((r, index) => (
                //         <tr
                //           key={r.index}
                //           className={`${
                //             index < royaltiesList.length - 1 ? "border-b" : ""
                //           } text-left text-txtblack text-[14px]`}
                //         >
                //           <td className="py-4 px-5">{r.royalty_percent}</td>
                //           <td
                //             className={`py-4 px-5  ${
                //               r.is_owner ? "text-info-1" : " text-success-1"
                //             }`}
                //           >
                //             {r.is_owner ? "Owner" : "Member"}
                //           </td>
                //           <td className="py-4 px-5">${r.earnable_amount}</td>
                //         </tr>
                //       ))}
                //     </tbody>
                //   </table>
                // </div>
                <div className="text-center ">
                  <h2 className="text-textSubtle mb-6">
                    You don't have any Royalty yet
                  </h2>
                </div>
              )}
            </div>
            {/* <div className="flex justify-center space-x-1 ">
              <button className="px-3 py-1   text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7">
                <i className="fa-solid fa-angle-left"></i>
              </button>
              <button className="px-3 py-1 font-satoshi-bold  text-primary-900">
                1
              </button>
              <button className="px-3 py-1 font-satoshi-bold text-textSubtle">
                2
              </button>
              <button className="px-3 py-1   text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7">
                <i className="fa-solid fa-angle-right"></i>
              </button>
            </div> */}
          </div>

          <div className="mb-[50px]">
            <h1 className="text-[28px] ml-4 mb-[36px] font-black">Your DAO</h1>

            {projectList.length > 0 ? (
              <Swiper
                breakpoints={daosettings}
                navigation={false}
                modules={[Navigation]}
                className={styles.createSwiper}
              >
                <div>
                  {projectList.map((item) => (
                    <div key={item.id}>
                      <SwiperSlide key={item.id} className={styles.daoCard}>
                        <DAOCard item={item} key={item.id} />
                      </SwiperSlide>
                    </div>
                  ))}
                </div>
              </Swiper>
            ) : (
              <div className="text-center mt-6">
                <h2 className="text-textSubtle">You don't have any DAO yet</h2>
              </div>
            )}
          </div>

          <div className="mb-[50px]">
            <h1 className="text-[28px] ml-4 mb-[36px] font-black">
              Collection
            </h1>
            {collectionList.length > 0 ? (
              <Swiper
                breakpoints={settings}
                navigation={false}
                modules={[Navigation]}
                className={styles.createSwiper}
              >
                <div>
                  {collectionList.map((collection, index) => (
                    <div key={collection.id}>
                      <SwiperSlide
                        key={collection.id}
                        className={styles.nftCard}
                      >
                        <div
                          className="min-h-[390px] rounded-x"
                          key={`best-collection-${index}`}
                        >
                          <Link
                            to={
                              collection.type === "right_attach"
                                ? `/royality-management/${collection.id}`
                                : `/collection-details/${collection.id}`
                            }
                          >
                            <img
                              className="rounded-xl h-[211px] md:h-[276px] object-cover w-full"
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

                          <div className="p-5">
                            <div className="pb-2 text-[18px] font-black md:text-[24px] text-txtblack truncate">
                              {collection.name}
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
                      </SwiperSlide>
                    </div>
                  ))}
                </div>
              </Swiper>
            ) : (
              <div className="text-center mt-6 text-textSubtle">
                <h2>You don't have any Collection yet</h2>
              </div>
            )}
          </div>
        </div>
      )}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          message="Successfully claimed royalty"
          subMessage=""
          buttonText="Close"
          redirection={`/profile/${id}`}
          showCloseIcon={true}
          handleClose={() => setShowSuccessModal(false)}
        />
      )}
      {errorModal && (
        <ErrorModal
          title={"Royalty can not claim right now."}
          message={`Please try again later`}
          handleClose={() => setErrorModal(false)}
          show={errorModal}
        />
      )}
    </>
  );
};
export default Profile;
