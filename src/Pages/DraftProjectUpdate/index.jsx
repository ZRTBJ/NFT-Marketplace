import { useState, useCallback, useEffect } from "react";
import "assets/css/CreateProject/mainView.css";
import {
  checkUniqueProjectName,
  checkUniqueTokenInfo,
  deleteAssetsOfProject,
  updateProject,
  getProjectDetailsById,
  getPublishCost,
  publishFundTransfer,
  publishProject,
  getProjectCategory,
  tokenBreakdown,
} from "services/project/projectService";

import Outline from "components/DraftProjectUpdate/Outline";
import Token from "components/DraftProjectUpdate/Token";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Confirmation from "components/DraftProjectUpdate/Confirmation";
import DeployingProjectModal from "components/modalDialog/DeployingProjectModal";
import { SendTransactions } from "util/metaMaskWallet";
import SuccessModal from "components/modalDialog/SuccessModal";
import ErrorModal from "components/modalDialog/ErrorModal";
import { useAuthState } from "Context";
import PublishModal from "components/modalDialog/PublishModal";
import LeftSideBar from "components/DraftProjectUpdate/LeftSideBar";

export default function DraftProjectUpdate() {
  const history = useHistory();
  const { id } = useParams();
  const [isDataLoading, setDataIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [tnxData, setTnxData] = useState({});
  const [projectStatus, setProjectStatus] = useState("");
  const [publishStep, setPublishStep] = useState(0);
  const [projectInfo, setProjectInfo] = useState({});
  const [tokenNameError, setTokenNameError] = useState(false);
  const context = useAuthState();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [userId, setUserId] = useState(context ? context.user : "");
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
      project_uuid: id,
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
        projectId: id,
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

    setCoverPhoto([]);
    setCoverPhotoUrl("");
  }
  // Cover photo end

  // photos start
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
        projectId: id,
        assetsId: i.id,
      };
      await deleteAssetsOfProject(payload).then((e) => {
        setUpPhotos();
      });
    } else {
      setPhotosUrl(photosUrl.filter((x) => x.name !== i.name));
    }
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
  const [projectCategoryName, setProjectCategoryName] = useState("");
  const [emptyProjeCtCategory, setEmptyProjectCategory] = useState(false);
  function onProjectCategoryChange(e) {
    setProjectCategory(e.target.value);
    setEmptyProjectCategory(false);
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
  const [photosLengthFromResponse, setPhotosLengthFromResponse] = useState(0);
  const [remainingPhotosName, setRemainingPhotosName] = useState([]);
  async function setUpPhotos() {
    let payload = {
      id: id,
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
  async function onTokenNameChange(tokenName) {
    let payload = {
      data: tokenName,
      type: "token_name",
      project_uuid: id,
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
      project_uuid: id,
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
    }
  }
  //  number of token end

  /**
   * ==============================================
   * Token End
   * ==============================================
   */

  const [ConfirmationKey, setConfirmationKey] = useState(0);
  /**
   * ==============================================
   * Confirmation end
   * ==============================================
   */

  const [currentStep, setcurrentStep] = useState([1]);

  const [showDeployModal, setShowDeployModal] = useState(false);
  async function projectDetails() {
    let payload = {
      id: id,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      if (!response.your_token_category) {
        history.push("/");
      }

      setProjectInfo(e.project);
      // outline start
      setProjectName(response.name);
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
      setOverview(response.overview);
      setProjectCategory(response.category_id);
      if (response.tags) {
        if (response.tags.length > 0) {
          let tags = [];
          response.tags.forEach((element) => {
            tags.push(element.name);
          });
          setTagList(tags);
        }
      }
      setNeedMember(response.member_needed);
      if (response.roles) {
        if (response.roles.length > 0) {
          let roles = [];
          response.roles.forEach((element) => {
            roles.push(element.name);
          });
          setRoleList(roles);
        }
      }
      // outline end

      // Token start
      setTokenName(response.token_name ? response.token_name : "");
      setTokenSymbol(response.token_symbol ? response.token_symbol : "");
      setNumberOfTokens(
        response.token_total_amount ? response.token_total_amount : ""
      );

      getProjectCategory().then((e) => {
        try {
          let CategoryName = e.categories.find(
            (x) => x.id === response.category_id
          );
          setProjectCategoryName(CategoryName.name);
        } catch (error) {
          console.log(error);
        }
      });

      // Token end
      setDataIsLoading(false);
      setConfirmationKey((pre) => pre + 1);
      setProjectStatus(response.project_status);
      if (response.project_status === "publishing") {
        setcurrentStep([1, 2, 3, 4, 5, 6, 7]);
        setPublishStep(1);
      }
    });
  }
  function handelClickNext() {
    // Outline start
    if (currentStep.length === 1) {
      if (projectName === "") {
        setemptyProjectName(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (projectCategory === "default") {
        setEmptyProjectCategory(true);
      } else {
        setcurrentStep([1, 2]);
      }
    }
    // Outline end

    // Token  start
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
          console.log(tokenName);
          setcurrentStep([1, 2, 3]);
        }
      }
      // if (!projectInfo.token_name || projectInfo.token_name.length < 1) {
      //   setTokenNameError(true);
      // } else if (!alreadyTakenTokenName && !alreadyTakenSymbol) {
      //   setcurrentStep([1, 2, 3, 4, 5, 6, 7]); // todo for now
      // }
    }
    // Token end
  }
  async function saveDraft(visibility) {
    setTokenNameError(false);
    // outline start
    if (currentStep.length === 1) {
      if (projectName === "") {
        setemptyProjectName(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (projectCategory === "") {
        setEmptyProjectCategory(true);
      } else if (
        projectName !== "" &&
        projectCategory !== "" &&
        !alreadyTakenProjectName
      ) {
        setDataIsLoading(true);

        let updatePayload = {
          id: id,
          visibility: visibility,
          name: projectName,
          category_id: projectCategory,
          overview: overview,
          tags: tagList.toString(),
          cover: coverPhoto.length > 0 ? coverPhoto[0] : null,
          photos: photos.length > 0 ? photos : null,
          photosLengthFromResponse: photosLengthFromResponse,
          remainingPhotosName: remainingPhotosName,
        };
        updateProject(updatePayload)
          .then((res) => {
            setDataIsLoading(false);
            setShowSuccessModal(true);
            projectDetails();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // outline end

    // token start
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
        if (!alreadyTakenSymbol && !alreadyTakenTokenName) {
          setDataIsLoading(true);

          let updatePayload = {
            id: id,
            token_name: tokenName,
            token_symbol: tokenSymbol,
            token_amount_total: numberOfTokens,
          };

          updateProject(updatePayload)
            .then((res) => {
              setDataIsLoading(false);
              setShowSuccessModal(true);
              projectDetails();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
    // token end
  }
  function handelClickBack() {
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
  }

  useEffect(() => {
    projectDetails();
  }, []);

  function projectTokenBreakdown() {
    setShowPublishModal(false);
    if (projectStatus === "publishing") {
      setPublishStep(1);
      setShowDeployModal(true);
    } else {
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
      tokenBreakdown(id, request)
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

  function getProjectPublishCost() {
    setDataIsLoading(true);
    getPublishCost(id)
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

  return (
    <div className="text-[white]">
      {isDataLoading && <div className="loading"></div>}
      <div className="cardContainer px-3 md:px-5">
        {currentStep.length === 1 && (
          <div>
            <LeftSideBar
              currentStep={currentStep}
              update={true}
              key={currentStep.length}
            />
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
            <LeftSideBar
              currentStep={currentStep}
              update={true}
              key={currentStep.length}
            />
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
            history.push(`/profile/${userId ? userId : ""}`);
          }}
          tnxData={tnxData}
          projectId={id}
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
