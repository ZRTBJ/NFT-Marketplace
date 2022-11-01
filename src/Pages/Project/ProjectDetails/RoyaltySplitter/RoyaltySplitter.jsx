import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCollections } from "services/collection/collectionService";
import ReactPaginate from "react-paginate";
import Spinner from "components/Commons/Spinner";
import { DebounceInput } from "react-debounce-input";
import CollectionSplitterItem from "./components/CollectionSplitterItem";

const RoyaltySplitter = ({ projectNetwork }) => {
  const { id } = useParams();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, SetPagination] = useState([]);
  const [payload, setPayload] = useState({
    projectId: id,
    order_by: "newer",
    page: 1,
    limit: 10,
    keyword: "",
  });
  const [openedCollection, setOpenedCollection] = useState(null);

  useEffect(() => {
    if (payload.projectId) {
      setLoading(true);
      getProjectCollections();
    }
  }, [payload]);

  const getProjectCollections = async () => {
    await getCollections(
      "project",
      payload.projectId,
      payload.page,
      payload.limit,
      payload.keyword,
      payload.order_by,
      true
    )
      .then((resp) => {
        setLoading(false);
        if (resp.code === 0) {
          setCollections(resp.data);
          if (resp.total && resp.total > 0) {
            const page = calculatePageCount(10, resp.total);
            const pageList = [];
            for (let index = 1; index <= page; index++) {
              pageList.push(index);
            }
            SetPagination(pageList);
          }
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };

  const handlePageClick = (event) => {
    const newPayload = { ...payload };
    newPayload.page = event.selected + 1;
    setPayload(newPayload);
  };

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

  return (
    <>
      {loading && (
        <div className="grid mt-[40px] place-items-center">
          <Spinner />
        </div>
      )}
      {!loading && (
        <div>
          <div className="flex flex-wrap mb-[40px]  items-center">
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
                    className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${payload.order_by === "newer"
                      ? "text-primary-900"
                      : "text-txtblack"
                      } hover:bg-slate-50 transition duration-150 ease-in-out`}
                  >
                    Newer
                  </div>
                </li>
                <li onClick={() => handleSortType("older")}>
                  <div
                    className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${payload.order_by === "older"
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
                placeholder="Search..."
              />
            </div>
          </div>
          <>
            {collections == null || collections.length === 0 ? (
              <>
                {payload.keyword === "" ? (
                  <div className="grid mt-[40px] h-full place-items-center">
                    <h1>This Project has no collections yet</h1>
                  </div>
                ) : (
                  <div className="text-center">
                    <h1>No data found</h1>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full">
                {collections.map((collection) => {
                  let image = collection?.assets?.find(
                    (asset) => asset.asset_type === "image"
                  );
                  return (
                    <CollectionSplitterItem
                      members={collection?.members}
                      name={collection.name}
                      status={collection?.royalty_splitter?.status}
                      image={image}
                      id={collection.id}
                      openedCollection={openedCollection}
                      setOpenedCollection={setOpenedCollection}
                      date={collection.created_at}
                      getProjectCollections={getProjectCollections}
                      projectNetwork={projectNetwork}
                    />
                  );
                })}
              </div>
            )}
          </>
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
    </>
  );
};

export default RoyaltySplitter;
