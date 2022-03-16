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
              className={active === type ? 'active' : ''}
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
                <div key={cardlist.id} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4">
                  <div className="projectCardLayout">
                    <ProjectCard cardInfo={cardlist} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {active.name === "WORK" && (
          <div className="container ">
            <div className="row">
              {active.cardList.map((cardlist) => (
                <div key={cardlist.id} className="col-12 col-sm-12 col-md-6  col-lg-4 col-xl-4 mb-4">
                  <div className="workCardLayout">
                    <WorkCard cardInfo={cardlist} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {active.name === "COLLECTION" && (
          <div className="container ">
            <div className="d-flex flex-wrap">
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
