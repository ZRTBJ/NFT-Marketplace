import thumbIcon from "assets/images/profile/card.svg";
import { useHistory } from "react-router-dom";

const CommonCard = ({ project }) => {
  const history = useHistory();
  function projectDetails(projectId) {
    history.push(`/project-details/${projectId}`);
  }

  return (
    <div
      onClick={() => projectDetails(project.id)}
      className="rounded-lg border border-primary-50 cursor-pointer p-2"
    >
      <div>
        <img
          className="rounded-lg w-full max-w-[301px] h-[137px] lg:h-[301px] object-cover"
          src={
            project && project.assets && project.assets.length > 0
              ? project.assets.find((x) => x.asset_purpose === "cover").path
              : thumbIcon
          }
          alt="card"
        />
      </div>
      <div className="p-5">
        <div>
          <h3 class="mb-2 tracking-tight text-color-grey">{project.name}</h3>
        </div>
        <div class="mt-4">
          <div className="inline-flex items-center mr-1 py-2 px-3 text-xs font-bold text-center text-color-gold bg-color-brown rounded-full ease-in-out duration-300 hover:text-color-brown hover:bg-color-gold focus:ring-4 focus:outline-none focus:ring-primary-300 ">
            Member
          </div>
          <div className="inline-flex items-center mr-1 py-2 px-3 text-xs font-bold text-center text-primary-50 bg-primary-900 rounded-full ease-in-out duration-300 hover:text-primary-900 hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 ">
            Member
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
  );
};
export default CommonCard;
