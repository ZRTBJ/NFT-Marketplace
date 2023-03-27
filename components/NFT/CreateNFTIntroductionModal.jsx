import Modal from 'components/Commons/Modal';
import Link from 'next/link';
import React from 'react';
const membershipNFTUseCase = [
  { title: `Artist's royalty member badge` },
  { title: `Exclusive content access` },
  { title: `Private group membership card` },
];

const productNFTUseCase = [
  { title: `Ownership Rights` },
  { title: `Sell The Product Easily` },
  { title: `Give Customer Loyalty Program` },
];

export default function CreateNFTIntroductionModal({
  type,
  show,
  handleClose,
  collectionId,
}) {
  const useCase =
    type === 'membership' ? membershipNFTUseCase : productNFTUseCase;
  return (
    <Modal
      width={680}
      show={show}
      handleClose={() => handleClose()}
      showCloseIcon={true}
      overflow={'auto'}
    >
      <div className='p-4 mt-5'>
        <div className='flex flex-wrap justify-between items-center mb-6'>
          <p className='text-[20px] font-black'>Create {type} NFT</p>
          <p className='underline cursor-pointer'>How to?</p>
        </div>
        <div>
          <p className='mb-4 word-break'>
            {type === 'membership'
              ? 'Membership NFT works as a ticket, coupon or access rights to let your audience to access to events, group...'
              : 'Product NFT works as a sale product'}
          </p>
          <Link
            className='contained-button !no-underline'
            href={`/nft/${type}/create${
              collectionId ? `?collection_id=${collectionId}` : ''
            }`}
          >
            Start Creating NFT
          </Link>

          <p className='text-[18px] font-black mt-6'>
            How {type} NFT can help me?
          </p>
          <p className='mb-6 word-break'>
            {type === 'membership'
              ? 'Take a look at some stories below to see how our customers are using membership NFT to provide benefits for their community '
              : 'Take a look at some stories below to see how our customers are using product NFT to provide benefits for their community '}
          </p>
          <div className='grid grid-cols-12 md:grid-cols-3 gap-6'>
            {useCase?.map((item, index) => (
              <div
                key={index}
                className='flex items-center justify-center text-center p-5 min-h-[200px] shadow border border-secondary-900'
              >
                <p className='font-black word-break'>{item?.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
