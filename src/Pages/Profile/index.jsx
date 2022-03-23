import { useState, useEffect } from "react";
import "assets/css/profile.css";
import profile from "assets/images/profile/profile.svg";
import dummy from "assets/images/profile/dummy.jpg";
import dummy2 from "assets/images/profile/dummy2.jpg";
import locationIcon from "assets/images/profile/locationIcon.svg";
import Tab from "components/profile/Tab";
import getUserProjectListById from "services/profile";
import { useSelector, useDispatch } from "react-redux";
import { getUserProjects } from "../../Slice/projectSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const tabs = [
    {
      id: 1,
      name: "PROJECT",
      cardList: [
        {
          id: 0,
          img: dummy2,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 1,
          img: dummy,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 2,
          img: dummy2,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 3,
          img: dummy,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 4,
          img: dummy,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 5,
          img: dummy,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
      ],
    },
    {
      id: 2,
      name: "WORK",
      cardList: [
        {
          id: 0,
          img: dummy,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 1,
          img: dummy,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 2,
          img: dummy,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 3,
          img: dummy2,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
      ],
    },
    {
      id: 3,
      name: "COLLECTION",
      cardList: [
        {
          id: 0,
          img: dummy2,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 1,
          img: dummy2,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 2,
          img: dummy2,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 3,
          img: dummy2,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 4,
          img: dummy2,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 5,
          img: dummy2,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 6,
          img: dummy2,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
        {
          id: 7,
          img: dummy2,
          type: "FUNDRAISING",
          title: "CAT foot print artwork",
          bookmark: 200,
          like: 346,
          view: 346,
        },
      ],
    },
  ];
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
  let [stats] = useState(initialStats);
  let [isFollowing, setIsFollowing] = useState(false);
  const loadingStatus = useSelector((state) => state.projects.status);

  useEffect(() => {
    let payload = {
      id: "8ca0c405-e120-4ec6-a87c-a0588163f42c",
      page: 1,
      perPage: 10,
    };
    dispatch(getUserProjects(payload));
    // getUserProjectListById(payload).then((e) => {
    //   console.log(e);
    // });
  }, []);

  return (
    <div className="profilePageContainer">
      <div className="banner"></div>
      <img src={profile} className="userProfilePicture" alt="User profile" />
      <div className="userName">USER NAME</div>
      <div className="profession">Designer, Web Analytics Consultant</div>
      <div className="mt-2 flex justify-center">
        <img className="locationIcon" src={locationIcon} alt="" />
        <div className="address">Tokyo, Japan</div>
      </div>
      <div className="intro">
        Hello Everyone! Thanks for coming my page. Please offer collaboration
        your project to me if you favorite my work. Thank you.
      </div>
      <div className="statsContainer flex justify-center flex-wrap">
        {stats.map((i) => (
          <div key={i.id} className="stat">
            <div className="amount">{i.amount}</div>
            <div className="title">{i.title}</div>
          </div>
        ))}
      </div>
      {isFollowing ? (
        <button className="followButton" onClick={() => setIsFollowing(false)}>
          FOLLOWING
        </button>
      ) : (
        <button className="followButton" onClick={() => setIsFollowing(true)}>
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
      <Tab tabs={tabs} />
    </div>
  );
};
export default Profile;
