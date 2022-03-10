import "assets/css/profile.css";
import meetUp from "assets/images/sidebar/meetUp.png";
import locationIcon from "assets/images/profile/locationIcon.svg";
import { useState } from "react";
const Profile = () => {
  const initialStats = [
    { id: 0, title: "Works", amount: "10.5k" },
    { id: 1, title: "Items", amount: "10.5k" },
    { id: 0, title: "Views", amount: "10.5k" },
    { id: 0, title: "Appreciations", amount: "10.5k" },
    { id: 0, title: "Followers", amount: "10.5k" },
  ];
  let [stats, setStats] = useState(initialStats);
  let [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="profilePageContainer">
      <div className="banner"></div>
      <img src={meetUp} className="userProfilePicture" alt="User profile" />
      <div className="userName">USER NAME</div>
      <div className="profession">Designer, Web Analytics Consultant</div>
      <div className="d-inline-flex align-items-center mt-2">
        <img className="locationIcon" src={locationIcon} alt="" />
        <div className="address">Tokyo, Japan</div>
      </div>
      <div className="intro">
        Hello Everyone! Thanks for coming my page. Please offer collaboration
        your project to me if you favorite my work. Thank you.
      </div>
      <div className="statsContainer d-flex justify-content-center">
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
    </div>
  );
};
export default Profile;
