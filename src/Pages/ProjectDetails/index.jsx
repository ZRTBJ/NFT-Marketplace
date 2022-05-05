import { useEffect, useState } from "react";
import { getProjectDetailsById } from "services/project/projectService";

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
    getProjectDetailsById(pid)
      .then((res) => {
        if (res.code === 0) {
          setProject(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  return (
    <div className="my-12">
      {!!project && !!project.title && (
        <div className="text-center text-red-500">Project not Found</div>
      )}
    </div>
  );
}
