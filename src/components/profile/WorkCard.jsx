import openSeaIcon from "assets/images/profile/social/ico_opensea.svg";
import raribleIcon from "assets/images/profile/social/ico_rarible.svg";
const WorkCard = ({ cardInfo }) => {
  return (
    <div className="workCardContainer ">
      <img className="workCardImage cp" src={cardInfo.img} alt="" />
      <div className="workCardTittle cp">{cardInfo.title}</div>
      <div className="flex justify-center mt-3">
        <img className="workCardIcon cp" src={openSeaIcon} alt="" />
        <img className="workCardIcon cp" src={raribleIcon} alt="" />
      </div>
    </div>
  );
};
export default WorkCard;
