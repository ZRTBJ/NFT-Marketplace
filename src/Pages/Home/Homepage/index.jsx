/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  getPublicProjectList,
  getProjectCategory,
} from "services/project/projectService";
import HomeNavigateCard from "Pages/Home/Homepage/components/HomeNavigateCard";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import thumbIcon from "assets/images/profile/card.svg";
import DAOCard from "components/Cards/DAOCard";
import { getCollections } from "services/collection/collectionService";
import { useParams, Link, useHistory } from "react-router-dom";
import InviteModal from "Pages/Collection/CollectionDetail/RoyaltySplitter/Invite/InviteModal";
import { getIdbyCode } from "services/nft/nftService";
import { useSelector } from "react-redux";
import Sort from "assets/images/icons/sort.svg";
import { Navigation } from "swiper";
import ReactPaginate from "react-paginate";
function Home() {
  SwiperCore.use([Autoplay]);
  const history = useHistory();
  // const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  // const [popularProjectList, setPopularProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState("newer");
  const [collectionList, setCollectionList] = useState([]);
  const [inviteData, setInviteData] = useState();
  const [isInviteLoading, setIsInvteLoading] = useState(false);
  const [ShowInviteModal, setShowInviteModal] = useState(false);
  const { invite } = useParams();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [pagination, SetPagination] = useState([]);
  const [isActive, setIsactive] = useState(1);

  const payload = {
    order_by: "newer",
    page: 1,
    limit: 10,
    keyword: "",
  };

  const settings = {
    320: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 15,
    },
    1536: {
      slidesPerView: 5,
      spaceBetween: 15,
    },
  };

  /**
 * TODO: In header, we check if user logged in, and should check metamask logged in, otherwise logout and navigate them to logi
 */
  useEffect(() => {
    if (userinfo.id) {
      console.log(userinfo);
      history.push(`/profile/${userinfo.id}/`);
    } else {
      history.push(`/profile/login`);
    }
    window.location.reload();
  }, []);

  useEffect(() => {
    const navItem = document.getElementById("nav-home");
    if (navItem) navItem.classList.add("active-menu");
  }, []);

  useEffect(() => {
    if (invite) {
      getIdbyCode(invite)
        .then((resp) => {
          if (resp.code === 0) {
            setShowInviteModal(true);
          }
          setInviteData(resp);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };

  async function getProjectList(payload, orderBy, isSearch = false) {
    payload.order_by = orderBy;

    const categoriesRes = await getProjectCategory();
    const projectRes = await getPublicProjectList(payload);

    if (categoriesRes?.categories && projectRes?.data) {
      const projects = projectRes.data.map((project) => {
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
      if (projectRes.total && projectRes.total > 0) {
        const page = calculatePageCount(10, projectRes.total);
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
      await getCollectionList();
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

  async function getCollectionList() {
    setIsLoading(true);
    await getCollections("", "", 1, 10)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          setCollectionList(e.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  const truncateArray = (members) => {
    let slicedItems = members.slice(0, 3);
    return { slicedItems, restSize: members.length - slicedItems.length };
  };

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

  useEffect(() => {
    payload.page = isActive;
    if (searchKeyword.length > 0) {
      payload.keyword = searchKeyword;
    }
    setIsLoading(true);
    getProjectList(payload, sortType, searchKeyword.length > 0 ? true : false);
  }, [isActive]);

  const handlePageClick = (event) => {
    setIsactive(event.selected + 1);
  };

  return (
    <>
      {isLoading && <div className="loading"></div>}
      <div className="text-txtblack mx-4 md:mx-0">
        <InviteModal
          show={ShowInviteModal}
          handleClose={() => setShowInviteModal(false)}
          collectionName={inviteData?.collection_name}
          isAuthenticated={userinfo?.id}
          nftId={inviteData?.lnft_id}
          collectionId={inviteData?.collection_id}
          assetImage={inviteData?.lnft_asset}
        />
        <section className="text-center my-4">
          <HomeNavigateCard />
        </section>

        {/* Start New UI MVP-1.1 */}

        <h2 className="mb-5">DAO List</h2>
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
                placeholder="Search DAO by name..."
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
                <a
                  className={`dropdown-item py-2 px-4 block whitespace-nowrap ${sortType === "newer" ? "text-primary-900" : "text-txtblack"
                    } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  Newer
                </a>
              </li>
              <li onClick={() => handleSortType("older")}>
                <a
                  className={`dropdown-item py-2 px-4 block whitespace-nowrap ${sortType === "older" ? "text-primary-900" : "text-txtblack"
                    } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  older
                </a>
              </li>
              <li onClick={() => handleSortType("view")}>
                <a
                  className={`dropdown-item py-2 px-4 block whitespace-nowrap ${sortType === "view" ? "text-primary-900" : "text-txtblack"
                    } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  view
                </a>
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
          <section className="flex flex-wrap items-center justify-center md:justify-start">
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
        </section>

        {/* ----- End Card Section ---- */}

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
        {/* End pagination */}

        <div className="mb-5 flex flex-wrap">
          <h2>Best Collection</h2>
          <Link
            to="/list/?type=collection"
            className="contained-button  py-1 px-3 rounded ml-auto"
          >
            View All
          </Link>
        </div>
        <section className="mb-6">
          {/* Card */}
          <Swiper
            breakpoints={settings}
            navigation={true}
            modules={[Navigation]}
            className=""
          >
            <div>
              {collectionList &&
                collectionList.length > 0 &&
                collectionList.map((collection, index) => (
                  <SwiperSlide key={index} className="">
                    <div
                      className="min-h-[390px] rounded-x"
                      key={`best-collection-${index}`}
                    >
                      <Link
                        to={
                          collection.type === "right_attach"
                            ? `/royality-management/${collection.id}`
                            : `/collection-details/${collection.id}`
                        }
                      >
                        <img
                          className="rounded-xl h-[276px] object-cover w-full"
                          src={
                            collection &&
                              collection.assets &&
                              collection.assets[0]
                              ? collection.assets[0].path
                              : thumbIcon
                          }
                          alt=""
                        />
                      </Link>

                      <div className="p-5">
                        <h3 className="pb-2 text-txtblack truncate text-[18px] md:text-[24px]">
                          {collection.name}
                        </h3>
                        <p className="mb-3 text-textSubtle text-[13px]">
                          {collection.description &&
                            collection.description.length > 70
                            ? collection.description.substring(0, 67) + "..."
                            : collection.description}
                        </p>

                        <div className="flex items-center">
                          {collection.members &&
                            collection.members.length > 0 &&
                            truncateArray(collection.members).slicedItems.map(
                              (member) => (
                                <img
                                  src={member.avatar}
                                  alt={member.id}
                                  className="rounded-full w-9 h-9 -ml-2 border-2 border-white"
                                />
                              )
                            )}
                          {collection.members && collection.members.length > 3 && (
                            <div className="flex items-center mt-[6px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[26px] h-[26px]">
                              <p className="text-[12px] text-[#9A5AFF]">
                                +{truncateArray(collection.members).restSize}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </div>
          </Swiper>
        </section>
      </div>
    </>
  );
}

export default Home;
