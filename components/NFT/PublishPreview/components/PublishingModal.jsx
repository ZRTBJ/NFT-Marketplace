import Modal from 'components/Commons/Modal';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import lottieJson from 'assets/lottieFiles/nft-minting-process';
import MockImage from 'assets/images/magic-wallet.png';
import NFTStatusTable from './NFTStatusTable';
import Link from 'next/link';

const PublishingModal = ({
  handleClose,
  show,
  currentStep,
  nfts,
  contributors,
  collectionId,
  nftsHashed,
  tokenStandard,
  nftsPublished,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieJson,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const steps = [
    {
      title: 'Publishing Royalty Splitter',
      titleCompleted: contributors?.length
        ? 'Published Royalty Splitter'
        : 'No Splitter to publish',
    },
    {
      title: 'Publishing NFT to IPFS',
      titleCompleted:
        nfts?.length || nftsHashed
          ? 'Published NFT to IPFS'
          : 'No NFTs to Publish',
    },
    {
      title: 'Publishing Collection',
      titleCompleted: 'Published Collection',
    },
  ];

  const steps721 = [...steps, { title: 'Done', titleCompleted: 'Put on sale' }];

  const steps1155 = [
    ...steps,
    { title: 'Adding Token', titleCompleted: 'Token Added' },
    { title: 'Done', titleCompleted: 'Put on sale' },
  ];

  const finalSteps = tokenStandard === 'ERC1155' ? steps1155 : steps721;

  return (
    <Modal width={600} show={show} handleClose={() => handleClose(false)}>
      <h2>Publishing NFT</h2>
      <p className='mt-2'>
        Please do not close this screen and sign transation when needed
      </p>
      <div className='flex items-center'>
        <div className='mt-8 ml-6'>
          <div className='relative text-gray-500 border-l border-l-4 border-gray-200 '>
            {finalSteps?.map((step, index) => (
              <div className='mb-16 ml-6' key={index}>
                <div
                  className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-[18px] ${
                    currentStep >= index + 1 ||
                    (tokenStandard === 'ERC721' && currentStep === 3) ||
                    (tokenStandard === 'ERC1155' && currentStep === 4)
                      ? 'bg-green-200'
                      : 'bg-gray-200'
                  }`}
                >
                  {(currentStep === index &&
                    tokenStandard === 'ERC721' &&
                    currentStep !== 3) ||
                  (currentStep === index &&
                    tokenStandard === 'ERC1155' &&
                    currentStep !== 4) ? (
                    <i class='fa-sharp fa-regular fa-arrows-rotate animate-spin'></i>
                  ) : currentStep >= index + 1 ||
                    (tokenStandard === 'ERC721' && currentStep === 3) ||
                    (tokenStandard === 'ERC1155' && currentStep === 4) ? (
                    <svg
                      aria-hidden='true'
                      className='w-5 h-5 text-green-500 dark:text-green-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                  ) : (
                    <p className='text-txtblack'>{index + 1}</p>
                  )}
                </div>
                <p
                  className={`${
                    currentStep >= index + 1 || currentStep === 3
                      ? 'text-txtblack'
                      : 'text-textSubtle'
                  }`}
                >
                  {currentStep >= index + 1 || currentStep === 3
                    ? step.titleCompleted
                    : step?.title}
                </p>
              </div>
            ))}
          </div>
        </div>
        {tokenStandard === 'ERC721' && currentStep === 1 ? (
          <NFTStatusTable nfts={nfts} />
        ) : tokenStandard === 'ERC1155' && currentStep === 3 ? (
          <NFTStatusTable
            nfts={nfts}
            addToken={true}
            nftsPublished={nftsPublished}
          />
        ) : (
          <Lottie options={defaultOptions} height={300} width={300} />
        )}
      </div>
      {(tokenStandard === 'ERC1155' && currentStep === 4) ||
      (tokenStandard === 'ERC721' && currentStep === 3) ? (
        <div className='w-full text-center'>
          <Link
            href={`/collection/${collectionId}`}
            className='contained-button mx-auto shadow-md'
          >
            Go to Collection
          </Link>
        </div>
      ) : null}
    </Modal>
  );
};

export default PublishingModal;
