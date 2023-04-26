import Image from 'next/image';
import MockImage from 'assets/images/magic-wallet.png';

const CollectionPreview = () => {
  return (
    <div className='section-collection'>
      <h3>Collection</h3>
      <div className='shadow-md mt-2 collection-content border-gray-500 border border-dashed px-4 py-3 rounded-xl'>
        <div className='flex items-center mb-8'>
          <Image src={MockImage} height={200} width={200} alt='Collection' />
          <div className='flex items-center ml-8'>
            <div>
              <p>
                <span className='block text-xs text-gray-400'>Name</span>
                Collection one
              </p>
              <p>
                <span className='block text-xs text-gray-400'>Category</span>
                Music
              </p>
              <p>
                <span className='block text-xs text-gray-400'>Token</span>ERC
                721
              </p>
            </div>
            <div className='ml-4'>
              <p>
                <span className='block text-xs text-gray-400'>Symbol</span>
                2344
              </p>
              <p>
                <span className='block text-xs text-gray-400'>Supply</span>30
              </p>
              <p>
                <span className='block text-xs text-gray-400'>Chain</span>
                Ethereum
              </p>
            </div>
          </div>
        </div>
        <p className='text-center text-sm'>
          NFT can/can not be transferable (Soulbound token)
        </p>
        <p className='text-center text-sm'>
          NFT having limited time (Timebound token)
        </p>

        <div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPreview;
