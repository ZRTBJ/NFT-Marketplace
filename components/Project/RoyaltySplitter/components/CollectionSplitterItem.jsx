import DefaultImage from 'assets/images/defaultImage.svg';
import Open from 'assets/images/open.svg';
import Closed from 'assets/images/closed.svg';
import Splitter from './Splitter';
import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';

const CollectionSplitter = ({
  members,
  name,
  status,
  image,
  id,
  openedCollection,
  setOpenedCollection,
  date,
  projectNetwork,
  getProjectCollections,
}) => {
  return (
    <div className='mb-10'>
      <div
        className='flex items-center w-full flex-wrap cursor-pointer'
        onClick={() => setOpenedCollection(openedCollection === id ? null : id)}
      >
        <div className='flex items-center w-[50%] md:w-[20%]'>
          <Image
            src={image?.path ? image.path : DefaultImage}
            className='md:h-[66px] object-cover md:w-[66px] h-[38px] w-[38px] rounded-lg mr-4'
            alt='Collection'
            height={66}
            width={66}
          />
          <a className='!no-underline'>
            <p className='text-[16px] font-black min-w-max'>{name}</p>
          </a>
        </div>
        <div className='w-[20%] text-center hidden md:flex items-center justify-center'>
          {/* Temporary disable it for now {members ? (
            members.map((member) => (
              <img
                src={member?.avatar ? member.avatar : Profile}
                alt="member"
                className="w-[32px] h-[32px] rounded-full -ml-[8px] -mr-[8px]"
              />
            ))
          ) : (
            <p>No members</p>
          )} */}
        </div>
        <p className='w-[20%] text-[14px] font-normal text-center hidden md:block'>
          {' '}
          {dayjs(date).format('DD/MM/YYYY - HH:mm')}
        </p>
        <p className='text-[14px] font-normal w-[20%] text-center hidden md:block'>
          {status && status === 'published' ? 'Locked' : 'Not Locked'}
        </p>
        <div className='w-[50%] md:w-[20%]'>
          {openedCollection === id ? (
            <Image
              src={Open}
              alt='Open'
              className='ml-auto cursor-pointer'
              height={21}
              width={21}
            />
          ) : (
            <Image
              src={Closed}
              alt='Close'
              className='ml-auto cursor-pointer'
              height={21}
              width={21}
            />
          )}
        </div>
        <div className='w-[33%] text-center flex md:hidden mt-4 items-center justify-center'>
          {/* Temporary disable it for now {members ? (
            members.map((member) => (
              <img
                src={member?.avatar ? member.avatar : Profile}
                alt="member"
                className="w-[32px] h-[32px] rounded-full -ml-[8px] -mr-[8px]"
              />
            ))
          ) : (
            <p>No members</p>
          )} */}
        </div>
        {/* <p className="w-[33%] text-[14px] font-normal text-center  block md:hidden  mt-4">
          {dayjs(date).format("DD/MM/YYYY - HH:mm")}
        </p>
        <p className="text-[14px] font-normal w-[33%] text-center  block md:hidden  mt-4">
          {status === "published" ? "Locked" : "Not Locked"}
        </p> */}
      </div>
      {openedCollection === id ? (
        <div className='transition duration-150 ease-in-out'>
          <Splitter
            collectionId={id}
            projectNetwork={projectNetwork}
            getProjectCollections={getProjectCollections}
          />
        </div>
      ) : null}
    </div>
  );
};

export default CollectionSplitter;
