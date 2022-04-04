import "assets/css/CreateProject/mainView.css";
import LeftSideBar from "components/ProjectCreate/LeftSideBar";
import Outline from "components/ProjectCreate/Outline";
import SelectType from "components/ProjectCreate/SelectType";
import Token from "components/ProjectCreate/Token";
import { useState, useCallback, useEffect } from "react";

export default function CreateProjectLayout() {
  /**
   * ==============================================
   * Project Type Start
   * ==============================================
   */
  const [selectedTab, setSelectedTab] = useState("");
  function setActiveTab(arg) {
    setSelectedTab(arg);
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
  let [outlineKey, setOutlineKey] = useState(0);
  const [coverPhoto, setCoverPhoto] = useState("");
  const [coverPhotoPreview, setCoverPhotoPreview] = useState();

  function onProjectNameChange(e) {
    setProjectName(e);
    console.log(projectName);
  }
  function closeCoverPhotoPreview() {
    console.log("close");
  }
  const onCoverDrop = useCallback((acceptedFiles) => {
    setCoverPhoto(acceptedFiles);
    setOutlineKey(outlineKey++);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (coverPhoto === "") {
      setCoverPhotoPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(coverPhoto[0]);
    setCoverPhotoPreview(objectUrl);
    console.log();

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [coverPhoto]);
  /**
   * ==============================================
   * Outline ENd
   * ==============================================
   */

  const [currentStep, setcurrentStep] = useState([1]);
  function handelClickNext() {
    // Select type start
    if (currentStep.length === 1) {
      console.log(selectedTab);
      setcurrentStep([1, 2]);
    }
    // Select type end

    // Outline start
    if (currentStep.length === 2) {
      setcurrentStep([1, 2, 3]);
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
            <SelectType setActiveTab={setActiveTab} />
          )}
          {currentStep.length === 2 && (
            <Outline
              projectName={projectName}
              onProjectNameChange={onProjectNameChange}
              closeCoverPhotoReview={() => closeCoverPhotoPreview()}
              coverPhotoProps={coverPhoto}
              onCoverDrop={onCoverDrop}
              coverPhotoPreview={coverPhotoPreview}
              key={outlineKey}
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
