import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

function Home(props) {
  return (
    <div className="px-2">
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
        interval={2000}
        transitionTime={500}
      >
        <div>
          <img src={require(`assets/images/slider/Bridge-of-Spirits.jpg`)} />
          <div className="flex relative bottom-48 left-1/3 ">
            <div
              className="h-12 w-48 pt-2 text-center rounded border-2 border-zinc-300"
              style={{ background: "rgb(0,0,0,0.3)" }}
            >
              <span className="text-xl text-white font-normal cursor-pointer">
                JOIN NOW
              </span>
            </div>
            <div
              className="h-12 w-48 pt-2 text-center rounded border-2 border-zinc-300 ml-2.5 cursor-pointer"
              style={{ background: "rgb(0,0,0,0.3)" }}
            >
              <span className="text-xl text-white font-normal cursor-pointer">
                What's CREABO?
              </span>
            </div>
          </div>
        </div>
        <div>
          <img
            src={require(`assets/images/slider/4k-cyberpunk-2077-ps-game-sr.jpg`)}
          />
          <div className="flex relative bottom-48 left-1/3 ">
            <div
              className="h-12 w-48 pt-2 text-center rounded border-2 border-zinc-300"
              style={{ background: "rgb(0,0,0,0.3)" }}
            >
              <span className="text-xl text-white font-normal">JOIN NOW</span>
            </div>
            <div
              className="h-12 w-48 pt-2 text-center rounded border-2 border-zinc-300 ml-2.5 "
              style={{ background: "rgb(0,0,0,0.3)" }}
            >
              <span className="text-xl text-white font-normal">
                What's CREABO?
              </span>
            </div>
          </div>
        </div>
        <div>
          <img src={require(`assets/images/slider/cyberpunk-2077.jpg`)} />
          <div className="flex relative bottom-48 left-1/3 ">
            <div
              className="h-12 w-48 pt-2 text-center rounded border-2 border-zinc-300"
              style={{ background: "rgb(0,0,0,0.3)" }}
            >
              <span className="text-xl text-white font-normal">JOIN NOW</span>
            </div>
            <div
              className="h-12 w-48 pt-2 text-center rounded border-2 border-zinc-300 ml-2.5 "
              style={{ background: "rgb(0,0,0,0.3)" }}
            >
              <span className="text-xl text-white font-normal">
                What's CREABO?
              </span>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}

export default Home;
