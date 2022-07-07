import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "../../assets/css/slider.css";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper";

export default function Slider(props) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        loop={true}
        spaceBetween={10}
        navigation={false}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="big-img"
      >
        {props?.imagesUrl?.map((i) => (
          <SwiperSlide key={i.id}>
            <img src={i.path} alt="cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={15}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper thumb-img"
      >
        {props?.imagesUrl?.map((i) => (
          <SwiperSlide key={i.id}>
            <img src={i.path} alt="cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
