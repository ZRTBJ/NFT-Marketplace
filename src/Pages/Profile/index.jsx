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
import { getUserInfo } from "services/User/userService";
import { Link, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const Profile = () => {
  // User general data start
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [websiteList, setWebsiteList] = useState([]);
  const [sncList, setsncList] = useState([]);

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
            setWebsiteList(weblist);
          } catch {
            setWebsiteList([]);
          }
          try {
            const sociallinks = JSON.parse(response.user["social"]);
            const sncs = [...sociallinks].map((e) => ({
              title: Object.keys(e)[0],
              url: Object.values(e)[0],
            }));
            setsncList(sncs);
          } catch {
            setsncList([]);
          }
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }
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
  const [hasMoreData, setMoreProjectListData] = useState(false);

  // project List End

  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [tabKey, setTabKey] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [walletAddress, setWalletAddress] = useState(null);

  // work list

  const [workList, setWorkList] = useState([]);

  const [nftList, setNftList] = useState([]);
  const [bookmarkList, setBookmarkList] = useState([]);

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
  function OnSetActive(index) {
    setActiveTab(initialTabData[index]);
  }
  function sortData(index) {
    activeTab.list = activeTab.list.reverse();
    console.log(activeTab.list);
    // setTabKey((pre) => pre + 1);
    console.log(index);
    setActiveTab(initialTabData[index]);
  }

  async function onScrollLoadMoreData() {
    if (activeTab.hasMoreData) {
      activeTab.hasMoreData = false;
      await getProjectList();
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
          // element.category_name = projectCategoryList.find(
          //   (x) => x.id === element.category_id
          // ).name;
          // element.showOverview = true;
          element.showMembersTag = true;
        });
        projectListCards = uniqueProjectList;
        setTabKey((pre) => pre + 1);
        const projects = projectList.concat(projectListCards);
        setProjectList(projects);
        if (e.data.length === limit) {
          const pageSize = page + 1;
          setProjectListPageNumber(pageSize);
          activeTab.hasMoreData = true;
        }
      }
      setIsLoading(false);
    });
  }

  // async function getWorksList() {
  //   let payload = {
  //     userId: id,
  //     page: page,
  //     perPage: limit,
  //   };
  //   // setIsLoading(true);
  //   await getNftListByProjectId(payload)
  //     .then((e) => {
  //       if (e.code === 0 && e.nfts !== null) {
  //         if (e.nfts.length === limit) {
  //           let pageSize = page + 1;
  //           setPage(pageSize);
  //           setHasMore(true);
  //         }
  //         e.nfts.forEach((element) => {
  //           element.isNft = true;
  //         });
  //         const nfts = nftList.concat(e.nfts);
  //         setNftList(nfts);
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch(() => {
  //       setIsLoading(false);
  //     });
  // }
  async function getNftList() {
    let address = localStorage.getItem("walletAddress");
    setWalletAddress(address);
    let type = "";
    if (window.ethereum.networkVersion === "80001") {
      type = "eth";
    }
    if (address !== null) {
      getExternalNftList(address, type).then((res) => {
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
  async function getBookmarks() {}

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
  }, [user]);

  useEffect(() => {
    getProjectList();
  }, []);
  useEffect(() => {
    getNftList();
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
              <div className="cursor-pointer w-12 h-12 bg-primary-50 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-primary-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="18"
                  height="19"
                  fill="none"
                  viewBox="0 0 18 19"
                >
                  <path fill="url(#pattern0)" d="M0 0.75H18V18.25H0z"></path>
                  <defs>
                    <pattern
                      id="pattern0"
                      width="1"
                      height="1"
                      patternContentUnits="objectBoundingBox"
                    >
                      <use
                        transform="matrix(.00781 0 0 .00804 0 -.014)"
                        xlinkHref="#image0_1369_36749"
                      ></use>
                    </pattern>
                    <image
                      id="image0_1369_36749"
                      width="128"
                      height="128"
                      xlinkHref="data:image/png;base64,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"
                    ></image>
                  </defs>
                </svg>
              </div>

              <div className="cursor-pointer w-12 h-12 bg-primary-50 flex justify-center items-center rounded-md duration-300 ml-4 hover:bg-primary-400">
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="cursor-pointer w-12 h-12 bg-primary-50 flex justify-center items-center rounded-md duration-300 ml-4 hover:bg-primary-400">
                <svg
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.01537 9.38353C8.37031 8.75477 8.00806 7.90296 8.00806 7.0149C8.00806 6.12685 8.37031 5.27504 9.01537 4.64628L10.1962 3.49828C10.8424 2.87003 11.7188 2.51709 12.6327 2.51709C13.5465 2.51709 14.4229 2.87003 15.0691 3.49828C15.7153 4.12652 16.0784 4.97861 16.0784 5.86708C16.0784 6.75555 15.7153 7.60763 15.0691 8.23588L13.8883 9.38353C13.2416 10.0109 12.3654 10.3632 11.4519 10.3632C10.5383 10.3632 9.66206 10.0109 9.01537 9.38353ZM14.1274 4.41353C13.7307 4.02907 13.1935 3.81319 12.6334 3.81319C12.0733 3.81319 11.536 4.02907 11.1394 4.41353L9.95893 5.56153C9.57968 5.95009 9.37148 6.46727 9.37869 7.00289C9.38591 7.5385 9.60797 8.05021 9.99756 8.42897C10.3872 8.80774 10.9135 9.02363 11.4644 9.03065C12.0153 9.03766 12.5473 8.83525 12.9469 8.46653L14.1274 7.31853C14.5228 6.93295 14.7449 6.41064 14.7448 5.86613C14.7447 5.32162 14.5226 4.79936 14.127 4.41388L14.1274 4.41353Z"
                    fill="#5C008D"
                  />
                  <path
                    d="M2.98592 15.1587C2.34066 14.5299 1.97827 13.678 1.97827 12.7899C1.97827 11.9017 2.34066 11.0498 2.98592 10.4211L4.16672 9.27306C4.81291 8.64486 5.68932 8.29196 6.60314 8.29199C7.51697 8.29203 8.39335 8.64499 9.0395 9.27323C9.68564 9.90148 10.0486 10.7535 10.0486 11.642C10.0486 12.5304 9.68551 13.3825 9.03932 14.0107L7.85888 15.1587C7.21209 15.7858 6.33589 16.138 5.4224 16.138C4.50891 16.138 3.6327 15.7858 2.98592 15.1587ZM8.09792 10.1887C7.70136 9.80403 7.16407 9.58803 6.60392 9.58803C6.04376 9.58803 5.50648 9.80403 5.10992 10.1887L3.92912 11.3363C3.54986 11.7249 3.34166 12.242 3.34888 12.7777C3.35609 13.3133 3.57815 13.825 3.96774 14.2038C4.35734 14.5825 4.88366 14.7984 5.43458 14.8054C5.9855 14.8124 6.51746 14.61 6.91712 14.2413L8.09792 13.0937C8.4932 12.708 8.71512 12.1857 8.71505 11.6413C8.71498 11.0968 8.49293 10.5746 8.09756 10.189L8.09792 10.1887Z"
                    fill="#5C008D"
                  />
                  <path
                    d="M9.04137 9.27166C9.18554 9.41185 9.31673 9.5641 9.43341 9.72666C9.7477 9.94835 10.0986 10.1163 10.4709 10.2233L11.6715 9.05606C11.3409 9.0896 11.0069 9.04677 10.6965 8.93108C10.3862 8.81538 10.1083 8.63008 9.8855 8.39026C9.66272 8.15043 9.50132 7.86286 9.41444 7.55094C9.32756 7.23902 9.31766 6.91156 9.38553 6.59521L8.11401 7.83176C8.21458 8.22403 8.38794 8.59516 8.62557 8.92691C8.7733 9.031 8.91233 9.14628 9.04137 9.27166Z"
                    fill="#A259FF"
                  />
                  <path
                    d="M9.01754 9.38154C8.87336 9.24138 8.74217 9.08912 8.6255 8.92654C8.2914 8.69107 7.91624 8.51629 7.51814 8.41064L6.28442 9.60974C6.61229 9.56054 6.94746 9.58715 7.26277 9.68741C7.57808 9.78768 7.86465 9.95879 8.09923 10.1869C8.33381 10.4149 8.5098 10.6935 8.61293 11.0001C8.71607 11.3066 8.74344 11.6325 8.69282 11.9512L9.92654 10.7521C9.82317 10.3852 9.65587 10.0382 9.4319 9.72629C9.28467 9.62215 9.14613 9.50687 9.01754 9.38154Z"
                    fill="#A259FF"
                  />
                  <path
                    d="M6.73634 11.556L6.73058 11.5501C6.60723 11.4272 6.53915 11.2617 6.54131 11.09C6.54347 10.9183 6.6157 10.7544 6.7421 10.6345L10.4379 7.12889C10.5646 7.01071 10.7343 6.94599 10.9099 6.94882C11.0855 6.95165 11.2528 7.02181 11.3755 7.14401C11.4981 7.26622 11.5662 7.43058 11.5648 7.60133C11.5634 7.77207 11.4927 7.93538 11.3681 8.05569L7.67234 11.5613C7.54703 11.6804 7.37847 11.7466 7.20323 11.7456C7.028 11.7446 6.86024 11.6765 6.73634 11.556Z"
                    fill="#5C008D"
                  />
                </svg>
              </div>
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

          {/* {activeTab.name === "Dao Project List" && (
            <>
              {projectList.length === 0 && (
                <EmptyCaseCard type={"Project"}></EmptyCaseCard>
              )}
            </>
          )}
          {activeTab.name === "Works" && (
            <EmptyCaseCard type={"Work"}></EmptyCaseCard>
          )}
          {activeTab.name === "NFTs" && (
            <EmptyCaseCard type={"NFT"}></EmptyCaseCard>
          )}
          {activeTab.name === "Bookmark" && (
            <EmptyCaseCard type={"Bookmark"}></EmptyCaseCard>
          )} */}
        </main>
      )}

      {/* <div className={!isLoading ? "" : "loading"}></div>
      
      {!isLoading && (
        <div className="profilePageContainer">
          {user.cover === "" ? (
            <div className="ProfileBannerDefault"></div>
          ) : (
            <img src={user.cover} className="Profilebanner" alt="" />
          )}

          {user.avatar === "" ? (
            <img
              src={profile}
              className="userProfilePicture"
              alt="User profile"
            />
          ) : (
            <img
              src={user.avatar}
              className="userProfilePicture"
              alt="User profile"
            />
          )}
          <div className="userName">
            {user.first_name} {user.last_name}
          </div>
          <div className="profession">{user.job}</div>
          <div className="mt-2 flex justify-center">
            <img className="locationIcon" src={locationIcon} alt="" />
            <div className="address">
              {user.area} {user.country}
            </div>
          </div>
          <div className="intro">{user.biography}</div>
          <div className="statsContainer flex justify-center flex-wrap">
            <div className="stat">
              <div className="amount">{user.data.total_work}</div>
              <div className="statsTitle">Works</div>
            </div>
            <div className="stat">
              <div className="amount">{user.data.total_item}</div>
              <div className="statsTitle">Items</div>
            </div>
            <div className="stat">
              <div className="amount">{user.data.total_view}</div>
              <div className="statsTitle">Views</div>
            </div>
            <div className="stat">
              <div className="amount">{user.data.total_review}</div>
              <div className="statsTitle">Appreciations</div>
            </div>
            <div className="stat">
              <div className="amount">{user.data.total_follow}</div>
              <div className="statsTitle">Followers</div>
            </div>
          </div>
          {localStorage.getItem("user_id") === id ? (
            <></>
          ) : (
            <button
              className="followButton"
              onClick={() => setIsFollowing(true)}
            >
              FOLLOW
            </button>
          )}

          <div className="socialIconsContqainer">
            {sncList &&
              sncList.map((snc, index) => (
                <div key={`snc-${index}`}>
                  <div className="inline-flex p-1.5">
                    <a href={snc.url} target="_blank" rel="noreferrer">
                      <img
                        className="cp"
                        src={require(`assets/images/profile/social/ico_${snc.title}.svg`)}
                        height={24}
                        width={24}
                        alt="social logo"
                      />
                    </a>
                  </div>
                </div>
              ))}


            {-----comment----- {socialLinks.map((i) => (
              <img
                key={i.id}
                className="cp"
                src={require(`assets/images/profile/social/ico_${i.title}.svg`)}
                alt="social logo"
              />
            ))} -----comment----- }



          </div>
          <div className="portfolioButtonContainer">
            {websiteList.map((website, index) => (
              <button key={`web-${index}`}>
                <a href={website.url} target="_blank" rel="noreferrer">
                  {website.title}
                </a>
              </button>
            ))}
          </div>
          <div className="profileDivider"></div>
          <div>tabData
            {!isLoading && (
              <InfiniteScroll
                dataLength={userProjectList.length} //This is important field to render the next data
                next={onScrollLoadMoreData}
                hasMore={hasMore}
              >
                <Tab tabs={tab} key={tabKey} />
                {smallSpinnerLoading && <div className="onlySpinner"></div>}
              </InfiniteScroll>
            )}
          </div>
        </div>
      )} */}
    </>
  );
};
export default Profile;
