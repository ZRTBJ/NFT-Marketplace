/* eslint-disable react-hooks/exhaustive-deps */
import Spinner from "components/Commons/Spinner";
import defaultCover from "assets/images/image-default.svg";
import ReactPaginate from "react-paginate";
import deleteSvg from "assets/images/projectDetails/delete.svg";
import viewSvg from "assets/images/projectDetails/eye.svg";
import {
  getCollections,
  deleteUnpublishedCollection,
} from "services/collection/collectionService";
import SuccessModal from "components/Modals/SuccessModal";
import ErrorModal from "components/Modals/ErrorModal";
import ConfirmationModal from "components/Modals/ConfirmationModal";
import { DebounceInput } from "react-debounce-input";
import { useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import emptyStateCommon from "assets/images/profile/emptyStateCommon.svg";

const CollectionTab = (props) => {
  const { id } = useParams();
  const history = useHistory();
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collectionList, setCollectionList] = useState([]);
  const [pagination, SetPagination] = useState([]);
  const [toDelete, setToDelete] = useState(false);
  const [collectionId, setCollectionId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [payload, setPayload] = useState({
    order_by: "",
    page: 1,
    keyword: "",
  });
  function handleSortType(order_by) {
    const newPayload = { ...payload };
    newPayload.order_by = order_by;
    setPayload(newPayload);
  }
  function searchProject(keyword) {
    const newPayload = { ...payload };
    newPayload.keyword = keyword;
    setPayload(newPayload);
  }
  function deleteCollection(element) {
    setCollectionId(element.id);
    setToDelete(true);
  }
  async function onDeleteCollection() {
    setOverlayLoading(true);
    await deleteUnpublishedCollection(collectionId)
      .then((res) => {
        if (res.code === 0) {
          getCollectionList();
          setOverlayLoading(false);
          setToDelete(false);
          setShowSuccessModal(true);
        } else {
          setOverlayLoading(false);
          setToDelete(false);
          setErrorModal(true);
          setErrorMessage(res.message);
        }
      })
      .catch(() => {
        setOverlayLoading(false);
        setToDelete(false);
        setErrorModal(true);
      });
  }
  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };
  const handlePageClick = (event) => {
    const newPayload = { ...payload };
    newPayload.page = event.selected + 1;
    setPayload(newPayload);
  };
  const viewDetails = (id) => {
    history.push(`/collection-details/${id}/`);
  };

  async function getCollectionList() {
    setLoading(true);
    await getCollections(
      "project",
      id,
      payload.page,
      10,
      payload.keyword,
      payload.order_by
    )
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          // e.data[0].assets = [];
          setCollectionList(e.data);
          if (e.total && e.total > 0) {
            const page = calculatePageCount(10, e.total);
            const pageList = [];
            for (let index = 1; index <= page; index++) {
              pageList.push(index);
            }
            SetPagination(pageList);
          }
        } else {
          setCollectionList([]);
          SetPagination([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    getCollectionList();
  }, []);
  useEffect(() => {
    getCollectionList();
  }, [payload]);
  return (
    <>
      {loading && (
        <div className="grid mt-[40px] place-items-center">
          <Spinner />
        </div>
      )}
      {overlayLoading && <div className="loading"></div>}
      {!loading && (
        <div>
          {/* action row */}
          <div className="flex flex-wrap mb-[40px]  items-center">
            <div className=" mr-4">
              {props.projectOwner && (
                <Link to={`/collection-create/?dao_id=${id}`}>
                  <button className="contained-button h-[45px]">
                    + Create New Collection
                  </button>
                </Link>
              )}
            </div>

            <div className="dropdown mt-4 md:mt-0  relative md:order-last">
              <button
                className="bg-white dropdown-toggle px-4  text-textSubtle font-black font-satoshi-bold rounded-lg shadow-main flex items-center justify-between w-44 h-[45px] "
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="">Sort Of</span>
                <i className="fa-solid fa-angle-down"></i>
              </button>

              <ul
                className="dropdown-menu w-[150px] md:w-full absolute hidden bg-white text-base z-50 py-2 list-none rounded-lg shadow-main  mt-1 "
                aria-labelledby="dropdownMenuButton1"
              >
                <li onClick={() => handleSortType("newer")}>
                  <div
                    className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                      payload.order_by === "newer"
                        ? "text-primary-900"
                        : "text-txtblack"
                    } hover:bg-slate-50 transition duration-150 ease-in-out`}
                  >
                    Newer
                  </div>
                </li>
                <li onClick={() => handleSortType("older")}>
                  <div
                    className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                      payload.order_by === "older"
                        ? "text-primary-900"
                        : "text-txtblack"
                    } hover:bg-slate-50 transition duration-150 ease-in-out`}
                  >
                    Older
                  </div>
                </li>
              </ul>
            </div>
            <div className=" mt-4 md:mt-0 flex-1 md:mr-4">
              <DebounceInput
                minLength={1}
                debounceTimeout={400}
                onChange={(e) => searchProject(e.target.value)}
                className="debounceInput"
                value={payload.keyword}
                placeholder="Search collection..."
              />
            </div>
          </div>
          {/* if collection list is empty */}
          {collectionList.length === 0 && (
            <>
              {payload.keyword === "" ? (
                <div className="grid mt-[40px] h-full place-items-center">
                  <div className="text-center mt-6">
                    <img
                      src={emptyStateCommon}
                      className="h-[210px] w-[315px] m-auto"
                      alt=""
                    />
                    <p className="text-subtitle font-bold">
                      This DAO has no Collection yet
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h1>No collection found</h1>
                </div>
              )}
            </>
          )}
          {collectionList.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left !whitespace-nowrap">
                <thead className="text-black">
                  <tr>
                    <th scope="col" className="py-3 px-6 !font-black">
                      Collection
                    </th>
                    <th scope="col" className="py-3 px-6 !font-black">
                      Status
                    </th>
                    <th scope="col" className="py-3 px-6 !font-black">
                      Type
                    </th>
                    <th scope="col" className="py-3 px-6 !font-black">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {collectionList.map((element, index) => (
                    <tr key={index}>
                      <th scope="row" className="py-4 px-6 ">
                        <div className="flex items-center">
                          <img
                            className="md:h-[66px] object-cover md:w-[66px] h-[38px] w-[38px] rounded-lg mr-4"
                            src={
                              element?.assets?.length > 0
                                ? element.assets.find(
                                    (img) => img["asset_purpose"] === "logo"
                                  )
                                  ? element.assets.find(
                                      (img) => img["asset_purpose"] === "logo"
                                    ).path
                                  : defaultCover
                                : defaultCover
                            }
                            alt="collection cover"
                          />
                          <Link
                            className="!no-underline"
                            to={`/collection-details/${element.id}`}
                          >
                            <h4 className="text-[16px] !no-underline">
                              {element.name}
                            </h4>
                          </Link>
                        </div>
                      </th>
                      <td className="py-4 px-6">
                        {" "}
                        {element.status.replace(
                          /^./,
                          element.status[0].toUpperCase()
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {element.type.replace(
                          /^./,
                          element.type[0].toUpperCase()
                        )}
                      </td>
                      <td className="py-4 px-6 ">
                        <div className="flex">
                          <img
                            onClick={() => viewDetails(element.id)}
                            src={viewSvg}
                            className="cursor-pointer h-[32px] w-[32px] rounded mr-3"
                            alt=""
                          />
                          {props.projectOwner && (
                            <>
                              {element.status !== "published" && (
                                <img
                                  onClick={() => deleteCollection(element)}
                                  src={deleteSvg}
                                  className="cursor-pointer h-[32px] w-[32px] rounded"
                                  alt=""
                                />
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-[30px]">
            {pagination.length > 0 && (
              <>
                <ReactPaginate
                  className="flex flex-wrap md:space-x-10 space-x-3 justify-center items-center my-6"
                  pageClassName="px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7 !text-txtblack "
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={pagination.length}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                  activeClassName="text-primary-900 bg-primary-900 !no-underline"
                  activeLinkClassName="!text-txtblack !no-underline"
                />
              </>
            )}
          </div>
        </div>
      )}
      {toDelete && (
        <ConfirmationModal
          show={toDelete}
          handleClose={() => setToDelete(false)}
          handleApply={onDeleteCollection}
          message="Are sure to delete this collection?"
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          message="You successfully deleted the collection!"
          buttonText="Close"
          handleClose={() => setShowSuccessModal(false)}
        />
      )}
      {errorModal && (
        <ErrorModal
          handleClose={() => {
            setErrorModal(false);
            setErrorMessage("");
          }}
          show={errorModal}
          title={"Collection delete was not successful"}
          mesage={errorMessage}
        />
      )}
    </>
  );
};

export default CollectionTab;
