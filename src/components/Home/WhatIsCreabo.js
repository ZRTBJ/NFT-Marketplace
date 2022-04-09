import React from "react";
import { ReactComponent as Tokenfunding } from "../../assets/images/home/figure_tokenfunding.svg";
import { ReactComponent as Collaboration } from "../../assets/images/home/figure_collaboration.svg";
import { ReactComponent as Shared } from "../../assets/images/home/figure_shared.svg";
import { ReactComponent as Mint } from "../../assets/images/home/figure_mint.svg";

function WhatIsCreabo(props) {
  return (
    <>
      <div className="px-2 py-4">
        <div className="text-center text-4xl sm:text-5xl font-bold">
          What's CREABO
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg-12 place-items-center mt-4 sm:mt-12 mx-4 sm:mx-6 xl:mx-40">
        <div className="lg:w-64 text-center max-w-fit">
          <div className="px-2 sm:px-14">
            <Tokenfunding />
          </div>
          <div className="text-lg sm:text-xl font-bold pt-4 pb-2">
            TOKEN FUNDING
          </div>
          <p className="antialiased text-sm sm:text-base">
            Create your own token and then you can fundraising by your token.
          </p>
          <div className="h-2.5 sm:h-6"></div>
        </div>
        <div className="lg:w-64 text-center max-w-fit">
          <div className="px-2 sm:px-14">
            <Collaboration />
          </div>
          <div className="text-lg sm:text-xl font-bold pt-4 pb-2">
            COLLABORATION
          </div>
          <p className="antialiased text-sm sm:text-base">
            Establish your project with various creators. Let's get meet up!
          </p>
          <div className="h-5 sm:h-.5"></div>
        </div>
        <div className="lg:w-64 text-center max-w-fit">
          <div className="px-2 sm:px-14">
            <Shared />
          </div>
          <div className="text-lg sm:text-xl font-bold pt-4 pb-2">
            SHARED OWNERSHIP
          </div>
          <p className="antialiased text-sm sm:text-base">
            We leave the production process in the chain and share ownership of
            the production with everyone.
          </p>
        </div>
        <div className="lg:w-64 text-center max-w-fit">
          <div className="px-2 sm:px-14">
            <Mint />
          </div>
          <div className="text-lg sm:text-xl font-bold pt-4 pb-2">NFT MINT</div>
          <p className="antialiased text-sm sm:text-base">
            After creating, you can minting your project NFT.
          </p>
          <div className="h-12 sm:h-8"></div>
        </div>
      </div>
    </>
  );
}

export default WhatIsCreabo;
