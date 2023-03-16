import Modal from 'components/Commons/Modal';
import Users from 'assets/images/createDAO/users.svg';
import Product from 'assets/images/createDAO/product.svg';
import Tooltip from 'components/Commons/Tooltip';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

const CreateNFTModal = ({ handleClose, show }) => {
  const router = useRouter();
  return (
    <Modal show={show} handleClose={handleClose} width={680}>
      <div>
        <h3 className='text-[28px] text-black font-black mb-8'>
          Create Your NFT
        </h3>
        <div className='cursor-pointer flex bg-[#F9FCFF] border-[1px] border-[#C7CEE5] rounded-[12px] p-6 mb-6'>
          <div className='mr-6 h-[40px] md:h-[74px] w-[40px] md:w-[74px] bg-secondary-50 flex items-center justify-center rounded-[8px]'>
            <Image src={Users} alt='Users' />
          </div>
          <div onClick={() => router.push('/nft/membership/create')}>
            <h3 className='text-[20px] md:text-[24px] font-bold text-[#303548]'>
              Membership NFT
            </h3>
            <p className='hidden md:block text-[14px] text-[#5F6479] w-[470px] mt-2 word-break'>
              Launch a members-only community using NFT as access. Raise funds
              and grant exclusive content through the power of membership NFT
            </p>
          </div>
        </div>
        <div className='cursor-pointer flex bg-[#F9FCFF] border-[1px] border-[#C7CEE5] rounded-[12px] p-6 mb-6'>
          <div className='mr-6 h-[40px] md:h-[74px] w-[40px] md:w-[74px] bg-primary-50 flex items-center justify-center rounded-[8px]'>
            <Image src={Product} alt='Product' />
          </div>
          <div onClick={() => router.push('/nft/product/create')}>
            <h3 className='text-[20px] md:text-[24px] font-bold text-[#303548]'>
              Product NFT
            </h3>
            <p className='hidden md:block text-[14px] text-[#5F6479] w-[470px] mt-2 word-break'>
              Create and mint your NFT to start earning as a creator
            </p>
          </div>
        </div>
        <div className='flex items-center justify-end'>
          <Tooltip message='Click to create a new collection' />
          <Link href='/collection/create'>
            <button className='rounded-[12px] py-3 px-4 bg-[#E8F5FB] text-[#199BD8] text-[14px] font-black'>
              Create Collection
            </button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default CreateNFTModal;
