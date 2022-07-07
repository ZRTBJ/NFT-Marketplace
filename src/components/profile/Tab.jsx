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
  const [active, setActive] = useState(props.tabs[0]);
  const [modalInfo, setModalInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const userData = useSelector((state) => state.user.userinfo);
  function openModal(card) {
    setModalInfo(card);
    setShowModal(true);
  }
  function OnSetActive(type, index) {
    setActive(type);
    props.OnSetActive(index);
  }
  return (
    <>
      <div className="flex-wrap justify-center hidden md:flex">
        {props.tabs.map((type, index) => (
          <button
            className={`text-white-shade-600 p-3 hover:text-primary-900 active:text-primary-900 ${
              active.name === type.name ? "text-primary-900" : ""
            }`}
            key={type.id}
            onClick={() => OnSetActive(type, index)}
          >
            {type.name}
            <span className="bg-primary-50 text-color-ass-1 p-1 ml-1 rounded-sm text-sm">
              {active.list.length}
            </span>
          </button>
        ))}
      </div>
      <section className="flex mt-7">
        {userData.id && userData.id === id ? (
          <>
            <button type="button" class="btn btn-primary btn-sm">
              <Link to="/project-create">
                Create New <i class="fa-thin fa-square-plus ml-1"></i>
              </Link>
            </button>
          </>
        ) : (
          <></>
        )}

        <button type="button" class="ml-auto btn btn-outline-primary btn-sm">
          Sort By <i class="fa-thin fa-arrow-down-short-wide ml-1"></i>
        </button>
      </section>

      <div className="tabContent">
        {active.name === "Dao Project List" && (
          <div className="py-5 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {active.list.length === 0 ? (
              <ProfileEmptyCaseCard type={"Project"}></ProfileEmptyCaseCard>
            ) : (
              <>
                {active.list.map((list) => (
                  <div>
                    <CommonCard key={list.id} project={list} />
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        {active.name === "Works" && (
          <div className="py-5 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {active.list.map((list) => (
              <div onClick={() => openModal(list)}>
                <CommonCard key={list.id} project={list} />
              </div>
            ))}
          </div>
        )}
        {active.name === "NFTs" && (
          <div className="py-5 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {active.list.map((list) => (
              <div>
                <CommonCard key={list.id} project={list} />
              </div>
            ))}
          </div>
        )}
        {active.name === "Bookmark" && (
          <div className="py-5 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {active.list.map((list) => (
              <div>
                <CommonCard key={list.id} project={list} />
              </div>
            ))}
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
