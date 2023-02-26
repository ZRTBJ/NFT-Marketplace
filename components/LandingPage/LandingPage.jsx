import React from 'react';
import OnBoardingGuide from './components/OnBoardingGuide';
import CreateNFTCard from './components/CreateNFTCard';
import BuildDaoCard from './components/BuildDaoCard';
import UseCase from './components/UseCase';
import TokenGatedBannerCard from './components/TokenGatedBannerCard';
const nftUseCase = {
  usedFor: 'NFTs',
  text: 'Lorem Ipsum is simply dummy text of the printing and Ipsum has been ',
  steps: [
    {
      title: 'Title / headline',
      description:
        'Lorem Ipsum is simply dummy text of the printing and Ipsum has been ',
    },
    {
      title: 'Title / headline',
      description:
        'Lorem Ipsum is simply dummy text of the printing and Ipsum has been ',
    },
    {
      title: 'Title / headline',
      description:
        'Lorem Ipsum is simply dummy text of the printing and Ipsum has been ',
    },
  ],
};
const daoUseCase = {
  usedFor: 'DAO Community',
  text: 'Lorem Ipsum is simply dummy text of the printing and Ipsum has been ',
  steps: [
    {
      title: 'Title / headline',
      description:
        'Lorem Ipsum is simply dummy text of the printing and Ipsum has been ',
    },
    {
      title: 'Title / headline',
      description:
        'Lorem Ipsum is simply dummy text of the printing and Ipsum has been ',
    },
    {
      title: 'Title / headline',
      description:
        'Lorem Ipsum is simply dummy text of the printing and Ipsum has been ',
    },
  ],
};
export default function LandingPage() {
  return (
    <div>
      <OnBoardingGuide />
      <div className='w-full px-4 my-10 md:max-w-[1100px] mx-auto'>
        <TokenGatedBannerCard />
      </div>
      <div className='w-full px-4  pb-3 md:max-w-[1100px] mx-auto flex gap-x-8 my-10 overflow-x-auto flex-nowrap custom-scrollbar'>
        <CreateNFTCard size='md' />
        <BuildDaoCard size='md' />
      </div>
      <div className='w-full px-4 mb-10 md:max-w-[1100px] mx-auto'>
        <UseCase data={nftUseCase} />
      </div>
      <div className='w-full px-4 pb-10 md:max-w-[1100px] mx-auto'>
        <UseCase data={daoUseCase} />
      </div>
    </div>
  );
}
