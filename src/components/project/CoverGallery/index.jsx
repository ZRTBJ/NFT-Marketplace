import manImg from "assets/images/projectDetails/man-img.svg";
import bigImg from "assets/images/gallery/big-img.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore, { Autoplay } from "swiper";

const CoverGallery = ({ assets, coverImages }) => {
  SwiperCore.use([Autoplay]);
  return (
    <>
      <section className=" hidden md:grid md:grid-cols-5 gap-4 mt-6">
        <div className="row-span-2 col-span-2">
          <img
            className="rounded-xl object-cover h-[260px] w-full"
            src={coverImages?.path ? coverImages.path : bigImg}
            alt=""
          />
        </div>
        {assets?.length > 0 &&
          assets.map((img, index) => (
            <div key={`dao-image-${index}`}>
              {img["asset_purpose"] !== "cover" && (
                <div>
                  <img
                    className="rounded-xl object-cover h-[122px] w-full"
                    src={img ? img.path : manImg}
                    alt=""
                  />
                </div>
              )}
            </div>
          ))}
      </section>
      {/* mobile gallery */}
      <Swiper
        navigation={false}
        modules={[Navigation]}
        className="md:hidden mt-4 mb-6"
      >
        <SwiperSlide className="!w-[212px] mx-2">
          <img
            className="rounded-xl object-cover h-[124px] w-full"
            src={coverImages?.path ? coverImages.path : bigImg}
            alt=""
          />
        </SwiperSlide>
        {assets?.length > 0 &&
          assets.map((img, index) => (
            <div key={`dao-image-${index}`}>
              {img["asset_purpose"] !== "cover" && (
                <div>
                  <SwiperSlide className="!w-[212px] mx-4">
                    <img
                      className="rounded-xl object-cover h-[124px] w-full"
                      src={img ? img.path : manImg}
                      alt=""
                    />
                  </SwiperSlide>
                </div>
              )}
            </div>
          ))}
      </Swiper>
    </>
  );
};

export default CoverGallery;
