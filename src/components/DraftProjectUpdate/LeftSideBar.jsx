import { useState } from "react";
import "assets/css/CreateProject/LeftSidebar.css";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
export default function LeftSideBar(props) {
  const [currentStep] = useState(props.currentStep);
  const percentage = currentStep.length > 1 ? currentStep.length * 50 : 50;

  return (
    <div className="md:flex items-center mb-[24px]">
      <div className="progressBar mr-4 ">
        <CircularProgressbarWithChildren
          value={percentage}
          strokeWidth={2}
          styles={buildStyles({
            textColor: "white",
            pathColor: "#DF9B5D",
          })}
        >
          <div className="text-center ">
            <div className="">
              <span className="text-[18px] font-black">
                {currentStep.length}
              </span>
              <span className="text-[18px] font-black">/2</span>
            </div>
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <div className="">
        <div className="font-bold text-[22px]">Create Project</div>
        <div className="text-[12px] text-[#9499AE]">
          Make sure you have fill the form with right data.
        </div>
      </div>
    </div>
  );
}
