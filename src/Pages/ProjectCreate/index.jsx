import { useState, useCallback } from "react";
import "assets/css/CreateProject/mainView.css";
import { checkUniqueProjectName } from "services/project/projectService";
import selectTypeTabData from "Pages/DraftProjectUpdate/projectCreateData";
import SelectType from "components/DraftProjectUpdate/SelectType";
import Outline from "components/DraftProjectUpdate/Outline";
import { createProject, updateProject } from "services/project/projectService";
import DraftLogo from "assets/images/projectCreate/draftLogo.svg";
import Modal from "components/Modal";
import FullScreenModal from "components/FullScreenModal";
import { useHistory } from "react-router-dom";
export default function ProjectCreate() {
  const history = useHistory();
  const [showFullScreenModal, setShowFullScreenModal] = useState(true);
  function selectProjectTypeRadient(i) {
    setSelectedTab(i);
    setShowFullScreenModal(false);
  }
  /**
   * ==============================================
   * Project Type Start
   * ==============================================
   */
  const [selectedTab, setSelectedTab] = useState(selectTypeTabData[0]);
  const [votingPower, setVotingPower] = useState("");
  const [canVote, setCanVote] = useState("");
  function setActiveTab(arg) {
    setSelectedTab(arg);
  }
  function votingPowerProps(params) {
    setVotingPower(params);
  }
  function canVoteProps(params) {
    setCanVote(params);
  }
  /**
   * ==============================================
   * Project Type End
   * ==============================================
   */

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
      setCoverPhotoUrl(objectUrl);
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
          url: URL.createObjectURL(element),
        });
      });
      setPshotos(acceptedFiles);
      setPhotosUrl(objectUrl);
    }
  }, []);
  function onPhotosRemove(fileName) {
    setPshotos(photos.filter((x) => x.name !== fileName));
    setPhotosUrl(photosUrl.filter((x) => x.name !== fileName));
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

  /**
   * ==============================================
   * Outline ENd
   * ==============================================
   */
  const [currentStep, setcurrentStep] = useState([1]);
  const [isLoadingPublic, setisLoadingPublic] = useState(false);
  const [isLoadingPrivate, setisLoadingPrivate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  async function saveDraft(visibility) {
    if (currentStep.length === 2) {
      if (projectName === "") {
        setemptyProjectName(true);
      }
      if (projectCategory === "") {
        setEmptyProjectCategory(true);
      }
      if (
        projectName !== "" &&
        projectCategory !== "" &&
        alreadyTakenProjectName === false
      ) {
        // console.log(
        //   selectedTab,
        //   projectName,
        //   coverPhoto,
        //   photos,
        //   projectCategory,
        //   overview,
        //   tagList,
        //   needMember,
        //   roleList
        // );
      }

      let createPayload = {
        name: projectName,
        category_id: projectCategory,
        org_type: selectedTab.title.toLocaleLowerCase(),
        voting_power: selectedTab.votingPower.find((x) => x.active === true)
          .value,
        voter_mode: selectedTab.canVote.find((x) => x.active === true).value,
      };
      if (visibility === "private") {
        setisLoadingPrivate(true);
      } else if (visibility === "public") {
        setisLoadingPublic(true);
      }
      await createProject(createPayload)
        .then((res) => {
          const r = res.project;
          let updatePayload = {
            ...createPayload,
            id: r.id,
            cover: coverPhoto[0],
            photos: photos,
            overview: overview,
            tags: tagList.toString(),
            need_member: needMember,
            roles: roleList.toString(),
            visibility: visibility,
          };
          updateProject("create", updatePayload)
            .then(() => {
              if (visibility === "private") {
                setisLoadingPrivate(false);
              } else if (visibility === "public") {
                setisLoadingPublic(false);
              }
              setShowModal(true);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      // setcurrentStep([1, 2, 3]);
    }
  }
  function handelClickBack() {
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
  }
  function handelClickNext() {
    if (currentStep.length === 1) {
      if (selectedTab.title === "CUSTOM") {
        if (votingPower === "" && canVote === "") {
          alert("Chosse 1 who have voting power and who can vote");
        } else if (votingPower === "") {
          alert("Chosse 1 who have voting power");
        } else if (canVote === "") {
          alert("Chosse 1 who can vote");
        } else if (votingPower !== "" && canVote !== "") {
          setcurrentStep([1, 2]);
        }
      } else {
        setcurrentStep([1, 2]);
      }
    }
  }
  return (
    <div>
      {showFullScreenModal && (
        <FullScreenModal>
          <div className="text-center mt-[50px]">
            <div className="mb-[24px] text-[42px] font-[600] text-[#192434]">
              Welcome to CREABO
            </div>
            <div className="mb-[35px] text-[#192434]">
              What are the objectives of your project?
            </div>
            <div className="md:max-w-[580px] block mx-auto">
              <div className="flex flex-wrap justify-between">
                {selectTypeTabData.map((i) => (
                  <div key={i.id} className="md:max-w-[280px] mb-8">
                    <div
                      className="w-[280px] selectProjectTypeCardHeaderRedient h-[125px] pt-[50px] rounded-tl-lg rounded-tr-lg"
                      style={{ background: i.backgroundColor }}
                    >
                      {i.title}
                    </div>
                    <div className="selectTypeCardBoxShadow rounded-bl-lg rounded-br-lg">
                      <div className="p-3">{i.text}</div>
                      <button
                        className="h-[40px] m-3 w-[120px] bg-[#0AB4AF] text-[white] rounded"
                        onClick={() => selectProjectTypeRadient(i)}
                      >
                        SELECT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FullScreenModal>
      )}
      <div className="flex flex-col md:flex-row ">
        <div className="flex-1">
          <div className="cardContainer px-3 md:px-5">
            {currentStep.length === 1 && (
              <SelectType
                setActiveTab={setActiveTab}
                votingPowerProps={votingPowerProps}
                canVoteProps={canVoteProps}
                selectedTab={selectedTab}
              />
            )}
            {currentStep.length === 2 && (
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
            )}
            <div className="buttonContainer">
              <div
                className={
                  currentStep.length > 1
                    ? "flex justify-between"
                    : "flex justify-end"
                }
              >
                {currentStep.length > 1 ? (
                  <button
                    className="backButton"
                    onClick={() => handelClickBack()}
                    disabled={
                      isLoadingPrivate ? true : isLoadingPublic ? true : false
                    }
                  >
                    BACK
                  </button>
                ) : (
                  <button
                    className="nextButton"
                    onClick={() => handelClickNext()}
                  >
                    NEXT
                  </button>
                )}
              </div>
              {currentStep.length > 1 && (
                <div className="flex justify-center space-x-6 mt-4">
                  <button
                    onClick={() => saveDraft("private")}
                    disabled={isLoadingPrivate ? true : false}
                    className={`
                  ${
                    isLoadingPrivate === true ? "onlySpinner" : ""
                  } h-[54px] w-[200px] rounded bg-[#B9CCD5] text-[white] hover:bg-[#192434]
                `}
                  >
                    {isLoadingPrivate ? "" : "PRIVATE"}
                  </button>
                  <button
                    onClick={() => saveDraft("public")}
                    disabled={isLoadingPublic ? true : false}
                    className={`
                  ${
                    isLoadingPublic === true ? "onlySpinner" : ""
                  } h-[54px] w-[200px] rounded bg-[#0AB4AF] text-[white] hover:bg-[#192434]
                `}
                  >
                    {isLoadingPublic ? "" : "PUBLIC"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {showModal && (
          <Modal
            height={361}
            width={800}
            show={showModal}
            handleClose={() => setShowModal(false)}
          >
            <div className="text-center">
              <img
                className="w-[151px] h-[133px] block mx-auto mt-[50px]"
                src={DraftLogo}
                alt=""
              />
              <div className="mb-4 text-[20px] font-bold color-[#192434] draftModalText">
                Your project saved the draft.
              </div>
              <div className="font-roboto mb-6">
                You can edit information from your project list
              </div>
              <button
                onClick={() => history.push("/profile-project-list")}
                className="w-[200px] h-[54px] bg-[#0AB4AF] rounded text-white"
              >
                PROJECT LIST
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
