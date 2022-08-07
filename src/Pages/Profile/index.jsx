import { useState, useEffect } from "react";
import "assets/css/profile.css";
import profile from "assets/images/profile/profile.svg";
import profileDummy from "assets/images/profile/profile-dummy.svg";
import Tab from "components/profile/Tab";
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
  // User general data start
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [websiteList, setWebsiteList] = useState([]);
  const [sncList, setsncList] = useState([]);
  const socialLinks = [
    { title: "linkInsta", icon: "instagram" },
    { title: "linkReddit", icon: "reddit" },
    { title: "linkTwitter", icon: "twitter" },
    { title: "linkFacebook", icon: "facebook" },
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
        <main className="container">
          {/* profile information section */}
          <div className="flex flex-wrap">
            <div className="flex-1 md:mr-4 flex flex-wrap bg-white md:h-[152px] rounded rounded-[8px] p-[13px] md:p-[26px]">
              <div>
                <div className="flex">
                  {user.avatar === "" ? (
                    <img
                      src={profile}
                      className="rounded-lg self-start w-14 h-14 md:w-[102px] object-cover md:h-[102px] bg-color-ass-6"
                      alt="User profile"
                    />
                  ) : (
                    <img
                      className="rounded-lg self-start w-14 h-14 md:w-[102px] object-cover md:h-[102px] bg-color-ass-6"
                      src={user.avatar}
                      width={98}
                      alt="user profile"
                    />
                  )}

                  <div className="flex-1 min-w-0  pl-[20px]">
                    <h3 className="text-ellipsis mb-[4px] overflow-hidden whitespace-nowrap font-black text-[18px]">
                      {user.display_name}
                    </h3>
                    <p className="text-[13px] text-[#7D849D] ">
                      {user?.eoa?.slice(0, 14)}..{" "}
                      <i
                        onClick={() => {
                          navigator.clipboard.writeText(user.eoa);
                        }}
                        className="fa-solid  fa-copy cursor-pointer pl-[6px]"
                      ></i>
                    </p>
                    <p className="flex items-center mb-[3px]">
                      <i className="fa-solid fa-map-pin mr-[7px] text-[#FF3C3C] text-[12px]"></i>
                      <span className="text-[13px] text-[#303548]">
                        {user.area}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <i className="fa-solid fa-briefcase mr-[7px] text-[#FF3C3C] text-[12px]"></i>
                      <span className="text-[13px] text-[#303548]">
                        {user.job}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex flex-wrap mt-3 md:ml-auto  md:mt-0"
                role="group"
              >
                {sncList &&
                  sncList.map((snc, index) => (
                    <div key={`snc-${index}`}>
                      {snc.url !== "" && (
                        <div
                          key={`snc-${index}`}
                          className="cursor-pointer mr-4 w-[44px] h-[44px] mb-4 bg-social-icon-bg flex justify-center gap-2 items-center rounded-md  ease-in-out duration-300 "
                        >
                          {snc.title.toLowerCase().match("weblink") ? (
                            <div className="">
                              <a
                                href={snc.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <i
                                  className="fa fa-link text-[20px] text-[#9A5AFF] mt-1"
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
                                } text-[20px] text-[#9A5AFF] mt-1`}
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
              className="w-full text-[#FFFFFF]  md:max-w-[347px]  h-[152px] bg-[#9A5AFF] rounded rounded-[8px]"
              style={{ boxShadow: "12px 12px 24px #D5BAFF" }}
            >
              <h3 className="ml-[24px] mt-[24px] text-[18px] font-black ">
                Total Earned Amount
              </h3>
              <h1 className="font-black text-[28px] ml-[24px] mt-[8px]">
                $1.505
              </h1>
              <p className="ml-[24px] mt-[8px] flex flex-wrap align-center">
                <div className="bg-[#32E865] h-[26px] w-[26px]  rounded-full">
                  <i class="fa-solid fa-up text-[#FFFF] ml-1.5  mt-[3px] text-[20px]"></i>
                </div>
                <p className="text-[14px] ml-2">
                  Increased 50% since last month
                </p>
              </p>
            </div>
          </div>
          {/* Royalties Table */}
          <div className="h-[300px] mt-[41px] mb-[49px] w-full border border-[#9A5AFF]"></div>
          {activeTab.id === 0 && (
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
          )}
        </main>
      )}
    </>
  );
};
export default Profile;
