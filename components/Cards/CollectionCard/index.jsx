import React from 'react';
import thumbIcon from 'assets/images/profile/card.svg';
import { Link } from 'react-router-dom';
import Image from 'next/image';

export default function CollectionCard({ collection }) {
  const truncateArray = (members) => {
    let slicedItems = members.slice(0, 3);
    return { slicedItems, restSize: members.length - slicedItems.length };
  };

  return (
    <div className='md:min-h-[390px]  rounded-x'>
      <Link
        to={
          collection.type === 'right_attach'
            ? `/royality-management/${collection.id}`
            : `/collection-details/${collection.id}`
        }
      >
        <Image
          className='w-full h-[156px] rounded-xl md:h-[276px] object-cover'
          src={
            collection && collection.assets && collection.assets[0]
              ? collection.assets[0].path
              : thumbIcon
          }
          alt=''
        />
      </Link>

      <div className='p-5'>
        <h3 className='pb-2 text-txtblack truncate text-[18px] md:text-[24px]'>
          {collection.name}
        </h3>
        <p className='mb-3 text-textSubtle text-[13px]'>
          {collection.description && collection.description.length > 70
            ? collection.description.substring(0, 67) + '...'
            : collection.description}
        </p>

        <div className='flex items-center'>
          {collection.members &&
            collection.members.length > 0 &&
            truncateArray(collection.members).slicedItems.map(
              (member, index) => (
                <Image
                  key={index}
                  src={member.avatar}
                  alt={member.id}
                  className='rounded-full w-9 h-9 -ml-2 border-2 border-white'
                />
              )
            )}
          {collection.members && collection.members.length > 3 && (
            <div className='flex items-center mt-[6px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[26px] h-[26px]'>
              <p className='text-[12px] text-[#9A5AFF]'>
                +{truncateArray(collection.members).restSize}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
