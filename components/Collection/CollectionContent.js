/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { round } from 'lodash';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  getCollectionNFTs,
  getCollectionDetailsById,
  getSplitterDetails,
  updateRoyaltySplitter,
  getCollectionSales,
  getNetWorth,
  getProductNFTCollectionSalesSetupInformation,
} from 'services/collection/collectionService';
import Cover from 'assets/images/cover-default.svg';
import manImg from 'assets/images/image-default.svg';
import avatar from 'assets/images/dummy-img.svg';
import Link from 'next/link';
import PublishCollectionModal from './Publish/PublishCollectionModal';
import SalesPageModal from './SaleSetting/SalesPageModal';
import SuccessModal from 'components/Modals/SuccessModal';
import DeployingCollectiontModal from './Publish/DeployingCollectionModal';
import ErrorModal from 'components/Modals/ErrorModal';
import Facebook from 'assets/images/facebook.svg';
import Instagram from 'assets/images/instagram.svg';
import Twitter from 'assets/images/twitter.svg';
import Github from 'assets/images/github.svg';
import Reddit from 'assets/images/reddit.svg';
import ExternalLink from 'assets/images/link.svg';
import TransferNFT from 'components/NFT/TransferNFT/TransferNFT';
import { getProjectDetailsById } from 'services/project/projectService';
import Eth from 'assets/images/network/eth.svg';
import Polygon from 'assets/images/network/polygon.svg';
import MemberListTable from './RoyaltySplitter/MemberListTable';
import PlusIcon from 'assets/images/icons/plus-circle.svg';
import NFTSales from './NFTSale';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import ImportWalletModal from './RoyaltySplitter/ImportWalletModal/ImportWalletModal';
import usePublishRoyaltySplitter from './RoyaltySplitter/Publish/hooks/usePublishRoyaltySplitter';
import PublishRoyaltyModal from './RoyaltySplitter/Publish/PublishRoyaltyModal';
import SalesSuccessModal from './SaleSetting/SalesSuccessModal';
import defaultCover from 'assets/images/image-default.svg';
import { walletAddressTruncate } from 'util/WalletUtils';
import { getCurrentNetworkId } from 'util/MetaMask';
import NetworkHandlerModal from 'components/Modals/NetworkHandlerModal';
import tickSvg from 'assets/images/icons/tick.svg';
import editImage from 'assets/images/edit-white.svg';
import emptyStateCommon from 'assets/images/profile/emptyStateCommon.svg';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import { getNftDetails } from 'services/nft/nftService';
import PublishRoyaltyConfirmModal from './Publish/PublishRoyaltyConfirmModal';
import Image from 'next/image';
import DaoConnectModal from 'components/Collection/DaoConnectModal/DaoConnectModal';
import WithdrawModal from './WithdrawModal';

const TABLE_HEADERS = [
  { id: 0, label: 'Wallet Address' },
  // { id: 2, label: "Email" },
  { id: 1, label: 'Percentage' },
  { id: 2, label: 'Name' },
  // { id: 4, label: "Token ID" },
  { id: 3, label: 'Role' },
  { id: 4, label: 'Action' },
];
const imageRegex = new RegExp('image');

const CollectionContent = ({ collectionId, userId }) => {
  const router = useRouter();
  const [Collection, setCollection] = useState();
  const [CoverImages, setCoverImages] = useState({});
  const [NFTs, setNFTs] = useState([]);
  const [Links, setLinks] = useState([]);
  const [ShowPublishModal, setShowPublishModal] = useState(false);
  const [ShowOptions, setShowOptions] = useState(null);
  const [showSalesPageModal, setShowSalesPageModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [collectionType, setCollectionType] = useState('');
  const [nftId, setNftId] = useState('');
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [publishStep, setPublishStep] = useState(1);
  const [tnxData, setTnxData] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [Logo, setLogo] = useState({});
  const [showTransferNFT, setShowTransferNFT] = useState(false);
  const [projectNetwork, setProjectNetwork] = useState('');
  const [selectedTab, setSelectedTab] = useState(1);
  const [isEdit, setIsEdit] = useState(null);
  const [AutoAssign, setAutoAssign] = useState(false);
  const [royalitySplitterId, setRoyalitySpliterId] = useState('');
  const [royalityMembers, setRoyalityMembers] = useState([]);
  const [IsAutoFillLoading, setIsAutoFillLoading] = useState(false);
  const [RoyaltyUpdatedSuccessfully, setRoyaltyUpdatedSuccessfully] =
    useState(false);
  const [ShowPercentError, setShowPercentError] = useState(false);
  const [showRoyalityErrorModal, setShowRoyalityErrorModal] = useState(false);
  const [showRoyalityErrorMessage, setShowRoyalityErrorMessage] = useState('');
  const [showImportWallet, setShowImportWallet] = useState(false);
  const [projectID, setProjectID] = useState('');
  const [nftSales, setNFTSales] = useState([]);
  const [nftMemSupply, setNftMemSupply] = useState(0);
  const [daoInfo, setDaoInfo] = useState({});
  const [nftShareURL, setNFTShareURL] = useState('');
  const [membershipNFTId, setMembershipNFTId] = useState('');
  const [showNetworkHandler, setShowNetworkHandler] = useState(false);
  const [collectionNetwork, setCollectionNetwork] = useState();
  const [collectionNotUpdatableModal, setCollectionNotUpdatableModal] =
    useState(false);
  const [setSalesError, setSetSalesError] = useState(false);
  const [salesSetupInfo, setSalesSetupInfo] = useState({});
  const [dataLoading, setDataLoading] = useState(false);
  const [showDaoConnectModal, setShowDaoConnectModal] = useState(false);
  // Publish royalty splitter
  const [showPublishRoyaltySpliterModal, setShowPublishRoyaltySpliterModal] =
    useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [
    showPublishRoyaltySpliterConfirmModal,
    setShowPublishRoyaltySpliterConfirmModal,
  ] = useState();
  const [isSalesPrice, setIsSalesPrice] = useState(false);
  const [
    showPublishRoyaltySpliterErrorModal,
    setShowPublishRoyaltySpliterErrorModal,
  ] = useState(false);
  const hasPublishedRoyaltySplitter = useMemo(
    () => Collection?.royalty_splitter?.status === 'published',
    [Collection]
  );

  const hanldeUpdatePublishStatus = (status) => {
    if (status === 'success') {
      if (Collection.royalty_splitter.status !== 'published') {
        setCollection({
          ...Collection,
          royalty_splitter: {
            ...Collection.royalty_splitter,
            status: 'published',
          },
        });
      }
    }
  };
  const {
    isLoading: isPublishingRoyaltySplitter,
    status: publishRoyaltySplitterStatus,
    canPublish: canPublishRoyaltySplitter,
    publish: publishRoyaltySplitter,
  } = usePublishRoyaltySplitter({
    collection: Collection,
    splitters: royalityMembers,
    onUpdateStatus: hanldeUpdatePublishStatus,
  });

  const [balanceLoading, setBalanceLoading] = useState(false);
  const [newWorth, setNetWorth] = useState({
    balance: 0,
    currency: '',
    balanceUSD: 0,
  });

  useEffect(() => {
    if (collectionId) {
      getCollectionDetail();
      getNFTs();
      getCollectionSalesData();
      getCollectionNewWorth();
    }
  }, [collectionId]);

  const getCollectionSalesData = () => {
    getCollectionSales(collectionId).then((data) =>
      setNFTSales(data?.sales ? data?.sales : [])
    );
  };

  const getCollectionNewWorth = () => {
    setBalanceLoading(true);
    getNetWorth(collectionId).then((resp) => {
      if (resp.code === 0) {
        setBalanceLoading(false);
        setNetWorth({
          balance: resp.balance,
          currency: resp.currency,
          balanceUSD: resp.balance_usd,
        });
      } else {
        setBalanceLoading(false);
        setNetWorth({ balance: 0, currency: '', balanceUSD: 0 });
      }
    });
  };

  const getNFTs = () => {
    getCollectionNFTs(collectionId)
      .then((resp) => {
        if (resp.code === 0) {
          setNFTs(resp.lnfts);
        }
      })
      .catch((err) => console.log(err));
  };

  const getSplittedContributors = (id, type) => {
    getSplitterDetails(id, type).then((data) => {
      if (data.code === 0) {
        setRoyalityMembers(data?.members);
      }
    });
  };

  const getCollectionDetail = () => {
    let payload = {
      id: collectionId,
    };
    getCollectionDetailsById(payload)
      .then((resp) => {
        if (resp.code === 0) {
          setProjectID(resp?.collection?.project_uid);
          setCollectionNetwork(resp?.collection?.blockchain);
          if (resp?.collection?.project_uid) {
            getProjectDetailsById({ id: resp?.collection?.project_uid }).then(
              (resp) => {
                setProjectNetwork(resp?.project?.blockchain);
                setDaoInfo(resp?.project);
              }
            );
          }
          if (resp?.collection?.royalty_splitter?.id) {
            setRoyalitySpliterId(resp.collection.royalty_splitter.id);
            getSplittedContributors(resp.collection.royalty_splitter.id);
          }
          setCollection(resp.collection);
          setCollectionType(resp.collection.type);
          if (resp?.collection?.assets && resp.collection.assets.length > 0) {
            setCoverImages(
              resp.collection.assets.find(
                (img) => img['asset_purpose'] === 'cover'
              )
            );
            setLogo(
              resp.collection.assets.find(
                (img) => img['asset_purpose'] === 'logo'
              )
            );
          }
          if (resp?.collection?.links) {
            const webLinks = [];
            try {
              const urls = JSON.parse(resp.collection.links);
              for (let url of urls) {
                webLinks.push({
                  title: Object.values(url)[0],
                  value: Object.values(url)[2],
                });
              }
            } catch {}
            setLinks(webLinks);
          }
          if (resp?.collection?.type === 'product') {
            getSalesSetupInfo('product', resp?.collection?.id);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-message');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
    }, 2000);
  }

  const handleShowOptions = (e, value) => {
    e.stopPropagation();
    e.preventDefault();
    if (ShowOptions) {
      setShowOptions(null);
    } else {
      setShowOptions(value);
    }
  };

  const handleAutoAssign = (e) => {
    let memberCount = royalityMembers.length;

    if (!memberCount) {
      return;
    }

    setAutoAssign(!AutoAssign);

    let value = 100 / memberCount;
    let values = royalityMembers.map((mem) => {
      return {
        ...mem,
        royalty_percent: parseFloat(round(value, 18)),
      };
    });
    setRoyalityMembers(values);
  };

  const handleEditNFT = (e, nft) => {
    e.stopPropagation();
    e.preventDefault();
    setShowOptions(null);

    if (Collection?.status === 'draft') {
      router.push(
        `${
          Collection?.type === 'product'
            ? `/nft/product/create?collectionId=${collectionId}&nftId=${nft.id}`
            : `/nft/membership/create?collection_id=${collectionId}&nftId=${nft.id}`
        }`
      );
    } else if (Collection?.status === 'published') {
      if (Collection?.type === 'membership') {
        router.push(
          `/nft/membership/create?collection_id=${collectionId}&nftId=${nft.id}`
        );
      } else if (Collection.type === 'product') {
        if (Collection?.updatable && !nft.freeze_metadata) {
          router.push(
            `/nft/product/create?collectionId=${collectionId}&nftId=${nft.id}`
          );
        } else {
          setCollectionNotUpdatableModal(true);
        }
      }
    }
  };

  const handleUpdateMeta = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setShowOptions(null);
  };

  async function salesPageModal(e, type, id, supply) {
    e.stopPropagation();
    e.preventDefault();
    if (type === 'product') {
      setShowOptions(null);
      setShowSalesPageModal(true);
    } else {
      if (Collection?.status === 'published') {
        setShowOptions(null);
        setNftId(id);
        setNftMemSupply(supply);
        await getSalesSetupInfo('membership', id);
        setShowSalesPageModal(true);
      } else {
        setSetSalesError(true);
      }
    }
  }

  const handlePublish = () => {
    setShowPublishModal(false);
    if (Collection.status === 'publishing') {
      setPublishStep(1);
      setShowDeployModal(true);
    } else {
      setShowDeployModal(true);
    }
  };

  const handleAutoFill = () => {
    let members = royalityMembers.map((mem) => {
      return {
        wallet_address: mem.user_eoa,
        royalty: mem.royalty_percent,
      };
    });
    let formData = new FormData();
    formData.append('royalty_data', JSON.stringify(members));
    royalitySplitterId
      ? formData.append('splitter_uid', royalitySplitterId)
      : formData.append('collection_uid', Collection.id);
    if (!ShowPercentError) {
      setIsAutoFillLoading(true);
      updateRoyaltySplitter(formData)
        .then((resp) => {
          if (resp.code === 0) {
            toast.success('Royalty Percentage Updated Successfully');

            setIsAutoFillLoading(false);
            setAutoAssign(false);
            setIsEdit(null);
            setShowRoyalityErrorModal(false);
            setShowRoyalityErrorMessage('');
            getSplittedContributors(royalitySplitterId);
            getCollectionDetail();
          } else {
            setIsAutoFillLoading(false);
            setRoyaltyUpdatedSuccessfully(false);
            setShowRoyalityErrorModal(true);
            setAutoAssign(false);
            setShowRoyalityErrorMessage(resp.message);
          }
        })
        .catch((err) => {
          setIsAutoFillLoading(false);
          setRoyaltyUpdatedSuccessfully(false);
          setAutoAssign(false);
        });
    }
  };

  const handleValueChange = (e, id) => {
    let values = royalityMembers.map((mem) => {
      if (id === mem.user_eoa) {
        return {
          ...mem,
          royalty_percent: parseFloat(e.target.value),
        };
      }
      return mem;
    });

    let percent = royalityMembers.reduce(
      (acc, val) => acc + val.royalty_percent,
      0
    );

    if (percent > 100) {
      setShowPercentError(true);
    } else {
      setShowPercentError(false);
    }

    setRoyalityMembers(values);
  };

  const handlePublishRoyaltySplitterButtonClick = async () => {
    setShowPublishRoyaltySpliterConfirmModal(true);
  };

  const handlePublishRoyaltySplitter = async () => {
    try {
      setShowPublishRoyaltySpliterConfirmModal(false);
      setShowPublishRoyaltySpliterModal(true);
      await publishRoyaltySplitter();
    } catch (err) {
      setShowPublishRoyaltySpliterModal(false);
      setShowPublishRoyaltySpliterErrorModal(true);
      console.error(err);
    }
  };

  const handlePublishModal = async () => {
    let networkId = await getCurrentNetworkId();
    if (Number(collectionNetwork) === networkId) {
      if (Collection?.type === 'product') {
        if (salesSetupInfo?.price) {
          setShowPublishModal(true);
          setIsSalesPrice(false);
        } else {
          setIsSalesPrice(true);
        }
      } else {
        setShowPublishModal(true);
      }
    } else {
      setShowNetworkHandler(true);
    }
  };

  const handlePublishSpliter = async () => {
    let networkId = await getCurrentNetworkId();
    if (Number(collectionNetwork) === networkId) {
      let totalPercent = royalityMembers.reduce(
        (arr, val) => arr + val.royalty_percent,
        0
      );
      if (totalPercent === 100) {
        setShowPublishRoyaltySpliterConfirmModal(true);
      } else {
        toast.error('Total royalty percent should be 100 %');
      }
    } else {
      setShowNetworkHandler(true);
    }
  };

  const getSalesSetupInfo = async (type, id) => {
    if (type === 'product') {
      await getProductNFTCollectionSalesSetupInformation(id)
        .then((res) => {
          if (res.code === 0) {
            setSalesSetupInfo(res?.more_info);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (type === 'membership') {
      // calling membership nft details api because sales setup info can found in the response
      setDataLoading(true);
      await getNftDetails('membership', id)
        .then((resp) => {
          if (resp.code === 0) {
            setSalesSetupInfo(resp?.more_info);
          }
          setDataLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setDataLoading(false);
        });
    }
  };
  console.log(Collection);
  let isSupplyOver = Collection?.total_supply <= NFTs?.length;
  return (
    <>
      <div className='mx-4 md:mx-0'>
        {dataLoading && <div className='loading'></div>}
        {showNetworkHandler && (
          <NetworkHandlerModal
            show={showNetworkHandler}
            handleClose={() => setShowNetworkHandler(false)}
            projectNetwork={collectionNetwork}
          />
        )}
        {showWithdrawModal && (
          <WithdrawModal
            show={showWithdrawModal}
            handleClose={() => setShowWithdrawModal(false)}
            network={Collection?.blockchain}
            price={newWorth?.balance}
          />
        )}
        {ShowPublishModal && (
          <PublishCollectionModal
            show={ShowPublishModal}
            handleClose={() => setShowPublishModal(false)}
            publishProject={handlePublish}
            isRoyaltyPublished={Collection?.royalty_splitter?.contract_address}
            type='Collection'
          />
        )}
        {RoyaltyUpdatedSuccessfully && (
          <SuccessModal
            show={RoyaltyUpdatedSuccessfully}
            handleClose={setRoyaltyUpdatedSuccessfully}
            message='Royalty Percentage Updated Successfully'
            btnText='Done'
          />
        )}
        {showRoyalityErrorModal && (
          <ErrorModal
            title={'Failed to apply royalty percentage!'}
            message={`${showRoyalityErrorMessage}`}
            handleClose={() => {
              setShowRoyalityErrorModal(false);
              setShowRoyalityErrorMessage(null);
              setAutoAssign(false);
            }}
            show={showRoyalityErrorModal}
          />
        )}
        {setSalesError && (
          <ErrorModal
            title={'Collection not published yet!'}
            // message={`${showRoyalityErrorMessage}`}
            handleClose={() => {
              setSetSalesError(false);
            }}
            show={setSalesError}
          />
        )}
        {isSalesPrice && (
          <ErrorModal
            title={'Please set the sales price to publish the collection!'}
            // message={`${showRoyalityErrorMessage}`}
            handleClose={() => {
              setIsSalesPrice(false);
            }}
            show={isSalesPrice}
          />
        )}
        {AutoAssign && (
          <ConfirmationModal
            show={AutoAssign}
            handleClose={setAutoAssign}
            handleApply={handleAutoFill}
            message='This will apply royalty percentage to all the members equally. Are you
          sure, you want to proceed?'
          />
        )}
        {showErrorModal && (
          <ErrorModal
            title={'Collection Publish failed !'}
            message={`${errorMsg}`}
            handleClose={() => {
              setShowErrorModal(false);
              setErrorMsg(null);
            }}
            redirection={
              errorMsg === `DAO is not published yet `
                ? `/dao/${Collection?.project_uid}`
                : false
            }
            show={showErrorModal}
            buttomText={
              errorMsg === `DAO is not published yet ` ? 'View DAO' : 'Close'
            }
          />
        )}
        {showDeployModal && (
          <DeployingCollectiontModal
            show={showDeployModal}
            handleClose={(status) => {
              setShowDeployModal(status);
              const payload = {
                id: collectionId,
              };
              getCollectionDetail(payload);
            }}
            errorClose={(msg) => {
              setErrorMsg(msg);
              setShowDeployModal(false);
              setShowErrorModal(true);
            }}
            tnxData={tnxData}
            collectionId={Collection?.id}
            collectionName={Collection?.name}
            collectionSymbol={Collection?.symbol}
            collectionType={Collection?.type}
            publishStep={publishStep}
            productPrice={salesSetupInfo?.price}
          />
        )}
        {showTransferNFT && (
          <TransferNFT
            show={showTransferNFT}
            handleClose={() => setShowTransferNFT(false)}
          />
        )}
        {showImportWallet && (
          <ImportWalletModal
            show={showImportWallet}
            handleClose={() => {
              setShowImportWallet(false);
              getCollectionDetail();
              getSplittedContributors(
                royalitySplitterId ? royalitySplitterId : Collection.id,
                royalitySplitterId ? 'splitter_id' : 'collection_id'
              );
            }}
            projectId={projectID}
            collectionName={Collection?.name}
            collectionId={Collection?.id}
            handleValueChange={handleValueChange}
            handleAutoFill={handleAutoFill}
            royalityMembers={royalityMembers}
            setRoyalityMembers={setRoyalityMembers}
            showPercentError={ShowPercentError}
            royalitySplitterId={royalitySplitterId}
            setRoyaltyUpdatedSuccessfully={setRoyaltyUpdatedSuccessfully}
            setShowRoyalityErrorModal={setShowRoyalityErrorModal}
            setShowRoyalityErrorMessage={setShowRoyalityErrorMessage}
          />
        )}
        {collectionNotUpdatableModal && (
          <ErrorModal
            title={
              'NFT is not updatable once its collection is published or its metadata was freezed'
            }
            message={`  `}
            handleClose={() => {
              setCollectionNotUpdatableModal(false);
            }}
            show={collectionNotUpdatableModal}
          />
        )}
        {showDaoConnectModal && (
          <DaoConnectModal
            show={showDaoConnectModal}
            handleClose={() => setShowDaoConnectModal(false)}
            userId={userId}
            collection={Collection}
            dao={daoInfo}
            onSuccessFullyConnect={() => getCollectionDetail()}
          />
        )}
        <section className='mt-6'>
          <div className='row-span-2 col-span-2'>
            <Image
              className='rounded-xl object-cover h-[124px] md:h-[260px] w-full'
              src={CoverImages?.path ? CoverImages?.path : Cover}
              alt=''
              height={260}
              width={100}
              unoptimized
            />
          </div>
        </section>
        <section
          className={`gray-linear-gradient-background rounded-b-xl mt-4 p-6 shadow-main`}
        >
          <div className='flex flex-col md:flex-row'>
            <div className='md:w-2/3'>
              <div className='flex'>
                <Image
                  src={Logo?.path ? Logo?.path : manImg}
                  className='rounded-full self-start w-14 h-14 md:w-[98px] object-cover md:h-[98px] bg-color-ass-6'
                  alt='User profile'
                  width={98}
                  height={98}
                  unoptimized
                />
                <div className='flex-1 min-w-0  px-4'>
                  <div className='flex items-center mb-1 md:mb-2'>
                    <h2 className='truncate'>{Collection?.name}</h2>
                    {Collection?.status === 'published' && (
                      <Image
                        className='ml-1 mt-1'
                        src={tickSvg}
                        alt=''
                        height={17}
                        width={17}
                      />
                    )}
                  </div>

                  {userId && Collection?.is_owner && (
                    <>
                      <div>
                        {daoInfo?.id ? (
                          <>
                            <p className='my-2 text-textLight md:text-sm text:xs md:flex items-center'>
                              Connected With :
                              <Link
                                className='md:ml-2 mt-1 mb-2 md:mb-0 md:mt-0 font-bold flex items-center !no-underline'
                                href={`/dao/${daoInfo?.id}`}
                              >
                                <Image
                                  className='h-[24px] w-[24px] rounded-full mr-1'
                                  src={
                                    daoInfo?.assets?.length > 0
                                      ? daoInfo.assets.find(
                                          (img) =>
                                            img['asset_purpose'] === 'cover'
                                        )
                                        ? daoInfo.assets.find(
                                            (img) =>
                                              img['asset_purpose'] === 'cover'
                                          ).path
                                        : defaultCover
                                      : defaultCover
                                  }
                                  width={24}
                                  height={24}
                                  alt='collection cover'
                                />
                                {daoInfo?.name}
                              </Link>
                              {Collection?.status === 'draft' && (
                                <span
                                  onClick={() => setShowDaoConnectModal(true)}
                                  className='rounded cursor-pointer social-icon-button text-primary-900  md:ml-2 px-2'
                                >
                                  <i className='fa-solid  fa-pen-to-square '></i>
                                </span>
                              )}
                            </p>
                          </>
                        ) : (
                          <p
                            className='bg-primary-900/[0.08] rounded mt-1 text-sm w-fit  text-primary-900 font-bold cursor-pointer p-2'
                            onClick={() => setShowDaoConnectModal(true)}
                          >
                            <i class='fa-solid fa-link mr-2'></i>
                            Connect DAO
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className='flex flex-wrap mt-3 items-start md:justify-end md:w-1/3 md:mt-0'
              role='group'
            >
              {Links.find((link) => link.title === 'linkFacebook') &&
                Links.find((link) => link.title === 'linkFacebook').value
                  ?.length > 0 && (
                  <div className='social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300'>
                    <a
                      href={`${
                        Links.find((link) => link.title === 'linkFacebook')
                          .value
                      }`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <Image
                        src={Facebook}
                        alt='Facebook'
                        width={16}
                        height={16}
                      />
                    </a>
                  </div>
                )}

              {Links.find((link) => link.title === 'linkInsta') &&
                Links.find((link) => link.title === 'linkInsta').value?.length >
                  0 && (
                  <div className='social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4'>
                    <a
                      href={`${
                        Links.find((link) => link.title === 'linkInsta').value
                      }`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <Image
                        src={Instagram}
                        alt='Instagram'
                        width={16}
                        height={16}
                      />
                    </a>
                  </div>
                )}

              {Links.find((link) => link.title === 'linkTwitter') &&
                Links.find((link) => link.title === 'linkTwitter').value
                  ?.length > 0 && (
                  <div className='social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4'>
                    <a
                      href={`${
                        Links.find((link) => link.title === 'linkTwitter').value
                      }`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <Image
                        src={Twitter}
                        alt='Twitter'
                        width={16}
                        height={16}
                      />
                    </a>
                  </div>
                )}

              {Links.find((link) => link.title === 'linkGitub') &&
                Links.find((link) => link.title === 'linkGitub').value?.length >
                  0 && (
                  <div className='social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 '>
                    <a
                      href={`${
                        Links.find((link) => link.title === 'linkGitub').value
                      }`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <Image src={Github} alt='Github' width={16} height={16} />
                    </a>
                  </div>
                )}
              {Links.find((link) => link.title === 'linkReddit') &&
                Links.find((link) => link.title === 'linkReddit').value
                  ?.length > 0 && (
                  <div className='social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 '>
                    <a
                      href={`${
                        Links.find((link) => link.title === 'linkReddit').value
                      }`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <Image src={Reddit} alt='Reddit' width={16} height={16} />
                    </a>
                  </div>
                )}

              {Links.find((link) => link.title === 'customLinks1') &&
                Links.find((link) => link.title === 'customLinks1').value
                  ?.length > 0 && (
                  <div className='social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 '>
                    <a
                      href={`${
                        Links.find((link) => link.title === 'customLinks1')
                          .value
                      }`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <Image
                        src={ExternalLink}
                        alt='Github'
                        width={16}
                        height={16}
                      />
                    </a>
                  </div>
                )}
              {Collection?.is_owner && (
                <Link
                  href={`/collection/create/?id=${collectionId}`}
                  className='ml-4'
                >
                  <Image src={editImage} alt='edit' />
                </Link>
              )}
            </div>
          </div>

          <div className='flex flex-col md:flex-row pt-5'>
            <div className='md:w-2/3'>
              <h3>About The Collection</h3>
              <div className='text-textLight text-sm'>
                {Collection?.description ? (
                  <div className='whitespace-pre-line text-textLight break-all text-sm'>
                    <ReactReadMoreReadLess
                      charLimit={300}
                      readMoreText={'Read more ▼'}
                      readLessText={'Read less ▲'}
                      readMoreClassName='font-bold'
                      readLessClassName='font-bold'
                    >
                      {Collection.description}
                    </ReactReadMoreReadLess>
                  </div>
                ) : (
                  'Please add description to show here'
                )}
              </div>
              <div className='mt-6 flex items-center'>
                {/* <a className='inline-block ml-4 bg-primary-900 bg-opacity-10 p-3 text-primary-900  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-opacity-100 hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>
                Sales Setting
              </a> */}
                {Collection?.type === 'product' && Collection?.is_owner && (
                  <div
                    onClick={(e) => salesPageModal(e, 'product')}
                    className='outlined-button ml-0 mr-4 font-satoshi-bold cursor-pointer'
                  >
                    <span>Sales Setting</span>
                  </div>
                )}
                {/* {Collection?.is_owner && (
                  <Link
                    href={`/collection/create/?id=${collectionId}`}
                    className='outlined-button ml-4 font-satoshi-bold'
                  >
                    <span>Edit Collection</span>
                  </Link>
                )} */}
                {Collection?.status !== 'published' && Collection?.is_owner && (
                  <a
                    onClick={handlePublishModal}
                    className='contained-button font-satoshi-bold'
                  >
                    Publish
                  </a>
                )}
              </div>
              <div className='flex items-center mt-3'>
                {Collection &&
                  Collection.members &&
                  Collection.members.length > 0 &&
                  Collection.members.map((img, index) => (
                    <div key={index}>
                      {index < 5 && (
                        <Image
                          key={`member-img-${index}`}
                          className='rounded-full h-[35px] w-[38px] -ml-1 border-2 object-cover  border-white'
                          src={img?.avatar ? img.avatar : avatar}
                          alt=''
                          width={38}
                          height={35}
                        />
                      )}
                    </div>
                  ))}
                {Collection &&
                  Collection.members &&
                  Collection.members.length > 5 && (
                    <span className='ml-2 bg-primary-900 bg-opacity-5  text-primary-900 rounded p-1 text-xs  '>
                      +{Collection.members.length - 5}
                    </span>
                  )}
              </div>
            </div>

            <div className='flex items-start md:items-end flex-col mt-3 justify-center md:justify-end md:w-1/3  md:mt-0'>
              {/* <div className='gray-linear-gradient-card-bg  ml-0 md:ml-3 rounded-md p-3 px-5 relative w-56'>

                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className='mt-2 border-[1px] rounded-[4px] border-primary-900 py-1 px-2 bg-primary-900/[0.08] w-fit text-[12px] text-primary-900 font-bold'
                >
                  Withdraw Funds
                </button>
              </div> */}
              <div className='gray-linear-gradient-card-bg  ml-0 md:ml-3 rounded-md p-3 px-5 relative w-[330px]'>
                <div className='flex'>
                  <p className=' text-textSubtle mt-1 text-[14px]'>
                    Net Worth{' '}
                    <i
                      onClick={getCollectionNewWorth}
                      className={`fa-regular fa-arrows-rotate text-textSubtle text-sm ${
                        balanceLoading ? 'fa-spin' : ''
                      } cursor-pointer`}
                    ></i>
                  </p>
                  <div className='ml-auto'>
                    <p className='pb-0 text-black font-black text-[16px] md:text-[20px] '>
                      {newWorth?.balance} {newWorth?.currency?.toUpperCase()}
                    </p>
                    <p className='text-sm  mt-0 text-textSubtle'>
                      (${newWorth?.balanceUSD?.toFixed(2)})
                    </p>
                  </div>
                </div>
                <div className='flex flex-col items-end'>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className='mt-2 border-[1px] rounded-[4px] border-primary-900 py-1 px-2 bg-primary-900/[0.08] w-fit text-[12px] text-primary-900 font-bold'
                  >
                    Withdraw Funds
                  </button>
                  <div className='text-[12px] text-textSubtle'>
                    Powered by{' '}
                    <a
                      href='https://www.coingecko.com/'
                      target='_blank'
                      rel='noreferrer'
                      className='text-primary-900'
                    >
                      CoinGecko
                    </a>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <p className=' text-textSubtle mt-1 text-[14px]'>Items </p>
                  <p className=' text-textSubtle mt-1 text-[14px] font-black text-black'>
                    {NFTs?.length ? NFTs.length : 0}
                  </p>
                </div>
                <div className='flex items-center justify-between'>
                  <p className=' text-textSubtle mt-1 text-[14px]'>
                    Contract Address{' '}
                  </p>
                  <p className=' text-textSubtle mt-1 text-[14px] font-black text-black'>
                    {Collection?.contract_address
                      ? walletAddressTruncate(Collection.contract_address)
                      : 'Not released'}
                    {Collection?.contract_address ? (
                      <i
                        className={`fa-solid fa-copy ml-2 ${
                          Collection?.contract_address
                            ? 'cursor-pointer'
                            : 'cursor-not-allowed'
                        }`}
                        disabled={!Collection?.contract_address}
                        onClick={() =>
                          copyToClipboard(Collection?.contract_address)
                        }
                      ></i>
                    ) : null}
                    <span id='copied-message' className='hidden ml-2'>
                      Copied !
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          {Collection?.is_owner ? (
            <div
              onClick={
                Collection.type === 'product' && isSupplyOver
                  ? null
                  : () =>
                      router.push(
                        `${
                          Collection?.type === 'product'
                            ? `/nft/product/create?collectionId=${collectionId}`
                            : `/nft/membership/create?collection_id=${collectionId}`
                        }`
                      )
              }
              className={`mint-button mt-3 text-center font-satoshi-bold w-full md:w-fit ${
                Collection.type === 'product' && isSupplyOver ? 'grayscale' : ''
              }`}
            >
              <span> Create NFT</span>
            </div>
          ) : null}
          <section>
            <div className='mb-4'>
              <ul
                className='flex flex-wrap -mb-px text-sm font-medium text-center'
                id='myTab'
                data-tabs-toggle='#myTabContent'
                role='tablist'
              >
                <li
                  className='mr-2'
                  role='presentation'
                  onClick={() => setSelectedTab(1)}
                >
                  <button
                    className={`inline-block p-4 text-lg rounded-t-lg ${
                      selectedTab === 1
                        ? 'border-b-2 border-primary-900 text-primary-900'
                        : 'border-transparent text-textSubtle'
                    } hover:text-primary-600`}
                    id='nft'
                    data-tabs-target='#nft'
                    type='button'
                    role='tab'
                    aria-controls='nft'
                    aria-selected='true'
                  >
                    NFT
                  </button>
                </li>
                {Collection?.is_owner && (
                  <li
                    className='mr-2'
                    role='presentation'
                    onClick={() => setSelectedTab(2)}
                  >
                    <button
                      className={`inline-block p-4 text-lg rounded-t-lg ${
                        selectedTab === 2
                          ? 'border-b-2 border-primary-900 text-primary-900'
                          : 'border-transparent text-textSubtle'
                      } hover:text-primary-900`}
                      id='dashboard'
                      data-tabs-target='#dashboard'
                      type='button'
                      role='tab'
                      aria-controls='dashboard'
                      aria-selected='false'
                    >
                      Royalty Splitter
                    </button>
                  </li>
                )}
                {Collection?.is_owner && (
                  <li
                    className='mr-2'
                    role='presentation'
                    onClick={() => setSelectedTab(3)}
                  >
                    <button
                      className={`inline-block p-4 text-lg rounded-t-lg ${
                        selectedTab === 3
                          ? 'border-b-2 border-primary-900 text-primary-900'
                          : 'border-transparent text-textSubtle'
                      } hover:text-primary-900`}
                      id='nft-sale'
                      data-tabs-target='#nft-sale'
                      type='button'
                      role='tab'
                      aria-controls='nft-sale'
                      aria-selected='false'
                    >
                      NFT Sale's
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <div id='myTabContent'>
              {selectedTab === 1 && (
                <div className='mt-6'>
                  {NFTs?.length ? (
                    <div className='grid gap-6  grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                      {NFTs.map((nft) => {
                        return (
                          <div
                            key={nft?.id}
                            className='min-h-auto md:min-h-[400px] rounded-xl  bg-white'
                          >
                            <Link href={`/nft/${nft?.nft_type}/${nft.id}`}>
                              {imageRegex.test(nft?.asset?.asset_type) && (
                                <Image
                                  className='rounded-xl h-[176px] md:h-[276px] w-full object-cover'
                                  src={nft?.asset?.path}
                                  alt=''
                                  width={276}
                                  height={276}
                                />
                              )}
                              {nft?.asset?.asset_type === 'movie' ||
                              nft?.asset?.asset_type === 'video/mp4' ? (
                                <video
                                  className='h-[176px] md:h-[276px] w-full'
                                  controls
                                >
                                  <source
                                    src={nft?.asset?.path}
                                    type='video/mp4'
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              ) : null}
                              {nft?.asset?.asset_type === 'audio' ||
                              nft?.asset?.asset_type === 'audio/mpeg' ? (
                                <audio
                                  src={nft?.asset?.path}
                                  controls
                                  autoPlay={false}
                                  className='h-[176px] md:h-[276px] w-full'
                                />
                              ) : null}
                            </Link>
                            <div className='py-2 md:py-5'>
                              <div className='flex '>
                                <h3 className='mb-2 text-txtblack truncate flex-1 mr-3 m-w-0 text-[24px]'>
                                  {nft?.name}
                                </h3>
                                <div className='relative'>
                                  {/* Dropdown menu  */}
                                  {Collection?.is_owner && (
                                    <>
                                      <button
                                        type='button'
                                        className='w-[20px]'
                                        onClick={(e) =>
                                          handleShowOptions(e, nft.id)
                                        }
                                      >
                                        <i className='fa-regular fa-ellipsis-vertical text-textSubtle'></i>
                                      </button>
                                    </>
                                  )}
                                  {ShowOptions === nft.id && (
                                    <div className='z-10 w-[115px]  bg-white   rounded-md  absolute right-0  top-6 mb-9 block'>
                                      <ul className='text-sm'>
                                        <li className='border'>
                                          <div
                                            onClick={(e) =>
                                              handleEditNFT(e, nft)
                                            }
                                            className='py-2 pl-3 block hover:bg-gray-100 cursor-pointer'
                                          >
                                            Edit NFT
                                          </div>
                                        </li>
                                        {Collection?.type === 'membership' && (
                                          <>
                                            {/* <li className="border">
                                          <div
                                            onClick={() => {
                                              setShowTransferNFT(true);
                                              setShowOptions(false);
                                            }}
                                            className="block p-4 hover:bg-gray-100 cursor-pointer"
                                          >
                                            Transfer NFT
                                          </div>
                                        </li> */}
                                            <li className='border'>
                                              <div
                                                onClick={(e) =>
                                                  salesPageModal(
                                                    e,
                                                    'membership',
                                                    nft.id,
                                                    nft.supply
                                                  )
                                                }
                                                className='block py-2 pl-3 hover:bg-gray-100 cursor-pointer'
                                              >
                                                Sales Settings
                                              </div>
                                            </li>
                                          </>
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className='flex  '>
                                <p className='text-[13px]'>
                                  {nft?.price ? nft?.price : 'Price not set'}{' '}
                                  {nft?.currency?.toUpperCase()}
                                </p>
                                {nft?.currency ? (
                                  <Image
                                    className='ml-auto'
                                    src={nft.currency === 'eth' ? Eth : Polygon}
                                    alt={collectionNetwork}
                                    width={24}
                                    height={24}
                                  />
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className='w-full mb-6'>
                      <Image
                        src={emptyStateCommon}
                        className='h-[210px] w-[315px] m-auto'
                        alt=''
                        width={315}
                        height={210}
                      />
                      <p className='font-bold text-center'>
                        You don't have any NFT.
                        {Collection?.status === 'draft'
                          ? ` Start create NFT now`
                          : ``}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {selectedTab === 2 && (
                <div className='mb-6'>
                  <div className='bg-white rounded-[12px] p-5 shadow-main'>
                    <div className='flex items-start md:items-center justify-between pb-7 border-b-[1px] mb-6 border-[#E3DEEA]'>
                      <h3 className='text-[18px] font-black'>Contributor</h3>
                      {ShowPercentError ? (
                        <p className='text-red-400 text-[14px] mt-1'>
                          Total percent of contributors should equal to or
                          lesser than 100%
                        </p>
                      ) : null}
                      {/* {CollectionDetail?.is_owner && data?.members?.length ? ( */}
                      <div className='flex items-center justify-center flex-col md:flex-row'>
                        {!hasPublishedRoyaltySplitter && (
                          <>
                            <div className='form-check form-switch flex items-center'>
                              <p className='text-[#303548] text-[12px] mr-3'>
                                Split Evenly
                              </p>
                              <input
                                className='form-check-input appearance-none w-9 rounded-full h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
                                type='checkbox'
                                checked={AutoAssign}
                                role='switch'
                                onChange={handleAutoAssign}
                              />
                            </div>
                            <div
                              className='mint-button mt-4 md:mt-0 ml-4 text-center font-satoshi-bold w-full text-[12px] md:w-fit flex'
                              onClick={() => setShowImportWallet(true)}
                            >
                              <Image
                                src={PlusIcon}
                                alt='add'
                                width={14}
                                height={14}
                              />
                              <span className='ml-1'>Import Contributor</span>
                            </div>
                          </>
                        )}
                      </div>
                      {/* ) : null} */}
                    </div>{' '}
                    <MemberListTable
                      collection={Collection}
                      list={royalityMembers}
                      headers={TABLE_HEADERS}
                      // handlePublish={setShowPublish}
                      setIsEdit={setIsEdit}
                      setRoyalityMembers={setRoyalityMembers}
                      showRoyalityErrorModal={showRoyalityErrorModal}
                      isEdit={isEdit}
                      handleValueChange={handleValueChange}
                      handleAutoFill={handleAutoFill}
                      isOwner={Collection?.is_owner}
                    />
                    <div className='w-full'>
                      {!hasPublishedRoyaltySplitter && (
                        <button
                          className='block ml-auto bg-primary-100 text-primary-900 p-3 font-black text-[14px]'
                          onClick={handlePublishSpliter}
                          disabled={
                            !canPublishRoyaltySplitter ||
                            isPublishingRoyaltySplitter ||
                            !royalityMembers.length ||
                            !royalitySplitterId
                          }
                        >
                          {isPublishingRoyaltySplitter
                            ? publishRoyaltySplitterStatus === 1
                              ? 'Creating contract'
                              : 'Publishing'
                            : 'Lock Percentage'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {selectedTab === 3 && (
                <div className='mb-6'>
                  <div className='bg-white rounded-[12px] p-5 mt-6 shadow-main'>
                    <NFTSales items={nftSales} />
                  </div>
                </div>
              )}
            </div>
          </section>
        </section>
        {showSalesPageModal && (
          <SalesPageModal
            projectId={projectID}
            show={showSalesPageModal}
            address={Collection?.contract_address}
            collectionId={collectionId}
            collectionType={`${collectionType}`}
            nftId={nftId}
            collectionName={Collection?.name}
            handleClose={() => setShowSalesPageModal(false)}
            successClose={() => {
              setShowSalesPageModal(false);
              setShowSuccessModal(true);
            }}
            supply={nftMemSupply}
            projectNetwork={collectionNetwork}
            setNFTShareURL={setNFTShareURL}
            setMembershipNFTId={setMembershipNFTId}
            salesSetupInfo={salesSetupInfo}
          />
        )}
        {showSuccessModal && (
          <SalesSuccessModal
            show={showSuccessModal}
            handleClose={() => {
              setShowSuccessModal(false);
              getCollectionDetail();
            }}
            projectId={projectID}
            nftShareURL={nftShareURL}
            membershipNFTId={membershipNFTId}
          />
        )}

        {showPublishRoyaltySpliterConfirmModal && (
          <PublishRoyaltyConfirmModal
            show={showPublishRoyaltySpliterConfirmModal}
            handleClose={() => {
              setShowPublishRoyaltySpliterConfirmModal(false);
            }}
            publishProject={handlePublishRoyaltySplitter}
          />
        )}

        {showPublishRoyaltySpliterModal && (
          <PublishRoyaltyModal
            isVisible={showPublishRoyaltySpliterModal}
            isLoading={isPublishingRoyaltySplitter}
            status={publishRoyaltySplitterStatus}
            onRequestClose={() => {
              getCollectionDetail();
              setShowPublishRoyaltySpliterModal(false);
            }}
          />
        )}

        {showPublishRoyaltySpliterErrorModal && (
          <ErrorModal
            show={showPublishRoyaltySpliterErrorModal}
            title='Failed to publish royalty percentage!'
            handleClose={() => setShowPublishRoyaltySpliterErrorModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default CollectionContent;
