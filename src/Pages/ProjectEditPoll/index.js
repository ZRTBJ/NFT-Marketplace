import React, { useEffect, useState } from "react";
import ProjectEditTopNavigationCard from "components/ProjectEdit/ProjectEditTopNavigationCard";
import ProjectCover from "components/ProjectEdit/ProjectCover";
import { getProjectPollList } from "services/project/projectService";
import Moment from "moment";

function ProjectPoll(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [pollList, setPollList] = useState([]);
  const [total, setTotal] = useState(1);

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
          <div className="text-center sm:text-right">
            <span className="inline-flex items-center justify-center px-3.5 py-1.5 text-lg text-white font-bold leading-none bg-[#0AB4AF] rounded-full mb-4">
              New Post
            </span>
          </div>
          {pollList && pollList.length > 0 ? (
            <>
              {pollList.map((poll, index) => (
                <div className="pt-5" key={`poll-list-${index}`}>
                  <div className="flex">
                    <span
                      className={`inline-flex items-center justify-center px-3.5 py-1.5 text-sm sm:text-s leading-none border ${
                        poll.status === "success"
                          ? "border-[#0AB4AF]"
                          : poll.status === "failed"
                          ? "border-red-400"
                          : "border-gray-400"
                      } rounded-full`}
                    >
                      <span className="font-medium">DUE DATE&nbsp;&nbsp;</span>{" "}
                      {Moment(poll.start_at).format("YYYY/MM/DD")} -
                      {Moment(poll.expire_at).format("YYYY/MM/DD")}
                    </span>
                    <span className="hidden sm:block ml-4 mt-2">
                      {Moment(poll.updated_at).format("YYYY/MM/DD")}
                    </span>
                  </div>
                  <p className="block sm:hidden mt-1.5">
                    {Moment(poll.updated_at).format("YYYY/MM/DD")}
                  </p>
                  <div className="text-base sm:text-lg font-bold mt-1">
                    {poll.title}
                  </div>
                  <div className="relative bottom-12 text-right text-gray-400">
                    <i className="fa fa-angle-right fa-lg sm:fa-2x" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <></>
          )}
          {isLoading ? (
            <div className={`h-12 w-full text-center`}>
              <i
                class="fa fa-spinner fa-spin fa-3x text-[#0AB4AF] mt-4 "
                aria-hidden="true"
              ></i>
            </div>
          ) : (
            <>
              {total - pageSize > 0 ? (
                <div className={`h-12 w-full text-center pt-8`}>
                  <span
                    className="text-[#0AB4AF] cursor-pointer font-medium"
                    onClick={getMore}
                  >
                    See more
                  </span>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectPoll;
