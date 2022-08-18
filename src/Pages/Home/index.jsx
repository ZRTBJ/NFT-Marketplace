/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  getPublicProjectList,
  getProjectCategory,
} from "services/project/projectService";
import HomeNavigateCard from "components/Home/HomeNavigateCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore, { Autoplay } from "swiper";
import CommonCard from "components/CommonCard";
import { Navigation } from "swiper";
import thumbIcon from "assets/images/profile/card.svg";
import avatar from "assets/images/dummy-img.svg";
import DAOCard from "components/DAOCard";

function Home() {
  SwiperCore.use([Autoplay]);
  const [projectList, setProjectList] = useState([]);
  const [popularProjectList, setPopularProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState("newer");

  const payload = {
    order_by: "newer",
    page: 1,
    limit: 10,
    keyword: "",
  };
  const popularPayload = {
    order_by: "view",
    page: 1,
    limit: 10,
  };
  async function getProjectList(payload, type) {
    let categoryList = [];
    await getProjectCategory().then((response) => {
      categoryList = response.categories;
    });
    await getPublicProjectList(payload)
      .then((response) => {
        let data = [];
        if (response.data && response.data.length > 0) {
          data = response.data;
          data.forEach((element) => {
            element.category_name = categoryList.find(
              (x) => x.id === element.category_id
            ).name;

            // if (element.project_fundraising !== null) {
            //   let allocation = "";
            //   let user_allocated_percent = "";
            //   allocation =
            //     (element.token_total_amount / 100) *
            //     element.project_fundraising.allocation_percent;
            //   user_allocated_percent =
            //     (allocation / 100) *
            //     element.project_fundraising.user_allocated_percent;
            //   element.project_fundraising.total_allocation = user_allocated_percent;
            // }
          });
        }
        if (type === "new") {
          setProjectList(data);
        } else if (type === "popular") {
          setPopularProjectList(data);
        }

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }
  useEffect(() => {
    getProjectList(payload, "new");
  }, []);
  useEffect(() => {
    getProjectList(popularPayload, "popular");
  }, []);

  function handleSortType(type) {
    setSortType(type);
    payload.order_by = type;
    getProjectList(payload, "new");
  }

  function searchProject(event) {
    const text = event.currentTarget.value;
    if (text && text.length > 2) {
      setTimeout(() => {
        if (payload.keyword !== text) {
          payload.keyword = text;
          getProjectList(payload, "new");
        }
      }, 2000);
    }
  }

  return (
    <div className="text-txtblack dark:text-white">
      <section className="text-center my-4">
        <HomeNavigateCard />
      </section>

      {/* Start New UI MVP-1.1 */}

      <h2 className="mb-5">DAO List</h2>

      <section className="flex mb-6">
        <form className="mr-4 flex-1">
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none">
              <i className="fa-regular fa-magnifying-glass text-primary-900 text-lg"></i>
            </div>
            <input
              type="search"
              id="default-search"
              name="projectSearch2"
              autoComplete="off"
              className="text-lg shadow-main w-full rounded-lg  pl-12 placeholder-color-ass-4 py-4 pr-4 h-[72px]"
              placeholder="Search DAO by name"
              onChange={searchProject}
            />
          </div>
        </form>

        <div className="dropdown relative">
          <button
            className="bg-white dropdown-toggle p-4 text-textSubtle font-black font-satoshi-bold rounded-lg shadow-main flex items-center justify-between w-44 h-[72px]"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Sort Of
            <i className="fa-solid fa-angle-down"></i>
          </button>

          <ul
            className="dropdown-menu w-full absolute hidden bg-white text-base z-50 py-2 list-none rounded-lg shadow-main  mt-1 "
            aria-labelledby="dropdownMenuButton1"
          >
            <li onClick={() => handleSortType("newer")}>
              <a
                className={`dropdown-item py-2 px-4 block whitespace-nowrap ${
                  sortType === "newer" ? "text-primary-900" : "text-txtblack"
                } hover:bg-slate-50 transition duration-150 ease-in-out`}
              >
                Newer
              </a>
            </li>
            <li onClick={() => handleSortType("older")}>
              <a
                className={`dropdown-item py-2 px-4 block whitespace-nowrap ${
                  sortType === "older" ? "text-primary-900" : "text-txtblack"
                } hover:bg-slate-50 transition duration-150 ease-in-out`}
              >
                older
              </a>
            </li>
            <li onClick={() => handleSortType("view")}>
              <a
                className={`dropdown-item py-2 px-4 block whitespace-nowrap ${
                  sortType === "view" ? "text-primary-900" : "text-txtblack"
                } hover:bg-slate-50 transition duration-150 ease-in-out`}
              >
                view
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="grid md:grid-cols-3 xl:grid-cols-4 gap-4 mb-24">
        {projectList.map((item, index) => (
          <div key={index}>
            <DAOCard item={item} key={item.id} />
          </div>
        ))}
      </section>
      {/* ----- End Card Section ---- */}

      {/* <section className="mb-5">
        <div className="flex justify-center space-x-1">
          <a className="px-3 py-1 text-sm  text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7">
            <i className="fa-solid fa-angle-left"></i>
          </a>

          <a
            href="#"
            className="px-3 py-1 font-satoshi-bold text-sm text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7"
          >
            1
          </a>
          <a
            href="#"
            className="px-3 py-1 font-satoshi-bold text-sm text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7"
          >
            2
          </a>
          <a
            href="#"
            className="px-3 py-1 font-satoshi-bold text-sm text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7"
          >
            3
          </a>
          <a
            href="#"
            className="px-3 py-1 font-satoshi-bold text-sm text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7"
          >
            4
          </a>

          <a className="px-3 py-1 text-sm  text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7">
            <i className="fa-solid fa-angle-right"></i>
          </a>
        </div>
      </section> */}
      {/* End pagination */}

      <h2 className="mb-5">Best Collection</h2>
      <section className="grid md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {/* Card */}
        <div className="min-h-[390px] rounded-x">
          <a href="#">
            <img
              className="rounded-xl h-[276px] object-cover w-full"
              src={thumbIcon}
              alt=""
            />
          </a>

          <div className="p-5">
            <h2 className="mb-2 text-txtblack truncate">NFT Collection #1</h2>
            <p className="mb-3 text-textSubtle text-[13px]">
              There are many variations of passages of Lorem
            </p>

            <div className="flex items-center">
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
            </div>
          </div>
        </div>
        {/* Card */}
        <div className="min-h-[390px] rounded-x">
          <a href="#">
            <img
              className="rounded-xl h-[276px] object-cover w-full"
              src={thumbIcon}
              alt=""
            />
          </a>

          <div className="p-5">
            <h2 className="mb-2 text-txtblack truncate">NFT Collection #1</h2>
            <p className="mb-3 text-textSubtle text-[13px]">
              There are many variations of passages of Lorem
            </p>

            <div className="flex items-center">
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="min-h-[390px] rounded-x">
          <a href="#">
            <img
              className="rounded-xl h-[276px] object-cover w-full"
              src={thumbIcon}
              alt=""
            />
          </a>

          <div className="p-5">
            <h2 className="mb-2 text-txtblack truncate">NFT Collection #1</h2>
            <p className="mb-3 text-textSubtle text-[13px]">
              There are many variations of passages of Lorem
            </p>

            <div className="flex items-center">
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="min-h-[390px] rounded-x">
          <a href="#">
            <img
              className="rounded-xl h-[276px] object-cover w-full"
              src={thumbIcon}
              alt=""
            />
          </a>

          <div className="p-5">
            <h2 className="mb-2 text-txtblack truncate">NFT Collection #1</h2>
            <p className="mb-3 text-textSubtle text-[13px]">
              There are many variations of passages of Lorem
            </p>

            <div className="flex items-center">
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
      {/* ----- End Card Section ---- */}

      {/* END New UI MVP-1.1 */}

      {/* <div className="relative">
        <h2 className="mb-5">Newest Project</h2>
        {isLoading && <div className="onlySpinner mt-[150px]"></div>}
        {!isLoading && (
          <Swiper
            breakpoints={{
              320: {
                slidesPerView: 2,
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
            }}
            className="swipe-card"
            navigation={true}
            modules={[Navigation]}
          >
            <div>
              {projectList.map((i, index) => (
                <SwiperSlide key={index}>
                  <CommonCard key={index} project={i} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        )}
      </div> */}

      {/* {!isLoading && (
        <section className="mt-16 pb-16 relative">
          <h2 className="mb-5">Popular Project</h2>
          <Swiper
            breakpoints={{
              320: {
                slidesPerView: 2,
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
            }}
            className="swipe-card"
            navigation={true}
            modules={[Navigation]}
          >
            <div>
              {popularProjectList.map((i, index) => (
                <SwiperSlide key={index}>
                  <CommonCard key={index} project={i} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </section>
      )} */}
    </div>
  );
}

export default Home;
