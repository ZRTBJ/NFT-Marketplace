import "assets/css/profileSettings.css";
import dummyImage from "assets/images/dummy.png";
import TopNavigationCard from "components/ProfileSettings/TopNavigationCard";
import { useState, useEffect } from "react";
import { getUserProjectListById } from "services/project/projectService";
import ProjectCard from "components/profile/ProjectCard";
import { useHistory } from "react-router-dom";
import DeployingProjectModal from "components/modalDialog/DeployingProjectModal";
import InfiniteScroll from "react-infinite-scroll-component";

const ProfileSettings = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [projectList, setProjectList] = useState([]);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [smallSpinnedLoading, setSmallSpinnedLoading] = useState(false);

  async function fetchData() {
    if (hasMore) {
      setHasMore(false);
      setSmallSpinnedLoading(true);
      await getUserInfo();
      setSmallSpinnedLoading(false);
    }
  }

  function projectEdit(status, id) {
    setProjectId(id);
    if (status === "published") {
      history.push({
        pathname: `/project-edit/${id}/project-top`,
      });
    } else if (status === "draft") {
      history.push({
        pathname: `/project-update/${id}`,
      });
    } else if (status === "publishing") {
      setShowDeployModal(true);
    }
  }
  async function getUserInfo() {
    let payload = {
      id: localStorage.getItem("user_id"),
      page: page,
      perPage: limit,
    };
    let projectListCards = [];
    await getUserProjectListById(payload).then((e) => {
      if (e && e.data) {
        e.data.forEach((element) => {
          let assets = element.assets.find((x) => x.asset_purpose === "cover");
          projectListCards.push({
            id: element.id,
            img: assets ? assets.path : dummyImage,
            title: element.name,
            type: element.project_type,
            bookmark: element.project_mark_count,
            like: element.project_like_count,
            view: element.project_view_count,
            status: element.project_status,
            visibility: element.visibility,
          });
        });
        if (e.data.length === limit) {
          let pageSize = page + 1;
          setPage(pageSize);
          setHasMore(true);
        }
      }
      setProjectList(projectListCards);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div>
      <TopNavigationCard />
      <div className={`grid justify-items-center my-24`}>
        {isLoading && <div className="loading"></div>}
        <h1 className="text-5xl font-bold mb-16">MY PROJECT</h1>
        <div className="container mx-auto">
          <div>
            {!isLoading && (
              <InfiniteScroll
                dataLength={projectList.length} //This is important field to render the next data
                next={fetchData}
                hasMore={hasMore}
              >
                {projectList.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                    {projectList.map((cardlist) => (
                      <div
                        onClick={() =>
                          projectEdit(cardlist.status, cardlist.id)
                        }
                        key={cardlist.id}
                      >
                        <div className="projectCardLayout">
                          <ProjectCard cardInfo={cardlist} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center mx-auto">No Match results</div>
                )}

                {smallSpinnedLoading && <div className="onlySpinner"></div>}
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>
      {showDeployModal && (
        <DeployingProjectModal
          show={showDeployModal}
          handleClose={setShowDeployModal}
          projectId={projectId}
          publishStep={1}
        />
      )}
    </div>
  );
};
export default ProfileSettings;
