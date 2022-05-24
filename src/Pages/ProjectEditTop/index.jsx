/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ProjectEditTopNavigationCard from "components/ProjectEdit/ProjectEditTopNavigationCard";
import ProjectCover from "components/ProjectEdit/ProjectCover";
import { useParams } from "react-router-dom";
import { getProjectDetailsById } from "services/project/projectService";
import SuccessModal from "components/modalDialog/SuccessModal";
import ErrorModal from "components/modalDialog/ErrorModal";
import { useSelector } from "react-redux";
import profile from "assets/images/profile/profile.svg";
import {
  updateProject,
  deleteAssetsOfProject,
} from "services/project/projectService";
function ProjectEditOutline(props) {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [projectInfo, setProjectInfo] = useState({});
  const userinfo = useSelector((state) => state.user.userinfo);
  async function projectDetails() {
    let payload = {
      id: id,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      setProjectInfo(response);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    projectDetails();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="loading"></div>
      ) : (
        <div className="text-[#192434]">
          <div className="sticky z-[1]">
            <ProjectEditTopNavigationCard />
          </div>
          <div className="relative md:bottom-8">
            <ProjectCover />
          </div>
          <div className="max-w-[630px] block mx-auto px-6 md:px-0">
            <div>
              <div className="roboto text-[14px] md:text-[16px] mb-[8px] md:mb-[14px] font-bold text-[#192434]">
                YOUR TOKEN
              </div>
              <div className="h-[148px] md:h-[168px] max-w-[347px] md:max-w-[400px] border border-[#CCCCCC] pl-[14px] md:pl-[24px]">
                <div className="flex flex-wrap items-center pt-[18px] md:pt-[29px]">
                  <div>
                    <img
                      src={userinfo.avatar === "" ? profile : userinfo.avatar}
                      alt=""
                      className="h-[80px] w-[80px] md:h-[100px] md:w-[100px] rounded-[50px] object-cover"
                    />
                    <div className="text-[12px] md:text-[16px] text-center">
                      {userinfo.display_name}
                    </div>
                  </div>
                  <div className="ml-[18px] md:ml-[28px]">
                    <div className="mb-[10px] text-[12px] text-gray-400">
                      Your Token type
                    </div>
                    <div className="mb-[15px] md:mb-[25px]">
                      {projectInfo.your_token_category.name}
                    </div>
                    <div className="text-[12px] text-gray-400 mb-[10px]">
                      How much your token of this project
                    </div>
                    {projectInfo.your_token_category.project_token_percent}{" "}
                    {projectInfo.token_symbol}{" "}
                    <span className="text-gray-400">(0000MATIC)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[30px]">
              <div className="roboto text-[14px] md:text-[16px] mb-[8px] md:mb-[14px] font-bold">
                PROJECT TOKEN
              </div>
              <div className="pb-6 max-w-[347px] md:max-w-[400px] border border-[#CCCCCC] pt-[20px] md:pt-[31px] pl-[14px] md:pl-[30px]">
                <div className="text-[12px] text-gray-400 mb-[10px]">
                  Token name
                </div>
                <div className="mb-[24px]">{projectInfo.token_name}</div>
                <div className="text-[12px] text-gray-400 mb-[10px]">
                  Token symbol (Up to 5 characters)
                </div>
                <div className="mb-[24px]">{projectInfo.token_symbol}</div>
                <div className="text-[12px] text-gray-400 mb-[10px]">
                  Number of tokens
                </div>
                {projectInfo.token_total_amount} {projectInfo.token_symbol}
                <span className="text-gray-400">(0000MATIC)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <SuccessModal
          handleClose={setShowSuccessModal}
          show={showSuccessModal}
        />
      )}
      {showErrorModal && (
        <ErrorModal handleClose={setShowErrorModal} show={showErrorModal} />
      )}
    </div>
  );
}

export default ProjectEditOutline;
