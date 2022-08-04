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
    await getPublicProjectList(payload)
      .then((response) => {
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

  return (
    <div className="text-txtblack dark:text-white">
      <section className="text-center  my-11">
        <HomeNavigateCard />
      </section>
      <div className="relative">
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
      </div>

      {!isLoading && (
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
      )}
    </div>
  );
}

export default Home;
