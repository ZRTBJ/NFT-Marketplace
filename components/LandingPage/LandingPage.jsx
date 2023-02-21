import React from 'react';
import OnBoardingGuide from './components/OnBoardingGuide';
import CreateNFTCard from './components/CreateNFTCard';
import BuildDaoCard from './components/BuildDaoCard';
import NFTUseCase from './components/NFTUseCase';
import TokenGatedBannerCard from './components/TokenGatedBannerCard';
export default function LandingPage() {
  return (
    <div>
      <OnBoardingGuide />
      <div className='w-full px-4  pb-3 md:max-w-[1100px] mx-auto flex gap-x-8 my-10 overflow-x-auto flex-nowrap'>
        <CreateNFTCard />
        <BuildDaoCard />
      </div>
      <div className='w-full px-4 mb-10 md:max-w-[1100px] mx-auto'>
        <NFTUseCase />
      </div>
      <div className='w-full px-4 mt-10 pb-10 md:max-w-[1100px] mx-auto'>
        <TokenGatedBannerCard />
      </div>
    </div>
  );
}
