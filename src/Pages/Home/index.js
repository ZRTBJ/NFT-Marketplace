import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import WhatIsCreabo from "../../components/Home/WhatIsCreabo";

function Home(props) {
  return (
    <>
      {/* Top slider */}
      {/* Dexktop view */}
      <div className="px-1 hidden sm:block">
        <div className="flex absolute top-44 left-8 z-[1]">
          <span className="text-8xl xl:text-9xl font-bold italic tracking-wide text-white max-w-12">
            <p>Share their success</p>
            <p>All together</p>
          </span>
        </div>
        <Carousel
          showArrows={true}
          showStatus={false}
          showIndicators={true}
          infiniteLoop={true}
          showThumbs={false}
          useKeyboardArrows={true}
          autoPlay={true}
          stopOnHover={true}
          swipeable={true}
          dynamicHeight={false}
          emulateTouch={true}
          autoFocus={false}
          centerMode={true}
          centerSlidePercentage={35}
          interval={4000}
          transitionTime={500}
        >
          <div>
            <img
              className="h-[720px]"
              src={require(`assets/images/slider/AdobeStock_388577434_Preview.jpg`)}
              alt="slider 1"
            />
          </div>
          <div>
            <img
              className="h-[720px]"
              src={require(`assets/images/slider/games-battlefield.jpg`)}
              alt="slider 2"
            />
          </div>
          <div>
            <img
              className="h-[720px]"
              src={require(`assets/images/slider/game.jpg`)}
              alt="slider 3"
            />
          </div>
          <div>
            <img
              className="h-[720px]"
              src={require(`assets/images/slider/halo.jpg`)}
              alt="slider 4"
            />
          </div>
          <div>
            <img
              className="h-[720px]"
              src={require(`assets/images/slider/Gaming-Mobile-Wallpaper.jpg`)}
              alt="slider 5"
            />
          </div>
        </Carousel>
        <div className="flex max-w-fit relative bottom-16 sm:bottom-32 left-20 sm:left-1/4 xl:left-1/3">
          <div
            className="h-8 sm:h-12 w-24 sm:w-48 pt-1 sm:pt-2 text-center rounded border sm:border-2 border-zinc-300 ml-4 sm:ml-4 lg:ml-10"
            style={{ background: "rgb(0,0,0,0.3)" }}
          >
            <span className="text-base sm:text-xl text-white font-light sm:font-normal">
              JOIN NOW
            </span>
          </div>
          <div
            className="h-8 sm:h-12 w-32 sm:w-48 pt-1 sm:pt-2 text-center rounded border sm:border-2 border-zinc-300 ml-4 sm:ml-4 lg:ml-10"
            style={{ background: "rgb(0,0,0,0.3)" }}
          >
            <span className="text-base sm:text-xl text-white font-light sm:font-normal">
              What's CREABO?
            </span>
          </div>
        </div>
      </div>
      {/* Mobile view */}
      <div className="px-1 block sm:hidden">
        <div className="flex absolute top-24 left-4 z-[1]">
          <span className="text-4xl font-bold italic tracking-wide text-white max-w-12">
            <p>Share their success</p>
            <p>All together</p>
          </span>
        </div>
        <Carousel
          showArrows={true}
          showStatus={false}
          showIndicators={true}
          infiniteLoop={true}
          showThumbs={false}
          useKeyboardArrows={true}
          autoPlay={true}
          stopOnHover={true}
          swipeable={true}
          dynamicHeight={false}
          emulateTouch={true}
          autoFocus={false}
          centerMode={true}
          centerSlidePercentage={70}
          interval={4000}
          transitionTime={500}
        >
          <div>
            <img
              src={require(`assets/images/slider/AdobeStock_388577434_Preview.jpg`)}
              alt="slider 1"
              height={1020}
              width={650}
            />
          </div>
          <div>
            <img
              src={require(`assets/images/slider/games-battlefield.jpg`)}
              alt="slider 2"
              height={1020}
              width={650}
            />
          </div>
          <div>
            <img
              src={require(`assets/images/slider/game.jpg`)}
              alt="slider 3"
              height={1020}
              width={650}
            />
          </div>
          <div>
            <img
              src={require(`assets/images/slider/halo.jpg`)}
              alt="slider 4"
              height={1020}
              width={650}
            />
          </div>
          <div>
            <img
              src={require(`assets/images/slider/Gaming-Mobile-Wallpaper.jpg`)}
              alt="slider 1"
              height={1020}
              width={650}
            />
          </div>
        </Carousel>
        <div className="flex max-w-fit relative bottom-16 sm:bottom-32 left-20 sm:left-1/4 xl:left-1/3">
          <div
            className="h-8 sm:h-12 w-24 sm:w-48 pt-1 sm:pt-2 text-center rounded border sm:border-2 border-zinc-300 ml-4 sm:ml-4 lg:ml-10"
            style={{ background: "rgb(0,0,0,0.3)" }}
          >
            <span className="text-base sm:text-xl text-white font-light sm:font-normal">
              JOIN NOW
            </span>
          </div>
          <div
            className="h-8 sm:h-12 w-32 sm:w-48 pt-1 sm:pt-2 text-center rounded border sm:border-2 border-zinc-300 ml-4 sm:ml-4 lg:ml-10"
            style={{ background: "rgb(0,0,0,0.3)" }}
          >
            <span className="text-base sm:text-xl text-white font-light sm:font-normal">
              What's CREABO?
            </span>
          </div>
        </div>
      </div>
      {/*What's CREABO */}
      <div className="pt-2">
        <WhatIsCreabo />
      </div>
    </>
  );
}

export default Home;
