import React from "react";

export default function SelectTypeCard(props) {
  function active(props) {
    props.info.active = true;
    props.cardClick(props);
  }
  return (
    <div
      className={
        "projectTypeCardcontainer " +
        (props.info.active === true ? "activeprojectTypeCardcontainer" : "")
      }
      onClick={() => active(props)}
    >
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
