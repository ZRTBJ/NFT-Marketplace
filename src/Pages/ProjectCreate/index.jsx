import { useState, useCallback } from "react";
import "assets/css/CreateProject/mainView.css";
import { checkUniqueProjectName } from "services/project/projectService";
import selectTypeTabData from "Pages/ProjectCreate/projectCreateData";
import LeftSideBar from "components/ProjectCreate/LeftSideBar";
import SelectType from "components/ProjectCreate/SelectType";
import Outline from "components/ProjectCreate/Outline";
import Token from "components/ProjectCreate/Token";

export default function CreateProjectLayout() {
  /**
   * ==============================================
   * Project Type Start
   * ==============================================
   */
  const [selectedTab, setSelectedTab] = useState(selectTypeTabData[1]);
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
  /**
   * ==============================================
   * Outline ENd
   * ==============================================
   */
  const [currentStep, setcurrentStep] = useState([1, 2]);
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
        setcurrentStep([1, 2]);
      }
    }
    // Select type end

    // Outline start
    if (currentStep.length === 2) {
      if (projectName === "") {
        setemptyProjectName(true);
      }
      if (projectCategory === "") {
        setEmptyProjectCategory(true);
      } else {
        console.log(projectName, coverPhoto, photos, projectCategory);
      }
      // setcurrentStep([1, 2, 3]);
    }
    // Outline end

    // Token  start
    if (currentStep.length === 3) {
      setcurrentStep([1, 2, 3, 4]);
    }
    // Token end
  }
  function handelClickBack() {
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
  }
  return (
    <div className="flex flex-col md:flex-row ">
      <div className="hidden md:block md:relative  w-full md:w-64 lg:w-80  content-center">
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
            />
          )}
          {currentStep.length === 2 && (
            <Outline
              onProjectNameChange={onProjectNameChange}
              emptyProjectName={emptyProjectName}
              alreadyTakenProjectName={alreadyTakenProjectName}
              closeCoverPhotoPreview={closeCoverPhotoPreview}
              onCoverDrop={onCoverDrop}
              closePhotoPreview={closePhotoPreview}
              onPhotoDrop={onPhotoDrop}
              emptyProjeCtCategory={emptyProjeCtCategory}
              onProjectCategoryChange={onProjectCategoryChange}
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
                +currentStep.length > 1
                  ? "flex justify-between"
                  : "flex justify-end"
              }
            >
              {currentStep.length > 1 && (
                <button
                  className="backButton"
                  onClick={() => handelClickBack()}
                >
                  BACK
                </button>
              )}
              <button className="nextButton" onClick={() => handelClickNext()}>
                NEXT
              </button>
            </div>
            {currentStep.length > 1 && (
              <button className="saveDraft">SAVE DRAFT</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
