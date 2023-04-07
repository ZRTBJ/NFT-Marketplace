import React from "react";
import OnBoardingGuide from "./components/OnBoardingGuide";
import CreateNFTCard from "./components/CreateNFTCard";
import BuildDaoCard from "./components/BuildDaoCard";
import UseCase from "./components/UseCase";
import TokenGatedBannerCard from "./components/TokenGatedBannerCard";
import SplitterBanner from "components/LandingPage/components/SplitterBanner";
import charity from "assets/images/profile/charity.png";
import dao from "assets/images/profile/dao.png";
import fashion from "assets/images/profile/fashion.png";
import invest from "assets/images/profile/invest.png";
import membership from "assets/images/profile/membership.png";
import pfp from "assets/images/profile/pfp.png";

const nftUseCase = {
  usedFor: "NFT",
  text: "Here are a few ways your project can deploy NFT",
  steps: [
    {
      title: "Membership NFT",
      description:
        "Offer personalized experiences through token-gated NFTs. Offer membership, design rewards, and create categories-based access services",
      img: membership,
      url: "https://decir.io/decir-users-to-web3-asset-owners/",
    },
    {
      title: "PFP",
      description:
        "PFP NFT helps your brand to build and engage your online community. It is a great tool for brand identity",
      img: pfp,
      url: "https://decir.io/what-are-pfp-nfts-used-for/",
    },
    {
      title: "Digital Fashion",
      description:
        "Design the next set of virtual fashion collectibles tailored to the increasing demands of the virtual world",
      img: fashion,
      url: "https://decir.io/introduction-of-nft-in-digital-fashion/",
    },
  ],
};
const daoUseCase = {
  usedFor: "DAO",
  text: "DAOs can be made to serve specific purposes. What’s yours?",
  steps: [
    {
      title: "Build",
      description:
        "Build web3 projects to create diverse income streams for your members through the power of the DAO",
      img: dao,
      url: "https://decir.io/decir-no-code-dao-tool/",
    },
    {
      title: "Charity",
      description:
        "Create a DAO that caters to the needs of communities around the world. Support noble courses through the power of the collective.",
      img: charity,
      url: "https://decir.io/decir-token-gated-dao-communities/",
    },
    {
      title: "Invest",
      description:
        "Invest in web3 startups and in physical assets through a DAO. Forge shared prosperity through mutual benefits",
      img: invest,
      url: "https://decir.io/decir-for-web3-project-fundraising/",
    },
  ],
};
export default function LandingPage({ setShowCreateSplitter }) {
  return (
    <div>
      <OnBoardingGuide />
      <div className="w-full px-4 my-10 md:max-w-[1100px] mx-auto">
        <TokenGatedBannerCard />
      </div>
      <div className="w-full px-4  pb-3 md:max-w-[1100px] mx-auto flex gap-x-8 my-10 overflow-x-auto flex-nowrap custom-scrollbar">
        <CreateNFTCard size="md" />
        <BuildDaoCard size="md" />
      </div>
      <div className="w-full px-4 pb-10 md:max-w-[1100px] mx-auto">
        <SplitterBanner setShowCreateSplitter={setShowCreateSplitter} />
      </div>
      <div className="w-full px-4 mb-10 md:max-w-[1100px] mx-auto">
        <UseCase data={nftUseCase} />
      </div>
      <div className="w-full px-4 pb-10 md:max-w-[1100px] mx-auto">
        <UseCase data={daoUseCase} />
      </div>
    </div>
  );
}
