import React, { useEffect, useState } from "react";
import ProjectEditTopNavigationCard from "components/ProjectEdit/ProjectEditTopNavigationCard";
import ProjectCover from "components/ProjectEdit/ProjectCover";
import { getProjectPollList } from "services/project/projectService";
import PollListView from "components/ProjectEdit/Poll/PollList";
import CreatePoll from "components/ProjectEdit/Poll/CreatePoll";

function ProjectPoll(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [pollList, setPollList] = useState([]);
  const [total, setTotal] = useState(1);
  const [showNewPost, setShowNewPost] = useState(false);

  const projectId = props.match.params.id;
  let pageNo = 1;
  let pageSize = 15;

  useEffect(() => {
    if (projectId && !isLoading) {
      getPollList(projectId);
    }
  }, []);

  async function getPollList(projectId) {
    setIsLoading(true);
    const response = await getProjectPollList(projectId, pageNo, pageSize);
    setTotal(response.total);
    const newPollList = pollList.concat(response.polls);
    setPollList(newPollList);
    setIsLoading(false);
  }

  function getMore() {
    pageNo++;
    getPollList(projectId);
  }

  function closeNewPost() {
    setShowNewPost(false);
  }

  return (
    <>
      <div className="sticky z-[1]">
        <ProjectEditTopNavigationCard />
      </div>
      <div className="relative bottom-8">
        <ProjectCover />
      </div>
      <div className={`grid justify-items-center`}>
        <span className="text-5xl font-bold">POLL</span>
        <div className="mt-8 divide-y divide-gray-300 w-full sm:w-2/3 px-4 sm:mx-0">
          {showNewPost === true ? (
            <CreatePoll closeNewPost={closeNewPost} projectId={projectId} />
          ) : (
            <>
              <div className="text-center sm:text-right">
                <span
                  onClick={() => setShowNewPost(true)}
                  className="inline-flex items-center justify-center px-3.5 py-1.5 text-lg text-white font-bold leading-none bg-[#0AB4AF] rounded-full mb-4"
                >
                  New Post
                </span>
              </div>
              <PollListView
                pollList={pollList}
                isLoading={isLoading}
                total={total}
                pageSize={pageSize}
                getMore={getMore}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectPoll;
