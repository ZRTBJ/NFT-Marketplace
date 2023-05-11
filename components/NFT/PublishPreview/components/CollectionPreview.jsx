import Tooltip from 'components/Commons/Tooltip';
import Image from 'next/image';
import Cover from 'assets/images/image-default.svg';

const CollectionPreview = ({ tokenStandard, collection, network }) => {
  const collectionLogo = collection?.assets.find(
    (asset) => asset.asset_purpose === 'logo'
  );

  return (
    <div className='section-collection'>
      <div className='flex items-center'>
        <Tooltip message='The below collection config will be saved to blockchain' />
        <h3>Collection</h3>
      </div>
      <div className='mt-4 collection-content border shadow px-4 py-3 rounded-xl'>
        <div className='flex items-center mb-8'>
          <Image
            src={collectionLogo?.path ? collectionLogo?.path : Cover}
            alt='Collection'
            className='object-cover w-[150px] h-[150px] rounded-xl'
            unoptimized
            width={150}
            height={150}
          />

          <div className='flex items-start ml-8'>
            <div>
              <p>
                <span className='block text-xs text-gray-400'>Name</span>
                {collection?.name}
              </p>
              <p>
                <span className='block text-xs text-gray-400'>Token</span>
                {tokenStandard}
              </p>
              <p>
                <span className='block text-xs text-gray-400'>Chain</span>
                <span className='flex items-center'>
                  {network?.networkName}{' '}
                  {network?.networkName && (
                    <Image
                      src={network?.icon?.src}
                      height={20}
                      width={20}
                      alt='Chain Icon'
                      className='ml-1'
                    />
                  )}
                </span>
              </p>
            </div>
            <div className='ml-4'>
              <p>
                <span className='block text-xs text-gray-400'>Symbol</span>
                {collection?.collection_symbol}
              </p>
              <p>
                <span className='block text-xs text-gray-400'>Supply</span>
                {collection?.total_supply}
              </p>
              <p>
                <span className='block text-xs text-gray-400'>
                  Royalty Percentage
                </span>
                {collection?.royalty_percent}
              </p>
            </div>
          </div>
        </div>
        <p className='text-center text-sm'>
          NFT{' '}
          {collection?.token_transferable
            ? 'can be transferable'
            : 'can not be transferable (Soulbound token)'}
        </p>
        {collection?.token_limit_duration ? (
          <p className='text-center text-sm'>NFT having limited time</p>
        ) : null}
      </div>
    </div>
  );
};

export default CollectionPreview;
