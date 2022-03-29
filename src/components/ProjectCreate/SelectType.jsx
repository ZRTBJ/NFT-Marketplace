import { useState } from "react";
import SelectTypeCard from "./SelectTypeCard";
import "assets/css/CreateProject/SelectType.css";
import allMember from "assets/images/projectCreate/allMember.svg";
import owner from "assets/images/projectCreate/owner.svg";
import vote1Member from "assets/images/projectCreate/vote1Member.svg";
import token from "assets/images/projectCreate/token.svg";
import userIcon from "assets/images/projectCreate/ico_owners.svg";
const tabs = [
  {
    id: 1,
    title: "CUSTOM",
    votingPower: [
      {
        id: 1,
        icon: token,
        title: "TOKEN WEIGHTED",
        description: "More tokens more voting power.",
      },
      {
        id: 1,
        icon: vote1Member,
        title: "1 VOTE PER 1 MEMBER",
        description: "Every member gets 1 vote.",
      },
    ],
    canVote: [
      {
        id: 1,
        icon: owner,
        title: "OWNERS",
        description: "The owners who have the governance token.",
      },
      {
        id: 2,
        icon: allMember,
        title: "ALL MEMBERS",
        description: "Every member can vote.",
      },
    ],
  },
  {
    id: 2,
    title: "COMPANY",
    votingPower: [
      {
        id: 1,
        icon: token,
        title: "TOKEN WEIGHTED",
        description: "More tokens more voting power.",
      },
    ],
    canVote: [
      {
        id: 1,
        icon: owner,
        title: "OWNERS",
        description: "The owners who have the governance token.",
      },
    ],
  },
  {
    id: 3,
    title: "COLLABORATE",
    votingPower: [
      {
        id: 1,
        icon: vote1Member,
        title: "1 VOTE PER 1 MEMBER",
        description: "Every member gets 1 vote.",
      },
    ],
    canVote: [
      {
        id: 2,
        icon: allMember,
        title: "ALL MEMBERS",
        description: "Every member can vote.",
      },
    ],
  },
  {
    id: 4,
    title: "CLUB",
    votingPower: [
      {
        id: 1,
        icon: token,
        title: "TOKEN WEIGHTED",
        description: "More tokens more voting power.",
      },
    ],
    canVote: [
      {
        id: 2,
        icon: allMember,
        title: "ALL MEMBERS",
        description: "Every member can vote.",
      },
    ],
  },
];
export default function SelectType() {
  const [active, setActive] = useState(tabs[0]);
  return (
    <div className="selecTypeContainer">
      <div className="selectProjectTypeTitle">SELECT PROJECT TYPE</div>
      <div className="projectTypeSelect">Please select your project type.</div>
      <div>
        <div className="selectProjectTypeTab">
          {tabs.map((type) => (
            <button
              className={
                active.title === type.title ? "activeSelectProjectTab" : ""
              }
              key={type.id}
              onClick={() => setActive(type)}
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
              <SelectTypeCard info={cardlist} />
            </div>
          ))}
        </div>
        <div className="selectProjectTypeCardHeader mt-12">Who can vote?</div>
        <div className="grid grid-cols-2 gap-4">
          {active.canVote.map((cardlist) => (
            <div key={cardlist.id}>
              <SelectTypeCard info={cardlist} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
