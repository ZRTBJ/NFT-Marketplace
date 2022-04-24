import { useState } from "react";
import "assets/css/CreateProject/LeftSidebar.css";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
export default function LeftSideBar(props) {
  const stepsList = [
    { id: 1, title: "SELECT TYPE", active: false },
    { id: 2, title: "OUTLINE", active: false },
    { id: 3, title: "TOKEN", active: false },
    { id: 4, title: "TOKEN CATEGORY", active: false },
    { id: 5, title: "FUNDRAISING", active: false },
    { id: 6, title: "ALLOCATION", active: false },
    { id: 7, title: "CONFIRMATION", active: false },
  ];
  const [currentStep] = useState(props.currentStep);
  const percentage = currentStep.length > 1 ? currentStep.length * 14 : 14;

  return (
    <div className="createProjectLeftSideBarContainer">
      <div className="progressBar">
        <CircularProgressbarWithChildren
          value={percentage}
          strokeWidth={2}
          styles={buildStyles({
            textColor: "black",
            pathColor: "#0AB4AF",
          })}
        >
          <div className="text-center">
            <p className="text-sm font-medium">Progress bar</p>
            <div className="pt-2">
              <span className="text-3xl font-medium">{percentage}</span>
              <span className="text-gray-600">%</span>
            </div>
            <div className="pt-2">
              <span className="text-lg font-medium">{currentStep.length}</span>
              <span className="text-gray-400">/7</span>
            </div>
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <ul className="stpesContainer">
        {stepsList.map((i) => (
          <li className="steps flex items-center" key={i.id}>
            <span
              className={
                "stepsIcon " +
                (currentStep.find((x) => x === i.id) ? "active" : "")
              }
            >
              {i.id}
            </span>
            <span className="stepsTitle ml-4">{i.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
