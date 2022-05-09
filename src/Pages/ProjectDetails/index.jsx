import { useEffect, useState } from "react";
import { getProjectDetailsById } from "services/project/projectService";
import { ReactComponent as LikeIcon } from "assets/images/projectDetails/ico_like.svg";

export default function ProjectDetails(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState({});
  const projectId = props.match.params.id;

  useEffect(() => {
    if (projectId && !isLoading) {
      projectDetails(projectId);
    }
  }, []);

  function projectDetails(pid) {
    setIsLoading(true);
    getProjectDetailsById({ id: pid })
      .then((res) => {
        if (res.code === 0) {
          setProject(res.project);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  return (
    <div className={`my-4 ${isLoading ? "loading" : ""}`}>
      {!isLoading && project && !project.name && (
        <div className="text-center text-red-500">Project not Found</div>
      )}
      {!isLoading && project && project.name && (
        <div>
          <div className="ml-12 text-2xl font-bold">{project.name}</div>
          <div className="py-4">
            <img
              src={project?.assets[0]?.path ? project.assets[0].path : ""}
              alt="cover"
              className="w-full h-96"
            />
          </div>
          <div className="float-right mr-10">
            <div className="relative bottom-10 left-1 rounded-full h-14 w-14 bg-[#B9CCD5] hover:bg-[#0AB4AF] grid grid-cols-1 content-center cursor-pointer">
              <LikeIcon className="ml-1.5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
