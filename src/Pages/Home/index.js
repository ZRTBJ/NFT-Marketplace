import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import WhatIsCreabo from "../../components/Home/WhatIsCreabo";

function Home(props) {
  return (
    <>
      {/* Top slider */}
      <div className="px-1">
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
              src={require(`assets/images/slider/4k-cyberpunk-2077-ps-game-sr.jpg`)}
            />
            {/* <div className="flex relative bottom-14 sm:bottom-48 left-8 sm:left-1/3 ">
              <div
                className="h-8 sm:h-12 w-24 sm:w-48 pt-1 sm:pt-2 text-center rounded border sm:border-2 border-zinc-300"
                style={{ background: "rgb(0,0,0,0.3)" }}
              >
                <span className="text-base sm:text-xl text-white font-light sm:font-normal">
                  JOIN NOW
                </span>
              </div>
              <div
                className="h-8 sm:h-12 w-32 sm:w-48 pt-1 sm:pt-2 text-center rounded border sm:border-2 border-zinc-300 ml-4 sm:ml-8"
                style={{ background: "rgb(0,0,0,0.3)" }}
              >
                <span className="text-base sm:text-xl text-white font-light sm:font-normal">
                  What's CREABO?
                </span>
              </div>
            </div> */}
          </div>
          <div>
            <img src={require(`assets/images/slider/Bridge-of-Spirits.jpg`)} />
          </div>
          <div>
            <img src={require(`assets/images/slider/cyberpunk-2077.jpg`)} />
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
