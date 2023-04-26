import { useState } from 'react';
import Image from 'next/image';
import Cover from 'assets/images/cover-default.svg';
import manImg from 'assets/images/image-default.svg';
import Link from 'next/link';

export default function CollectionDetailsDraft({ userId }) {
  const [selectedTab, setSelectedTab] = useState(1);
  return (
    <div className='mx-4 mt-6'>
      <Image
        className='rounded-xl object-cover h-[124px] md:h-[260px] w-full'
        src={Cover}
        alt='collection cover'
        height={260}
        width={100}
        unoptimized
      />
      <div className='gray-linear-gradient-background rounded-b-xl mt-4 p-6 shadow-main'>
        <div className='flex flex-wrap items-center gap-3'>
          <Image
            src={manImg}
            className='rounded-full w-14 h-14 md:w-[98px] md:h-[98px] object-cover'
            alt='collection logo'
            width={98}
            height={98}
            unoptimized
          />
          <h2 className='truncate'>{`Unnamed Collection`}</h2>
        </div>
        <div className='mt-4'>
          <h3>About the Collection</h3>
          <p className='text-textLight text-sm'>No description provided yet</p>
          <div className='flex flex-wrap items-center gap-4 mt-6'>
            <button className='contained-button font-satoshi-bold'>
              Publish
            </button>

            <Link
              href={`/collection/create`}
              className='outlined-button font-satoshi-bold'
            >
              <span>Edit</span>
            </Link>
          </div>
        </div>
      </div>
      <div className='mt-10'>
        <ul className='flex flex-wrap items-center  text-sm font-medium text-center'>
          <li onClick={() => setSelectedTab(1)}>
            <button
              className={`inline-block p-4 text-lg rounded-t-lg ${
                selectedTab === 1
                  ? 'border-b-2 border-primary-900 text-primary-900'
                  : 'border-transparent text-textSubtle'
              } hover:text-primary-600`}
            >
              NFT
            </button>
          </li>
          <li onClick={() => setSelectedTab(2)}>
            <button
              className={`inline-block p-4 text-lg rounded-t-lg ${
                selectedTab === 2
                  ? 'border-b-2 border-primary-900 text-primary-900'
                  : 'border-transparent text-textSubtle'
              } hover:text-primary-900`}
            >
              Royalty Splitter
            </button>
          </li>
          <li onClick={() => setSelectedTab(3)}>
            <button
              className={`inline-block p-4 text-lg rounded-t-lg ${
                selectedTab === 3
                  ? 'border-b-2 border-primary-900 text-primary-900'
                  : 'border-transparent text-textSubtle'
              } hover:text-primary-900`}
            >
              NFT Sales
            </button>
          </li>
        </ul>
        <div className='mt-10 text-center'>
          <p className='mb-4'>
            {selectedTab === 1
              ? 'Click button below to start creating NFT'
              : selectedTab === 2
              ? 'Please create NFT first and then set Royalty Splitter'
              : 'Please create NFT first in order to see the sales'}{' '}
          </p>
          <Link
            href={`/nft/create`}
            className='contained-button !no-underline hover:text-white font-satoshi-bold  w-[150px]'
          >
            Create NFT
          </Link>
        </div>
      </div>
    </div>
  );
}
