import { useState, useEffect } from 'react';
import DropdownCreabo from 'components/DropdownCreabo';
import CirclePlus from 'assets/images/icons/plus-circle.svg';
import MemberListTable from 'components/RoyalityManagement/MemberListTable/MemberListTable';
import styles from './style.module.css';
import FB from 'assets/images/icons/fb.svg';
import twitter from 'assets/images/icons/twitter.svg';
import reddit from 'assets/images/icons/reddit.svg';
import instagram from 'assets/images/icons/instagram.svg';
import NFTSample from 'assets/images/createDAO/nft-sample.svg';
import NewPublishModal from 'components/modalDialog/NewPublishModal';
import { useParams } from 'react-router-dom';
import { getCollectionNFTs } from 'services/collection/collectionService';

const COLLECTIONS = [
  { id: '0', name: 'Collection one' },
  { id: '1', name: 'Collection two' },
  { id: '2', name: 'Collection three' },
];

const TABLE_HEADERS = [
  { id: 0, label: 'Wallet Address' },
  { id: 1, label: 'Name' },
  { id: 2, label: 'Email' },
  { id: 3, label: 'Percentage' },
  { id: 4, label: 'Token ID' },
  { id: 5, label: 'Role' },
  // { id: 6, label: 'Action' },
];

const LIST = [
  {
    id: 1,
    walletAddress: '0x2348539843,5435345',
    name: 'Rifat Abubakar',
    email: 'rifatabubakar2@gmai.com',
    role: 'Owner',
    percentage: '97%',
    tokenID: '#001',
  },
  {
    id: 2,
    walletAddress: '0x2348539843,5435345',
    name: 'Rifat Abubakar',
    email: 'rifatabubakar2@gmai.com',
    role: 'Contributor',
    percentage: '',
    tokenID: '#001',
  },
  {
    id: 3,
    walletAddress: '0x2348539843,5435345',
    name: 'Rifat Abubakar',
    email: 'rifatabubakar2@gmai.com',
    role: 'Contributor',
    percentage: '97%',
    tokenID: '#001',
  },
];

const RoyalityManagement = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [showPublish, setShowPublish] = useState(false);
  const [data, setData] = useState();
  const [IsLoading, setIsLoading] = useState(false);

  const { collectionId } = useParams();

  useEffect(() => {
    setIsLoading(true);
    getCollectionNFTs(collectionId)
      .then((resp) => {
        setIsLoading(false);
        if (resp.code === 0) {
          setData(resp.lnfts[0]);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setSelectedCollectionId(e.target.value);
  };

  const copyToClipboard = (e) => {
    document.execCommand(
      'copy',
      true,
      '  http:/MinttheNFT.com/abcsijuoeirhussd24234jsdsk2'
    );
  };

  console.log(data);

  return (
    <div className={`mt-3 ${IsLoading ? 'loading' : ''}`}>
      <NewPublishModal
        show={showPublish}
        handleClose={() => setShowPublish(false)}
      />
      <h3 className='text-[28px] font-black'>Rights Attached NFT</h3>
      <p className='text-[14px] font-regular text-[#5F6479] mt-2'>
        Dashboard that you can control the royalties share.
      </p>
      <div className='flex items-center mt-3'>
        <p className='text-[16px] font-black'>Member 3/5</p>
        <button className='rounded-[4px] p-2 ml-3 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[12px] font-bold'>
          Upgrade Plan
        </button>
      </div>
      <div className='w-[480px] mt-4'>
        <DropdownCreabo
          label='Connect Collection'
          value={selectedCollectionId}
          id='select-collection'
          defaultValue='Select Collection'
          handleChange={handleChange}
          options={COLLECTIONS}
        />
        <button className='rounded-[4px] p-2 mt-4 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[12px] font-bold flex items-center w-[127px] justify-center'>
          <img src={CirclePlus} alt='Add' />{' '}
          <span className='ml-[6px]'>Add Collection</span>
        </button>
      </div>
      <div
        className={`bg-white mt-6 rounded-[12px] p-6 ${styles.memberSection}`}
      >
        <div className='flex justify-between pb-7 border-b-[1px] mb-6 border-[#E3DEEA]'>
          <h3 className='text-[18px] font-black'>Member List</h3>
          <div class='flex items-center justify-center'>
            <div class='form-check form-switch flex items-center'>
              <p class='text-[#303548] text-[12px] mr-5'>Autofill Percentage</p>
              <input
                class='form-check-input appearance-none w-9 rounded-full h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
                type='checkbox'
                role='switch'
                id='flexSwitchCheckDefault'
              />
            </div>
          </div>
        </div>
        <MemberListTable
          list={LIST}
          headers={TABLE_HEADERS}
          handlePublish={setShowPublish}
        />
      </div>
      <div className='flex mb-8'>
        <div className='bg-white mt-6 p-6 w-2/4 mr-2 rounded-[12px]'>
          <h3 className='text-[18px] font-black'>Invite Contributor</h3>
          <p className='text-[12px] text-[#5F6479] mb-6'>
            Invite anothe contributor to get the royalties by copy this link and
            ask the to claim the Right Attached NFT
          </p>
          {/* <div className='w-full'>
            <label for='invite-address' className='text-[12px] text-[#5F6479]'>
              Invite with Wallet Address
            </label>
            <input
              id='invite-address'
              placeholder='Add wallet Address'
              className='text-[14px] block mb-2 py-[10px] pl-[15px] pr-[40px} text-[#9A5AFF] w-full rounded-[12px] border-[1px] border-[#C7CEE5] mt-1'
              value=''
            />
            <button className='ml-auto block rounded-[4px] p-2 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[12px] font-bold w-[110px]'>
              Invite
            </button>
          </div> */}
          <div className='mt-2'>
            <p className='text-[12px] text-[#5F6479] mb-1'>Invite with link</p>
            <div className='relative'>
              <p
                className='text-[16px] block mb-3 py-[10px] pl-[15px] pr-[40px] bg-opacity-[0.1] bg-[#9A5AFF] text-[#9A5AFF] w-full rounded-[12px]'
                id='iframe'
              >
                Link:{' '}
                <span className='font-black'>
                  http:/MinttheNFT.com/
                  {data?.invitation_code ? data?.invitation_code : 'null'}
                </span>
              </p>
              <div className='text-[#9A5AFF] absolute top-2 right-2'>
                <i
                  className='fa fa-copy text-lg cursor-pointer'
                  onClick={copyToClipboard}
                ></i>
              </div>
            </div>
          </div>
          <div>
            <p className='text-[12px] text-[#5F6479] mt-[46px] mb-1'>
              Invite with
            </p>
            <div className='flex items-center'>
              <div className='rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                <img src={FB} alt='facebook' />
              </div>
              <div className='rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                <img src={twitter} alt='twitter' />
              </div>
              <div className='rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                <img src={reddit} alt='reddit' />
              </div>
              <div className='rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                <img src={instagram} alt='instagram' />
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white mt-6 p-6 w-2/4 ml-2 rounded-[12px] flex items-center justify-center flex-col'>
          <h3 className='text-[18px] font-black'>Right Attached NFT</h3>
          <img
            src={data?.asset?.path}
            alt='NFT'
            className='mt-5 h-[189px] w-[189px]'
          />
        </div>
      </div>
    </div>
  );
};

export default RoyalityManagement;
