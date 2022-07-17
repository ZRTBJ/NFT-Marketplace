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
          <path
            d="M18.636 25.29V36H21.426V22.68H15.612V25.29H18.636ZM25.963 36L31.165 22.716H28.393L23.209 36H25.963ZM41.2582 35.964V33.264H36.3982L38.3962 31.59C40.0522 30.204 41.1502 28.728 41.1502 26.91C41.1502 24.066 39.3322 22.428 36.2902 22.428C33.3562 22.428 31.4482 24.372 31.4482 27.36H34.3462C34.3462 25.866 35.0662 25.02 36.3082 25.02C37.4962 25.02 38.1622 25.74 38.1622 27.09C38.1622 28.188 37.5682 29.016 36.1462 30.186L31.7542 33.84V36L41.2582 35.964Z"
            fill="white"
          />
          <circle
            cx="28.5"
            cy="28.5"
            r="27.5"
            stroke="url(#paint0_linear_811_35592)"
            stroke-width="2"
          />
          <defs>
            <linearGradient
              id="paint0_linear_811_35592"
              x1="6.26599"
              y1="14.25"
              x2="56.1016"
              y2="54.5485"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#DF9B5D" />
              <stop offset="0.947917" stop-color="#9A5AFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="">
        <div className="font-bold text-[22px]">
          {props.update ? "Update Project" : "Create Project"}
        </div>
        <div className="text-[12px] text-white-shade-600">
          Make sure you have fill the form with right data.
        </div>
      </div>
    </div>
  );
}
