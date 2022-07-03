import { useState } from "react";
import CommonCard from "components/CommonCard";
import WorkCard from "./WorkCard";
import CollectionCard from "./CollectionCard";
import Modal from "components/Modal";

const Tab = (props) => {
  const [active, setActive] = useState(props.tabs[0]);
  const [modalInfo, setModalInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  function openModal(card) {
    console.log(card);
    setModalInfo(card);
    setShowModal(true);
  }
  return (
    <>
      <div className="flex-wrap justify-center hidden md:flex">
        {props.tabs.map((type) => (
          <button
            className={`text-white-shade-600 p-3 hover:text-primary-900 active:text-primary-900 ${
              active.name === type.name ? "text-primary-900" : ""
            }`}
            key={type.id}
            onClick={() => setActive(type)}
          >
            {type.name}
            <span className="bg-primary-50 text-color-ass-1 p-1 ml-1 rounded-sm text-sm">
              {active.cardList.length}
            </span>
          </button>
        ))}
      </div>

      <div className="tabContent">
        {active.id === 1 && (
          <div>
            {/* <h1 className="text-white md:hidden"><span className="pr-3">Projects</span> <i class="fa-solid fa-circle-caret-down"></i></h1>
            <h1 className="text-white md:hidden"><span className="pr-3">Projects</span> <i class="fa-solid fa-circle-caret-right"></i></h1> 
            <div className=" h-0 ease-in-out duration-300">No Projects yet</div>*/}

            {active.cardList.length === 0 ? (
              <div>No Projects yet</div>
            ) : (
              <div className="py-5 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                {active.cardList.map((cardlist) => (
                  <div>
                    <CommonCard key={cardlist.id} project={cardlist} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {active.name === "WORK" && (
          <div className="container mx-auto md:px-4">
            <h1 className="text-white md:hidden">
              <span className="pr-3">Work</span>{" "}
              <i class="fa-solid fa-circle-caret-down"></i>
            </h1>
            {active.cardList.length === 0 ? (
              <div className="text-white">No works yet</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                {active.cardList.map((cardlist) => (
                  <div key={cardlist.id}>
                    <div
                      className="workCardLayout"
                      onClick={() => openModal(cardlist)}
                      key={cardlist.id}
                    >
                      <WorkCard key={cardlist.id} cardInfo={cardlist} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {active.name === "COLLECTION" && (
          <div>
            {active.cardList.length === 0 ? (
              <div>No collections yet</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:px-5 ">
                {active.cardList.map((cardlist) => (
                  <div key={cardlist.id} className="collectionCardLayout">
                    <CollectionCard cardInfo={cardlist} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {showModal && (
        <Modal show={showModal} handleClose={() => setShowModal(false)}>
          <div className="mx-4 my-6 text-left">
            <div className="flex">
              <div>
                <img
                  src={modalInfo.img}
                  className="h-[250px] w-[400px] rounded "
                  alt=""
                />
                <div className="mt-3 font-bold">{modalInfo.title}</div>
                <div className="mt-2">
                  {modalInfo.details.metadata.description}
                </div>
              </div>
              <div className="md:ml-3">
                <div>
                  {" "}
                  <span className="font-bold">Balance:</span>{" "}
                  <span>{modalInfo.details.balance}</span>
                </div>
                <div className="mt-2">
                  <span className="font-bold">Address:</span>
                  <span>{modalInfo.details.contract.address}</span>
                </div>
                <div className="mt-2">
                  <h3 className="font-bold mb-3">Attributes</h3>
                  <div>
                    <div className="">
                      {modalInfo.details.metadata.attributes && (
                        <div>
                          {modalInfo.details.metadata.attributes.map(
                            (i, index) => (
                              <div key={index} className="my-3">
                                <span className="mx-3  rounded px-4 py-1 bg-[grey] text-[white]">
                                  {i.trait_type} :
                                </span>
                                <span>{i.value}</span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Tab;
