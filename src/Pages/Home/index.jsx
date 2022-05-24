import React, { useEffect, useState } from "react";
import {
  getPublicProjectList,
  getProjectCategory,
} from "services/project/projectService";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import WhatIsCreabo from "../../components/Home/WhatIsCreabo";
import ProjectListCard from "components/Home/ProjectListCard";
import { Link } from "react-router-dom";

function Home(props) {
  SwiperCore.use([Autoplay]);
  const [projectList, setProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  async function getProjectList() {
    let categoryList = [];
    await getProjectCategory().then((response) => {
      categoryList = response.categories;
    });
    await getPublicProjectList().then((response) => {
      response.data.forEach((element) => {
        element.category_name = categoryList.find(
          (x) => x.id === element.category_id
        ).name;
        if (element.project_fundraising !== null) {
          let allocation = "";
          let user_allocated_percent = "";
          allocation =
            (element.token_total_amount / 100) *
            element.project_fundraising.allocation_percent;
          user_allocated_percent =
            (allocation / 100) *
            element.project_fundraising.user_allocated_percent;
          element.project_fundraising.total_allocation = user_allocated_percent;
        }
      });
      setProjectList(response.data);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    getProjectList();
  }, []);

  return (
    <div>
      {/* Top slider */}
      <div className="block">
        <div className="flex absolute top-28 lg:top-32 xl:top-42 left-8 z-[2]">
          <span className="text-4xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold italic tracking-wide text-white max-w-12">
            <p>Share their success</p>
            <p>All together</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row absolute top-2/3 sm:top-80 lg:top-1/2 xl:top-3/4 left-1/4 sm:left-1/4 xl:left-1/3 z-[2]">
          <div
            className="h-12 w-48 pt-2 text-center rounded border-2 border-zinc-300 ml-4 sm:ml-4 lg:ml-10"
            style={{ background: "rgb(0,0,0,0.5)" }}
          >
            <span className="text-xl text-white font-normal">JOIN NOW</span>
          </div>
          <div
            className="h-12 w-48 pt-2 text-center rounded border-2 border-zinc-300 ml-4 sm:ml-4 lg:ml-10 mt-2 sm:mt-0"
            style={{ background: "rgb(0,0,0,0.5)" }}
          >
            <span className="text-xl text-white font-normal">
              What's CREABO?
            </span>
          </div>
        </div>
        <Swiper
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          autoplay={{
            delay: 1000,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              src={require(`assets/images/slider/AdobeStock_388577434_Preview.jpg`)}
              alt="slider 1"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={require(`assets/images/slider/games-battlefield.jpg`)}
              alt="slider 2"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={require(`assets/images/slider/game.jpg`)}
              alt="slider 3"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={require(`assets/images/slider/halo.jpg`)}
              alt="slider 4"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={require(`assets/images/slider/Gaming-Mobile-Wallpaper.jpg`)}
              alt="slider 5"
            />
          </SwiperSlide>
        </Swiper>
      </div>
      {/*What's CREABO */}
      <div className="pt-2">
        <WhatIsCreabo />
      </div>
      {/* Project List */}
      <div className="bg-[#192434] ">
        <div className="flex items-center justify-between md:justify-start  pt-[40px] md:pt-[54px] mb-[32px]">
          <div className="text-[40px] md:text-[100px] text-[#0AB4AF] roboto font-[600]">
            PROJECT
          </div>
          <Link
            to="/all-project"
            className="ml-[23px] md:mt-[50px] mr-4 md:mr-0  h-[22px] w-[74px] text-[14px] md:text-[16px] md:w-[100px] md:h-[26px] bg-[#0AB4AF] text-center rounded-[13px] text-[#FFFFFF]"
          >
            more
          </Link>
        </div>
        <div className="pb-[60px]">
          <Swiper
            spaceBetween={30}
            centeredSlides={false}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 5,
              },
            }}
          >
            {!isLoading && (
              <div>
                {projectList.map((i, index) => (
                  <SwiperSlide key={index}>
                    <ProjectListCard key={index} project={i} />
                  </SwiperSlide>
                ))}
              </div>
            )}
          </Swiper>
        </div>
        <hr className="border-[1px] border-[white mb-6" />
      </div>
    </div>
  );
}

export default Home;
