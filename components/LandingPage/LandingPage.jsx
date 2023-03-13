import React from 'react';
import OnBoardingGuide from './components/OnBoardingGuide';
import CreateNFTCard from './components/CreateNFTCard';
import BuildDaoCard from './components/BuildDaoCard';
import UseCase from './components/UseCase';
import TokenGatedBannerCard from './components/TokenGatedBannerCard';
const nftUseCase = {
  usedFor: 'NFTs',
  text: 'Here are a few ways your project can deploy NFT',
  steps: [
    {
      title: 'Membership NFT',
      description:
        'Offer personalized experiences through token-gated NFTs. Offer membership, design rewards, and create categories-based access services',
    },
    {
      title: 'PFP',
      description:
        'PFP NFT helps your brand build and engage your online community. It is a great tool for brand identity',
    },
    {
      title: 'Digital Fashion',
      description:
        'Design the next set of virtual fashion collectibles tailored to the increasing demands of the virtual world',
    },
  ],
};
const daoUseCase = {
  usedFor: 'a DAO',
  text: 'DAOs can be made to serve specific purposes. What’s yours?',
  steps: [
    {
      title: 'Build',
      description:
        'Build web3 projects to create diverse income streams for your members through the power of the DAO',
    },
    {
      title: 'Charity',
      description:
        'Create a DAO that caters to the needs of communities around the world. Support noble courses through the power of the collective.',
    },
    {
      title: 'Invest',
      description:
        'Invest in web3 startups and in physical assets through a DAO. Forge shared prosperity through mutual benefits',
    },
  ],
};
export default function LandingPage({ setShowCreateSplitter }) {
  return (
    <div>
      <OnBoardingGuide />
      <div className='w-full px-4 my-10 md:max-w-[1100px] mx-auto'>
        <TokenGatedBannerCard />
      </div>
      <button
        className='outlined-button'
        onClick={() => setShowCreateSplitter(true)}
      >
        Create
      </button>
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
