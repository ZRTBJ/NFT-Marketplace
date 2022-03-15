import { ReactComponent as ProfileLogo } from "assets/images/profileSettings/ico_personal.svg";
import { ReactComponent as ProjectLogo } from "assets/images/profileSettings/ico_project.svg";
import { ReactComponent as BookmarkLogo } from "assets/images/profileSettings/ico_bookmark2.svg";
import { ReactComponent as FollowLogo } from "assets/images/profileSettings/ico_follow.svg";
import { ReactComponent as FollowerLogo } from "assets/images/profileSettings/ico_follower.svg";
import { NavLink } from "react-router-dom";
const TopNavigationCard = () => {
  const navigationList = [
    { id: 0, title: "PROFILE", to: "/profile-settings", logo: <ProfileLogo /> },
    { id: 1, title: "PROJECT", to: "/project-settings", logo: <ProjectLogo /> },
    {
      id: 2,
      title: "BOOKMARK",
      to: "/bookmark-settings",
      logo: <BookmarkLogo />,
    },
    { id: 3, title: "FOLLOW", to: "/follow-settings", logo: <FollowLogo /> },
    {
      id: 4,
      title: "FOLLOWER",
      to: "/follower-settings",
      logo: <FollowerLogo />,
    },
  ];
  return (
    <div className="topNavigationCardContainer">
      {navigationList.map((i) => (
        <NavLink
          key={i.id}
          to={i.to}
          className="topNavigationCardLinks"
          activeClassName="selectedTopNavigation"
        >
          <div className="topNavigationCardImageContainer">{i.logo}</div>
          <div className="topNavigationCardTitle">{i.title}</div>
        </NavLink>
      ))}
    </div>
  );
};
export default TopNavigationCard;
