import { useState } from "react";
import "assets/css/CreateProject/LeftSidebar.css";
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
  return (
    <div className="createProjectLeftSideBarContainer">
      <div className="progressBar">Round Progress bar</div>
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
