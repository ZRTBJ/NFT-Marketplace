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
  deleteAssetsOfProject,
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
    if (coverPhotoUrl.id) {
      let payload = {
        projectId: projectInfo.id,
        assetsId: coverPhotoUrl.id,
      };
      deleteAssetsOfProject(payload).then((e) => {
        setCoverPhoto([]);
        setCoverPhotoUrl("");
      });
    } else {
      setCoverPhoto([]);
      setCoverPhotoUrl("");
    }
  }
  // Cover photo end

  // photos start
  const [photosLengthFromResponse, setPhotosLengthFromResponse] = useState(0);
  const [remainingPhotosName, setRemainingPhotosName] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [photosUrl, setPhotosUrl] = useState([]);
  const onPhotosSelect = useCallback((params, photos) => {
    if (photosLengthFromResponse + params.length > 4) {
      alert("Maxmimum 4 photos");
    } else {
      let totalSize = 0;
      params.forEach((element) => {
        totalSize = totalSize + element.size;
      });
      if (totalSize > 16000000) {
        alert("Size Exceed");
      } else {
        let objectUrl = [];
        params.forEach((element) => {
          objectUrl.push({
            name: element.name,
            path: URL.createObjectURL(element),
          });
        });
        let megred = [...photos, ...objectUrl];
        setPhotosUrl(megred);
        setPhotos(params);
      }
    }
  }, []);
  async function onPhotosRemove(i) {
    if (i.id) {
      let payload = {
        projectId: projectInfo.id,
        assetsId: i.id,
      };
      await deleteAssetsOfProject(payload).then((e) => {
        setUpPhotos();
      });
    } else {
      setPhotosUrl(photosUrl.filter((x) => x.name !== i.name));
    }
  }
  async function setUpPhotos() {
    let payload = {
      id: projectInfo.id,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      let photosInfoData = response.assets.filter(
        (x) => x.asset_purpose === "subphoto"
      );
      setPhotosLengthFromResponse(photosInfoData.length);
      setPhotosUrl(photosInfoData);
      let constPhotosName = ["img1", "img2", "img3", "img4"];
      let photosname = [];
      photosname = photosInfoData.map((e) => {
        return e.name;
      });
      let remainingPhotosName = constPhotosName.filter(function (v) {
        return !photosname.includes(v);
      });
      setRemainingPhotosName(remainingPhotosName);
    });
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

  async function intiProjectPublish() {
    setShowPublishModal(false);
    if (projectStatus === "publishing") {
      setPublishStep(1);
      setShowDeployModal(true);
    } else {
      try {
        let id = projectInfo && projectInfo.id ? projectInfo.id : "";
        setDataIsLoading(true);
        if (!projectCreated) {
          id = await createNewProject();
          await updateExistingProject(id, "public");
          getProjectStatus(id);
        } else if (projectCreated && id !== "") {
          await updateExistingProject(id, "public");
          getProjectStatus(id);
        }
        await delay(1000);
      } catch {
        setDataIsLoading(false);
      }
    }

    function getProjectStatus(id) {
      let payload = {
        id: id ? id : projectId,
      };
      getProjectDetailsById(payload)
        .then((e) => {
          let proj = e.project;
          id = proj.id;
          if (
            proj &&
            proj.token_category &&
            proj.token_category[0] &&
            proj.token_category[0].id
          ) {
            projectTokenBreakdown(id, proj.token_category[0].id);
          }
        })
        .catch((ex) => {
          setDataIsLoading(false);
        });
    }

    async function projectTokenBreakdown(projectId, token_category_id) {
      let data = {
        user_id: userId,
        token_category_id: token_category_id
          ? token_category_id
          : projectInfo &&
            projectInfo.token_category &&
            projectInfo.token_category[0] &&
            projectInfo.token_category[0].id
          ? projectInfo.token_category[0].id
          : 1,
        token_amount: parseInt(numberOfTokens),
      };
      const request = new FormData();
      request.append("allocation", JSON.stringify(data));
      await tokenBreakdown(projectId, request)
        .then((res) => {
          if (res.code === 0) {
            getProjectPublishCost(projectId);
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

  async function getProjectPublishCost(id) {
    if (id || (projectInfo && projectInfo.id)) {
      await getPublishCost(id ? id : projectInfo.id)
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
      cover: coverPhoto.length > 0 ? coverPhoto[0] : null,
      photos: photos.length > 0 ? photos : null,
      photosLengthFromResponse: photosLengthFromResponse,
      remainingPhotosName: remainingPhotosName,
      overview: overview,
      tags: tagList.toString(),
      roles: roleList.toString(),
      visibility: visibility,
      token_name: tokenName,
      token_symbol: tokenSymbol,
      token_amount_total: numberOfTokens,
    };
    await updateProject(updatePayload);
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
      let cover = response.assets.find((x) => x.asset_purpose === "cover");
      setCoverPhotoUrl(cover ? cover : "");
      let photosInfoData = response.assets.filter(
        (x) => x.asset_purpose === "subphoto"
      );
      setPhotosLengthFromResponse(photosInfoData.length);
      setPhotosUrl(photosInfoData);
      let constPhotosName = ["img1", "img2", "img3", "img4"];
      let photosname = [];
      photosname = photosInfoData.map((e) => {
        return e.name;
      });
      let remainingPhotosName = constPhotosName.filter(function (v) {
        return !photosname.includes(v);
      });
      setRemainingPhotosName(remainingPhotosName);
    });
  }
  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  return (
    <>
      {isDataLoading && <div className="loading"></div>}

      <div className="text-white max-w-[600px] mx-auto md:pt-12">
        <div className="create-project-container">
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
        </div>

        <div className="buttonContainer">
          <div className="flex">
            {projectStatus !== "publishing" && (
              <>
                {currentStep.length > 1 && (
                  <button
                    className="btn-secondary-link btn-sm"
                    onClick={() => handelClickBack()}
                  >
                    <i class="fa-regular fa-angle-left mr-1"></i> BACK
                  </button>
                )}
                {currentStep.length < 3 && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handelClickNext()}
                  >
                    Next <i class="fa-regular fa-angle-right ml-1"></i>
                  </button>
                )}
                {currentStep.length < 3 && projectStatus !== "published" && (
                  <button
                    onClick={() => saveDraft("public")}
                    className={`btn-secondary-link btn-sm ml-auto`}
                  >
                    Save to Draft
                  </button>
                )}
              </>
            )}
            {currentStep.length === 3 && projectStatus !== "published" && (
              <button
                onClick={() => {
                  if (projectStatus === "publishing") {
                    intiProjectPublish();
                  } else {
                    setShowPublishModal(true);
                  }
                }}
                className="btn btn-primary btn-sm ml-auto"
              >
                Publish
              </button>
            )}
          </div>
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
          publishProject={intiProjectPublish}
          show={showPublishModal}
        />
      )}
    </>
  );
}
