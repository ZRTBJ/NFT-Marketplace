import thumbIcon from "assets/images/profile/card.svg";
import defaultImage from "assets/images/defaultImage.svg";
import { useHistory } from "react-router-dom";
import avatar from "assets/images/dummy-img.svg";

const DAOCard = ({ item }) => {
  const history = useHistory();
  function gotToDetailPage(projectId) {
    if (item.isNft) {
      if (!item.isExternalNft) {
        history.push(`/${projectId}/nft-details`);
      }
    } else {
      if (item.project_status === "draft" || item.status === "draft") {
        history.push(`/project-details/${projectId}`);
      } else if (
        item.project_status === "publishing" ||
        item.status === "publishing"
      ) {
        history.push(`/project-details/${projectId}`);
      } else {
        history.push(`/project-details/${projectId}`);
      }
    }
  }

  const truncateArray = (members) => {
    let slicedItems = members.slice(0, 3);
    return { slicedItems, restSize: members.length - slicedItems.length };
  };

  return (
    <div
      className="cursor-pointer  bg-white-shade-900 text-center w-[173px] md:w-[340px] h-[280px] md:h-[325px] rounded-[12px] mb-5 mx-2 relative flex flex-col shadow-main"
      onClick={() => gotToDetailPage(item.id)}
    >
      <img
        src={
          item.assets?.find((pic) => pic.name === "img1")
            ? item.assets?.find((pic) => pic.name === "img1").path
            : defaultImage
        }
        alt={item.name}
        className="rounded-t-xl h-24 md:h-36 object-cover w-full"
      />
      <img
        src={
          item.assets?.find((pic) => pic.name === "cover")
            ? item.assets?.find((pic) => pic.name === "cover").path
            : thumbIcon
        }
        alt={item.name}
        className="rounded-full h-16 w-16 md:w-24 md:h-24  absolute top-14 md:top-20 left-1/2 z-10 -ml-[32px] md:-ml-12 object-cover "
      />

      <h3
        className="mt-10 font-bold text-[15px] md:text-[24px] text-[#303548]"
        title={item.name}
      >
        {item.name
          ? item?.name?.length > 20
            ? item.name.substring(0, 17) + "..."
            : item.name
          : "No name"}
      </h3>
      <p className="text-[13px] mt-0 md:mt-3 text-[#7D849D]">
        Value: {item.last_revenue.toFixed(2)} USD
      </p>
      <div className="flex mx-auto mt-3 mb-4 min-h-[40px]">
        {item.members &&
          item.members.length > 0 &&
          truncateArray(item.members).slicedItems.map((member) => (
            <img
              key={member.id}
              src={member.avatar ? member.avatar : avatar}
              alt={member.id}
              className="rounded-full object-cover h-[35px] w-[35px] ml-2 border-2 border-white"
            />
          ))}
        {item.members && item.members.length > 3 && (
          <div className="flex items-center mt-[6px] justify-center rounded-md ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[26px] h-[26px]">
            <p className="text-[12px] text-[#9A5AFF]">
              +{truncateArray(item.members).restSize}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DAOCard;
