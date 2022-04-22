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
  const [projectName, setProjectName] = useState("");
  const [coverPhoto, setCoverPhoto] = useState([]);
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
  /**
   * ==============================================
   * Outline ENd
   * ==============================================
   */
  const [currentStep, setcurrentStep] = useState([1]);
  const [isLoading, setIsloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  async function saveDraft(visibility) {
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
              visibility: visibility,
            };
            updateProject("create", updatePayload)
              .then(() => {
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
  }
  function handelClickBack() {
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
  }
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
                    disabled={isLoading ? true : false}
                  >
                    BACK
                  </button>
                ) : (
                  <button
                    disabled={isLoading ? true : false}
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
                    disabled={isLoading ? true : false}
                    className={`
                  ${
                    isLoading === true ? "onlySpinner" : ""
                  } h-[54px] w-[200px] rounded bg-[#B9CCD5] text-[white] hover:bg-[#192434]
                `}
                  >
                    {isLoading ? "" : "PRIVATE"}
                  </button>
                  <button
                    onClick={() => saveDraft("public")}
                    disabled={isLoading ? true : false}
                    className={`
                  ${
                    isLoading === true ? "onlySpinner" : ""
                  } h-[54px] w-[200px] rounded bg-[#0AB4AF] text-[white] hover:bg-[#192434]
                `}
                  >
                    {isLoading ? "" : "PUBLIC"}
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
