import "assets/css/CreateProject/mainView.css";
import LeftSideBar from "components/ProjectCreate/LeftSideBar";
import Outline from "components/ProjectCreate/Outline";
import SelectType from "components/ProjectCreate/SelectType";
import { useState, useCallback } from "react";
import selectTypeTabData from "Pages/ProjectCreate/projectCreateData";
export default function CreateProjectLayout() {
  // project type start
  const [selectProjectActiveTab, SetSelectProjectActiveTab] = useState(
    selectTypeTabData[0]
  );
  // project type end

  // Outline start
  let [outlineKey, setOutlineKey] = useState(0);
  const [coverPhoto, setCoverPhoto] = useState("");
  function closeCoverPhotoPreview() {
    console.log("close");
  }
  const onCoverDrop = useCallback((acceptedFiles) => {
    setCoverPhoto(acceptedFiles);
    setOutlineKey((outlineKey = outlineKey) + 1);
  }, []);
  // Outline End

  const [currentStep, setcurrentStep] = useState([1]);
  function handelClickNext() {
    // Select type start
    if (currentStep.length === 1) {
      setcurrentStep([1, 2]);
    }
    // Select type end
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
              tabData={selectTypeTabData}
              activeTab={selectProjectActiveTab}
            />
          )}
          {currentStep.length === 2 && (
            <Outline
              closeCoverPhotoReview={() => closeCoverPhotoPreview()}
              coverPhotoProps={coverPhoto}
              onCoverDrop={onCoverDrop}
              key={outlineKey}
            />
          )}
          {/* {currentStep === 1 && <SelectType />}
        {currentStep === 1 && <SelectType />}
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
