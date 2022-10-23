/* eslint-disable react-hooks/exhaustive-deps */
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
import styles from "Pages/Project/CreateDAOandNFT/style.module.css";
import { Navigation } from "swiper";
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
import { walletAddressTruncate } from "util/walletAddressTruncate";
import { getMintedNftListByUserId } from "services/nft/nftService";
import NFTListCard from "components/NFTListCard";
import { refreshNFT } from "services/nft/nftService";
import { royaltyClaim } from "eth/logics/royalty-claim";
import { updateMetadata } from "eth/logics/update-metadata";
import { createProvider } from "eth/logics/provider";
import { createMintInstance } from "eth/abis/mint-nft";
import { toast } from "react-toastify";
const Profile = () => {
  const provider = createProvider();
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
  // project List End
  // Collection start
  const [collectionList, setCollectionList] = useState([]);
  // collection end
  // Royalties start
  const [setRoyaltiesListSortBy] = useState("default");
  const [royaltiesList, setRoyaltiesList] = useState([]);
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
  const notificationsList = useSelector((state) =>
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

  const [mintedNftList, setMintedNftList] = useState([]);
  const [nftErrorModalMessage, setNftErrorModalMessage] = useState("");
  const [nftErrorModal, setNftErrorModal] = useState(false);
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
      res.royalties.forEach((element) => {
        element.isLoading = false;
      });
      setRoyaltiesList(res.royalties);
    });
  }

  async function getProjectList() {
    let payload = {
      id: id,
      page: 1,
      perPage: 10,
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
  async function claimRoyaltyWithtnx(data) {
    const payload = {
      royalty_uid: data.id,
      transaction_hash: data.transaction_hash,
    };
    return await claimRoyalty(payload);
  }
  async function claimRoyaltyById(royalty) {
    setRoyaltyData(royalty, "loadingTrue");
    const payload = {
      royalty_uid: royalty.royalty_id,
    };
    let config = {};
    let hasConfig = false;
    await claimRoyalty(payload)
      .then((res) => {
        if (res.code === 0) {
          config = res.config;
          hasConfig = true;
        } else {
          setIsLoading(false);
          setErrorModal(true);
          setRoyaltyData(royalty, "loadingFalse");
        }
      })
      .catch(() => {
        setIsLoading(false);
        setErrorModal(true);
      });
    if (hasConfig) {
      const result = await royaltyClaim(provider, config);
      if (result) {
        const data = {
          id: royalty.royalty_id,
          transaction_hash: result,
        };
        await claimRoyaltyWithtnx(data).then((res) => {
          if (res.function.status === "success") {
            setRoyaltyData(royalty, "loadingFalse");
            setRoyaltyData(royalty, "claimButtonDisable");
            toast.success(`Successfully claimed for  ${royalty.project_name}`);
          }
          if (res.function.status === "failed") {
            setRoyaltyData(royalty, "loadingFalse");
            toast.error(`Unexpected error, Please try again`);
          }
        });
      }
    }
  }
  async function getNftList() {
    const payload = {
      userId: id,
      page: 1,
      limit: 10,
    };
    await getMintedNftListByUserId(payload)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          e.data.forEach((element) => {
            element.loading = false;
          });

          setMintedNftList(e.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }
  function setNftData(nft, type) {
    let nftList = [...mintedNftList];
    const nftIndex = nftList.findIndex((item) => item.id === nft.id);
    const nftLocal = { ...nft };
    if (type === "loadingTrue") {
      nftLocal.loading = true;
    } else if (type === "loadingFalse") {
      nftLocal.loading = false;
    } else if (type === "hideRefreshButton") {
      nftLocal.refresh_status = "notRequired";
    } else if (type === "showRefreshButton") {
      nftLocal.refresh_status = "failed";
    }
    nftList[nftIndex] = nftLocal;
    setMintedNftList(nftList);
  }
  function setRoyaltyData(royalty, type) {
    let royaltyList = [...royaltiesList];
    const royaltyIndex = royaltyList.findIndex(
      (item) => item.id === royalty.id
    );
    const royaltyLocal = { ...royalty };
    if (type === "loadingTrue") {
      royaltyLocal.isLoading = true;
    }
    if (type === "claimButtonDisable") {
      royaltyLocal.earnable_amount = 0;
    }
    royaltyList[royaltyIndex] = royaltyLocal;
    setRoyaltiesList(royaltyList);
  }

  async function refreshNFTWithtnx(payload) {
    return await refreshNFT(payload);
  }

  async function onRefreshNft(nft) {
    // hide the refresh button start
    setNftData(nft, "hideRefreshButton");
    // hide the refresh end

    // 1. set Loading true start
    setNftData(nft, "loadingTrue");
    // 1. set loading true end

    // 2. call refresh api for getting config object
    const payload = {
      id: nft.id,
      tokenId: nft.token_id,
    };
    let config = {};
    let hasConfigForNft = false;

    await refreshNFT(payload)
      .then((res) => {
        if (res.code === 0) {
          config = res.config;
          hasConfigForNft = true;
        } else {
          setNftErrorModalMessage(res.message);
          setNftErrorModal(true);
          setNftData(nft, "loadingFalse");
          setNftData(nft, "sowRefreshButton");
        }
      })
      .catch((error) => {
        setNftErrorModalMessage(
          "Can not refresh right now,please Try Again later"
        );
        setNftErrorModal(true);
        setNftData(nft, "loadingFalse");
        setNftData(nft, "sowRefreshButton");
      });
    if (hasConfigForNft) {
      const erc721CollectionContract = createMintInstance(
        config.collection_contract_address,
        provider);
      const result = await updateMetadata(erc721CollectionContract, provider, config);
      if (result) {
        console.log(result);
        const data = {
          id: nft.id,
          tokenId: nft.token_id,
          tnxHash: result,
        };
        await refreshNFTWithtnx(data)
          .then((res) => {
            if (res.code === 0) {
              if (res.function.status === "success") {
                setNftData(nft, "loadingFalse");
                setNftData(nft, "hideRefreshButton");
                toast.success(`Successfully refreshed ${nft.name} NFT`);
              }
              if (res.function.status === "failed") {
                setNftData(nft, "loadingFalse");
                setNftData(nft, "sowRefreshButton");
                toast.error(`Unexpected error, Please try again`);
              }
            }
          })
          .catch((err) => {
            setNftErrorModalMessage(err);
            setNftErrorModal(true);
            setNftData(nft, "loadingFalse");
          });
      }
    }
  }

  useEffect(() => {
    // need to check with real minted nft,code could be change
    for (const localkey in localStorage) {
      const projectDeployStatus = notificationsList.find(
        (x) => x.function_uuid === localkey
      );
      if (projectDeployStatus) {
        if (projectDeployStatus.data !== "") {
          const data = JSON.parse(projectDeployStatus.data);
          const nft = JSON.parse(localStorage.getItem(localkey));
          if (data.fn_name === "updateMetadata") {
            if (data.fn_status === "success") {
              setNftData(nft, "loadingFalse");
              setNftData(nft, "hideRefreshButton");
              toast.success(`Refresh completed for NFT ${nft.name}`);
            } else if (data.fn_status === "failed") {
              setNftData(nft, "loadingFalse");
              setNftData(nft, "showRefreshButton");
              toast.error(`Refresh failed for NFT ${nft.name}`);
            }
            localStorage.removeItem("localkey");
          }
        }
      }
    }

    console.log(notificationsList);
  }, [notificationsList]);
  useEffect(() => {
    userInfo();
  }, []);
  useEffect(() => {
    setUser(user);
    setWalletAddress(user.eao);
  }, [user]);
  useEffect(() => {
    getUserRoyaltiesInfo();
  }, []);
  useEffect(() => {
    getProjectList();
  }, []);
  useEffect(() => {
    getCollectionList();
  }, []);
  useEffect(() => {
    getNftList();
  }, []);

  useEffect(() => {
    calculateTotalRoyalties();
  }, [royaltiesList]);

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
                                  className={`fa-brands fa-${socialLinks.find(
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
                $ {royaltyEarned.total_earn_usd?.toFixed(3)}
              </div>
              <div className=" md:mt-[8px] flex flex-wrap align-center">
                <div className="bg-success-1 h-[26px] w-[26px]  rounded-full">
                  <i className="fa-solid fa-up text-[#FFFF] ml-1.5  mt-[3px] text-[20px]"></i>
                </div>
                <div className="text-[14px] ml-2">
                  Last month earned $ {royaltyEarned.last_month_earn_usd?.toFixed(3)}
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
                  ${royaltiesList?.length > 0 ? totalRoyality?.toFixed(3) : `0`}
                </span>
              </div>
              {royaltiesList?.length > 0 && (
                <>
                  {/* <button
                    onClick={claimAllRoyalty}
                    className="contained-button font-bold py-1 px-3 rounded ml-3"
                  >
                    Claim All Royalties
                  </button> */}
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
              {royaltiesList?.length > 0 ? (
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
                          className={`${index < royaltiesList.length - 1 ? "border-b" : ""
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
                          <td className="py-4 px-5">{r.royalty_percent} %</td>
                          <td
                            className={`py-4 px-5  ${r.is_owner ? "text-info-1" : " text-success-1"
                              }`}
                          >
                            {r.is_owner ? "Owner" : "Member"}
                          </td>
                          <td className="py-4 px-5">${r.earnable_amount?.toFixed(3)}</td>
                          <td className="py-4 px-5">
                            {r.isLoading ? (
                              <div role="status" className="">
                                <svg
                                  aria-hidden="true"
                                  className=" w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-secondary-900"
                                  viewBox="0 0 100 101"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                  />
                                </svg>
                                <span className="sr-only">Loading...</span>
                              </div>
                            ) : (
                              <>
                                {r.earnable_amount > 0 && (
                                  <button
                                    onClick={() => claimRoyaltyById(r)}
                                    className="bg-primary-900/[.20] h-[32px] w-[57px] rounded text-primary-900"
                                  >
                                    Claim
                                  </button>
                                )}
                              </>
                            )}
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
              {royaltiesList?.length > 0 ? (
                <div>
                  {royaltiesList.map((r, index) => (
                    <div
                      key={index}
                      className={`my-8 py-7  ${index < royaltiesList.length - 1 ? "border-b" : ""
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
                        <div className="ml-auto">
                          {r.isLoading ? (
                            <div role="status" className="mr-10">
                              <svg
                                aria-hidden="true"
                                className=" w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-secondary-900"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill"
                                />
                              </svg>
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            <>
                              {r.earnable_amount > 0 && (
                                <button
                                  onClick={() => claimRoyaltyById(r)}
                                  className="bg-primary-900/[.20] h-[32px] w-[57px] rounded text-primary-900"
                                >
                                  Claim
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div>Percentage</div>
                          <div className="text-center">{r.royalty_percent}</div>
                        </div>
                        <div>
                          <div>Role</div>
                          <div
                            className={`text-centre ${r.is_owner ? "text-info-1" : " text-success-1"
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
                <div className="text-center ">
                  <h2 className="text-textSubtle mb-6">
                    You don't have any Royalty yet
                  </h2>
                </div>
              )}
            </div>
          </div>

          <div className="mb-[50px]">
            <div className="mb-5 flex px-4 flex-wrap">
              <h1>Your DAO</h1>
              <Link
                to={`/list/?type=dao&user=${id}`}
                className="contained-button  py-1 px-3 rounded ml-auto"
              >
                View All
              </Link>
            </div>

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
            <div className="mb-5 flex px-4 flex-wrap">
              <h1>Your Collection</h1>
              <Link
                to={`/list/?type=collection&user=true`}
                className="contained-button  py-1 px-3 rounded ml-auto"
              >
                View All
              </Link>
            </div>
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

          <div className="mb-[50px]">
            <div className="mb-5 flex px-4 flex-wrap">
              <h1>Minted NFTs List</h1>
              <Link
                to={`/list/?type=nft&user=${id}`}
                className="contained-button  py-1 px-3 rounded ml-auto"
              >
                View All
              </Link>
            </div>
            {mintedNftList.length > 0 ? (
              <Swiper
                breakpoints={settings}
                navigation={false}
                modules={[Navigation]}
                className={styles.createSwiper}
              >
                <div>
                  {mintedNftList.map((nft) => (
                    <SwiperSlide className={styles.nftCard} key={nft.id}>
                      <NFTListCard
                        nft={nft}
                        projectWork="ethereum"
                        refresh={onRefreshNft}
                        loading={nft.loading}
                      />
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper>
            ) : (
              <div className="text-center mt-6 text-textSubtle">
                <h2>You don't have any minted NFT yet</h2>
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
      {nftErrorModal && (
        <ErrorModal
          message={nftErrorModalMessage}
          buttonText={"Close"}
          handleClose={() => {
            setNftErrorModal(false);
            setNftErrorModalMessage("");
          }}
          show={nftErrorModal}
        />
      )}
    </>
  );
};
export default Profile;
