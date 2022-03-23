import "assets/css/card.css";
import bookmarkIcon from "assets/images/profile/ico_bookmark.svg";
import thumbIcon from "assets/images/profile/ico_like.svg";
import viewIcon from "assets/images/profile/ico_view.svg";

const ProjectCard = ({ cardInfo }) => {
  return (
    <div >
      <div className="projectCardContainer">
        <img src={cardInfo.img} alt="" />
      </div>
      <div className="projectCardType">{cardInfo.type}</div>
      <div className="projectCardTitle cp">{cardInfo.title}</div>
      <div className="projectCardStatsIcon flex justify-center items-center cp">
        <img src={bookmarkIcon} alt="" />
        {cardInfo.bookmark}
        <img className="ms-3" src={thumbIcon} alt="" />
        {cardInfo.like}
        <img className="ms-3" src={viewIcon} alt="" />
        {cardInfo.view}
      </div>
    </div>
  );
};
export default ProjectCard;
