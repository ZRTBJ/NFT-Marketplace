/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  getUserProjectListById,
  getProjectCategory,
} from "services/project/projectService";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore, { Autoplay } from "swiper";
import DAOCard from "components/DAOCard";
import CollectionCard from "components/CollectionCard";
import NFTListCard from "components/NFTListCard";
import Sort from "assets/images/icons/sort.svg";
import { useLocation } from "react-router-dom";
import { getCollections } from "services/collection/collectionService";
function List() {
  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();
  SwiperCore.use([Autoplay]);
  // const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  // const [popularProjectList, setPopularProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortType, setSortType] = useState("newer");
  const [pagination, SetPagination] = useState([1, 2]);
  const [isActive, setIsactive] = useState(1);

  const payload = {
    order_by: "newer",
    page: 1,
    limit: 10,
    keyword: "",
  };
  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };

  async function getProjectList(payload, orderBy, isSearch = false) {
    payload.order_by = orderBy;

    const categoriesRes = await getProjectCategory();
    let projectResponse = [];
    if (query.get("type") === "collection") {
      let listType = "";
      if (query.get("user") === "true") {
        listType = "user";
      }
      projectResponse = await getCollections(
        listType,
        "",
        payload.page,
        10,
        payload.keyword
      );
    } else if (query.get("type") === "dao") {
      let payloadData = {
        id: query.get("user"),
        page: payload.page,
        perPage: 10,
        keyword: payload.keyword,
      };
      projectResponse = await getUserProjectListById(payloadData);
    }
    // const projectRes = await getPublicProjectList(payload);

    if (categoriesRes?.categories && projectResponse?.data) {
      const projects = projectResponse.data.map((project) => {
        project.category_name = categoriesRes.categories.find(
          (category) => category.id === project.category_id
        )?.name;
        return project;
      });
      // types

      if (isSearch) {
        setSearchList(projects);
      } else {
        setProjectList(projects);
      }
      if (projectResponse.total && projectResponse.total > 0) {
        const page = calculatePageCount(10, projectResponse.total);
        const pageList = [];
        for (let index = 1; index <= page; index++) {
          pageList.push(index);
        }
        SetPagination(pageList);
      }
    } else {
      SetPagination([]);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      payload.page = isActive;
      if (searchKeyword.length > 0) {
        payload.keyword = searchKeyword;
      }
      await getProjectList(
        payload,
        sortType,
        searchKeyword.length > 0 ? true : false
      );
      // await getCollectionList();
    })();
  }, [sortType]);

  function handleSortType(type) {
    setSortType(type);
  }

  function searchProject(event) {
    event.stopPropagation();
    event.preventDefault();
    const text = event.currentTarget.value;
    setSearchKeyword(text);
    if (text && text.length > 2) {
      // todo: use debounce
      payload.keyword = text;
      setIsactive(1);
      getProjectList(payload, sortType, true);
    }
  }
  async function clearSearch() {
    setSearchKeyword("");
    payload.page = 1;
    setIsactive(1);
    await getProjectList(payload, "newer");
  }

  // async function getCollectionList() {
  //   setIsLoading(true);
  //   await getCollections("", "", 1, 10)
  //     .then((e) => {
  //       if (e.code === 0 && e.data !== null) {
  //         setCollectionList(e.data);
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch(() => {
  //       setIsLoading(false);
  //     });
  // }

  useEffect(() => {
    const navItem = document.getElementById("nav-home");
    if (navItem) navItem.classList.add("active-menu");
  }, []);
  useEffect(
    () => () => {
      const navItem = document.getElementById("nav-home");
      if (navItem) navItem.classList.remove("active-menu");
    },
    []
  );
  const isSearching = searchKeyword.length > 2;

  async function onClickPagination(page) {
    setIsactive(page);
  }

  async function nextPage() {
    if (isActive < pagination.length) {
      setIsactive((pre) => pre + 1);
    }
  }
  async function prevPage() {
    if (isActive > 1) {
      setIsactive((pre) => pre - 1);
    }
  }
  useEffect(() => {
    payload.page = isActive;
    if (searchKeyword.length > 0) {
      payload.keyword = searchKeyword;
    }
    setIsLoading(true);
    getProjectList(payload, sortType, searchKeyword.length > 0 ? true : false);
  }, [isActive]);

  return (
    <>
      {isLoading && <div className="loading"></div>}
      <div className="text-txtblack mx-4 md:mx-0">
        <h1 className="my-6">
          {query.get("type") === "collection"
            ? "Collection List"
            : query.get("type") === "dao"
            ? "DAO List"
            : "Minted NFTs List"}
        </h1>
        <section className="flex mb-6">
          <div className="mr-4 flex-1">
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none">
                <i className="fa-regular fa-magnifying-glass text-primary-900 text-lg"></i>
              </div>
              <input
                type="text"
                id="default-search"
                style={{
                  paddingLeft: 40, // todo: use tailwind
                  border: "none",
                }}
                className="text-lg shadow-main w-full rounded-lg placeholder-color-ass-4 h-[72px] text-[#000] pl-[40px]"
                placeholder="Search by name or title..."
                onChange={searchProject}
                value={searchKeyword}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    searchProject(event);
                  }
                }}
              />
            </div>
          </div>

          <div className="dropdown relative">
            <button
              className="bg-white dropdown-toggle p-4 text-textSubtle font-black font-satoshi-bold rounded-lg shadow-main flex items-center justify-between w-15 md:w-44 h-[72px]"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="hidden md:block"> Sort Of</span>
              <i className="fa-solid fa-angle-down hidden md:block"></i>
              <img src={Sort} alt="sort" className="block md:hidden" />
            </button>

            <ul
              className="dropdown-menu w-[150px] md:w-full absolute hidden bg-white text-base z-50 py-2 list-none rounded-lg shadow-main  mt-1 "
              aria-labelledby="dropdownMenuButton1"
            >
              <li onClick={() => handleSortType("newer")}>
                <div
                  className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                    sortType === "newer" ? "text-primary-900" : "text-txtblack"
                  } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  Newer
                </div>
              </li>
              <li onClick={() => handleSortType("older")}>
                <div
                  className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                    sortType === "older" ? "text-primary-900" : "text-txtblack"
                  } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  older
                </div>
              </li>
              <li onClick={() => handleSortType("view")}>
                <div
                  className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                    sortType === "view" ? "text-primary-900" : "text-txtblack"
                  } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  view
                </div>
              </li>
            </ul>
          </div>
        </section>
        <section>
          {isSearching ? (
            <h4>
              {`Showing result for "${searchKeyword}"`}{" "}
              <p
                className="text-primary-900 font-light cursor-pointer"
                onClick={clearSearch}
              >
                clear
              </p>
            </h4>
          ) : null}
          {isSearching && searchList.length === 0 ? (
            <div className="p-5 text-center min-h-[100px] text-primary-700">
              <h2> Nothing found</h2>
            </div>
          ) : null}
          {query.get("type") === "collection" && (
            <section className="flex flex-wrap items-center space-x-4 justify-center md:justify-start">
              {isSearching
                ? searchList.map((item, index) => (
                    <div key={item.id}>
                      <CollectionCard key={index} collection={item} />
                    </div>
                  ))
                : projectList.map((item, index) => (
                    <div key={item.id}>
                      <CollectionCard key={item.id} collection={item} />
                    </div>
                  ))}
            </section>
          )}

          {query.get("type") === "dao" && (
            <section className="flex flex-wrap items-center  justify-center md:justify-start">
              {isSearching
                ? searchList.map((item, index) => (
                    <div key={item.id}>
                      <DAOCard item={item} key={item.id} />
                    </div>
                  ))
                : projectList.map((item, index) => (
                    <div key={item.id}>
                      <DAOCard item={item} key={item.id} />
                    </div>
                  ))}
            </section>
          )}

          {query.get("type") === "nft" && (
            <section className="flex flex-wrap items-center space-x-4 justify-center md:justify-start">
              {isSearching
                ? searchList.map((item, index) => (
                    <div key={item.id}>
                      <NFTListCard nft={item} projectWork="ethereum" />
                    </div>
                  ))
                : projectList.map((item, index) => (
                    <div key={item.id}>
                      <NFTListCard nft={item} projectWork="ethereum" />
                    </div>
                  ))}
            </section>
          )}
        </section>

        {/* ----- End Card Section ---- */}

        {pagination.length > 0 && (
          <section className="my-5">
            <div className="flex justify-center space-x-1">
              <button
                onClick={prevPage}
                className="px-3 py-1 text-sm  text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7"
              >
                <i className="fa-solid fa-angle-left"></i>
              </button>
              {pagination.map((page) => (
                <button
                  key={page}
                  className={`${
                    isActive === page ? "text-primary-900 bg-primary-900" : ""
                  }  px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7`}
                  onClick={() => onClickPagination(page)}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={nextPage}
                className="px-3 py-1 text-sm  text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7"
              >
                <i className="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </section>
        )}
        {/* End pagination */}
      </div>
    </>
  );
}

export default List;
