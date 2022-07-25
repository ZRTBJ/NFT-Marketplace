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
    <div className="flex items-center mb-6">
      {!props.update && (
        <div className="progressBar mr-3">
          {/* <CircularProgressbarWithChildren
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
        </CircularProgressbarWithChildren> */}

          <svg
            width="57"
            height="57"
            viewBox="0 0 57 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="28.5"
              cy="28.5"
              r="27.5"
              stroke="url(#paint0_linear_811_35624)"
              strokeWidth="2"
            />
            <defs>
              <linearGradient
                id="paint0_linear_811_35624"
                x1="6.26599"
                y1="14.25"
                x2="56.1016"
                y2="54.5485"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#DF9B5D" />
                <stop offset="0.947917" stopColor="#9A5AFF" />
              </linearGradient>
            </defs>
          </svg>

          <div className="steps-text">
            <span className="text-lg font-satoshi-bold font-black">
              {currentStep.length}
            </span>
            <span className="text-lg font-satoshi-bold font-black">/2</span>
          </div>
        </div>
      )}
      <div className="">
        <div className="font-bold text-[22px]">
          {props.update ? "Edit project" : "Create Project"}
        </div>
        {!props.update && (
          <div className="text-[12px] text-white-shade-600">
            Make sure you have fill the form with right data.
          </div>
        )}
      </div>
    </div>
  );
}
