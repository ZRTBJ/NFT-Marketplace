import { useState, useEffect } from 'react';
import DropdownCreabo from 'components/DropdownCreabo';
import CirclePlus from 'assets/images/icons/plus-circle.svg';
import MemberListTable from 'components/RoyalityManagement/MemberListTable/MemberListTable';
import styles from './style.module.css';
import FB from 'assets/images/facebook.svg';
import twitter from 'assets/images/twitter.svg';
import reddit from 'assets/images/reddit.svg';
import instagram from 'assets/images/icons/instagram.svg';
import NFTSample from 'assets/images/createDAO/nft-sample.svg';
import NewPublishModal from 'components/modalDialog/NewPublishModal';
import { useParams } from 'react-router-dom';
import {
  getCollectionNFTs,
  getCollections,
  getCollectionDetailsById,
  connectCollection,
} from 'services/collection/collectionService';
import { getRightAttachedNFT, updateRoyalty } from 'services/nft/nftService';
import ColImage from 'assets/images/collection-wrapper.svg';
import { Link } from 'react-router-dom';
import ConfirmationModal from 'components/modalDialog/ConfirmationModal';
import SuccessModal from 'components/modalDialog/SuccessModal';
import DeployingCollectiontModal from 'components/modalDialog/DeployingCollectionModal';
import ErrorModal from 'components/modalDialog/ErrorModal';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
} from 'react-share';

const TABLE_HEADERS = [
  { id: 0, label: 'Wallet Address' },
  { id: 1, label: 'Name' },
  { id: 2, label: 'Email' },
  { id: 3, label: 'Percentage' },
  { id: 4, label: 'Token ID' },
  { id: 5, label: 'Role' },
  // { id: 6, label: 'Action' },
];

const RoyalityManagement = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [showPublish, setShowPublish] = useState(false);
  const [data, setData] = useState();
  const [IsLoading, setIsLoading] = useState(false);
  const [Collections, setCollections] = useState([]);
  const [CollectionDetail, setCollectionDetail] = useState([]);
  const [IsConnectionLoading, setIsConnectionLoading] = useState(false);
  const [IsNFTAvailable, setIsNFTAvailable] = useState(false);
  const [AutoAssign, setAutoAssign] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const [ConnectedSuccessfully, setConnectedSuccessfully] = useState(false);
  const [IsAutoFillLoading, setIsAutoFillLoading] = useState(false);
  const [RoyaltyUpdatedSuccessfully, setRoyaltyUpdatedSuccessfully] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [ShowPercentError, setShowPercentError] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [publishStep, setPublishStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState(null);
  const [tnxData, setTnxData] = useState({});
  const [showConnectErrorModal, setShowConnectErrorModal] = useState(false);
  const [connectErrorMessage, setConnectErrorMessage] = useState(null);
  const [connectedCollections, setConnectedCollections] = useState([]);
  const [isSubmitted, setIsSumbitted] = useState(false);
  const [isConfirmConnect, setIsConfirmConnect] = useState(false);
  const [showRoyalityErrorModal, setShowRoyalityErrorModal] = useState(false);
  const [showRoyalityErrorMessage, setShowRoyalityErrorMessage] = useState('');

  const { collectionId } = useParams();
  let origin = window.location.origin;

  useEffect(() => {
    if (data?.lnft?.id) handleGetNftDetail(data?.lnft?.id);
  }, [CollectionDetail.status]);

  useEffect(() => {
    setIsLoading(true);
    getCollectionNFTs(collectionId)
      .then((resp) => {
        setIsLoading(false);
        if (resp.code === 0) {
          if (resp?.lnfts?.[0]) {
            setIsNFTAvailable(true);
            let ranftId = resp?.lnfts?.[0];
            handleGetNftDetail(ranftId.id);
          } else {
            setIsNFTAvailable(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
    getCollectionDetail();

    return () => {
      setShowPercentError(false);
    };
  }, []);

  const handleAutoAssign = (e) => {
    setAutoAssign(!AutoAssign);
    let memberCount = data.members.length;
    let value = 100 / memberCount;
    let values = {
      ...data,
      members: data.members.map((mem) => {
        return {
          ...mem,
          royalty_percent: parseInt(value),
        };
      }),
    };
    setData(values);
  };

  const handleChange = (e) => {
    setSelectedCollectionId(e.target.value);
  };

  const getAllCollections = (id) => {
    getCollections('project', id)
      .then((resp) => {
        if (resp.code === 0) {
          let items = resp?.data.filter((col) => col.type !== 'right_attach');
          setCollections(items);
        }
      })
      .catch((err) => console.log(err));
  };

  const getCollectionDetail = () => {
    const payload = {
      id: collectionId,
    };
    getCollectionDetailsById(payload)
      .then((resp) => setCollectionDetail(resp.collection))
      .catch((err) => console.log(err));
  };

  const copyToClipboardShare = (text) => {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-share-message');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
    }, 2000);
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-message');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
    }, 2000);
  }

  const handleConnectCollection = () => {
    setIsSumbitted(true);
    if (selectedCollectionId) {
      setIsConfirmConnect(true);
    }
  };

  const submitConnection = () => {
    setIsConnectionLoading(true);
    connectCollection(data.lnft.id, selectedCollectionId)
      .then((resp) => {
        setIsConnectionLoading(false);
        if (resp.code === 0) {
          setConnectedSuccessfully(true);
          setTimeout(() => {
            setConnectedSuccessfully(false);
          }, [2500]);
        } else {
          setShowConnectErrorModal(true);
          setConnectErrorMessage(resp.message);
        }
      })
      .catch((err) => {
        setShowConnectErrorModal(true);
        console.log(err);
      });
  };

  const handleGetNftDetail = (id) => {
    getRightAttachedNFT(id)
      .then((resp) => {
        if (resp.code === 0) {
          setData(resp);
          let conCollections = resp?.connected_collections?.map(
            (con) => con.id
          );
          setConnectedCollections(conCollections);
          getAllCollections(resp?.project_id);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleAutoFill = () => {
    let members = data.members.map((mem) => {
      return {
        user_id: mem.id,
        royalty: mem.royalty_percent,
      };
    });
    let formData = new FormData();
    formData.append('royalties', JSON.stringify(members));
    if (!ShowPercentError) {
      setIsAutoFillLoading(true);
      updateRoyalty(data?.lnft?.id, formData)
        .then((resp) => {
          if (resp.code === 0) {
            setIsAutoFillLoading(false);
            setRoyaltyUpdatedSuccessfully(true);
            setAutoAssign(false);
            setIsEdit(null);
            setShowRoyalityErrorModal(false);
            setShowRoyalityErrorMessage('');
          } else {
            setIsAutoFillLoading(false);
            setRoyaltyUpdatedSuccessfully(false);
            setShowRoyalityErrorModal(true);
            setShowRoyalityErrorMessage(resp.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsAutoFillLoading(false);
          setRoyaltyUpdatedSuccessfully(false);
        });
    }
  };

  const handleValueChange = (e, id) => {
    let values = {
      ...data,
      members: data.members.map((mem) => {
        if (id === mem.id) {
          return {
            ...mem,
            royalty_percent: parseInt(e.target.value),
          };
        }
        return mem;
      }),
    };

    let percent = values.members.reduce(
      (acc, val) => acc + val.royalty_percent,
      0
    );

    if (percent > 100) {
      setShowPercentError(true);
    } else {
      setShowPercentError(false);
    }

    setData(values);
  };

  async function collectionPublish() {
    setShowPublish(false);
    if (CollectionDetail.status === 'publishing') {
      setPublishStep(1);
      setShowDeployModal(true);
    } else {
      setShowDeployModal(true);
    }
  }
  const connectingCollection =
    selectedCollectionId &&
    Collections.find((col) => col.id === selectedCollectionId);
  return (
    <div
      className={`mt-3 ${
        IsLoading || IsConnectionLoading || IsAutoFillLoading ? 'loading' : ''
      }`}
    >
      {showPublish && (
        <NewPublishModal
          show={showPublish}
          handleClose={() => setShowPublish(false)}
          publish={collectionPublish}
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
      {isConfirmConnect && (
        <ConfirmationModal
          show={isConfirmConnect}
          handleClose={() => setIsConfirmConnect(false)}
          handleApply={submitConnection}
          message={`Do you want to connect to ${connectingCollection.name} collection?`}
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
      {ConnectedSuccessfully && (
        <SuccessModal
          show={ConnectedSuccessfully}
          handleClose={setConnectedSuccessfully}
          message='Collection Connected Successfully'
          btnText='Done'
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
          show={showErrorModal}
        />
      )}
      {showConnectErrorModal && (
        <ErrorModal
          title={'Failed to connect the Collection!'}
          message={`${connectErrorMessage}`}
          handleClose={() => {
            setShowConnectErrorModal(false);
            setConnectErrorMessage(null);
            setIsConfirmConnect(false);
          }}
          show={showConnectErrorModal}
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
          collectionId={collectionId}
          publishStep={publishStep}
        />
      )}
      <div
        className={`${styles.memberSection} bg-white rounded-[12px] p-6 flex`}
      >
        <img
          src={
            CollectionDetail &&
            CollectionDetail.assets &&
            CollectionDetail.assets[0]
              ? CollectionDetail.assets[0].path
              : ColImage
          }
          className='w-[160px] h-[160px] rounded-[12px]'
          alt='Collection'
        />
        <div className='ml-6 w-[600px]'>
          <h3 className='text-[26px] font-bold'>{CollectionDetail.name}</h3>
          <p className='text-textLight text-sm'>
            {CollectionDetail?.contract_address
              ? CollectionDetail?.contract_address
              : 'Smart Contract not released'}
            <i
              className={`fa-solid fa-copy ml-2 ${
                CollectionDetail?.contract_address
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed'
              }`}
              disabled={!CollectionDetail.contract_address}
              onClick={() =>
                copyToClipboard(CollectionDetail?.contract_address)
              }
            ></i>
            <span id='copied-message' className='hidden ml-2'>
              Copied !
            </span>
          </p>
          <h4 className='text-[18px] font-bold mt-4'>About the Collection</h4>
          <p className='text-[14px] text-[#5F6479]'>
            {CollectionDetail?.description}
          </p>
        </div>
        {CollectionDetail.is_owner && (
          <div className='ml-auto'>
            <Link to={`/collection-create/?id=${collectionId}`}>
              <button className='font-black outlined-button'>
                <span>Edit Collection</span>
              </button>
            </Link>
          </div>
        )}
      </div>
      {/* <h3 className='text-[28px] font-black'>Rights Attached NFT</h3>
      <p className='text-[14px] font-regular text-[#5F6479] mt-2'>
        Dashboard that you can control the royalties share.
      </p>
      <div className='flex items-center mt-3'>
        <p className='text-[16px] font-black'>Member 3/5</p>
        <button className='rounded-[4px] p-2 ml-3 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] text-[12px] font-bold'>
          Upgrade Plan
        </button>
      </div> */}
      {CollectionDetail.is_owner && IsNFTAvailable ? (
        <div className='w-[680px] mt-4'>
          <div className='flex items-end'>
            <div>
              <DropdownCreabo
                label='Connect Collection'
                value={selectedCollectionId}
                id='select-collection'
                defaultValue='Select Collection'
                handleChange={handleChange}
                options={Collections}
                connectedCollections={connectedCollections}
              />
            </div>
            <div className='ml-4'>
              <button
                onClick={handleConnectCollection}
                className='font-black outlined-button'
              >
                <span>Connect</span>
              </button>
            </div>
          </div>
          {isSubmitted && !selectedCollectionId && (
            <p className='text-red-500 text-[12px]'>
              Please select a collection to connect
            </p>
          )}
          <Link to='/collection-create'>
            <button className='w-fit rounded-[4px] p-2 mt-4 bg-primary-50 text-[12px] font-bold flex items-center w-[127px] justify-center'>
              <img src={CirclePlus} alt='Add' />{' '}
              <span className='ml-[6px] gradient-text'>Add Collection</span>
            </button>
          </Link>
        </div>
      ) : null}
      <div
        className={`bg-white mt-6 rounded-[12px] p-6 ${styles.memberSection}`}
      >
        <div className='flex justify-between pb-7 border-b-[1px] mb-6 border-[#E3DEEA]'>
          <h3 className='text-[18px] font-black'>Member List</h3>
          {ShowPercentError ? (
            <p className='text-red-400 text-[14px] mt-1'>
              Total percent of members should equal to or lesser than 100%
            </p>
          ) : null}
          {CollectionDetail?.is_owner && data?.members?.length ? (
            <div class='flex items-center justify-center'>
              <div class='form-check form-switch flex items-center'>
                <p class='text-[#303548] text-[12px] mr-5'>
                  Autofill Percentage
                </p>
                <input
                  class='form-check-input appearance-none w-9 rounded-full h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
                  type='checkbox'
                  checked={AutoAssign}
                  role='switch'
                  onChange={handleAutoAssign}
                />
              </div>
            </div>
          ) : null}
        </div>
        {CollectionDetail?.status !== 'published' ? (
          <p className='text-center mt-4'>
            There is no collaborator yet. Please publish your collection and you
            can start inviting members.
          </p>
        ) : null}
        {CollectionDetail?.status === 'published' && data?.members?.length ? (
          <MemberListTable
            list={data?.members}
            headers={TABLE_HEADERS}
            handlePublish={setShowPublish}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            handleValueChange={handleValueChange}
            handleAutoFill={handleAutoFill}
            isOwner={CollectionDetail?.is_owner}
          />
        ) : null}
        {CollectionDetail?.status === 'published' && !data?.members?.length ? (
          <p className='text-center mt-4'>
            There is no collaborator yet. Please start inviting members.
          </p>
        ) : null}
        {CollectionDetail.is_owner &&
        CollectionDetail.status !== 'published' ? (
          <div className='w-full'>
            <button
              className='block ml-auto contained-button'
              onClick={() => setShowPublish(true)}
            >
              Publish
            </button>
          </div>
        ) : null}
      </div>
      <div className='flex mb-8'>
        <div
          className={`bg-white mt-6 p-6 w-2/4 mr-2 rounded-[12px] ${styles.memberSection}`}
        >
          <h3 className='text-[18px] font-black'>Invite Contributor</h3>
          {data?.lnft?.invitation_code ? (
            <>
              <p className='text-[12px] text-[#5F6479] mb-6'>
                Invite anothe contributor to get the royalties by copy this link
                and ask the to claim the Right Attached NFT
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
                <p className='text-[12px] text-[#5F6479] mb-1'>
                  Invite with link
                </p>
                <div className='relative w-fit'>
                  <p
                    className='text-[16px] block py-[10px] pl-[15px] pr-[40px]  text-primary-900 bg-primary-50 w-full rounded-[12px]'
                    id='iframe'
                  >
                    Link:{' '}
                    <span className='font-black'>
                      {origin}/{data?.lnft?.invitation_code}
                    </span>
                  </p>
                  <div className='text-primary-900 absolute top-2 right-2'>
                    <i
                      className='fa fa-copy text-lg cursor-pointer'
                      onClick={() =>
                        copyToClipboardShare(
                          `${origin}/${data?.lnft?.invitation_code}`
                        )
                      }
                    ></i>
                  </div>
                  <p
                    id='copied-share-message'
                    className='hidden text-green-500 text-[14px] text-center'
                  >
                    Copied Successfully!
                  </p>
                </div>
              </div>
              <div>
                <p className='text-[12px] text-[#5F6479] mt-[46px] mb-1'>
                  Invite with
                </p>
                <div className='flex items-center'>
                  <FacebookShareButton
                    url={`${origin}/${data?.lnft?.invitation_code}`}
                    quote={'Right Attach NFT'}
                  >
                    <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center mr-2'>
                      <img src={FB} alt='facebook' />
                    </div>
                  </FacebookShareButton>
                  <TwitterShareButton
                    title='Right Attach NFT'
                    url={`${origin}/${data?.lnft?.invitation_code}`}
                  >
                    <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center mr-2'>
                      <img src={twitter} alt='twitter' />
                    </div>
                  </TwitterShareButton>
                  <RedditShareButton
                    title='Right Attach NFT'
                    url={`${origin}/${data?.lnft?.invitation_code}`}
                  >
                    <div className='cursor-pointer rounded-[4px] bg-primary-50 h-[44px] w-[44px] flex items-center justify-center mr-2'>
                      <img src={reddit} alt='reddit' />
                    </div>
                  </RedditShareButton>
                  {/* <div className='cursor-pointer rounded-[4px] bg-opacity-[0.1] bg-[#9A5AFF] h-[44px] w-[44px] flex items-center justify-center mr-2'>
                    <img src={instagram} alt='instagram' />
                  </div> */}
                </div>
              </div>
            </>
          ) : (
            <p className='text-center text-[#5F6479] mb-6'>
              Please publish your collection to view invitation link
            </p>
          )}
        </div>
        {data?.lnft?.asset?.path ? (
          <div
            className={`bg-white mt-6 p-6 w-2/4 ml-2 rounded-[12px] flex items-center justify-center flex-col ${styles.memberSection}`}
          >
            <h3 className='text-[18px] font-black'>Right Attached NFT</h3>
            <img
              src={data?.lnft?.asset?.path}
              alt='NFT'
              className='mt-5 h-[189px] w-[189px]'
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RoyalityManagement;
