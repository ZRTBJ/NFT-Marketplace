import { useState } from "react";
import "assets/css/tab.css";
import ProjectCard from "./ProjectCard";
import WorkCard from "./WorkCard";
import CollectionCard from "./CollectionCard";

const Tab = (props) => {
  const [active, setActive] = useState(props.tabs[0]);
  return (
    <div>
      <div className="container px-4 mx-auto">
        <div className="buttonGroup">
          {props.tabs.map((type) => (
            <button
              className={active.name === type.name ? "active" : ""}
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
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
              {active.cardList.map((cardlist) => (
                <div key={cardlist.id}>
                  <div className="projectCardLayout">
                    <ProjectCard cardInfo={cardlist} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {active.name === "WORK" && (
          <div className="container mx-auto md:px-4">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
              {active.cardList.map((cardlist) => (
                <div key={cardlist.id}>
                  <div className="workCardLayout">
                    <WorkCard cardInfo={cardlist} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {active.name === "COLLECTION" && (
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:px-5 ">
              {active.cardList.map((cardlist) => (
                <div key={cardlist.id} className="collectionCardLayout">
                  <CollectionCard cardInfo={cardlist} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tab;
