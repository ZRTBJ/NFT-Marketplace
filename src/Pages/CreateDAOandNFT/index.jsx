import { useState } from 'react';
import ProfileImage from '../../assets/images/createDAO/user.svg';
import CoverImage from '../../assets/images/createDAO/cover.svg';
import CirclePlus from '../../assets/images/createDAO/circle-plus.svg';
import NFTSample from '../../assets/images/createDAO/nft-sample.svg';
import DAOCard from 'components/DAOCard';
import NFTCard from 'components/NFTCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import styles from './style.module.css';
import CreateNFTModal from '../../components/modalDialog/CreateNFTModal';

const DAO_ITEMS = [
  {
    id: 0,
    name: 'BoredApeYatchClub',
    value: '1.000.000',
    coverImage: CoverImage,
    profileImage: ProfileImage,
    users: [
      { id: 0, profileImage: ProfileImage },
      { id: 1, profileImage: ProfileImage },
      { id: 2, profileImage: ProfileImage },
      { id: 3, profileImage: ProfileImage },
      { id: 4, profileImage: ProfileImage },
      { id: 5, profileImage: ProfileImage },
    ],
  },
  {
    id: 1,
    name: 'BoredApeYatchClub',
    value: '1.000.000',
    coverImage: CoverImage,
    profileImage: ProfileImage,
    users: [
      { id: 0, profileImage: ProfileImage },
      { id: 1, profileImage: ProfileImage },
      { id: 2, profileImage: ProfileImage },
      { id: 3, profileImage: ProfileImage },
      { id: 4, profileImage: ProfileImage },
      { id: 5, profileImage: ProfileImage },
      { id: 6, profileImage: ProfileImage },
      { id: 7, profileImage: ProfileImage },
      { id: 8, profileImage: ProfileImage },
      { id: 9, profileImage: ProfileImage },
    ],
  },
];

const NFT_ITEMS = [
  {
    id: 0,
    name: 'NFT Collection #1',
    image: NFTSample,
    description: 'There are many variations of passages of Lorem',
    nfts: [
      { id: 0, profileImage: ProfileImage },
      { id: 1, profileImage: ProfileImage },
      { id: 2, profileImage: ProfileImage },
    ],
  },
  {
    id: 1,
    name: 'NFT Collection #2',
    image: NFTSample,
    description: 'There are many variations of passages of Lorem',
    nfts: [
      { id: 0, profileImage: ProfileImage },
      { id: 1, profileImage: ProfileImage },
      { id: 2, profileImage: ProfileImage },
      { id: 3, profileImage: ProfileImage },
    ],
  },
  {
    id: 2,
    name: 'NFT Collection #3',
    image: NFTSample,
    description: 'There are many variations of passages of Lorem',
    nfts: [
      { id: 0, profileImage: ProfileImage },
      { id: 1, profileImage: ProfileImage },
      { id: 2, profileImage: ProfileImage },
      { id: 3, profileImage: ProfileImage },
      { id: 2, profileImage: ProfileImage },
      { id: 3, profileImage: ProfileImage },
    ],
  },
];

const CreateDAOandNFT = () => {
  const [ShowCreateNFT, setShowCreateNFT] = useState(false);
  const settings = {
    320: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 15,
    },
    1536: {
      slidesPerView: 5,
      spaceBetween: 15,
    },
  };
  return (
    <div className='bg-white mt-4 py-6 pl-6'>
      <CreateNFTModal
        show={ShowCreateNFT}
        handleClose={() => setShowCreateNFT(false)}
      />
      <div className='border-[#C7CEE5] border-b-[1px] pb-3'>
        <h3 className='text-[28px] font-black mb-2'>Create new DAO</h3>
        <p className='text-[14px] text-[#5F6479] font-normal w-[450px]'>
          Create new DAO for making your project is really managed and secure in
          web3 envoirment.
        </p>
        <div className='flex mt-6'>
          <div className='cursor-pointer w-[276px] h-[276px] mr-6 flex flex-col items-center justify-center bg-[#32E865] bg-opacity-[0.1] rounded-[12px] border-[#32E865] border-[1px]'>
            <img src={CirclePlus} alt='add' />
            <p className='text-[#32E865] text-[18px] font-black mt-3'>
              Create new
            </p>
          </div>
          <Swiper
            breakpoints={settings}
            navigation={true}
            modules={[Navigation]}
            className={styles.createSwiper}
          >
            <div>
              {DAO_ITEMS.map((item) => (
                <SwiperSlide key={item.id} className={styles.daoCard}>
                  <DAOCard item={item} key={item.id} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      </div>
      <div className='mt-4'>
        <h3 className='text-[28px] font-black mb-2'>Create new NFT</h3>
        <p className='text-[14px] text-[#5F6479] font-normal w-[450px]'>
          Sstart creating your NFT with many of choiche, you can create 3 type
          of NFT such like Membership,Pre-Product and Product.
        </p>
        <div className='flex flex-wrap mt-6'>
          <div
            className='cursor-pointer w-[276px] h-[276px] mr-6 flex flex-col items-center justify-center bg-[#32E865] bg-opacity-[0.1] rounded-[12px] border-[#32E865] border-[1px]'
            onClick={() => setShowCreateNFT(true)}
          >
            <img src={CirclePlus} alt='add' />
            <p className='text-[#32E865] text-[18px] font-black mt-3'>
              Create new
            </p>
          </div>
          <Swiper
            breakpoints={settings}
            navigation={true}
            modules={[Navigation]}
            className={styles.createSwiper}
          >
            <div>
              {NFT_ITEMS.map((item) => (
                <SwiperSlide key={item.id} className={styles.nftCard}>
                  <NFTCard item={item} key={item.id} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default CreateDAOandNFT;
