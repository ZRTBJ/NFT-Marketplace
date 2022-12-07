import manImg from 'assets/images/projectDetails/man-img.svg';
import bigImg from 'assets/images/gallery/big-img.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore, { Autoplay } from 'swiper';
import Image from 'next/image';

const CoverGallery = ({ assets }) => {
  SwiperCore.use([Autoplay]);
  const subPhoto = assets?.filter((img) => img['asset_purpose'] !== 'cover');
  return (
    <>
      <section className=' hidden md:grid md:grid-cols-5 gap-4 mt-6'>
        {subPhoto?.length === 0 && (
          <div className='row-span-2 col-span-2'>
            <Image
              className='rounded-xl object-cover h-[260px] w-full'
              src={bigImg}
              alt='Dao Default cover'
            />
          </div>
        )}
        {assets?.length > 0 &&
          subPhoto?.map((img, index) => (
            <div
              key={`dao-image-${index}`}
              className={
                index === 0 ? `row-span-2 col-span-2 h-[260px]` : 'h-[122px]'
              }
            >
              <Image
                className='rounded-xl object-cover  h-full w-full'
                src={img ? img.path : manImg}
                alt='dao cover'
                height={index === 0 ? 260 : 122}
                width={index === 0 ? 548 : 266}
              />
            </div>
          ))}
      </section>
      {/* mobile gallery */}
      <Swiper
        navigation={false}
        modules={[Navigation]}
        className='md:hidden mt-4 mb-6'
      >
        {subPhoto?.length === 0 && (
          <SwiperSlide className='!w-[212px] mx-2'>
            <Image
              className='rounded-xl object-cover h-[124px] w-full'
              src={bigImg}
              alt='Dao Default cover'
            />
          </SwiperSlide>
        )}
        {assets?.length > 0 &&
          subPhoto?.map((img, index) => (
            <div key={`dao-image-mobile-${index}`}>
              <SwiperSlide className='!w-[212px] mx-4'>
                <Image
                  className='rounded-xl object-cover h-[124px] w-full'
                  src={img ? img.path : manImg}
                  alt='dao cover'
                  height={124}
                  width={266}
                />
              </SwiperSlide>
            </div>
          ))}
      </Swiper>
    </>
  );
};

export default CoverGallery;
