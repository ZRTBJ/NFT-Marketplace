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

  return <div className="h-screen"></div>;
}

export default Home;
