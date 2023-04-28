import { useState } from 'react';
import CollectionPreview from './components/CollectionPreview';
import PricingRoyalty from './components/PricingRoyalty';
import NFTList from './components/NFTList';
import PublishingModal from './components/PublishingModal';
import {
  validateCollectionPublish,
  getCollectionDetailsById,
  getSplitterDetails,
  getCollectionNFTs,
} from 'services/collection/collectionService';
import { useEffect } from 'react';
import { NETWORKS } from 'config/networks';

const PublishPreview = ({ query }) => {
  const [showPublishing, setShowPublishing] = useState(false);
  const [tokenStandard, setTokenStandard] = useState('');
  const [collection, setCollection] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [nfts, setNFTs] = useState([]);
  const network = NETWORKS?.[collection?.blockchain];

  useEffect(() => {
    if (query?.id) {
      validatePublish();
      getCollectionDetails();
      getSplitters();
      getNFTs();
    }
  }, [query?.id]);

  const validatePublish = () => {
    validateCollectionPublish(query?.id).then((resp) => {
      if (resp.message === 'OK') {
        setTokenStandard(resp.token_standard);
      }
    });
  };

  const getCollectionDetails = () => {
    getCollectionDetailsById({ id: query?.id }).then((resp) => {
      if (resp.code === 0) {
        setCollection(resp.collection);
      }
    });
  };

  const getSplitters = () => {
    getSplitterDetails(query?.id, 'collection_id').then((resp) => {
      setContributors(resp?.members);
    });
  };

  const getNFTs = () => {
    getCollectionNFTs(query?.id).then((resp) => {
      if (resp.code === 0) {
        setNFTs(resp?.lnfts);
      }
    });
  };

  return (
    <div className='pt-6 md:pt-0 md:mt-[40px] mx-10 mb-10'>
      <h2 className='text-center'>Publish Preview</h2>
      <div className='max-w-[600px]  mx-4 md:mx-auto pt-5'>
        <CollectionPreview
          tokenStandard={tokenStandard}
          collection={collection}
          network={network}
        />
        <PricingRoyalty
          price={collection?.price}
          network={network}
          contributors={contributors}
        />
        <NFTList nfts={nfts} />
        <div className='w-full mt-8'>
          <button
            className='contained-button mx-auto block shadow-md'
            onClick={() => setShowPublishing(true)}
          >
            Publish to Blockchain
          </button>
        </div>
      </div>
      {showPublishing && (
        <PublishingModal
          show={showPublishing}
          handleClose={() => setShowPublishing(false)}
        />
      )}
    </div>
  );
};

export default PublishPreview;
