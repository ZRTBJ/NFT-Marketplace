import { useState, useEffect, useMemo } from 'react';
import PlusIcon from 'assets/images/icons/plus-circle.svg';
import { round } from 'lodash';
import MemberListTable from 'components/Collection/RoyaltySplitter/MemberListTable';
import usePublishRoyaltySplitter from 'components/Collection/RoyaltySplitter/Publish/hooks/usePublishRoyaltySplitter';
import {
  getCollectionDetailsById,
  getSplitterDetails,
  updateRoyaltySplitter,
} from 'services/collection/collectionService';
import { useSelector } from 'react-redux';
import SuccessModal from 'components/Modals/SuccessModal';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import ImportWalletModal from 'components/Collection/RoyaltySplitter/ImportWalletModal/ImportWalletModal';
import ErrorModal from 'components/Modals/ErrorModal';
import { toast } from 'react-toastify';
import PublishRoyaltyModal from 'components/Collection/RoyaltySplitter/Publish/PublishRoyaltyModal';
import PublishCollectionModal from 'components/Collection/Publish/PublishCollectionModal';
import Spinner from 'components/Commons/Spinner';
import ReactPaginate from 'react-paginate';
import { getCurrentNetworkId } from 'util/MetaMask';
import NetworkHandlerModal from 'components/Modals/NetworkHandlerModal';
import PublishRoyaltyConfirmModal from 'components/Collection/Publish/PublishRoyaltyConfirmModal';
import Image from 'next/image';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import { NETWORKS } from 'config/networks';
import Tooltip from 'components/Commons/Tooltip';

const TABLE_HEADERS = [
  { id: 0, label: 'Wallet Address' },
  { id: 1, label: 'Percentage' },
  { id: 2, label: 'Name' },
  { id: 3, label: 'Role' },
  { id: 4, label: 'Action' },
];

const Splitter = ({
  collectionId,
  getProjectCollections,
  projectNetwork,
  isModal,
  createSplitterClose,
  splitterId,
  onGetSplitterList,
}) => {
  const [ShowPercentError, setShowPercentError] = useState(false);
  const [AutoAssign, setAutoAssign] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const [royalitySplitterId, setRoyalitySpliterId] = useState('');
  const [royalityMembers, setRoyalityMembers] = useState([]);
  const [showRoyalityErrorModal, setShowRoyalityErrorModal] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [IsAutoFillLoading, setIsAutoFillLoading] = useState(false);
  const [pagination, SetPagination] = useState([]);
  const [payload, setPayload] = useState({
    page: 1,
    limit: 5,
  });
  const [Collection, setCollection] = useState();
  const [projectID, setProjectID] = useState('');
  const [showNetworkHandler, setShowNetworkHandler] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [toCreateSplitter, setToCreateSplitter] = useState(false);
  const [blockchain, setBlockchain] = useState('');
  const [splitterName, setSplitterName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (projectNetwork) {
      setBlockchain(projectNetwork);
    }
  }, [projectNetwork]);

  const hasPublishedRoyaltySplitter = useMemo(
    () => Collection?.royalty_splitter?.status === 'published',
    [Collection]
  );
  const [showRoyalityErrorMessage, setShowRoyalityErrorMessage] = useState('');
  const [RoyaltyUpdatedSuccessfully, setRoyaltyUpdatedSuccessfully] =
    useState(false);
  const [showPublishRoyaltySpliterModal, setShowPublishRoyaltySpliterModal] =
    useState(false);
  const [
    showPublishRoyaltySpliterConfirmModal,
    setShowPublishRoyaltySpliterConfirmModal,
  ] = useState();
  const [
    showPublishRoyaltySpliterErrorModal,
    setShowPublishRoyaltySpliterErrorModal,
  ] = useState(false);

  const hanldeUpdatePublishStatus = (status) => {
    if (status === 'success') {
      setIsPublishLoading(false);
      if (Collection?.royalty_splitter?.status !== 'published') {
        setCollection({
          ...Collection,
          royalty_splitter: {
            ...Collection?.royalty_splitter,
            status: 'published',
          },
        });
        if (!isModal) {
          getProjectCollections();
        }
      }
    }
  };

  const {
    isLoading: isPublishingRoyaltySplitter,
    status: publishRoyaltySplitterStatus,
    canPublish: canPublishRoyaltySplitter,
    publish: publishRoyaltySplitter,
    setIsLoading: setPublishingSplitter,
  } = usePublishRoyaltySplitter({
    collection: Collection,
    splitters: royalityMembers,
    onUpdateStatus: hanldeUpdatePublishStatus,
    royaltySplitterId: splitterId,
  });

  const [showImportWallet, setShowImportWallet] = useState(false);
  const userInfo = useSelector((state) => state.user.userinfo);

  useEffect(() => {
    if (toCreateSplitter) {
      handleAutoFill();
    }

    return () => {
      setToCreateSplitter(false);
    };
  }, [userInfo?.id]);

  useEffect(() => {
    setIsLoading(true);
    getCollectionDetail();
  }, [collectionId]);

  useEffect(() => {
    if (splitterId) {
      getSplittedContributors(splitterId);
    }
  }, [splitterId]);

  // useEffect(() => {}, [payload]);

  const getCollectionDetail = () => {
    let payload = {
      id: collectionId,
    };
    getCollectionDetailsById(payload)
      .then((resp) => {
        setIsLoading(false);
        if (resp.code === 0) {
          setProjectID(resp?.collection?.project_uid);
          if (resp?.collection?.royalty_splitter?.id) {
            setRoyalitySpliterId(resp.collection.royalty_splitter.id);
            getSplittedContributors(resp.collection.royalty_splitter.id);
          }
          setCollection(resp.collection);
        }
      })
      .catch((err) => setIsLoading(false));
  };

  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };

  const getSplittedContributors = (id, type) => {
    getSplitterDetails(id, type).then((data) => {
      if (data.code === 0) {
        if (data?.splitter?.status === 'published') {
          setIsPublished(true);
        } else {
          setIsPublished(false);
        }
        setSplitterName(data?.splitter?.name);
        setBlockchain(data?.splitter?.blockchain);
        setRoyalityMembers(data?.members);
        if (data?.members?.length > 0) {
          const page = calculatePageCount(payload.limit, data.members.length);
          const pageList = [];
          for (let index = 1; index <= page; index++) {
            pageList.push(index);
          }
          SetPagination(pageList);
        }
      }
    });
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

  const handlePublishRoyaltySplitter = async () => {
    try {
      setPublishingSplitter(true);
      setShowPublishRoyaltySpliterConfirmModal(false);
      setShowPublishRoyaltySpliterModal(true);
      if (splitterId) {
        await publishRoyaltySplitter();
      } else {
        await handleAutoFill(null, true);
      }
    } catch (err) {
      setShowPublishRoyaltySpliterModal(false);
      setShowPublishRoyaltySpliterErrorModal(true);
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

  const handleAutoFill = (e, publish) => {
    setIsSubmitted(true);
    if (splitterName && blockchain && royalityMembers.length) {
      if (userInfo?.id) {
        let members = royalityMembers.map((mem) => {
          return {
            wallet_address: mem.user_eoa,
            royalty: mem.royalty_percent,
          };
        });
        let formData = new FormData();
        formData.append('royalty_data', JSON.stringify(members));
        splitterName && formData.append('name', splitterName);
        blockchain && formData.append('blockchain', blockchain);
        royalitySplitterId || splitterId
          ? formData.append(
              'splitter_uid',
              splitterId ? splitterId : royalitySplitterId
            )
          : Collection?.id
          ? formData.append('collection_uid', Collection?.id)
          : null;
        if (!ShowPercentError) {
          setIsAutoFillLoading(true);
          updateRoyaltySplitter(formData)
            .then((resp) => {
              if (resp.code === 0) {
                if (publish) {
                  publishRoyaltySplitter(resp.splitter_id);
                } else {
                  toast.success(
                    isModal
                      ? 'Royalty Splitter added Successfully'
                      : 'Royalty Percentage Updated Successfully'
                  );
                  setIsAutoFillLoading(false);
                  setAutoAssign(false);
                  setIsEdit(null);
                  setShowRoyalityErrorModal(false);
                  setShowRoyalityErrorMessage('');
                  getCollectionDetail();
                  if (isModal) {
                    createSplitterClose();
                    onGetSplitterList();
                  }
                }
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
      } else {
        setShowConnectModal(true);
        setToCreateSplitter(true);
      }
    }
  };

  const handlePageClick = (event) => {
    const newPayload = { ...payload };
    newPayload.page = event.selected + 1;
    setPayload(newPayload);
  };

  const handlePublishSpliter = async () => {
    setIsSubmitted(true);
    if (splitterName && blockchain && royalityMembers.length) {
      let selectedNetwork = projectNetwork
        ? Number(projectNetwork)
        : Number(blockchain);
      let networkId = await getCurrentNetworkId();
      if (selectedNetwork === networkId) {
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
    }
  };

  const indexOfLastPost = payload.page * payload.limit;

  const indexOfFirstPost = indexOfLastPost - payload.limit;

  const currentMembers =
    royalityMembers?.length &&
    royalityMembers.slice(indexOfFirstPost, indexOfLastPost);

  let validNetworks = NETWORKS
    ? Object.values(NETWORKS).filter(
        (net) => net.network !== 97 && net.network !== 56
      )
    : [];

  return (
    <>
      {loading && (
        <div className='grid mt-[40px] place-items-center'>
          <Spinner />
        </div>
      )}
      {showNetworkHandler && (
        <NetworkHandlerModal
          show={showNetworkHandler}
          handleClose={() => setShowNetworkHandler(false)}
          projectNetwork={projectNetwork ? projectNetwork : blockchain}
          type='Splitter'
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
      {showImportWallet && (
        <ImportWalletModal
          show={showImportWallet}
          handleClose={() => {
            setShowImportWallet(false);
            getCollectionDetail();
            getSplittedContributors(
              royalitySplitterId ? royalitySplitterId : Collection?.id,
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
          isModal={isModal}
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
      {/* {showPublishRoyaltySpliterConfirmModal && (
        <PublishCollectionModal
          show={showPublishRoyaltySpliterConfirmModal}
          handleClose={() => setShowPublishRoyaltySpliterConfirmModal(false)}
          publishProject={handlePublishRoyaltySplitter}
          type='Royalty Splitter'
          isRoyaltyPublished={Collection?.royalty_splitter?.contract_address}
        />
      )} */}
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
            createSplitterClose(false);
            onGetSplitterList();
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

      {showConnectModal && (
        <WalletConnectModal
          showModal={showConnectModal}
          noRedirection={true}
          closeModal={() => setShowConnectModal(false)}
        />
      )}

      {!loading && (
        <div className='bg-[#F8FCFE] rounded-[12px] p-5 mt-5'>
          <div className='flex items-center mb-8'>
            <div className='w-2/4 mr-1 relative'>
              <label htmlFor='splitterName'>Splitter name</label>
              <input
                id='splitterName'
                name='splitterName'
                value={splitterName}
                className='mt-1 rounded-[3px]'
                disabled={hasPublishedRoyaltySplitter}
                style={{ height: 42 }}
                type='text'
                onChange={(e) => setSplitterName(e.target.value)}
                placeholder='Splitter Name'
              />
              {isSubmitted && !splitterName && (
                <p className='text-sm text-red-400 absolute'>
                  Name is required
                </p>
              )}
            </div>
            <div className='w-2/4 ml-1 relative'>
              <label htmlFor='blockchain'>Blockchain</label>
              <select
                value={blockchain}
                disabled={hasPublishedRoyaltySplitter}
                onChange={(e) => setBlockchain(e.target.value)}
                className='h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3'
              >
                <option value={''} defaultValue>
                  Select Blockchain
                </option>
                {validNetworks.map((network) => (
                  <option value={network?.network} key={network?.network}>
                    {network?.networkName}
                  </option>
                ))}
              </select>
              {isSubmitted && !blockchain && (
                <p className='text-sm text-red-400 absolute'>
                  Blockchain is required
                </p>
              )}
            </div>
          </div>
          <div className='flex items-start md:items-center justify-between pb-7 '>
            <h3 className='text-[18px] font-black'>Contributors</h3>
            {ShowPercentError ? (
              <p className='text-red-400 text-[14px] mt-1'>
                Total percent of contributors should equal to or lesser than
                100%
              </p>
            ) : null}
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
                    <Image src={PlusIcon} alt='add' width={12} height={12} />
                    <span className='ml-1'>Import Contributor</span>
                  </div>
                </>
              )}
            </div>
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
            isOwner={Collection?.is_owner || isModal}
            isPublished={isPublished}
          />
          {/* <div className="mt-[30px]">
            {pagination.length > 0 && (
              <>
                <ReactPaginate
                  className="flex flex-wrap md:space-x-10 space-x-3 justify-center items-center my-6"
                  pageClassName="px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7 !text-txtblack "
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={pagination.length}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                  activeClassName="text-primary-900 bg-primary-900 !no-underline"
                  activeLinkClassName="!text-txtblack !no-underline"
                />
              </>
            )}
          </div> */}
          {/* {CollectionDetail.is_owner &&
                CollectionDetail.status !== "published" ? ( */}
          {isSubmitted && !royalityMembers.length && (
            <p className='text-red-400 text-sm mt-4'>
              Please add members to save or publish
            </p>
          )}
          <div className='w-full flex items-center justify-end'>
            {((!hasPublishedRoyaltySplitter && !isModal) ||
              (!isPublished && isModal)) && (
              <div>
                <button
                  onClick={handleAutoFill}
                  className='border-primary-900 border text-primary-900 p-3 font-black text-[14px]'
                  // disabled={!royalityMembers.length}
                >
                  Save draft
                </button>
              </div>
            )}
            {(isModal && !isPublished) ||
              (!isModal && !hasPublishedRoyaltySplitter && userInfo?.id && (
                <button
                  className='flex items-center ml-4 border border-primary-100 bg-primary-100 text-primary-900 p-3 font-black text-[14px]'
                  onClick={handlePublishSpliter}
                  disabled={
                    isPublishingRoyaltySplitter || !royalityMembers.length
                  }
                >
                  <span className='mr-1'>
                    {isPublishingRoyaltySplitter
                      ? publishRoyaltySplitterStatus === 1
                        ? 'Creating contract'
                        : 'Publishing'
                      : 'Publish to Blockchain'}
                  </span>
                  <Tooltip
                    message='If you Publish to Blockchain, it will be visible on blockchain'
                    place='left'
                  ></Tooltip>
                </button>
              ))}
          </div>
          {/* ) : null} */}
        </div>
      )}
    </>
  );
};

export default Splitter;
