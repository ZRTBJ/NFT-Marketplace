import { useState, useEffect } from "react";
import "assets/css/profile.css";
import profile from "assets/images/profile/profile.svg";
import profileDummy from "assets/images/profile/profile-dummy.svg";
import locationIcon from "assets/images/profile/locationIcon.svg";
import noProject from "assets/images/profile/no-project.svg";
import emptyProject from "assets/images/profile/empty-project.svg";
import Tab from "components/profile/Tab";
import {
  getUserProjectListById,
  getExternalNftList,
} from "services/project/projectService";
import { getUserInfo } from "services/User/userService";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import Card from "components/profile/Card";


const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [userProjectList, setUserProjectList] = useState([]);
  const [tab, setTab] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [websiteList, setWebsiteList] = useState([]);
  const [sncList, setsncList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [tabKey, setTabKey] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [smallSpinnerLoading, setSmallSpinnerLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  async function fetchData() {
    if (hasMore) {
      setHasMore(false);
      setSmallSpinnerLoading(true);
      await userInfo();
      setSmallSpinnerLoading(false);
    }
  }

  async function userInfo() {
    await getUserInfo(id).then((response) => {
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
    });
    let payload = {
      id: id,
      page: page,
      perPage: limit,
    };
    let projectListCards = [];
    let nftList = [];
    await getUserProjectListById(payload).then((e) => {
      if (e && e.data) {
        const key = "id";
        const uniqueProjectList = [
          ...new Map(e.data.map((item) => [item[key], item])).values(),
        ];
        uniqueProjectList.forEach((element) => {
          let assets = element.assets.find((x) => x.asset_purpose === "cover");
          projectListCards.push({
            id: element.id,
            img: assets ? assets.path : "",
            title: element.name,
            type: element.project_type,
            bookmark: element.project_mark_count,
            like: element.project_like_count,
            view: element.project_view_count,
          });
        });
        if (e.data.length === limit) {
          let pageSize = page + 1;
          setPage(pageSize);
          setHasMore(true);
        }
        setTabKey((pre) => pre + 1);
      }
    });
    let address = localStorage.getItem("walletAddress");
    setWalletAddress(address);
    let type = "";
    if (window.ethereum.networkVersion === "80001") {
      type = "eth";
    }
    if (address !== null) {
      getExternalNftList(address, type).then((res) => {
        const key = "id.tokenId";
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
            nftList.push({
              id: element.id.tokenId,
              img: element.metadata.image,
              title: element.title,
              type: "",
              bookmark: "",
              like: "",
              view: "",
              details: element,
            });
          });
        }
      });
    }
    const projects = userProjectList.concat(projectListCards);
    setUserProjectList(projects);
    const tabData = [
      {
        id: 1,
        name: "PROJECT",
        cardList: projects,
      },
      {
        id: 2,
        name: "WORK",
        cardList: nftList,
      },
      // {
      //   id: 3,
      //   name: "COLLECTION",
      //   cardList: [],
      // },
    ];
    setTab(tabData);
    setIsLoading(false);
  }
  useEffect(() => {
    userInfo();
  }, []);
  return (



    <div className="container mx-auto">



      <section className="mb-4">
        <img src={profileDummy} className="rounded-3xl object-cover h-[212px] w-full" alt="Profile Cover image" />

        {/* 
         for no image 
        <div className="rounded-3xl h-[212px] w-full bg-white-shade-800"></div> */}

      </section>




      <section className="flex py-4">

        <div className="w-2/3 flex text-white">

          <img className="rounded-lg self-start" src={profile} width={98} height={98} alt="Muhammad Rifat Abubakar" />
          <div className="flex-1 px-4">
            <h1 className="-mt-1 mb-2 flex">
              Muhammad Rifat Abubakar
              <svg className="mt-2 ml-2" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.8274 2.89191L14.0084 0.19268C13.3503 -0.0643894 12.5606 -0.0643894 11.7708 0.19268L3.08343 2.89191C1.24066 3.40605 0.187642 5.077 0.582523 6.87649L2.03042 14.5886C2.68855 18.1875 4.53132 21.0153 7.29548 22.6863C9.79639 24.2287 11.6392 24.9999 13.0871 24.9999C14.535 24.9999 16.3777 24.2287 18.8786 22.6863C21.6428 21.0153 23.4856 18.1875 24.1437 14.5886L25.46 6.87649C25.7232 5.077 24.6702 3.40605 22.8274 2.89191ZM17.5624 10.4755L12.2973 15.6168C12.034 15.7454 11.9024 15.8739 11.6392 15.8739C11.3759 15.8739 11.1127 15.7454 10.981 15.6168L8.3485 13.0462C7.95362 12.6605 7.95362 12.0179 8.3485 11.6323C8.74338 11.2467 9.40151 11.2467 9.79639 11.6323L11.7708 13.5603L16.3777 9.06157C16.7726 8.67597 17.4307 8.67597 17.8256 9.06157C17.9572 9.57571 17.9572 10.0899 17.5624 10.4755Z" fill="#4A59E1" />
              </svg>

            </h1>
            <p className="flex">
              <svg className="mt-1 mr-1" width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.2556 2.76562C10.9417 1.35937 9.00948 0.5 7 0.5C4.99052 0.5 3.05833 1.28125 1.74444 2.76562C0.662416 4.01562 0.121403 5.57812 0.275979 7.14062C0.275979 7.45312 0.353266 7.76562 0.430554 8C1.12614 11.2812 4.68137 14.1719 6.22712 15.2656C6.45899 15.4219 6.69085 15.5 7 15.5C7.30915 15.5 7.54101 15.4219 7.77288 15.2656C9.24134 14.1719 12.8739 11.2812 13.5694 8C13.6467 7.76562 13.6467 7.45312 13.724 7.14062C13.8786 5.57812 13.3376 4.01562 12.2556 2.76562ZM7 9.48438C5.84069 9.48438 4.83595 8.54687 4.83595 7.29687C4.83595 6.04687 5.7634 5.10937 7 5.10937C8.2366 5.10937 9.16405 6.04687 9.16405 7.29687C9.16405 8.54687 8.15931 9.48438 7 9.48438Z" fill="#D35252" />
              </svg>

              Jakarta Indonesia
            </p>
            <p className="flex">
              <svg className="mt-1 mr-1" width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.2556 2.76562C10.9417 1.35937 9.00948 0.5 7 0.5C4.99052 0.5 3.05833 1.28125 1.74444 2.76562C0.662416 4.01562 0.121403 5.57812 0.275979 7.14062C0.275979 7.45312 0.353266 7.76562 0.430554 8C1.12614 11.2812 4.68137 14.1719 6.22712 15.2656C6.45899 15.4219 6.69085 15.5 7 15.5C7.30915 15.5 7.54101 15.4219 7.77288 15.2656C9.24134 14.1719 12.8739 11.2812 13.5694 8C13.6467 7.76562 13.6467 7.45312 13.724 7.14062C13.8786 5.57812 13.3376 4.01562 12.2556 2.76562ZM7 9.48438C5.84069 9.48438 4.83595 8.54687 4.83595 7.29687C4.83595 6.04687 5.7634 5.10937 7 5.10937C8.2366 5.10937 9.16405 6.04687 9.16405 7.29687C9.16405 8.54687 8.15931 9.48438 7 9.48438Z" fill="#D35252" />
              </svg>
              UI/UX Designer
            </p>
            <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45.</p>
          </div>
        </div>

        <div className="flex justify-end w-1/3 " role="group">

          <div className="cursor-pointer w-12 h-12 bg-primary-50 flex justify-center items-center rounded-md ml-2 ease-in-out duration-300 hover:bg-primary-400">
            <svg className=" w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
          </div>

          <div className="cursor-pointer w-12 h-12 bg-primary-50 flex justify-center items-center rounded-md ml-2 duration-300 hover:bg-primary-400">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
          </div>
          <div className="cursor-pointer w-12 h-12 bg-primary-50 flex justify-center items-center rounded-md ml-2 duration-300 hover:bg-primary-400">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
          </div>
        </div>

      </section>



      <section className="flex justify-center">


        <div className="inline-flex py-4 text-white text-center">

          <div className="border-r border-color-ass px-5 last:border-0">
            <strong className="display-block font-bold text-[22px]">0</strong>
            <span >Views</span>
          </div>

          <div className="border-r border-color-ass px-5 last:border-0">
            <strong class="display-block font-bold text-[22px]">0</strong>
            <span >Followers</span>
          </div>

          <div className="border-r border-color-ass px-5 last:border-0">
            <strong class="display-block font-bold text-[22px]">0</strong>
            <span >Works</span>
          </div>



        </div>



      </section>




      <section className="flex justify-between">

        <button type="button" class="btn btn-primary btn-sm">Create New <i class="fa-thin fa-square-plus ml-1"></i></button>

        <button type="button" class="btn btn-outline-primary btn-sm">Sort By <i class="fa-thin fa-arrow-down-short-wide ml-1"></i></button>
      </section>








      <div className="py-3 grid gap-4 grid-cols-1 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 ">

        <Card />


        <Card />

        <Card />
        <Card />
        <Card />


      </div>


      {/* no project */}
      <section className="text-center my-7 lg:my-40">
        <img className="inline-block mb-7" src={noProject} alt="This user haven’t create any Project." />
        <div className="text-color-ass-2 font-bold text-[26px]">This user haven’t create any Project.</div>
      </section>


      <section className="text-center my-7 lg:my-40">
        <img className="inline-block mb-7" src={emptyProject} alt="This user haven’t create any Project." />
        <div className="text-color-ass-2 font-bold text-[26px]">You Doesnt have any Project.<br /> let’s go create new project!</div>
        <button type="button" class="btn-outline-primary-gradient btn-sm mt-5"><span>Create New <i class="fa-thin fa-square-plus ml-2"></i></span></button>
      </section>


      <div className={!isLoading ? "" : "loading"}></div>
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
            {/* {socialLinks.map((i) => (
              <img
                key={i.id}
                className="cp"
                src={require(`assets/images/profile/social/ico_${i.title}.svg`)}
                alt="social logo"
              />
            ))} */}
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
          <div>
            {!isLoading && (
              <InfiniteScroll
                dataLength={userProjectList.length} //This is important field to render the next data
                next={fetchData}
                hasMore={hasMore}
              >
                <Tab tabs={tab} key={tabKey} />
                {smallSpinnerLoading && <div className="onlySpinner"></div>}
              </InfiniteScroll>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Profile;
