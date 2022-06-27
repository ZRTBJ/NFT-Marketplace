import { useState, useCallback, useEffect } from "react";
import "assets/css/CreateProject/mainView.css";
import { checkUniqueProjectName } from "services/project/projectService";
import Outline from "components/DraftProjectUpdate/Outline";
import Confirmation from "components/DraftProjectUpdate/Confirmation";
import {
  createProject,
  updateProject,
  checkUniqueTokenInfo,
  getPublishCost,
  getProjectDetailsById,
  tokenBreakdown,
} from "services/project/projectService";
import { useHistory } from "react-router-dom";
import LeftSideBar from "components/DraftProjectUpdate/LeftSideBar";
import Token from "components/DraftProjectUpdate/Token";
import DeployingProjectModal from "components/modalDialog/DeployingProjectModal";
import ErrorModal from "components/modalDialog/ErrorModal";
import SuccessModal from "components/modalDialog/SuccessModal";
import PublishModal from "components/modalDialog/PublishModal";

import { useAuthState } from "Context";
import { getProjectCategory } from "services/project/projectService";

export default function ProjectCreate() {
  const history = useHistory();
  /**
   * ==============================================
   * Outline Start
   * ==============================================
   */

  // Project Name start
  const [projectName, setProjectName] = useState("");
  const [emptyProjectName, setemptyProjectName] = useState(false);
  const [alreadyTakenProjectName, setAlreadyTakenProjectName] = useState(false);
  async function onProjectNameChange(e) {
    let payload = {
      projectName: e,
    };
    setProjectName(payload.projectName);
    await checkUniqueProjectName(payload)
      .then((e) => {
        if (e.code === 0) {
          setemptyProjectName(false);
          setAlreadyTakenProjectName(false);
        } else {
          setAlreadyTakenProjectName(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // Project Name End

  // Cover photo start
  const [coverPhoto, setCoverPhoto] = useState([]);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const onCoverPhotoSelect = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      setCoverPhoto(acceptedFiles);
      let objectUrl = URL.createObjectURL(acceptedFiles[0]);
      let coverPhotoInfo = {
        path: objectUrl,
      };
      setCoverPhotoUrl(coverPhotoInfo);
      setoutlineKey(1);
    }
  }, []);
  function onCoverPhotoRemove() {
    setCoverPhoto([]);
    setCoverPhotoUrl("");
  }
  // Cover photo end

  // photos start
  const [photos, setPshotos] = useState([]);
  const [photosUrl, setPhotosUrl] = useState([]);
  const onPhotosSelect = useCallback((acceptedFiles) => {
    let totalSize = 0;
    acceptedFiles.forEach((element) => {
      totalSize = totalSize + element.size;
    });
    if (totalSize > 16000000) {
      alert("Size Exceed");
    } else {
      let objectUrl = [];
      acceptedFiles.forEach((element) => {
        objectUrl.push({
          name: element.name,
          path: URL.createObjectURL(element),
        });
      });
      setPshotos(acceptedFiles);
      setPhotosUrl(objectUrl);
    }
  }, []);
  function onPhotosRemove(fileName) {
    setPshotos(photos.filter((x) => x.name !== fileName.name));
    setPhotosUrl(photosUrl.filter((x) => x.name !== fileName.name));
  }
  // Photos End

  // overview start
  const [overview, setOverview] = useState("");
  function onOverviewChange(e) {
    setOverview(e.target.value);
  }
  // overview End

  // category start
  const [projectCategory, setProjectCategory] = useState("");
  const [emptyProjeCtCategory, setEmptyProjectCategory] = useState(false);
  const [projectCategoryName, setProjectCategoryName] = useState("");
  function onProjectCategoryChange(event) {
    setProjectCategory(event.target.value);
    setEmptyProjectCategory(false);
    const categoryName = projectCategoryList.find(
      (x) => x.id === parseInt(event.target.value)
    );

    setProjectCategoryName(categoryName ? categoryName.name : "");
  }
  // category end

  // tags start
  const [tagList, setTagList] = useState([]);
  const [tagLimit, setTagLimit] = useState(false);
  function onTagEnter(event) {
    const value = event.target.value;
    if (event.code === "Enter" && value.length > 0) {
      if (tagList.length > 4) {
        setTagLimit(true);
      } else {
        setTagList([...tagList, value]);
        event.target.value = "";
      }
    }
  }
  function onTagRemove(index) {
    if (index >= 0) {
      const newRoleList = [...tagList];
      newRoleList.splice(index, 1);
      setTagList(newRoleList);
      setTagLimit(false);
    }
  }
  // tag end

  // role start
  const [roleList, setRoleList] = useState([]);
  function onRoleEnter(event) {
    const value = event.target.value;
    if (event.code === "Enter" && value.length > 0) {
      setRoleList([...roleList, value]);
      event.target.value = "";
    }
  }
  function onRoleRemove(index) {
    if (index >= 0) {
      const newRoleList = [...roleList];
      newRoleList.splice(index, 1);
      setRoleList(newRoleList);
    }
  }

  // role end

  // Need mamber start
  const [needMember, setNeedMember] = useState(false);
  function onNeedMemberChange(e) {
    if (e) {
      setNeedMember(true);
    } else {
      setRoleList([]);
      setNeedMember(false);
    }
  }
  // need member end

  const [outlineKey, setoutlineKey] = useState(0);

  /**
   * ==============================================
   * Outline ENd
   * ==============================================
   */
  /**
   * ==============================================
   * Token Start
   * ==============================================
   */

  // token name start
  const [tokenName, setTokenName] = useState("");
  const [alreadyTakenTokenName, setAlreadyTakenTokenName] = useState(false);
  const [emptyToken, setEmptyToken] = useState(false);
  // const [tokenNameError, setTokenNameError] = useState(false);
  async function onTokenNameChange(tokenName) {
    let payload = {
      data: tokenName,
      type: "token_name",
    };
    setTokenName(tokenName);
    setEmptyToken(false);
    await checkUniqueTokenInfo(payload)
      .then((e) => {
        if (e.code === 0) {
          setAlreadyTakenTokenName(false);
        } else {
          setAlreadyTakenTokenName(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // token name end

  // token name start
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [alreadyTakenSymbol, setAlreadyTakenSymbol] = useState(false);
  const [emptySymbol, setEmptySymbol] = useState(false);
  async function onTokenSymbolChange(tokenSymbol) {
    let payload = {
      data: tokenSymbol,
      type: "token_symbol",
    };
    setTokenSymbol(tokenSymbol);
    setEmptySymbol(false);
    await checkUniqueTokenInfo(payload)
      .then((e) => {
        if (e.code === 0) {
          setAlreadyTakenSymbol(false);
        } else {
          setAlreadyTakenSymbol(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // token name end

  // number of token
  const [numberOfTokens, setNumberOfTokens] = useState("");
  const [emptyNumberOfToken, setEmptyNumberOfToken] = useState(false);
  function isInDesiredForm(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  }
  async function onNumberOfTokenChange(params) {
    if (params === "") {
      setNumberOfTokens("");
    }
    let token = isInDesiredForm(params);
    if (token) {
      setNumberOfTokens(params);
      setEmptyNumberOfToken(false);
    }
  }
  // const [projectInfo, setProjectInfo] = useState({});
  //  number of token end

  /**
   * ==============================================
   * Token End
   * ==============================================
   */

  const [currentStep, setcurrentStep] = useState([1]);
  const [projectCreated, setProjectCreated] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [publishStep, setPublishStep] = useState(0);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [tnxData, setTnxData] = useState({});
  const [isDataLoading, setDataIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const context = useAuthState();
  const [userId, setUserId] = useState(context ? context.user : "");
  const [projectInfo, setProjectInfo] = useState({});
  const [projectCategoryList, setProjectCategoryList] = useState([]);

  function handelClickBack() {
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
  }
  function handelClickNext() {
    // outline
    if (currentStep.length === 1) {
      if (projectName === "") {
        setemptyProjectName(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (projectCategory === "") {
        setEmptyProjectCategory(true);
      } else if (
        projectName !== "" &&
        projectCategory !== "" &&
        alreadyTakenProjectName === false
      ) {
        setcurrentStep([1, 2]);
      }
    }

    // token
    if (currentStep.length === 2) {
      if (tokenName === "") {
        setEmptyToken(true);
      }
      if (tokenSymbol === "") {
        setEmptySymbol(true);
      }
      if (numberOfTokens === "") {
        setEmptyNumberOfToken(true);
      } else if (
        tokenName !== "" &&
        tokenSymbol !== "" &&
        numberOfTokens !== ""
      ) {
        if (!alreadyTakenTokenName && !alreadyTakenSymbol) {
          setcurrentStep([1, 2, 3]);
        }
      }
      // if (!projectInfo.token_name || projectInfo.token_name.length < 1) {
      //   setTokenNameError(true);
      // } else if (!alreadyTakenTokenName && !alreadyTakenSymbol) {
      //   setcurrentStep([1, 2, 3, 4, 5, 6, 7]); // todo for now
      // }
    }
  }
  async function projectTokenBreakdown() {
    setShowPublishModal(false);
    if (projectStatus === "publishing") {
      setPublishStep(1);
      setShowDeployModal(true);
    } else {
      let id = "";
      if (!projectCreated) {
        id = await createNewProject();
        await updateExistingProject(id, "public");
        await projectDetails(id);
      } else if (projectCreated && projectId !== "") {
        await updateExistingProject(id, "public");
        await projectDetails(id);
      }
      let data = {
        user_id: userId,
        token_category_id:
          projectInfo &&
          projectInfo.token_category &&
          projectInfo.token_category[0] &&
          projectInfo.token_category[0].id
            ? projectInfo.token_category[0].id
            : 1,
        token_amount: parseInt(numberOfTokens),
      };
      const request = new FormData();
      request.append("allocation", JSON.stringify(data));
      setDataIsLoading(true);
      await tokenBreakdown(id, request)
        .then((res) => {
          if (res.code === 0) {
            getProjectPublishCost();
            setDataIsLoading(false);
          } else {
            setDataIsLoading(false);
            setShowErrorModal(true);
          }
        })
        .catch((err) => {
          setDataIsLoading(false);
        });
    }
  }
  async function getProjectPublishCost() {
    await getPublishCost(projectId)
      .then((res) => {
        if (
          res.code === 0 &&
          res.data &&
          res.data.amount &&
          res.data.gasPrice &&
          res.data.toEoa
        ) {
          setTnxData(res.data);
          setShowDeployModal(true);
          setDataIsLoading(false);
        } else {
          setDataIsLoading(false);
          setShowErrorModal(true);
        }
      })
      .catch((err) => {
        setDataIsLoading(false);
      });
  }
  async function createBlock(id, visibility) {
    setDataIsLoading(true);
    id = await createNewProject();
    await updateExistingProject(id, visibility);
    await projectDetails(id);
    setDataIsLoading(false);
    setShowSuccessModal(true);
  }
  async function updateBlock(id, visibility) {
    setDataIsLoading(true);
    await updateExistingProject(id, visibility);
    await projectDetails(id);
    setDataIsLoading(false);
    setShowSuccessModal(true);
  }
  async function saveDraft(visibility) {
    // outline
    if (currentStep.length === 1) {
      if (projectName === "") {
        setemptyProjectName(true);
      }
      if (projectCategory === "") {
        setEmptyProjectCategory(true);
      } else if (
        projectName !== "" &&
        projectCategory !== "" &&
        alreadyTakenProjectName === false
      ) {
        let id = "";
        if (!projectCreated) {
          await createBlock(id, visibility);
        } else if (projectCreated && projectId !== "") {
          await updateBlock(id, visibility);
        }
      }
    }

    // Token
    if (currentStep.length === 2) {
      if (tokenName === "") {
        setEmptyToken(true);
      }
      if (tokenSymbol === "") {
        setEmptySymbol(true);
      }
      if (numberOfTokens === "") {
        setEmptyNumberOfToken(true);
      } else if (
        tokenName !== "" &&
        tokenSymbol !== "" &&
        numberOfTokens !== ""
      ) {
        if (!alreadyTakenTokenName && !alreadyTakenSymbol) {
          let id = "";
          if (!projectCreated) {
            await createBlock(id, visibility);
          } else if (projectCreated && projectId !== "") {
            await updateBlock(id, visibility);
          }
        }
      }
    }

    // confirmation
    if (currentStep.length === 3) {
      if (!projectCreated) {
        await createNewProject(visibility);
      } else if (projectCreated && projectId !== "") {
        await updateExistingProject();
      }
    }
  }
  async function createNewProject() {
    let createPayload = {
      name: projectName,
      category_id: projectCategory,
    };

    let projectId = "";
    await createProject(createPayload)
      .then((res) => {
        if (res.code === 4003) {
          setAlreadyTakenProjectName(true);
          setcurrentStep([1]);
          window.scrollTo(0, 0);
        } else if (res.code === 0) {
          projectId = res.project.id;
          setProjectCreated(true);
          setProjectId(projectId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return projectId;
  }
  async function updateExistingProject(id, visibility) {
    let updatePayload = {
      name: projectName,
      category_id: projectCategory,
      id: id ? id : projectId,
      cover: coverPhoto[0],
      photos: photos,
      overview: overview,
      tags: tagList.toString(),
      need_member: needMember,
      roles: roleList.toString(),
      visibility: visibility,
      token_name: tokenName,
      token_symbol: tokenSymbol,
      token_amount_total: numberOfTokens,
    };
    await updateProject("create", updatePayload);
  }
  async function projectDetails(id) {
    let payload = {
      id: id ? id : projectId,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      setProjectInfo(e.project);
      setProjectStatus(response.project_status);
      if (response.project_status === "publishing") {
        setcurrentStep([1, 2, 3]);
        setPublishStep(1);
      }
    });
  }
  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);
  return (
    <div className="text-[white]">
      {isDataLoading && <div className="loading"></div>}
      <div className="cardContainer px-3 md:px-5">
        {currentStep.length === 1 && (
          <div>
            <LeftSideBar currentStep={currentStep} key={currentStep.length} />
            <Outline
              key={outlineKey}
              // name
              projectName={projectName}
              emptyProjectName={emptyProjectName}
              alreadyTakenProjectName={alreadyTakenProjectName}
              onProjectNameChange={onProjectNameChange}
              //cover photos
              coverPhotoUrl={coverPhotoUrl}
              onCoverPhotoSelect={onCoverPhotoSelect}
              onCoverPhotoRemove={onCoverPhotoRemove}
              //photos
              photosUrl={photosUrl}
              onPhotosSelect={onPhotosSelect}
              onPhotosRemove={onPhotosRemove}
              // overview
              overview={overview}
              onOverviewChange={onOverviewChange}
              // category
              projectCategory={projectCategory}
              emptyProjeCtCategory={emptyProjeCtCategory}
              onProjectCategoryChange={onProjectCategoryChange}
              // tag
              tagList={tagList}
              tagLimit={tagLimit}
              onTagEnter={onTagEnter}
              onTagRemove={onTagRemove}
              // need member
              needMember={needMember}
              onNeedMemberChange={onNeedMemberChange}
              // role list
              roleList={roleList}
              onRoleEnter={onRoleEnter}
              onRoleRemove={onRoleRemove}
            />
          </div>
        )}
        {currentStep.length === 2 && (
          <div>
            <LeftSideBar currentStep={currentStep} key={currentStep.length} />
            <Token
              // token name
              tokenName={tokenName}
              emptyToken={emptyToken}
              alreadyTakenTokenName={alreadyTakenTokenName}
              onTokenNameChange={onTokenNameChange}
              // token symbol
              tokenSymbol={tokenSymbol}
              emptySymbol={emptySymbol}
              alreadyTakenSymbol={alreadyTakenSymbol}
              onTokenSymbolChange={onTokenSymbolChange}
              // number of token
              numberOfTokens={numberOfTokens}
              emptyNumberOfToken={emptyNumberOfToken}
              onNumberOfTokenChange={onNumberOfTokenChange}
            />
          </div>
        )}
        {currentStep.length === 3 && (
          <Confirmation
            projectName={projectName}
            projectCover={coverPhotoUrl}
            photosUrl={photosUrl}
            overview={overview}
            category={projectCategoryName}
            tagList={tagList}
            needMember={needMember}
            roleList={roleList}
            tokenName={tokenName}
            tokenSymbol={tokenSymbol}
            numberOfTokens={numberOfTokens}
          />
        )}
        <div className="buttonContainer">
          {projectStatus !== "publishing" && (
            <div className="flex">
              {currentStep.length > 1 && (
                <button
                  className="btn-outline-primary mr-4 w-[100px] h-[38px]"
                  onClick={() => handelClickBack()}
                >
                  BACK
                </button>
              )}
              {currentStep.length < 3 && (
                <button
                  className="btn-primary w-[100px] h-[38px]"
                  onClick={() => handelClickNext()}
                >
                  NEXT
                </button>
              )}
              {currentStep.length < 3 && (
                <button
                  onClick={() => saveDraft("public")}
                  className={`btn-outline-primary w-[140px] h-[38px] ml-auto`}
                >
                  Save to Draft
                </button>
              )}
              {currentStep.length === 3 && (
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="btn-primary w-[100px] h-[38px] ml-auto"
                >
                  PUBLISH
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {showDeployModal && (
        <DeployingProjectModal
          show={showDeployModal}
          handleClose={(status) => {
            setShowDeployModal(status);
            projectDetails(projectId);
          }}
          tnxData={tnxData}
          projectId={projectId}
          publishStep={publishStep}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          handleClose={() => setShowSuccessModal(false)}
          show={showSuccessModal}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          show={showErrorModal}
        />
      )}
      {showPublishModal && (
        <PublishModal
          handleClose={() => setShowPublishModal(false)}
          publishProject={projectTokenBreakdown}
          show={showPublishModal}
        />
      )}
    </div>
  );
}
