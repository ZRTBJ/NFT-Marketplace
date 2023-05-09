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
  publishCollection,
} from 'services/collection/collectionService';
import { moveToIPFS } from 'services/nft/nftService';
import { useEffect } from 'react';
import { NETWORKS } from 'config/networks';
import { getCurrentNetworkId } from 'util/MetaMask';
import { ls_GetChainID, ls_GetWalletType } from 'util/ApplicationStorage';
import NetworkHandlerModal from 'components/Modals/NetworkHandlerModal';
import usePublishRoyaltySplitter from 'components/Collection/RoyaltySplitter/Publish/hooks/usePublishRoyaltySplitter';
import { useSelector, useDispatch } from 'react-redux';
import { getNotificationData } from 'redux/notification';
import {
  createProvider,
  createUserProvider,
} from 'util/smartcontract/provider';
import { createInstance } from 'config/ABI/genericProxyFactory';
import { erc721ProxyInstance } from 'config/ABI/erc721ProxyFactory';
import { erc1155ProxyInstance } from 'config/ABI/erc1155ProxyFactory';
import {
  createCollection,
  createCollectionByCaller,
} from 'components/Collection/Publish/deploy-collection';

const PublishPreview = ({ query }) => {
  const [showPublishing, setShowPublishing] = useState(false);
  const [tokenStandard, setTokenStandard] = useState('');
  const [collection, setCollection] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [nfts, setNFTs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [txnData, setTxnData] = useState();
  const [showNetworkHandler, setShowNetworkHandler] = useState(false);
  const [isSplitterPublished, setIsSplitterPublished] = useState(false);
  const [moveNFTs, setMoveNFTs] = useState([]);
  const fileUploadNotification = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const dispatch = useDispatch();
  const network = NETWORKS?.[collection?.blockchain];
  let walletType = ls_GetWalletType();

  const {
    isLoading: isPublishingRoyaltySplitter,
    status: publishRoyaltySplitterStatus,
    publish: publishRoyaltySplitter,
    contractAddress,
    // setIsLoading: setPublishingSplitter,
  } = usePublishRoyaltySplitter({
    collection: collection,
    splitters: contributors,
    // onUpdateStatus: hanldeUpdatePublishStatus,
  });

  useEffect(() => {
    // file upload web socket
    console.log(fileUploadNotification);
    console.log(moveNFTs);
    const projectDeployStatus = fileUploadNotification.find(
      (x) => x.function_uuid === moveNFTs[0]?.asset?.id
    );
    console.log(projectDeployStatus);
    if (projectDeployStatus && projectDeployStatus.data) {
      const data = JSON.parse(projectDeployStatus.data);
      console.log(data);
    }
  }, [fileUploadNotification]);

  useEffect(() => {
    if (query?.id) {
      validatePublish();
      getCollectionDetails();
      getSplitters();
      getNFTs();
    }
  }, [query?.id]);

  useEffect(() => {
    if (publishRoyaltySplitterStatus === 2) {
      moveNFTsToIPFS();
    }
  }, [publishRoyaltySplitterStatus]);

  const moveNFTsToIPFS = async () => {
    setCurrentStep(1);
    let formData = new FormData();
    let nftIds = nfts.join(',');
    formData.append('nft_ids', nftIds);
    let resp = await moveToIPFS(formData);
    if (resp.code === 0) {
      nfts.map((nft) => {
        if (nft?.asset?.id && nfts?.asset?.hash) {
          const notificationData = {
            function_uuid: nft?.asset?.id,
            data: '',
          };
          dispatch(getNotificationData(notificationData));
        }
      });

      setCurrentStep(2);
      publishTheCollection();
    }
  };

  const handleSmartContract = async (config) => {
    try {
      let response;
      const provider = await createUserProvider();

      const collectionContract =
        tokenStandard === 'ERC1155'
          ? await erc1155ProxyInstance(
              network?.ProxyManagerERC1155Mumbai,
              provider
            )
          : await erc721ProxyInstance(
              network?.ProxyManagerERC721Mumbai,
              provider
            );

      // if (gaslessMode === 'true') {

      // response = await createCollection(
      //   collectionContract,
      //   provider,
      //   config
      // collectionType,
      // productPrice
      // );
      // } else {
      response = await createCollectionByCaller(
        collectionContract,
        config
        // collectionType,
        // productPrice
      );
      // }
      console.log(response);
      let hash;
      if (response?.txReceipt) {
        hash = response.txReceipt;
        let data = {
          transactionHash: hash.transactionHash,
          block_number: hash.blockNumber,
        };
        publishTheCollection(data);
        setTxnData(data);
      } else {
        // errorClose(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const publishTheCollection = async (data) => {
    let payload = new FormData();
    if (data) {
      payload.append('transaction_hash', data.transactionHash);
    }
    await publishCollection(
      collection?.id,
      data?.transactionHash ? payload : null
    )
      .then((res) => {
        if (res.code === 0) {
          console.log(res);
          if (res?.function?.status === 'success') {
            console.log('success');
          } else {
            handleSmartContract(res.config);
          }
        }
      })
      .catch((err) => {});
  };

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
      if (resp?.splitter?.status === 'published') {
        setIsSplitterPublished(true);
      }
      setContributors(resp?.members);
    });
  };

  const getNFTs = () => {
    getCollectionNFTs(query?.id).then((resp) => {
      if (resp.code === 0) {
        setNFTs(resp?.lnfts);
        let nftStatus = resp?.lnfts.map((nft) => {
          return {
            ...nft,
            status: 'pending',
          };
        });
        setMoveNFTs(nftStatus);
      }
    });
  };

  const handlePublishModal = async () => {
    if (walletType === 'metamask') {
      let networkId = await getCurrentNetworkId();
      if (Number(collection?.blockchain) === networkId) {
        publishAll();
      } else {
        setShowNetworkHandler(true);
      }
    } else if (walletType === 'magicwallet') {
      let chainId = await ls_GetChainID();
      if (Number(collection?.blockchain) === chainId) {
        publishAll();
      } else {
        setShowNetworkHandler(true);
      }
    }
  };

  const publishAll = async () => {
    try {
      setShowPublishing(true);
      if (!contributors?.length && !nfts?.length) {
        setCurrentStep(2);
        publishTheCollection();
      } else {
        if (!isSplitterPublished && contributors.length) {
          setCurrentStep(0);
          await publishRoyaltySplitter();
        } else {
          await moveNFTsToIPFS();
        }
      }
    } catch {}
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
            onClick={handlePublishModal}
          >
            Publish to Blockchain
          </button>
        </div>
      </div>
      {showPublishing && (
        <PublishingModal
          show={showPublishing}
          handleClose={() => setShowPublishing(false)}
          currentStep={currentStep}
          nfts={moveNFTs}
          contributors={contributors}
        />
      )}
      {showNetworkHandler && (
        <NetworkHandlerModal
          show={showNetworkHandler}
          handleClose={() => setShowNetworkHandler(false)}
          projectNetwork={collection?.blockchain}
        />
      )}
    </div>
  );
};

export default PublishPreview;
