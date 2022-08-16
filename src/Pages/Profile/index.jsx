import { useState, useEffect } from "react";
import "assets/css/profile.css";
import DefaultProfilePicture from "assets/images/profile/defaultProfile.svg";
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
import Tab from "components/profile/Tab";
import ProfileImage from "assets/images/createDAO/user.svg";
import CoverImage from "assets/images/createDAO/cover.svg";
import CirclePlus from "assets/images/createDAO/circle-plus.svg";
import NFTSample from "assets/images/createDAO/nft-sample.svg";
import {
  getUserProjectListById,
  getExternalNftList,
  getProjectCategory,
} from "services/project/projectService";
import {
  getUserInfo,
  getUserBookmarkedProjectList,
} from "services/User/userService";
import { Link, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { getNftListByUserId } from "services/nft/nftService";

const Profile = () => {
  SwiperCore.use([Autoplay]);
  // User general data start
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [websiteList, setWebsiteList] = useState([]);
  const [sncList, setsncList] = useState([]);
  const socialLinks = [
    { title: "linkInsta", icon: "instagram", value: "" },
    { title: "linkReddit", icon: "reddit", value: "" },
    { title: "linkTwitter", icon: "twitter", value: "" },
    { title: "linkFacebook", icon: "facebook", value: "" },
    { title: "webLink1", icon: "link", value: "" },
  ];

  // user General data end

  // project category List start
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  async function projectCategory() {
    await getProjectCategory()
      .then((response) => {
        setProjectCategoryList(response.categories);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }
  // project category List end

  // 4 Tab Data

  // project List start
  const [projectList, setProjectList] = useState([]);
  const [projectListPageNumber, setProjectListPageNumber] = useState(1);
  const [projectListLimit, setProjectListLimit] = useState(10);
  const [projectListHasMoreData, setprojectListHasMoreData] = useState(false);
  // project List End

  // works start
  const [workList, setWorkList] = useState([]);
  const [workListPageNumber, setWorkListPageNumber] = useState(1);
  const [workListLimit, setworkListLimit] = useState(10);
  // works end

  // external nft start
  const [nftList, setNftList] = useState([]);
  // external nft end

  // bookmark start
  const [bookmarkList, setBookmarkList] = useState([]);
  const [bookmarkListPageNumber, setbookmarkListPageNumber] = useState(1);
  const [bookmarkListLimit, setBookmarkListLimit] = useState(10);
  const [bookmarkListHasMoreData, setBookmarkListHasMoreData] = useState(false);
  // bookmark end

  // Royalties start
  const [royaltiesListSortBy, setRoyaltiesListSortBy] = useState("default");
  const royaltiesSortByList = [
    { id: 1, name: "Revenue" },
    { id: 2, name: "Name" },
    { id: 3, name: "Percentage" },
  ];
  const [royaltiesList, setRoyalitiesList] = useState([
    {
      id: 1,
      projectIcon: DefaultProjectLogo,
      projectName: "The Dark Web",
      percentage: "15%",
      role: "Owner",
      totalRevenue: "$5291",
    },
    {
      id: 2,
      projectIcon: DefaultProjectLogo,
      projectName: "Mint World",
      percentage: "50%",
      role: "Member",
      totalRevenue: "$4291",
    },
    {
      id: 3,
      projectIcon: DefaultProjectLogo,
      projectName: "Mint World",
      percentage: "50%",
      role: "Member",
      totalRevenue: "$4291",
    },
  ]);
  async function onRoyaltiesListSort(e) {
    setRoyaltiesListSortBy(e.target.value);
  }
  // Royalties End

  const [isLoading, setIsLoading] = useState(true);
  const [tabKey, setTabKey] = useState(0);
  const [walletAddress, setWalletAddress] = useState(null);

  let initialTabData = [
    {
      id: 0,
      name: "DAO",
      list: projectList,
      hasMoreData: false,
    },
    { id: 1, name: "Collection", list: nftList, hasMoreData: false },
    { id: 2, name: "NFT's", list: workList, hasMoreData: false },
  ];
  const [activeTab, setActiveTab] = useState(initialTabData[0]);
  const [tabData, setTabData] = useState(initialTabData);

  const DAO_ITEMS = [
    {
      id: 0,
      name: "BoredApeYatchClub",
      value: "1.000.000",
      coverImage: CoverImage,
      profileImage: ProfileImage,
      users: [
        { id: 0, profileImage: ProfileImage },
        { id: 1, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
        { id: 4, profileImage: ProfileImage },
        { id: 5, profileImage: ProfileImage },
      ],
    },
    {
      id: 1,
      name: "BoredApeYatchClub",
      value: "1.000.000",
      coverImage: CoverImage,
      profileImage: ProfileImage,
      users: [
        { id: 0, profileImage: ProfileImage },
        { id: 1, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
        { id: 4, profileImage: ProfileImage },
        { id: 5, profileImage: ProfileImage },
        { id: 6, profileImage: ProfileImage },
        { id: 7, profileImage: ProfileImage },
        { id: 8, profileImage: ProfileImage },
        { id: 9, profileImage: ProfileImage },
      ],
    },
    {
      id: 2,
      name: "BoredApeYatchClub",
      value: "1.000.000",
      coverImage: CoverImage,
      profileImage: ProfileImage,
      users: [
        { id: 0, profileImage: ProfileImage },
        { id: 1, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
        { id: 4, profileImage: ProfileImage },
        { id: 5, profileImage: ProfileImage },
        { id: 6, profileImage: ProfileImage },
        { id: 7, profileImage: ProfileImage },
        { id: 8, profileImage: ProfileImage },
        { id: 9, profileImage: ProfileImage },
      ],
    },
    {
      id: 3,
      name: "BoredApeYatchClub",
      value: "1.000.000",
      coverImage: CoverImage,
      profileImage: ProfileImage,
      users: [
        { id: 0, profileImage: ProfileImage },
        { id: 1, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
        { id: 4, profileImage: ProfileImage },
        { id: 5, profileImage: ProfileImage },
        { id: 6, profileImage: ProfileImage },
        { id: 7, profileImage: ProfileImage },
        { id: 8, profileImage: ProfileImage },
        { id: 9, profileImage: ProfileImage },
      ],
    },
    {
      id: 4,
      name: "BoredApeYatchClub",
      value: "1.000.000",
      coverImage: CoverImage,
      profileImage: ProfileImage,
      users: [
        { id: 0, profileImage: ProfileImage },
        { id: 1, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
        { id: 4, profileImage: ProfileImage },
        { id: 5, profileImage: ProfileImage },
        { id: 6, profileImage: ProfileImage },
        { id: 7, profileImage: ProfileImage },
        { id: 8, profileImage: ProfileImage },
        { id: 9, profileImage: ProfileImage },
      ],
    },
  ];

  const COLLECTION_ITEMS = [
    {
      id: 0,
      name: "NFT Collection #1",
      image: NFTSample,
      description: "There are many variations of passages of Lorem",
      nfts: [
        { id: 0, profileImage: ProfileImage },
        { id: 1, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
      ],
    },
    {
      id: 1,
      name: "NFT Collection #2",
      image: NFTSample,
      description: "There are many variations of passages of Lorem",
      nfts: [
        { id: 0, profileImage: ProfileImage },
        { id: 1, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
      ],
    },
    {
      id: 2,
      name: "NFT Collection #3",
      image: NFTSample,
      description: "There are many variations of passages of Lorem",
      nfts: [
        { id: 0, profileImage: ProfileImage },
        { id: 1, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
      ],
    },
    {
      id: 3,
      name: "NFT Collection #3",
      image: NFTSample,
      description: "There are many variations of passages of Lorem",
      nfts: [
        { id: 0, profileImage: ProfileImage },
        { id: 1, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
      ],
    },
    {
      id: 4,
      name: "NFT Collection #3",
      image: NFTSample,
      description: "There are many variations of passages of Lorem",
      nfts: [
        { id: 0, profileImage: ProfileImage },
        { id: 1, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
        { id: 2, profileImage: ProfileImage },
        { id: 3, profileImage: ProfileImage },
      ],
    },
  ];

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

  // function start
  async function userInfo() {
    await getUserInfo(id)
      .then((response) => {
        setUser(response.user);
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

  function OnSetActive(index) {
    console.log(index);
    let activeTabs = initialTabData[index];
    console.log(activeTabs);
    setActiveTab(activeTabs);
  }
  function sortData(index) {
    activeTab.list = activeTab.list.reverse();
    setActiveTab(initialTabData[index]);
  }

  async function onScrollLoadMoreData() {
    if (projectListHasMoreData) {
      await getProjectList();
    }
  }

  async function onScrollLoadMoreDataBookmark() {
    if (bookmarkListHasMoreData) {
      await getBookmarks();
    }
  }
  async function getProjectList() {
    let payload = {
      id: id,
      page: projectListPageNumber,
      perPage: projectListLimit,
    };
    await getUserProjectListById(payload).then((e) => {
      if (e.data !== null) {
        let projectListCards = [];
        const key = "id";
        const uniqueProjectList = [
          ...new Map(e.data.map((item) => [item[key], item])).values(),
        ];
        uniqueProjectList.forEach((element) => {
          element.showMembersTag = true;
        });
        projectListCards = uniqueProjectList;
        setTabKey((pre) => pre + 1);
        const projects = projectList.concat(projectListCards);
        setProjectList(projects);
        setprojectListHasMoreData(false);
        if (e.data.length === projectListLimit) {
          const pageSize = projectListPageNumber + 1;
          setProjectListPageNumber(pageSize);
          setprojectListHasMoreData(true);
        }
      }
      setIsLoading(false);
    });
  }

  async function getWorksList() {
    let payload = {
      userId: id,
      page: workListPageNumber,
      perPage: workListLimit,
    };
    await getNftListByUserId(payload)
      .then((e) => {
        if (e.code === 0 && e.nfts !== null) {
          e.nfts.forEach((element) => {
            element.isNft = true;
          });
          // if (e.nfts.length === workListLimit) {
          //   let pageSize = workListPageNumber + 1;
          //   setWorkListPageNumber(pageSize);
          //   activeTab.hasMoreData = true;
          // }
          // const nfts = workList.concat(e.nfts);

          setWorkList(e.nfts);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }
  async function getNftList() {
    let type = "";
    if (window.ethereum.networkVersion === "80001") {
      type = "eth";
    }
    getExternalNftList(walletAddress, type).then((res) => {
      const key = "id.tokenId";
      let nfts = [];
      const uniqueNftList = [
        ...new Map(
          res.external_nft.ownedNfts.map((item) => [
            item["id"]["tokenId"],
            item,
          ])
        ).values(),
      ];
      if (uniqueNftList.length > 0) {
        uniqueNftList.forEach((element) => {
          nfts.push({
            id: element.id.tokenId,
            path: element.metadata.image,
            name: element.title,
            details: element,
            isNft: true,
            isExternalNft: true,
          });
        });
        setNftList(nfts);
      }
    });
  }
  async function getBookmarks() {
    let payload = {
      userID: id,
      page: bookmarkListPageNumber,
      limit: bookmarkListLimit,
    };
    await getUserBookmarkedProjectList(payload).then((e) => {
      if (e.projects !== null) {
        let bookmarkProjectListCards = [];
        const key = "id";
        const uniqueProjectList = [
          ...new Map(e.projects.map((item) => [item[key], item])).values(),
        ];
        uniqueProjectList.forEach((element) => {
          element.showMembersTag = true;
        });
        bookmarkProjectListCards = uniqueProjectList;
        // setTabKey((pre) => pre + 1);
        const projects = bookmarkList.concat(bookmarkProjectListCards);
        setBookmarkList(projects);
        let oldTabData = [...tabData];
        oldTabData[3].list = projects;
        oldTabData[3].hasMoreData = true;

        setTabData(oldTabData);
        setBookmarkListHasMoreData(false);

        if (e.projects.length === bookmarkListLimit) {
          const pageSize = bookmarkListPageNumber + 1;
          setbookmarkListPageNumber(pageSize);
          setBookmarkListHasMoreData(true);
        }
      }
    });
  }

  useEffect(() => {
    projectCategory();
  }, []);
  useEffect(() => {
    setProjectCategoryList(projectCategoryList);
  }, [projectCategoryList]);

  useEffect(() => {
    userInfo();
  }, []);

  useEffect(() => {
    setUser(user);
    setWalletAddress(user.eao);
  }, [user]);
  useEffect(() => {
    getProjectList();
  }, []);
  useEffect(() => {
    getWorksList();
  }, []);
  // useEffect(() => {
  //   getNftList();
  // }, []);
  // useEffect(() => {
  //   getBookmarks();
  // }, []);
  useEffect(() => {
    setProjectList(projectList);
    let oldTabData = [...tabData];
    oldTabData[0].list = projectList;
    setTabData(oldTabData);
  }, [projectList]);
  useEffect(() => {
    setNftList(nftList);
    let oldTabData = [...tabData];
    oldTabData[1].list = nftList;
    setTabData(oldTabData);
  }, [nftList]);
  useEffect(() => {
    setWorkList(workList);
    let oldTabData = [...tabData];
    oldTabData[2].list = workList;
    setTabData(oldTabData);
  }, [workList]);
  // useEffect(() => {
  //   setBookmarkList(bookmarkList);
  //   let oldTabData = [...tabData];
  //   oldTabData[3].list = bookmarkList;
  //   setTabData(oldTabData);
  // }, [bookmarkList]);
  return (
    <>
      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <main className="container mx-auto">
          {/* profile information section */}
          <div className="flex flex-wrap mt-[16px] justify-between">
            <div className="md:mr-4 flex flex-wrap  bg-white-shade-900 flex-1 rounded rounded-[8px] p-[13px] md:p-[20px]">
              <div>
                <div className="flex">
                  <img
                    src={
                      user.avatar === "" ? DefaultProfilePicture : user.avatar
                    }
                    className="rounded-lg self-start  w-[102px] object-cover h-[102px]"
                    alt={user.display_name + "profile picture"}
                  />
                  <div className="flex-1 min-w-0  pl-[20px]">
                    <h3 className="text-ellipsis text-txtblack mb-[4px] overflow-hidden whitespace-nowrap font-black text-[18px]">
                      {user.display_name}
                    </h3>
                    <p className="text-[13px] text-textSubtle ">
                      {user?.eoa?.slice(0, 20)}..{" "}
                      <i
                        onClick={() => {
                          navigator.clipboard.writeText(user.eoa);
                        }}
                        className="fa-solid  fa-copy cursor-pointer pl-[6px]"
                      ></i>
                    </p>
                    <p className="flex items-center mb-[3px]">
                      <i className="fa-solid fa-map-pin mr-[7px] text-danger-1 text-[12px]"></i>
                      <span className="text-[13px] text-txtblack">
                        {user.area}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <i className="fa-solid fa-briefcase mr-[7px] text-danger-1 text-[12px]"></i>
                      <span className="text-[13px] text-txtblack">
                        {user.job}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap mt-3  ml-auto md:mt-0">
                {sncList &&
                  sncList.map((snc, index) => (
                    <div key={`snc-${index}`}>
                      {snc.url !== "" && (
                        <div
                          key={`snc-${index}`}
                          className="cursor-pointer mr-4 w-[44px] h-[44px] mb-4 bg-primary-900/[.09] flex justify-center  items-center rounded-md "
                        >
                          {snc.title.toLowerCase().match("weblink") ? (
                            <div className="">
                              <a
                                href={snc.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <i
                                  className="fa fa-link text-[20px] text-primary-900 mt-1"
                                  aria-hidden="true"
                                ></i>
                              </a>
                            </div>
                          ) : (
                            <a href={snc.url} target="_blank" rel="noreferrer">
                              <i
                                className={`fa-brands fa-${
                                  socialLinks.find((x) => x.title === snc.title)
                                    .icon
                                } text-[20px] text-primary-900 mt-1`}
                              ></i>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div
              className="px-4 text-white-shade-900   h-[152px] bg-primary-900 rounded rounded-[8px]"
              style={{ boxShadow: "12px 12px 24px #D5BAFF" }}
            >
              <h3 className="ml-[24px] mt-[24px] text-[18px] font-black ">
                Total Earned Amount
              </h3>
              <h1 className="font-black text-[28px] ml-[24px] mt-[8px]">
                $1.505
              </h1>
              <p className="ml-[24px] mt-[8px] flex flex-wrap align-center">
                <div className="bg-success-1 h-[26px] w-[26px]  rounded-full">
                  <i className="fa-solid fa-up text-[#FFFF] ml-1.5  mt-[3px] text-[20px]"></i>
                </div>
                <p className="text-[14px] ml-2">
                  Increased 50% since last month
                </p>
              </p>
            </div>
          </div>
          {/* Royalties Table */}
          <div className="mt-[41px] mb-[36px] pt-[30px] pl-[24px] pr-[24px] pb-[35px] bg-white-shade-900 rounded-[8px]">
            <div className="flex flex-wrap item-center mb-[24px]">
              <h2 className="text-[24px] mb-3">Royalties</h2>
              <div className="flex  flex-wrap items-center md:ml-auto">
                <p className="mr-4 mb-3">
                  <span className="text-txtblack mr-2">Total Royalties:</span>
                  <span className="text-txtblack font-black">$1.505</span>
                </p>
                <button className="mb-4 text-primary-900 font-bold bg-primary-900/[0.1] py-1 px-3 rounded mr-4">
                  Claim All Royalties
                </button>
                <select
                  className="w-[120PX] h-[32px] mb-4 bg-white-shade-900 pl-2 outline-none text-textSubtle border border-[#C7CEE5]"
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
                </select>
              </div>
            </div>
            <div className="overflow-x-auto relative mb-[54px]">
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
                      Percentage
                    </th>
                    <th scope="col" className="px-5">
                      Role
                    </th>
                    <th scope="col" className="px-5">
                      Total Revenue
                    </th>
                    <th scope="col" className="px-5">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {royaltiesList.map((r, index) => (
                    <tr
                      key={r.id}
                      className={`${
                        index < royaltiesList.length - 1 ? "border-b" : ""
                      } text-left text-txtblack text-[14px]`}
                    >
                      <td className="py-4 px-5">
                        <img
                          src={r.projectIcon}
                          className="h-[34px] w-[34px] object-cover rounded-full"
                          alt={r.projectName + "logo"}
                        />
                      </td>
                      <td className="py-4 px-5 font-black ">{r.projectName}</td>
                      <td className="py-4 px-5">{r.percentage}</td>
                      <td
                        className={`py-4 px-5  ${
                          r.role === "Owner" ? "text-info-1" : " text-success-1"
                        }`}
                      >
                        {r.role}
                      </td>
                      <td className="py-4 px-5">{r.totalRevenue}</td>
                      <td className="py-4 px-5">
                        <button className="bg-secondary-900/[.20] h-[32px] w-[57px] rounded text-secondary-900">
                          Claim
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center space-x-1 ">
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
            </div>
          </div>

          {/* <div className="mb-[50px]">
            <h1 className="text-[28px] mb-[36px] font-black">Your DAO</h1>
            <Swiper
              breakpoints={{
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
              }}
              className="swipe-card"
              navigation={false}
              modules={[Navigation]}
            >
              <Swiper
                breakpoints={settings}
                navigation={true}
                modules={[Navigation]}
                className={styles.createSwiper}
              >
                <div>
                  {DAO_ITEMS.map((item) => (
                    <SwiperSlide key={item.id} className={styles.daoCard}>
                      <DAOCard item={item} key={item.id} />
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper>
            </Swiper>
          </div>

          <div className="mb-[50px]">
            <h1 className="text-[28px] mb-[36px] font-black">Collection</h1>
            <Swiper
              breakpoints={settings}
              navigation={false}
              modules={[Navigation]}
              className={styles.createSwiper}
            >
              <div>
                {COLLECTION_ITEMS.map((item) => (
                  <SwiperSlide key={item.id} className={styles.nftCard}>
                    <NFTCard item={item} key={item.id} />
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>
          </div> */}

          {/* {activeTab.id === 0 && (
            <div>
              {!isLoading && (
                <InfiniteScroll
                  dataLength={projectList} //This is important field to render the next data
                  next={onScrollLoadMoreData}
                  hasMore={projectListHasMoreData}
                >
                  <Tab
                    tabs={tabData}
                    key={tabKey}
                    OnSetActive={OnSetActive}
                    sortData={sortData}
                    active={initialTabData[0]}
                  />
                </InfiniteScroll>
              )}
            </div>
          )}
          {activeTab.id === 1 && (
            <div>
              {!isLoading && (
                <InfiniteScroll
                  dataLength={activeTab.list.length} //This is important field to render the next data
                  next={onScrollLoadMoreData}
                  hasMore={activeTab.hasMoreData}
                >
                  <Tab
                    tabs={tabData}
                    key={tabKey}
                    OnSetActive={OnSetActive}
                    sortData={sortData}
                    active={activeTab}
                  />
                </InfiniteScroll>
              )}
            </div>
          )}
          {activeTab.id === 2 && (
            <div>
              {!isLoading && (
                <InfiniteScroll
                  dataLength={activeTab.list.length} //This is important field to render the next data
                  next={onScrollLoadMoreData}
                  hasMore={activeTab.hasMoreData}
                >
                  <Tab
                    tabs={tabData}
                    key={tabKey}
                    OnSetActive={OnSetActive}
                    sortData={sortData}
                    active={activeTab}
                  />
                </InfiniteScroll>
              )}
            </div>
          )} */}
        </main>
      )}
    </>
  );
};
export default Profile;
