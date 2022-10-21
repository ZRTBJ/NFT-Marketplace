/* eslint-disable react-hooks/exhaustive-deps */
import Spinner from "components/common/Spinner";
import { getCollections } from "services/collection/collectionService";
import defaultCover from "assets/images/image-default.svg";
import ReactPaginate from "react-paginate";
import { DebounceInput } from "react-debounce-input";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import deleteSvg from "assets/images/projectDetails/delete.svg";
import viewSvg from "assets/images/projectDetails/eye.svg";

const CollectionTab = (props) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [collectionList, setCollectionList] = useState([]);
  const [pagination, SetPagination] = useState([]);
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
    console.log(element);
  }
  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };
  const handlePageClick = (event) => {
    const newPayload = { ...payload };
    newPayload.page = event.selected + 1;
    setPayload(newPayload);
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
      {!loading && (
        <div>
          {/* if collection list is empty */}
          {collectionList.length === 0 && (
            <div className="grid mt-[40px] h-full place-items-center">
              <h1>This Project has no collection yet</h1>
              {props.projectOwner && (
                <Link to={`/collection-create/?dao_id=${id}`}>
                  <button className="contained-button h-[45px] mt-2">
                    + Create New Collection
                  </button>
                </Link>
              )}
            </div>
          )}
          {collectionList.length > 0 && (
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
              {/* table */}
              <div>
                <div className="hidden md:mb-4 md:flex flex-wrap items-center justify-between">
                  <p>Collections</p>
                  <p>Actions</p>
                </div>

                {collectionList.map((element) => (
                  <div
                    key={element.id}
                    className="mb-5 md:mb-[60px]  flex flex-wrap items-center"
                  >
                    <img
                      className="md:h-[66px] md:w-[66px] h-[38px] w-[38px] rounded-lg mr-4"
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
                    <Link className="flex-1" to={`/collection-details/${element.id}`}>
                      <h4 className="text-[16px]">{element.name}</h4>
                    </Link>
                    <Link to={`/collection-details/${element.id}`}>
                      <img
                        src={viewSvg}
                        className="cursor-pointer h-[32px] w-[32px] rounded mr-3"
                        alt=""
                      />
                    </Link>

                    {props.projectOwner && (
                      <img
                        onClick={() => deleteCollection(element)}
                        src={deleteSvg}
                        className="cursor-pointer h-[32px] w-[32px] rounded"
                        alt=""
                      />
                    )}
                  </div>
                ))}
              </div>
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
        </div>
      )}
    </>
  );
};

export default CollectionTab;
