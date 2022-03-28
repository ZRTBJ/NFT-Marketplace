import "assets/css/CreateProject/mainView.css";
import LeftSideBar from "components/ProjectCreate/LeftSideBar";
import Outline from "components/ProjectCreate/Outline";
import SelectType from "components/ProjectCreate/SelectType";
import { useState } from "react";
export default function CreateProjectLayout() {
  const [currentStep, setcurrentStep] = useState(1);
  return (
    <div className="flex flex-col md:flex-row ">
      <div className="hidden md:block md:relative  w-full md:w-64 lg:w-80  content-center">
        <LeftSideBar currentStep={currentStep} />
      </div>
      <div className="flex-1">
        <div className="cardContainer px-5">
          {currentStep === 1 && <SelectType />}
          {currentStep === 2 && <Outline />}
          {/* {currentStep === 1 && <SelectType />}
        {currentStep === 1 && <SelectType />}
        {currentStep === 1 && <SelectType />}
        {currentStep === 1 && <SelectType />}
        {currentStep === 1 && <SelectType />} */}
          <div className="buttonContainer">
            <div className="flex justify-between">
              <button className="backButton">BACK</button>
              <button className="nextButton">NEXT</button>
            </div>
            <button className="saveDraft">SAVE DRAFT</button>
          </div>
        </div>
      </div>
    </div>
  );
}
