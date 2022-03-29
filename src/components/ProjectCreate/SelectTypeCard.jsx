import React from "react";

export default function SelectTypeCard(props) {
  return (
    <div className="projectTypeCardcontainer">
      <img src={props.info.icon} className="projectTypeCardIcon" alt="" />
      <div>
        <div className="projectTypeCardTitle">{props.info.title}</div>
        <div className="projectTypeCardDescription">
          {props.info.description}
        </div>
      </div>
    </div>
  );
}
