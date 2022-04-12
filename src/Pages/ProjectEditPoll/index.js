import React from "react";
import ProjectEditTopNavigationCard from "components/ProjectEdit/ProjectEditTopNavigationCard";
import ProjectCover from "components/ProjectEdit/ProjectCover";

function ProjectPoll(props) {
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
        <div className="mt-8 divide-y divide-gray-300 w-2/3">
          <div className="text-right">
            <span className="inline-flex items-center justify-center px-3.5 py-1.5 text-lg text-white font-bold leading-none bg-[#0AB4AF] rounded-full mb-4">
              New Post
            </span>
          </div>
          <div className="h-28">
            <span className="inline-flex items-center justify-center px-3.5 py-1.5 text-lg leading-none border border-[#0AB4AF] rounded-full my-3">
              <strong>DUE DATE&nbsp;&nbsp;</strong> 2022/04/13 - 2022/04/30
            </span>
            <span className="ml-4">2022/04/30</span>
            <div className="text-xl font-bold">
              Propose to change the TOKEN CATEGORY ALLOCATION
            </div>
            <div className="relative bottom-10 text-right text-gray-400">
              <i className="fa fa-angle-right fa-2x" />
            </div>
          </div>
          <div className="h-28">
            <span className="inline-flex items-center justify-center px-3.5 py-1.5 text-lg leading-none border border-gray-400 rounded-full my-3">
              <strong>DUE DATE&nbsp;&nbsp;</strong> 2022/04/13 - 2022/04/30
            </span>
            <span className="ml-4">2022/04/30</span>
            <div className="text-xl font-bold">Withdraw the project money</div>
            <div className="relative bottom-10 text-right text-gray-400">
              <i className="fa fa-angle-right fa-2x" />
            </div>
          </div>
          <div className="h-28">
            <span className="inline-flex items-center justify-center px-3.5 py-1.5 text-lg leading-none border border-gray-400 rounded-full my-3">
              <strong>DUE DATE&nbsp;&nbsp;</strong> 2022/04/13 - 2022/04/30
            </span>
            <span className="ml-4">2022/04/30</span>
            <div className="text-xl font-bold">Withdraw the project money</div>
            <div className="relative bottom-10 text-right text-gray-400">
              <i className="fa fa-angle-right fa-2x" />
            </div>
          </div>
          <div className="h-28">
            <span className="inline-flex items-center justify-center px-3.5 py-1.5 text-lg leading-none border border-gray-400 rounded-full my-3">
              <strong>DUE DATE&nbsp;&nbsp;</strong> 2022/04/13 - 2022/04/30
            </span>
            <span className="ml-4">2022/04/30</span>
            <div className="text-xl font-bold">Withdraw the project money</div>
            <div className="relative bottom-10 text-right text-gray-400">
              <i className="fa fa-angle-right fa-2x" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectPoll;
