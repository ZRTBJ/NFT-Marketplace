import "assets/css/card.css";
import bookmarkIcon from "assets/images/profile/ico_bookmark.svg";
import thumbIcon from "assets/images/profile/ico_like.svg";
import viewIcon from "assets/images/profile/ico_view.svg";

const ProjectCard = ({ cardInfo }) => {
  return (
    <div>
      <div
        className={`projectCardContainer ${
          cardInfo.status === "draft" ? "relative bg-[#CCCCCC]" : ""
        }`}
      >
        {cardInfo.status === "draft" && (
          <div className="h-[60px] w-[60px] right-0 left-0 mx-auto mt-[-9px] md:mt-[-20px] absolute bg-[#CCCCCC]">
            <div className={`text-[14px] mt-4`}>
              {cardInfo.status.toUpperCase()}
            </div>
            <div
              className={`text-[14px]  ${
                cardInfo.visibility === "private"
                  ? "text-[#D31B0C]"
                  : "text-[#0AB4AF]"
              }`}
            >
              {cardInfo.visibility.toUpperCase()}
            </div>
          </div>
        )}
        <img src={cardInfo.img} alt="" />
      </div>
      {!cardInfo.status && (
        <div className="projectCardType">{cardInfo.type}</div>
      )}
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
