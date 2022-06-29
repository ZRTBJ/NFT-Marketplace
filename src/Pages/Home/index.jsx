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
import SwiperCore, { Autoplay } from "swiper";
import CommonCard from "components/CommonCard";

function Home() {
  SwiperCore.use([Autoplay]);
  const [projectList, setProjectList] = useState([]);
  const [popularProjectList, setPopularProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const payload = {
    order_by: "newer",
    page: 1,
    limit: 10,
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
    await getPublicProjectList(payload).then((response) => {
      let data = [];
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
      if (type === "new") {
        setProjectList(data);
      } else if (type === "popular") {
        setPopularProjectList(data);
      }

      setIsLoading(false);
    });
  }
  useEffect(() => {
    getProjectList(payload, "new");
  }, []);
  useEffect(() => {
    getProjectList(popularPayload, "popular");
  }, []);

  return (
    <main className="container mx-auto px-4 text-white">
      <section className="text-center  my-11">
        <HomeNavigateCard />
      </section>

      <div className="mt-[26px] ml-4">
        <h2 className="mb-[36px]">Newest Project</h2>
        <Swiper
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
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
        >
          {!isLoading && (
            <div>
              {projectList.map((i, index) => (
                <SwiperSlide key={index}>
                  <CommonCard key={index} project={i} />
                </SwiperSlide>
              ))}
            </div>
          )}
        </Swiper>
      </div>
      <div className="mt-[26px] ml-4">
        <h2 className="mb-[36px]">Popular Project</h2>
        <Swiper
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
              slidesPerView: 4,
              spaceBetween: 10,
            },
          }}
        >
          {!isLoading && (
            <div>
              {popularProjectList.map((i, index) => (
                <SwiperSlide key={index}>
                  <CommonCard key={index} project={i} />
                </SwiperSlide>
              ))}
            </div>
          )}
        </Swiper>
      </div>
    </main>
  );
}

export default Home;
