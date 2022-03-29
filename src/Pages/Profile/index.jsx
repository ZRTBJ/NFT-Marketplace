import { useState, useEffect } from "react";
import "assets/css/profile.css";
import profile from "assets/images/profile/profile.svg";
import locationIcon from "assets/images/profile/locationIcon.svg";
import Tab from "components/profile/Tab";
import { getUserProjectListById } from "services/project/projectService";
const initialStats = [
  { id: 0, title: "Works", amount: "10.5k" },
  { id: 1, title: "Items", amount: "10.5k" },
  { id: 2, title: "Views", amount: "10.5k" },
  { id: 3, title: "Appreciations", amount: "10.5k" },
  { id: 4, title: "Followers", amount: "10.5k" },
];
const socialLinks = [
  { id: 0, title: "discord", link: "" },
  { id: 1, title: "twitter", link: "" },
  { id: 2, title: "facebook", link: "" },
  { id: 3, title: "instagram", link: "" },
  { id: 4, title: "youtube", link: "" },
  { id: 5, title: "tumblr", link: "" },
  { id: 6, title: "weibo", link: "" },
  { id: 7, title: "spotify", link: "" },
  { id: 8, title: "github", link: "" },
  { id: 9, title: "behance", link: "" },
  { id: 10, title: "dribbble", link: "" },
  { id: 11, title: "opensea", link: "" },
  { id: 12, title: "rarible", link: "" },
];
const Profile = () => {
  let [stats] = useState(initialStats);
  let [isFollowing, setIsFollowing] = useState(false);
  const [userProjectList, setUserProjectList] = useState([]);
  const [tab, setTab] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    getUserInfo();
    async function getUserInfo() {
      let payload = {
        id: localStorage.getItem("user_id"),
        page: 1,
        perPage: 10,
      };
      let projectListCards = [];
      await getUserProjectListById(payload).then((e) => {
        e.data.data.forEach((element) => {
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
        setUserProjectList(projectListCards);
      });
      setisLoading(false);
    }
  }, []);

  useEffect(() => {
    let tabData = [
      {
        id: 1,
        name: "PROJECT",
        cardList: userProjectList,
      },
      {
        id: 2,
        name: "WORK",
        cardList: [],
      },
      {
        id: 3,
        name: "COLLECTION",
        cardList: [],
      },
    ];
    setTab(tabData);
  }, [userProjectList]);

  return (
    <div>
      <div className={!isLoading ? "" : "loading"}></div>
      {!isLoading && (
        <div className="profilePageContainer">
          <div className="banner"></div>
          <img
            src={profile}
            className="userProfilePicture"
            alt="User profile"
          />
          <div className="userName">USER NAME</div>
          <div className="profession">Designer, Web Analytics Consultant</div>
          <div className="mt-2 flex justify-center">
            <img className="locationIcon" src={locationIcon} alt="" />
            <div className="address">Tokyo, Japan</div>
          </div>
          <div className="intro">
            Hello Everyone! Thanks for coming my page. Please offer
            collaboration your project to me if you favorite my work. Thank you.
          </div>
          <div className="statsContainer flex justify-center flex-wrap">
            {stats.map((i) => (
              <div key={i.id} className="stat">
                <div className="amount">{i.amount}</div>
                <div className="statsTitle">{i.title}</div>
              </div>
            ))}
          </div>
          {isFollowing ? (
            <button
              className="followButton"
              onClick={() => setIsFollowing(false)}
            >
              FOLLOWING
            </button>
          ) : (
            <button
              className="followButton"
              onClick={() => setIsFollowing(true)}
            >
              FOLLOW
            </button>
          )}
          <div className="socialIconsContqainer">
            {socialLinks.map((i) => (
              <img
                key={i.id}
                className="cp"
                src={require(`assets/images/profile/social/ico_${i.title}.svg`)}
                alt="social logo"
              />
            ))}
          </div>
          <div className="portfolioButtonContainer">
            <button>Portfolio</button>
            <button>Website</button>
            <button>Online Shop</button>
          </div>
          <div className="profileDivider"></div>
          <Tab tabs={tab} />
        </div>
      )}
    </div>
  );
};
export default Profile;
