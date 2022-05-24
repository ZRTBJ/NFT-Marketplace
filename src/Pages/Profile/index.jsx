import { useState, useEffect } from "react";
import "assets/css/profile.css";
import profile from "assets/images/profile/profile.svg";
import locationIcon from "assets/images/profile/locationIcon.svg";
import Tab from "components/profile/Tab";
import { getUserProjectListById } from "services/project/projectService";
import { getUserInfo } from "services/User/userService";
import { useParams } from "react-router-dom";

// const socialLinks = [
//   { id: 0, title: "discord", link: "" },
//   { id: 1, title: "twitter", link: "" },
//   { id: 2, title: "facebook", link: "" },
//   { id: 3, title: "instagram", link: "" },
//   { id: 4, title: "youtube", link: "" },
//   { id: 5, title: "tumblr", link: "" },
//   { id: 6, title: "weibo", link: "" },
//   { id: 7, title: "spotify", link: "" },
//   { id: 8, title: "github", link: "" },
//   { id: 9, title: "behance", link: "" },
//   { id: 10, title: "dribbble", link: "" },
//   { id: 11, title: "opensea", link: "" },
//   { id: 12, title: "rarible", link: "" },
// ];
const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [userProjectList, setUserProjectList] = useState([]);
  const [tab, setTab] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [websiteList, setWebsiteList] = useState([]);
  const [sncList, setsncList] = useState([]);
  useEffect(() => {
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
        page: 1,
        perPage: 10,
      };
      let projectListCards = [];
      await getUserProjectListById(payload).then((e) => {
        if (e && e.data) {
          e.data.forEach((element) => {
            let assets = element.assets.find(
              (x) => x.asset_purpose === "cover"
            );
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
        }
        setUserProjectList(projectListCards);
      });
      setisLoading(false);
    }
    userInfo();
  }, []);

  useEffect(() => {
    let tabData = [
      {
        id: 1,
        name: "PROJECT",
        cardList: userProjectList,
      },
      // {
      //   id: 2,
      //   name: "WORK",
      //   cardList: [],
      // },
      // {
      //   id: 3,
      //   name: "COLLECTION",
      //   cardList: [],
      // },
    ];
    setTab(tabData);
  }, [userProjectList]);

  return (
    <div className="container mx-auto">
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
          <Tab tabs={tab} />
        </div>
      )}
    </div>
  );
};
export default Profile;
