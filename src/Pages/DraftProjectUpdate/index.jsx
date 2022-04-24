import { useState, useCallback, useEffect } from "react";
import "assets/css/CreateProject/mainView.css";
import { checkUniqueProjectName } from "services/project/projectService";
import selectTypeTabData from "Pages/DraftProjectUpdate/projectCreateData";
import LeftSideBar from "components/DraftProjectUpdate/LeftSideBar";
import SelectType from "components/DraftProjectUpdate/SelectType";
import Outline from "components/DraftProjectUpdate/Outline";
import Token from "components/DraftProjectUpdate/Token";
import { createProject, updateProject } from "services/project/projectService";
import DraftLogo from "assets/images/projectCreate/draftLogo.svg";
import Modal from "components/Modal";
import { useParams } from "react-router-dom";
import { getProjectDetailsById } from "services/project/projectService";

export default function DraftProjectUpdate() {
  /**
   * ==============================================
   * Project Type Start
   * ==============================================
   */
  const [selectedTab, setSelectedTab] = useState(selectTypeTabData[0]);
  const [votingPower, setVotingPower] = useState("");
  const [canVote, setCanVote] = useState("");
  const { id } = useParams();
  const [isDataLoading, setDataIsLoading] = useState(true);
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
  const [projectName, setProjectName] = useState("");
  const [coverPhoto, setCoverPhoto] = useState([]);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const [emptyProjectName, setemptyProjectName] = useState(false);
  const [alreadyTakenProjectName, setAlreadyTakenProjectName] = useState(false);
  const [photos, setPshotos] = useState([]);
  const [projectCategory, setProjectCategory] = useState("");
  const [emptyProjeCtCategory, setEmptyProjectCategory] = useState(false);
  const [overview, SetOverview] = useState("");
  const [tagsList, SetTagsList] = useState([]);
  const [needMember, setNeedMember] = useState(false);
  const [roleList, setRollList] = useState([]);

  function overviewOnChange(e) {
    SetOverview(e);
  }
  async function onProjectNameChange(e) {
    let payload = {
      projectName: e,
    };
    await checkUniqueProjectName(payload)
      .then((e) => {
        if (e.code === 0) {
          setProjectName(payload.projectName);
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
  function closeCoverPhotoPreview() {
    setCoverPhoto([]);
  }
  const onCoverDrop = useCallback((acceptedFiles) => {
    setCoverPhoto(acceptedFiles);
  }, []);
  function closePhotoPreview(fileName) {
    setPshotos(photos.filter((x) => x.name !== fileName));
  }
  const onPhotoDrop = useCallback((acceptedFiles) => {
    setPshotos(acceptedFiles);
  }, []);
  function onProjectCategoryChange(e) {
    setProjectCategory(e);
    setEmptyProjectCategory(false);
  }
  function onChangeTagList(type, list) {
    if (type === "tag") {
      SetTagsList(list);
    } else if (type === "role") {
      setRollList(list);
    }
  }
  function onNeedMemberChange(e) {
    setNeedMember(e);
  }
  async function projectDetails() {
    let payload = {
      id: id,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      if (response.org_type !== "") {
        let org_type = selectTypeTabData.find(
          (x) => x.title === response.org_type.toUpperCase()
        );
        setSelectedTab(org_type);
      }
      setProjectName(response.name);
      let cover = response.assets.find((x) => x.asset_purpose === "cover");
      setCoverPhotoUrl(cover ? cover.path : "");
      // let photosInfoData = response.assets.filter(
      //   (x) => x.asset_purpose === "subphoto"
      // );
      // setPhotosLengthFromResponse(photosInfoData.length);
      // setPhotosInfo(photosInfoData);
      // let constPhotosName = ["img1", "img2", "img3", "img4"];
      // let photosname = [];
      // photosname = photosInfoData.map((e) => {
      //   return e.name;
      // });
      // let remainingPhotosName = constPhotosName.filter(function (v) {
      //   return !photosname.includes(v);
      // });
      // setRemainingPhotosName(remainingPhotosName);
      // if (photosInfoData.length === 4) {
      //   setPhotoDisabled(true);
      // }
      // setOverview(response.overview);
      // setCategory(response.category_id);
      // if (response.tags) {
      //   if (response.tags.length > 0) {
      //     let tags = [];
      //     response.tags.forEach((element) => {
      //       tags.push(element.name);
      //     });
      //     setTagList(tags);
      //   }
      // }
      // setLookingForMember(response.member_needed);
      // if (response.roles) {
      //   if (response.roles.length > 0) {
      //     let roles = [];
      //     response.roles.forEach((element) => {
      //       roles.push(element.name);
      //     });
      //     setRoleList(roles);
      //   }
      // }
      setDataIsLoading(false);
    });
  }
  useEffect(() => {
    projectDetails();
  }, []);
  /**
   * ==============================================
   * Outline ENd
   * ==============================================
   */
  const [currentStep, setcurrentStep] = useState([1]);
  const [isLoading, setIsloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  function handelClickNext() {
    // Select type start
    if (currentStep.length === 1) {
      if (selectedTab.title === "CUSTOM") {
        if (votingPower === "" && canVote === "") {
          alert("Chosse 1 who have voting power and who can vote");
        } else if (votingPower === "") {
          alert("Chosse 1 who have voting power");
        } else if (canVote === "") {
          alert("Chosse 1 who can vote");
        } else if (votingPower !== "" && canVote !== "") {
          let finalSelectedTab = {
            id: 1,
            title: "CUSTOM",
            canVote: [canVote],
            votingPower: [votingPower],
          };
          setSelectedTab(finalSelectedTab);
          setcurrentStep([1, 2]);
        }
      } else {
        let finalSelectedTabs = {
          id: selectedTab.id,
          title: selectedTab.title,
          canVote: selectedTab.canVote,
          votingPower: selectedTab.votingPower,
        };
        setVotingPower(selectedTab.votingPower[0]);
        setCanVote(selectedTab.canVote[0]);
        setSelectedTab(finalSelectedTabs);
        setcurrentStep([1, 2]);
      }
    }
    // Select type end

    // Outline start
    if (currentStep.length === 2) {
      if (projectName === "") {
        setemptyProjectName(true);
      } else if (projectCategory === "") {
        setEmptyProjectCategory(true);
      } else {
        setcurrentStep([1, 2, 3]);
      }
    }
    // Outline end

    // Token  start
    if (currentStep.length === 3) {
      setcurrentStep([1, 2, 3, 4]);
    }
    // Token end
  }
  async function saveDraft() {
    // Outline start
    if (currentStep.length === 2) {
      if (projectName === "") {
        setemptyProjectName(true);
      } else if (projectCategory === "") {
        setEmptyProjectCategory(true);
      } else {
        // console.log(
        //   projectName,
        //   coverPhoto,
        //   photos,
        //   projectCategory,
        //   overview,
        //   tagsList,
        //   needMember,
        //   roleList
        // );
        let createPayload = {
          name: projectName,
          category_id: projectCategory,
          voting_power: votingPower.value,
          voter_mode: canVote.value,
        };
        setIsloading(true);
        await createProject(createPayload)
          .then((res) => {
            const r = res.project;
            let updatePayload = {
              ...createPayload,
              id: r.id,
              cover: coverPhoto[0],
              photos: photos,
              overview: overview,
              tags: tagsList.toString(),
              need_member: needMember,
              roles: roleList.toString(),
            };
            updateProject("create", updatePayload)
              .then((res) => {
                console.log(res);
                setIsloading(false);
                setShowModal(true);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
      // setcurrentStep([1, 2, 3]);
    }
    // Outline end

    // Token  start
    // if (currentStep.length === 3) {
    //   setcurrentStep([1, 2, 3, 4]);
    // }
    // Token end
  }
  function handelClickBack() {
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
  }
  return (
    <div>
      {isDataLoading && <div className="loading"></div>}
      <div className="flex flex-col md:flex-row ">
        <div className="hidden md:block md:relative bg-[#f6f6f7]  w-full md:w-64 lg:w-80  content-center">
          <LeftSideBar currentStep={currentStep} key={currentStep} />
        </div>
        <div className="flex-1">
          <div className="stepTitleName">STEP{currentStep.length}</div>
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
                SelectedprojectName={projectName}
                SelectedcoverPhotoUrl={coverPhotoUrl}
                isLoading={isLoading}
                onProjectNameChange={onProjectNameChange}
                emptyProjectName={emptyProjectName}
                alreadyTakenProjectName={alreadyTakenProjectName}
                closeCoverPhotoPreview={closeCoverPhotoPreview}
                onCoverDrop={onCoverDrop}
                closePhotoPreview={closePhotoPreview}
                onPhotoDrop={onPhotoDrop}
                emptyProjeCtCategory={emptyProjeCtCategory}
                onProjectCategoryChange={onProjectCategoryChange}
                overviewOnChange={overviewOnChange}
                onChangeTagList={onChangeTagList}
                onNeedMemberChange={onNeedMemberChange}
              />
            )}
            {currentStep.length === 3 && <Token />}
            {/* {currentStep === 1 && <SelectType />}
        {currentStep === 1 && <SelectType />}
        {currentStep === 1 && <SelectType />}
        {currentStep === 1 && <SelectType />} */}
            <div className="buttonContainer">
              <div
                className={
                  currentStep.length > 1
                    ? "flex justify-between"
                    : "flex justify-end"
                }
              >
                {currentStep.length > 1 && (
                  <button
                    className="backButton"
                    onClick={() => handelClickBack()}
                    disabled={isLoading ? true : false}
                  >
                    BACK
                  </button>
                )}
                <button
                  disabled={isLoading ? true : false}
                  className="nextButton"
                  onClick={() => handelClickNext()}
                >
                  NEXT
                </button>
              </div>
              {currentStep.length > 1 && (
                <button
                  onClick={saveDraft}
                  disabled={isLoading ? true : false}
                  className={`
                  ${isLoading === true ? "onlySpinner" : ""} saveDraft
                `}
                >
                  {isLoading ? "" : "SAVE DRAFT"}
                </button>
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
              <button className="w-[200px] h-[54px] bg-[#0AB4AF] rounded text-white">
                PROJECT LIST
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
