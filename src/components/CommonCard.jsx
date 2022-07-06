import thumbIcon from "assets/images/profile/card.svg";
import edit_icon from "assets/images/profile/edit_icon.png";
import ProjectCreate from "Pages/ProjectCreate";
import { useHistory } from "react-router-dom";

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
      className="rounded-lg border rounded rounded-[24px] border-primary-50 cursor-pointer relative p-3"
    >
      <div>
        {(!project.isNft && project.project_status === "draft") ||
        project.status === "draft" ? (
          <div className="absolute left-0 z-10 right-0 flex p-3  items-center justify-center mx-auto w-[169px] font-bold top-[50%] h-[35px]  text-color-gold bg-color-brown rounded-lg">
            <img src={edit_icon} className="mr-2" alt="edit" />
            <span>Continue Editing</span>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div
        className={`  rounded rounded-[24px] ${
          (!project.isNft && project.project_status === "draft") ||
          project.status === "draft"
            ? "bg-[#9499AE] opacity-[0.5] p-2"
            : ""
        }`}
      >
        <div>
          {!project.isNft ? (
            <img
              className="rounded-lg w-full h-[137px] lg:h-[301px] object-cover"
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
        </div>
        <div>
          <h3 class="mb-[13px] mt-[12px] tracking-tight text-color-grey">
            {project.name}
          </h3>
          {!project.isNft && project.showOverview && (
            <div className=" text-white  font-bold">{project.overview}</div>
          )}
          {!project.isNft && project.showMembersTag && (
            <div>
              {project.is_member && (
                <div className="inline-flex items-center mr-1  justify-center w-[63px] h-[28px] text-xs font-bold text-center text-color-gold bg-color-brown rounded-full ease-in-out duration-300 hover:text-color-brown hover:bg-color-gold focus:ring-4 focus:outline-none focus:ring-primary-300 ">
                  Member
                </div>
              )}
              {project.is_owner && (
                <>
                  {project.project_status === "published" ? (
                    <div className="inline-flex items-center mr-1  mb-[15px] justify-center w-[63px] h-[28px] text-xs font-bold text-center text-primary-50 bg-primary-900 rounded-full ease-in-out duration-300 hover:text-primary-900 hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 ">
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
            <div className="flex flex-wrap">
              <div className="flex  items-center text-white mr-[35px]">
                <i className="fa-thin fa-eye mr-2"></i>
                <span className=" ml-1">{project.project_view_count}</span>
              </div>
              <div className="flex  mr-[35px] items-center text-white ">
                <i class="fa-thin fa-heart mr-2"></i>
                <span className=" ml-1"> {project.project_like_count}</span>
              </div>
              <div className="flex  mr-[35px] items-center text-white ">
                <i class="fa-thin fa-bookmark mr-2"></i>
                <span className=" ml-1">{project.project_mark_count}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CommonCard;
