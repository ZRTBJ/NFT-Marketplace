import thumbIcon from "assets/images/profile/card.svg";
import edit_icon from "assets/images/profile/edit_icon.png";
import { useHistory } from "react-router-dom";

const CommonCard = ({ project }) => {
  const history = useHistory();
  function projectDetails(projectId) {
    if (project.your_token_category) {
    }
    if (project.project_status === "draft" || project.status === "draft") {
      history.push(`/project-update/${projectId}`);
    } else {
      history.push(`/project-details/${projectId}`);
    }
  }

  return (
    <div
      onClick={() => projectDetails(project.id)}
      className="border rounded-3xl border-primary-50 cursor-pointer relative p-2"
    >

      {project.project_status === "draft" || project.status === "draft" ? (
        <div className="absolute left-0 z-10 right-0 flex  items-center justify-center mx-auto w-[169px] font-bold top-[50%] h-[35px]  text-color-gold bg-color-brown rounded-lg">
          <img src={edit_icon} className="mr-2" alt="edit" />
          <span>Continue Editing</span>
        </div>
      ) : (
        <></>
      )}


      <div
        className={`rounded-3xl ${project.project_status === "draft" || project.status === "draft"
          ? "bg-[#9499AE] opacity-[0.5]"
          : ""
          }`}
      >
        <img
          className="rounded-3xl w-full h-[137px] lg:h-72 2xl:h-[301px] object-cover"
          src={
            project && project.assets && project.assets.length > 0
              ? project.assets.find((x) => x.asset_purpose === "cover")?.path
                ? project.assets.find((x) => x.asset_purpose === "cover")
                  ?.path
                : thumbIcon
              : thumbIcon
          }
          alt="card"
        />
        <div className="p-5">
          <div>
            <h3 class="mb-2 tracking-tight text-color-grey">{project.name}</h3>
          </div>
          {project.showOverview && (
            <div className="mt-4 text-white  font-bold">{project.overview}</div>
          )}
          <div class="mt-4">
            <div className="inline-flex items-center mr-1 py-2 px-3 text-xs font-bold justify-center  text-color-gold bg-color-brown rounded-full ease-in-out duration-300 w-20 mb-2 md:mb-0 hover:text-color-brown hover:bg-color-gold focus:ring-4 focus:outline-none focus:ring-primary-300 ">
              Member
            </div>
            <div className="inline-flex items-center mr-1 py-2 px-3 text-xs font-bold justify-center text-primary-50 bg-primary-900 rounded-full ease-in-out duration-300 w-20 hover:text-primary-900 hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 ">
              Owner
            </div>
          </div>
          <div className="flex flex-wrap mt-4">
            <div className="flex space-x-2 items-center text-white mr-4">
              <i className="fa-thin fa-eye"></i>
              <span className=" ml-1">{project.project_view_count}</span>
            </div>
            <div className="flex space-x-2 items-center text-white mr-4">
              <i class="fa-thin fa-heart"></i>
              <span className=" ml-1"> {project.project_like_count}</span>
            </div>
            <div className="flex space-x-2 items-center text-white mr-4">
              <i class="fa-thin fa-bookmark"></i>
              <span className=" ml-1">{project.project_mark_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CommonCard;
