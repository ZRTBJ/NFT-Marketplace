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
import { moveToIPFS, NFTRegisterAfterPublish } from 'services/nft/nftService';
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
import { createCollectionByCaller } from 'components/Collection/Publish/deploy-collection';
import ErrorModal from 'components/Modals/ErrorModal';
import { useRouter } from 'next/router';
import { getAssetDetail } from 'services/tokenGated/tokenGatedService';
import { uniqBy } from 'lodash';
import { erc1155Instance } from 'config/ABI/erc1155';
import Config from 'config/config';
import { ethers } from 'ethers';

const PublishPreview = ({ query }) => {
  const [showPublishing, setShowPublishing] = useState(false);
  const [tokenStandard, setTokenStandard] = useState('');
  const [collection, setCollection] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [nfts, setNFTs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [txnData, setTxnData] = useState();
  const [showError, setShowError] = useState('');
  const [showNetworkHandler, setShowNetworkHandler] = useState(false);
  const [isSplitterPublished, setIsSplitterPublished] = useState(false);
  const [uploadingNFTs, setUploadingNFTs] = useState([]);
  const [isSplitterCreated, setIsSplitterCreated] = useState(false);
  const fileUploadNotification = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const [uploadedNFTs, setUploadedNFTs] = useState([]);
  const [splitterPercent, setShowSplitterPercent] = useState(0);
  const [nftsHashed, setNFTsHashed] = useState(false);
  const [nftsPublished, setNFTsPublished] = useState([]);
  const router = useRouter();
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
    uploadingNFTs.map((resp) => {
      const projectDeployStatus = fileUploadNotification.find(
        (x) => x.function_uuid === resp?.id
      );
      if (projectDeployStatus && projectDeployStatus.data) {
        const data = JSON.parse(projectDeployStatus.data);
        if (data?.Data?.upload_result) {
          setUploadedNFTs([...uploadedNFTs, data?.Data?.nft_id]);
          let nftUploading = uploadingNFTs.find(
            (nft) => nft?.id === data?.Data?.nft_id
          );
          setUploadingNFTs(
            uniqBy(
              [{ ...nftUploading, status: 'success' }, ...uploadingNFTs],
              'id'
            )
          );
        }
      } else {
        setTimeout(() => {
          verifyFileHash(resp?.asset?.id);
        }, 8000);
      }
    });
  }, [fileUploadNotification]);

  useEffect(() => {
    if (currentStep === 1) {
      if (uploadingNFTs.every((nft) => nft?.status === 'success')) {
        setCurrentStep(2);
        publishTheCollection();
      }
    }
  }, [uploadingNFTs]);

  const verifyFileHash = async (id) => {
    // await uploadingNFTs.map((item) => {
    await getAssetDetail(id).then((response) => {
      if (response.code === 0) {
        if (response?.asset?.hash) {
          setUploadedNFTs([...uploadedNFTs, response?.asset?.id]);

          let nftUploading = uploadingNFTs.find(
            (nft) => nft?.asset?.id === response?.asset?.id
          );
          setUploadingNFTs(
            uniqBy(
              [{ ...nftUploading, status: 'success' }, ...uploadingNFTs],
              'id'
            )
          );
        }
      }
    });

    if (uploadingNFTs.every((nft) => nft?.status === 'success')) {
      setCurrentStep(2);
      publishTheCollection();
    }
  };

  useEffect(() => {
    if (query?.id) {
      handleInitialLoad();
    }
  }, [query?.id]);

  const handleInitialLoad = () => {
    validatePublish();
    getCollectionDetails();
    getSplitters();
    getNFTs();
  };

  useEffect(() => {
    if (publishRoyaltySplitterStatus === 2) {
      moveNFTsToIPFS();
    }
  }, [publishRoyaltySplitterStatus]);

  const moveNFTsToIPFS = async () => {
    if (nfts?.length) {
      if (nfts.some((nft) => nft?.asset?.hash === '')) {
        setCurrentStep(1);

        let formData = new FormData();
        let filNfts = nfts?.filter((nft) => nft?.asset?.hash === '');
        let nftIds = filNfts.map((nft) => nft?.id).join(',');
        setUploadingNFTs(filNfts);
        formData.append('nft_ids', nftIds);
        let resp = await moveToIPFS(formData);
        if (resp.code === 0) {
          nfts.map((nft) => {
            if (nft?.asset?.id && !nfts?.asset?.hash) {
              const notificationData = {
                function_uuid: nft?.id,
                data: '',
              };
              dispatch(getNotificationData(notificationData));
            }
          });
        }
      } else {
        setCurrentStep(2);
        publishTheCollection();
      }
    } else {
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
          ? await erc1155ProxyInstance(network?.ProxyManagerERC1155, provider)
          : await erc721ProxyInstance(network?.ProxyManagerERC721, provider);

      response = await createCollectionByCaller(collectionContract, config);

      let hash;
      if (response?.txReceipt) {
        hash = response.txReceipt;
        let data = {
          transactionHash: hash.transactionHash,
          block_number: hash.blockNumber,
        };
        publishTheCollection(data);
        setTxnData(data);
      }
    } catch (err) {
      setShowError(err);
      setShowPublishing(false);
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
          if (res?.function?.status === 'success') {
            setCurrentStep(3);
            if (tokenStandard === 'ERC1155') {
              registerToken();
            }
          } else {
            handleSmartContract(res.config);
          }
        } else {
          setShowError(res.message);
          setShowPublishing(false);
        }
      })
      .catch((err) => {
        setShowError(err);
        setShowPublishing(false);
      });
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
      if (resp?.splitter?.contract_address) {
        setIsSplitterPublished(true);
      }
      if (resp?.splitter?.id) {
        setIsSplitterCreated(true);
      }
      setContributors(resp?.members);
      let percent = resp?.members?.reduce(
        (acc, val) => acc + val.royalty_percent,
        0
      );
      setShowSplitterPercent(percent);
    });
  };

  const getNFTs = () => {
    getCollectionNFTs(query?.id).then((resp) => {
      if (resp.code === 0) {
        setNFTs(resp?.lnfts);
        let nftStatus = resp?.lnfts.map((nft) => {
          return {
            ...nft,
            status: nft?.asset?.hash ? 'success' : 'pending',
          };
        });
        setNFTs(nftStatus);
        if (
          resp?.lnfts?.length &&
          resp.lnfts.every((nft) => nft?.asset?.hash)
        ) {
          setNFTsHashed(true);
        } else {
          setNFTsHashed(false);
        }
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
      if (!isSplitterCreated && !contributors?.length && !nfts?.length) {
        setCurrentStep(2);
        publishTheCollection();
      } else {
        if (
          !isSplitterPublished &&
          isSplitterCreated &&
          !contributors?.length
        ) {
          setShowPublishing(false);
          setShowError('Please add members to splitter to publish');
        } else if (
          !isSplitterPublished &&
          contributors?.length &&
          isSplitterCreated
        ) {
          if (splitterPercent === 100) {
            setCurrentStep(0);
            await publishRoyaltySplitter();
          } else {
            setShowPublishing(false);
            setShowError('Total Royalty Percent should be 100%');
            router.push(`/collection/${query?.id}`);
          }
        } else {
          console.log('---');
          await moveNFTsToIPFS();
        }
      }
    } catch (err) {
      setShowError(err);
      setShowPublishing(false);
    }
  };

  useEffect(() => {
    if (nftsPublished?.length === nfts?.length) {
      console.log('success', nftsPublished, nfts);
      setCurrentStep(4);
    }
  }, [nftsPublished, nfts]);

  const verifyTokenId = async (nftId, hash) => {
    await NFTRegisterAfterPublish(nftId, hash)
      .then((res) => {
        if (res?.code !== 0) {
          setShowError(res?.message);
          setShowPublishing(false);
        } else {
          setNFTsPublished((prevValues) => [...prevValues, nftId]);
        }
      })
      .catch((error) => {
        setShowError(error.message);
        setShowPublishing(false);
      });
  };

  const registerToken = async () => {
    try {
      let data = await getCollectionDetailsById({ id: query?.id });
      let collectionData = await getCollectionNFTs(query?.id);

      if (data?.collection?.contract_address) {
        let nftsRegistering = collectionData?.lnfts;
        if (nftsRegistering?.length) {
          await nftsRegistering.map(
            async (nft) =>
              await handleContractCall(nft, data?.collection?.contract_address)
          );
        }
      }
    } catch (err) {
      setShowError(error.message);
      setShowPublishing(false);
    }
  };

  const handleContractCall = async (nft, collectionAddress) => {
    try {
      let walletType = await ls_GetWalletType();
      let signer;

      const provider = await createUserProvider();
      const priceContract = erc1155Instance(collectionAddress, provider);
      const nftInfo = {
        price: ethers.utils.parseEther(nft?.more_info?.price.toString()),
        uri: `${Config.PINATA_URL}${nft?.metadata_url}`,
        total_supply: nft?.supply,
      };
      if (walletType === 'metamask') {
        if (!window.ethereum) throw new Error(`User wallet not found`);
        await window.ethereum.enable();
        const userProvider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        signer = await userProvider.getSigner();
      } else if (walletType === 'magicwallet') {
        signer = await etherMagicProvider.getSigner();
      }
      const response = await priceContract
        .connect(signer)
        .addNewToken(nftInfo.price, nftInfo.uri, nftInfo.total_supply);

      if (response?.hash) {
        const tnxHash = await provider.waitForTransaction(response?.hash);
        await verifyTokenId(nft?.id, response?.hash);
      }
    } catch (err) {
      setShowError(err.message);
      setShowPublishing(false);
    }
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
            disabled={!tokenStandard}
          >
            Publish to Blockchain
          </button>
        </div>
      </div>
      {showPublishing && (
        <PublishingModal
          show={showPublishing}
          handleClose={() => {
            setShowPublishing(false);
            handleInitialLoad();
          }}
          currentStep={currentStep}
          nfts={uploadingNFTs}
          contributors={contributors}
          collectionId={query?.id}
          nftsHashed={nftsHashed}
          tokenStandard={tokenStandard}
          nftsPublished={nftsPublished}
        />
      )}
      {showNetworkHandler && (
        <NetworkHandlerModal
          show={showNetworkHandler}
          handleClose={() => setShowNetworkHandler(false)}
          projectNetwork={collection?.blockchain}
        />
      )}
      {showError && (
        <ErrorModal
          title={'Publish failed !'}
          message={`${showError}`}
          handleClose={() => {
            setShowError(null);
            handleInitialLoad();
          }}
          show={showError}
        />
      )}
    </div>
  );
};

export default PublishPreview;
