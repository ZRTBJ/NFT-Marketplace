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
  // bookmark end

  const [isLoading, setIsLoading] = useState(true);
  const [tabKey, setTabKey] = useState(0);
  const [walletAddress, setWalletAddress] = useState(null);

  let initialTabData = [
    {
      id: 0,
      name: "Dao Project List",
      list: projectList,
      hasMoreData: false,
    },
    { id: 1, name: "Works", list: workList, hasMoreData: false },
    { id: 2, name: "NFTs", list: nftList, hasMoreData: false },
    {
      id: 3,
      name: "Bookmark",
      list: bookmarkList,
      hasMoreData: false,
    },
  ];
  const [activeTab, setActiveTab] = useState(initialTabData[0]);
  const [tabData, setTabData] = useState(initialTabData);

  // function start
  async function userInfo() {
    await getUserInfo(id)
      .then((response) => {
        setUser(response.user);
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
    setActiveTab(initialTabData[index]);
  }
  function sortData(index) {
    activeTab.list = activeTab.list.reverse();
    setActiveTab(initialTabData[index]);
  }

  async function onScrollLoadMoreData() {
    if (activeTab.id === 0 && activeTab.hasMoreData) {
      activeTab.hasMoreData = false;
      await getProjectList();
    }
    if (activeTab.id === 3 && activeTab.hasMoreData) {
      activeTab.hasMoreData = false;
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
        if (e.data.length === projectListLimit) {
          const pageSize = projectListPageNumber + 1;
          setProjectListPageNumber(pageSize);
          if (activeTab.id === 0) {
            activeTab.hasMoreData = true;
          }
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
    if (walletAddress) {
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
            });
          });
          setNftList(nfts);
        }
      });
    }
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
        if (e.projects.length === bookmarkListLimit) {
          console.log("entry");
          const pageSize = bookmarkListPageNumber + 1;
          setbookmarkListPageNumber(pageSize);
          let oldTabData = [...tabData];
          oldTabData[3].hasMoreData = true;
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
  useEffect(() => {
    getNftList();
  }, []);
  useEffect(() => {
    getBookmarks();
  }, []);
  useEffect(() => {
    setProjectList(projectList);
    let oldTabData = [...tabData];
    oldTabData[0].list = projectList;
    setTabData(oldTabData);
  }, [projectList]);
  useEffect(() => {
    setNftList(nftList);
    let oldTabData = [...tabData];
    oldTabData[2].list = nftList;
    setTabData(oldTabData);
  }, [nftList]);
  useEffect(() => {
    setWorkList(workList);
    let oldTabData = [...tabData];
    oldTabData[1].list = workList;
    setTabData(oldTabData);
  }, [workList]);
  useEffect(() => {
    setBookmarkList(bookmarkList);
    let oldTabData = [...tabData];
    oldTabData[3].list = bookmarkList;
    setTabData(oldTabData);
  }, [bookmarkList]);

  // console.log(activeTab);

  return (
    <>
      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <main className="container mx-auto px-4">
          {/* Cover image section */}
          <section className="mt-5 rounded-3xl">
            {user.cover === "" ? (
              <img
                src={profileDummy}
                className="rounded-3xl object-cover md:h-[217px] w-full"
                alt="Profile Cover "
              />
            ) : (
              <img
                src={user.cover}
                className="rounded-3xl object-cover md:h-[217px] w-full"
                alt="Profile Cover "
              />
            )}
          </section>

          {/* profile information section */}
          <section className="flex flex-col md:flex-row pt-5 md:pt-14">
            <div className="md:w-2/3 text-white">
              <div className="flex">
                {user.avatar === "" ? (
                  <img
                    src={profile}
                    className="rounded-lg self-start w-14 h-14 md:w-[98px] object-cover md:h-[98px] bg-color-ass-6"
                    alt="User profile"
                  />
                ) : (
                  <img
                    className="rounded-lg self-start w-14 h-14 md:w-[98px] object-cover md:h-[98px] bg-color-ass-6"
                    src={user.avatar}
                    width={98}
                    alt="Muhammad Rifat Abubakar"
                  />
                )}

                <div className="flex-1 min-w-0  px-4">
                  <h1 className="-mt-1 mb-1 md:mb-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {user.display_name}
                  </h1>
                  <p className="flex">
                    <svg
                      className="mt-1 mr-1"
                      width="14"
                      height="16"
                      viewBox="0 0 14 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.2556 2.76562C10.9417 1.35937 9.00948 0.5 7 0.5C4.99052 0.5 3.05833 1.28125 1.74444 2.76562C0.662416 4.01562 0.121403 5.57812 0.275979 7.14062C0.275979 7.45312 0.353266 7.76562 0.430554 8C1.12614 11.2812 4.68137 14.1719 6.22712 15.2656C6.45899 15.4219 6.69085 15.5 7 15.5C7.30915 15.5 7.54101 15.4219 7.77288 15.2656C9.24134 14.1719 12.8739 11.2812 13.5694 8C13.6467 7.76562 13.6467 7.45312 13.724 7.14062C13.8786 5.57812 13.3376 4.01562 12.2556 2.76562ZM7 9.48438C5.84069 9.48438 4.83595 8.54687 4.83595 7.29687C4.83595 6.04687 5.7634 5.10937 7 5.10937C8.2366 5.10937 9.16405 6.04687 9.16405 7.29687C9.16405 8.54687 8.15931 9.48438 7 9.48438Z"
                        fill="#D35252"
                      />
                    </svg>
                    {user.area}
                  </p>
                  <p className="flex">
                    <svg
                      className="mt-1 mr-1"
                      width="14"
                      height="16"
                      viewBox="0 0 14 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.2556 2.76562C10.9417 1.35937 9.00948 0.5 7 0.5C4.99052 0.5 3.05833 1.28125 1.74444 2.76562C0.662416 4.01562 0.121403 5.57812 0.275979 7.14062C0.275979 7.45312 0.353266 7.76562 0.430554 8C1.12614 11.2812 4.68137 14.1719 6.22712 15.2656C6.45899 15.4219 6.69085 15.5 7 15.5C7.30915 15.5 7.54101 15.4219 7.77288 15.2656C9.24134 14.1719 12.8739 11.2812 13.5694 8C13.6467 7.76562 13.6467 7.45312 13.724 7.14062C13.8786 5.57812 13.3376 4.01562 12.2556 2.76562ZM7 9.48438C5.84069 9.48438 4.83595 8.54687 4.83595 7.29687C4.83595 6.04687 5.7634 5.10937 7 5.10937C8.2366 5.10937 9.16405 6.04687 9.16405 7.29687C9.16405 8.54687 8.15931 9.48438 7 9.48438Z"
                        fill="#D35252"
                      />
                    </svg>
                    {user.job}
                  </p>
                </div>
              </div>

              <div className="md:pl-28">
                <p className="md:pl-1">{user.biography}</p>
              </div>
            </div>

            <div
              className="flex flex-wrap mt-3 md:justify-end md:w-1/3  md:mt-0"
              role="group"
            >
              {sncList &&
                sncList.map((snc, index) => (
                  <>
                    {snc.url !== "" && (
                      <div
                        key={`snc-${index}`}
                        className="cursor-pointer w-12 h-12 mb-4 bg-primary-50 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-primary-400"
                      >
                        {snc.title.search("webLink") ? (
                          <div className="inline-flex p-1.5">
                            <a href={snc.url} target="_blank" rel="noreferrer">
                              <img
                                className="cp"
                                src={require(`assets/images/profile/social/${snc.title}.png`)}
                                height={24}
                                width={24}
                                alt="social logo"
                              />
                            </a>
                          </div>
                        ) : (
                          <>
                            <div className="inline-flex p-1.5">
                              <a
                                href={snc.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <i
                                  className="fa fa-link text-[white]"
                                  aria-hidden="true"
                                ></i>
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                ))}
            </div>
          </section>

          {/* Views followers section */}

          <section className="flex justify-center pt-4 md:pt-10">
            <div className="inline-flex py-4 text-white text-center">
              <div className="border-r border-color-ass px-5 last:border-0">
                <strong className="display-block font-black font-satoshi-bold text-[22px]">
                  {user?.data?.total_view}
                </strong>
                <span>Views</span>
              </div>

              <div className="border-r border-color-ass px-5 last:border-0">
                <strong className="display-block font-black font-satoshi-bold text-[22px]">
                  {user?.data?.total_follow}
                </strong>
                <span>Followers</span>
              </div>

              <div className="border-r border-color-ass px-5 last:border-0">
                <strong className="display-block font-black font-satoshi-bold text-[22px]">
                  {user?.data?.total_work}
                </strong>
                <span>Works</span>
              </div>
            </div>
          </section>

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
                />
              </InfiniteScroll>
            )}
          </div>
        </main>
      )}
    </>
  );
};
export default Profile;
