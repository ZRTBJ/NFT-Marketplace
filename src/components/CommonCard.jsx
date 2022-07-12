import thumbIcon from "assets/images/profile/card.svg";
import edit_icon from "assets/images/profile/edit_icon.png";
import { useHistory } from "react-router-dom";
import "../assets/css/commonCard.css";

const CommonCard = ({ project }) => {
  const history = useHistory();
  function gotToDetailPage(projectId) {
    if (project.isNft) {
      console.log("nft");
    } else {
      if (project.project_status === "draft" || project.status === "draft") {
        history.push(`/project-update/${projectId}`);
      } else {
        history.push(`/project-details/${projectId}`);
      }
    }
  }

  return (
    <div
      onClick={() => gotToDetailPage(project.id)}
      className="border rounded-3xl border-primary-50 cursor-pointer relative"
    >

      {(!project.isNft && project.project_status === "draft") ||
        project.status === "draft" ? (
        <div className="absolute left-0 z-10 right-0 flex  items-center justify-center mx-auto max-w-full w-[169px] font-bold top-[50%] h-[35px]  text-color-gold bg-color-brown rounded-lg">
          <img src={edit_icon} className="mr-2" alt="edit" />
          <span>Continue Editing</span>
        </div>
      ) : (
        <></>
      )}
      <div
        className={`rounded-3xl p-2  ${(!project.isNft && project.project_status === "draft") ||
          project.status === "draft"
          ? "bg-[#9499AE] opacity-[0.5]"
          : ""
          }`}
      >

        {!project.isNft ? (
          <img
            className="rounded-3xl w-full h-[137px] lg:h-72 2xl:h-[301px] object-cover thumb-img"
            src={
              project && project.assets && project.assets.length > 0
                ? project.assets.find((x) => x.asset_purpose === "cover")
                  ?.path
                  ? project.assets.find((x) => x.asset_purpose === "cover")
                    ?.path
                  : thumbIcon
                : thumbIcon
            }
            alt="card"
          />
        ) : (
          <img
            className="rounded-lg w-full h-[137px] lg:h-[301px] object-cover"
            src={project.path}
            alt="card"
          />
        )}
        <div>
          <h3 className="tracking-tight text-color-grey truncate mt-3">
            {project.name}
          </h3>
          {!project.isNft && project.showOverview && (
            <div className="mt-4 text-white  font-bold">{project.overview}</div>
          )}

          {!project.isNft && project.showMembersTag && (
            <div className="mt-4 mb-1">
              {project.is_member && (
                <div className="inline-flex items-center mr-1 py-2 px-3 text-xs font-bold justify-center  text-color-gold bg-color-brown rounded-full ease-in-out duration-300 w-20 mb-2 md:mb-0 hover:text-color-brown hover:bg-color-gold focus:ring-4 focus:outline-none focus:ring-primary-300">
                  Member
                </div>
              )}
              {project.is_owner && (
                <>
                  {project.project_status === "published" ? (
                    <div className="inline-flex items-center mr-1 py-2 px-3 text-xs font-bold justify-center text-primary-50 bg-primary-900 rounded-full ease-in-out duration-300 w-20 hover:text-primary-900 hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300">
                      Owner
                    </div>
                  ) : (
                    <div className="flex justify-center items-center mr-1  mb-[15px] w-[63px] h-[28px] text-xs font-bold text-center text-[#9499AE] bg-[#DDDDDD] rounded-full ease-in-out duration-300">
                      Draft
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {!project.isNft && (
            <>
              <div className="flex mt-3 mb-1">
                <div className="flex space-x-2 items-center text-white mr-4">
                  <i className="fa-thin fa-eye"></i>
                  <span className="ml-1">{project.project_view_count}</span>
                </div>
                <div className="flex space-x-2 items-center text-white mr-4">
                  <i class="fa-thin fa-heart"></i>
                  <span className="ml-1"> {project.project_like_count}</span>
                </div>
                <div className="flex space-x-2 items-center text-white mr-4">
                  <i className="fa-thin fa-bookmark"></i>
                  <span className="ml-1">{project.project_mark_count}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default CommonCard;
