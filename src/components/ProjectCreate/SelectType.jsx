import { useState } from "react";
import SelectTypeCard from "./SelectTypeCard";
import "assets/css/CreateProject/SelectType.css";
import userIcon from "assets/images/projectCreate/ico_owners.svg";
import selectTypeTabData from "Pages/ProjectCreate/projectCreateData";

export default function SelectType(props) {
  const [active, setActive] = useState(selectTypeTabData[1]);
  function setActiveTab(type) {
    setActive(type);
    props.setActiveTab(type);
  }
  function votingPowerCardClick(active, params) {
    if (active.title === "CUSTOM") {
      let inactive = active.votingPower.find((x) => x.title !== params.title);
      inactive.active = false;
      props.votingPowerProps(params);
    }
  }
  function canVoteCardClick(active, params) {
    if (active.title === "CUSTOM") {
      let inactive = active.canVote.find((x) => x.title !== params.title);
      inactive.active = false;
      props.canVoteProps(params);
    }
  }
  return (
    <div className="selecTypeContainer">
      <div className="selectProjectTypeTitle">SELECT PROJECT TYPE</div>
      <div className="projectTypeSelect">Please select your project type.</div>
      <div>
        <div className="selectProjectTypeTab">
          {selectTypeTabData.map((type) => (
            <button
              className={
                active.title === type.title ? "activeSelectProjectTab" : ""
              }
              key={type.id}
              onClick={() => setActiveTab(type)}
            >
              {type.title}
            </button>
          ))}
        </div>
        <div className="selectedTabTitle">{active.title}</div>
        <div className="drivenByTitle">Driven by (Who can propose?)</div>
        <div className="staticOwnersSectionContainer">
          <img className="staticUserIcon" src={userIcon} alt="" />
          <div>
            <div className="staticTitle">OWNERS</div>
            <div className="staticDescription">
              The owners who have the governance token can propose only.
            </div>
          </div>
        </div>
        <div className="selectProjectTypeCardHeader">Voting Power</div>
        <div className="grid grid-cols-2 gap-4">
          {active.votingPower.map((cardlist) => (
            <div key={cardlist.id}>
              <SelectTypeCard
                info={cardlist}
                cardClick={() => votingPowerCardClick(active, cardlist)}
              />
            </div>
          ))}
        </div>
        <div className="selectProjectTypeCardHeader mt-12">Who can vote?</div>
        <div className="grid grid-cols-2 gap-4">
          {active.canVote.map((cardlist) => (
            <div key={cardlist.id}>
              <SelectTypeCard
                info={cardlist}
                cardClick={() => canVoteCardClick(active, cardlist)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
