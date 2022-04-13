import { ReactComponent as ProjectLogo } from "assets/images/projectEdit/ico_project.svg";
import { ReactComponent as AllocationLogo } from "assets/images/projectEdit/ico_allocation.svg";
import { ReactComponent as FileuploadLogo } from "assets/images/projectEdit/ico_fileupload.svg";
import { ReactComponent as PollLogo } from "assets/images/projectEdit/ico_poll.svg";
import { ReactComponent as TokencategoryLogo } from "assets/images/projectEdit/ico_tokencategory.svg";
import { ReactComponent as WorkmintLogo } from "assets/images/projectEdit/ico_workmint.svg";
import { ReactComponent as OutlineLogo } from "assets/images/projectEdit/ico_outline.svg";

import { NavLink } from "react-router-dom";
const ProjectEditTopNavigationCard = () => {
  const navigationList = [
    {
      id: 1,
      title: "PROJECT TOP",
      to: "project-top",
      logo: <ProjectLogo />,
    },
    {
      id: 2,
      title: "WORK UPLOAD",
      to: "work-upload",
      logo: <FileuploadLogo />,
    },
    {
      id: 3,
      title: "ALLOCATION",
      to: "allocation",
      logo: <AllocationLogo />,
    },
    {
      id: 4,
      title: "POLL",
      to: "poll",
      logo: <PollLogo />,
    },
    {
      id: 5,
      title: "OUTLINE",
      to: "outline",
      logo: <OutlineLogo />,
    },
    {
      id: 6,
      title: "TOKEN CATEGORY",
      to: "token-category",
      logo: <TokencategoryLogo />,
    },
    {
      id: 7,
      title: "WORK MINT",
      to: "work-mint",
      logo: <WorkmintLogo />,
    },
  ];
  return (
    <div className="topNavigationCardContainer !w-[320px] sm:!w-[620px] !h-auto bg-white">
      {navigationList.map((i) => (
        <NavLink
          key={i.id}
          to={i.to}
          className="topNavigationCardLinks my-2.5 mx-1"
          activeClassName="selectedTopNavigation"
        >
          <div className="topNavigationCardImageContainer">{i.logo}</div>
          <div className="topNavigationCardTitle !text-center">{i.title}</div>
        </NavLink>
      ))}
    </div>
  );
};
export default ProjectEditTopNavigationCard;
