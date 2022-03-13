import { useState } from "react";
import "assets/css/tab.css";
import ProjectCard from "./ProjectCard";
import WorkCard from "./WorkCard";
import CollectionCard from "./CollectionCard";
const Tab = (props) => {
  const [active, setActive] = useState(props.tabs[0]);
  return (
    <div>
      <div className="container">
        <div className="buttonGroup">
          {props.tabs.map((type) => (
            <button
              className={active === type ? "active" : ""}
              key={type.id}
              onClick={() => setActive(type)}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
      <div className="tabDivider"></div>
      <div className="tabContent">
        {active.name === "PROJECT" && (
          <div className="container ">
            <div className="row px-md-5">
              {active.cardList.map((cardlist) => (
                <div className="col-md-3 mb-4">
                  <ProjectCard cardInfo={cardlist} />
                </div>
              ))}
            </div>
          </div>
        )}
        {active.name === "WORK" && (
          <div className="container ">
            <div className="row px-md-5">
              {active.cardList.map((cardlist) => (
                <div className="col-md-4 mb-4">
                  <WorkCard cardInfo={cardlist} />
                </div>
              ))}
            </div>
          </div>
        )}
        {active.name === "COLLECTION" && (
          <CollectionCard cardInfo={active.cardList} />
        )}
      </div>
    </div>
  );
};

export default Tab;
