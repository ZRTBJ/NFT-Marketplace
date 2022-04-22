import "assets/css/profileSettings.css";
import TopNavigationCard from "components/ProfileSettings/TopNavigationCard";
import { useState, useEffect } from "react";
import { getUserProjectListById } from "services/project/projectService";
import ProjectCard from "components/profile/ProjectCard";
import { useHistory } from "react-router-dom";

const ProfileSettings = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [projectList, setProjectList] = useState([]);
  function projectEdit(status, id) {
    if (status === "published") {
      history.push({
        pathname: `/project-edit/${id}/outline`,
      });
    } else if (status === "draft") {
      history.push({
        pathname: `/project-update/${id}`,
      });
    }
  }
  useEffect(() => {
    getUserInfo();
    async function getUserInfo() {
      let payload = {
        id: localStorage.getItem("user_id"),
        page: 1,
        perPage: 10,
      };
      let projectListCards = [];
      await getUserProjectListById(payload).then((e) => {
        if (e && e.data) {
          e.data.forEach((element) => {
            let assets = element.assets.find(
              (x) => x.asset_purpose === "cover"
            );
            projectListCards.push({
              id: element.id,
              img: assets ? assets.path : "",
              title: element.name,
              type: element.project_type,
              bookmark: element.project_mark_count,
              like: element.project_like_count,
              view: element.project_view_count,
              status: element.project_status,
              visibility: element.visibility,
            });
          });
        }
        setProjectList(projectListCards);
      });
      setIsLoading(false);
    }
  }, []);
  return (
    <div>
      <TopNavigationCard />
      <div className={`grid justify-items-center my-24`}>
        {isLoading && <div className="loading"></div>}
        <h1 className="text-5xl font-bold mb-16">MY PROJECT</h1>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {projectList.map((cardlist) => (
              <div
                onClick={() => projectEdit(cardlist.status, cardlist.id)}
                key={cardlist.id}
              >
                <div className="projectCardLayout">
                  <ProjectCard cardInfo={cardlist} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileSettings;
