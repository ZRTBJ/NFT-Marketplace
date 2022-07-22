import { useState } from "react";
import CommonCard from "components/CommonCard";
import WorkCard from "./WorkCard";
import CollectionCard from "./CollectionCard";
import Modal from "components/Modal";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ProfileEmptyCaseCard from "components/EmptyCaseCard/ProfileEmptyCaseCard";

const Tab = (props) => {
  const { id } = useParams();
  const [modalInfo, setModalInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const userData = useSelector((state) => state.user.userinfo);
  function openModal(card) {
    setModalInfo(card);
    setShowModal(true);
  }
  function OnSetActive(type, index) {
    props.OnSetActive(index);
  }
  function sortData(index) {
    props.sortData(index);
  }
  console.log(props.active?.id);
  return (
    <>
      <div className="flex-wrap justify-center hidden md:flex">
        {props.tabs.map((type, index) => (
          <button
            className={` p-3 hover:text-primary-900 active:text-primary-900 ${
              props.active?.id === type.id
                ? " text-primary-900 "
                : "text-white-shade-600"
            }`}
            key={type.id}
            onClick={() => OnSetActive(type, index)}
          >
            {type.name}
            <span className="bg-primary-50 text-color-ass-1 p-1 ml-1 rounded-sm text-sm">
              {type.list.length}
            </span>
          </button>
        ))}
      </div>
      <section className="flex mt-7">
        {userData.id && userData.id === id ? (
          <>
            {props.active?.name !== "NFTs" &&
              props.active?.name !== "Bookmark" && (
                <button type="button" className="btn btn-primary btn-sm">
                  {props.active?.name === "Dao Project List" ? (
                    <Link to="/project-create">
                      Create New <i className="fa-thin fa-square-plus ml-1"></i>
                    </Link>
                  ) : (
                    <Link to="/undefined/mint-nft">
                      Create New <i className="fa-thin fa-square-plus ml-1"></i>
                    </Link>
                  )}
                </button>
              )}
          </>
        ) : (
          <></>
        )}

        {props.active?.list.length > 0 && (
          <button
            type="button"
            className="ml-auto btn btn-outline-primary btn-sm"
            onClick={() => sortData(props.active?.id)}
          >
            Sort By <i className="fa-thin fa-arrow-down-short-wide ml-1"></i>
          </button>
        )}
      </section>

      <div className="tabContent">
        {props.active?.name === "Dao Project List" && (
          <>
            {/* 
            
                //Open Ttitle
                <h1 className="text-white mt-4 md:hidden"><span className="pr-3">Projects</span> <i className="fa-solid fa-circle-caret-down"></i></h1>

                <div className="py-5"> open content</div>

                // Close Title  inside h1 tag icon class name will be changed
                <h1 className="text-white md:hidden"><span className="pr-3">Projects</span> <i className="fa-solid fa-circle-caret-right"></i></h1> 

                //Close Content py- class will be removed h-0 class will be added
                
                <div className="h-0"> Close content</div>
            

            */}
            <div>
              {props.active?.list.length === 0 ? (
                <ProfileEmptyCaseCard
                  className="mx-auto"
                  type={"Project"}
                ></ProfileEmptyCaseCard>
              ) : (
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ease-in-out duration-300 py-5">
                  {props.active?.list.map((list) => (
                    <CommonCard key={list.id} project={list} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        {props.active?.name === "Works" && (
          <>
            {props.active?.list.length === 0 ? (
              <ProfileEmptyCaseCard
                className="mx-auto"
                type={"Works"}
              ></ProfileEmptyCaseCard>
            ) : (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ease-in-out duration-300 py-5">
                {props.active?.list.map((list) => (
                  <CommonCard key={list.id} project={list} />
                ))}
              </div>
            )}
          </>
        )}
        {props.active?.name === "NFTs" && (
          <>
            {props.active?.list.length === 0 ? (
              <ProfileEmptyCaseCard
                className="mx-auto"
                type={"External NFTs"}
              ></ProfileEmptyCaseCard>
            ) : (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ease-in-out duration-300 py-5">
                {props.active?.list.map((list) => (
                  <div key={list.id} onClick={() => openModal(list)}>
                    <CommonCard key={list.id} project={list} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {props.active?.name === "Bookmark" && (
          <div>
            {props.active?.list.length === 0 ? (
              <ProfileEmptyCaseCard
                className="mx-auto"
                type={"Bookmark"}
              ></ProfileEmptyCaseCard>
            ) : (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ease-in-out duration-300 py-5">
                {props.active?.list.map((list) => (
                  <CommonCard key={list.id} project={list} />
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
                  src={modalInfo.path}
                  className="h-[250px] w-[400px] rounded object-cover"
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
