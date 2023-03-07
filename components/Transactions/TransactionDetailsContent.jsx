import { useEffect, useState } from 'react';
import Eye from 'assets/images/hide-eye.svg';
import Image from 'next/image';
import Lines from 'assets/images/curved-lines.svg';
import { getCurrentNetworkId } from 'util/MetaMask';
import {
  getRoyalties,
  claimRoyalty,
  getUserRevenue,
} from 'services/User/userService';
import { useSelector } from 'react-redux';
import { getUserProjectListById } from 'services/project/projectService';
import { getUserCollections } from 'services/collection/collectionService';
import WithdrawModal from 'components/Collection/WithdrawModal';
import NetworkHandlerModal from 'components/Modals/NetworkHandlerModal';
import { toast } from 'react-toastify';
import LeavingSite from 'components/Project/Components/LeavingSite';
import ErrorModal from 'components/Modals/ErrorModal';
import { royaltyClaim } from 'components/Profile/royalty-claim';
import { createProvider } from 'util/smartcontract/provider';
import DAOList from './components/DAOList';
import CollectionList from './components/CollectionList';
import SplitterList from './components/SplitterList';
import Tabs from './components/Tabs';

const ITEMS = {
  dao: {
    headers: ['Network', 'Dao name', 'Treasury address', 'Value', 'Claim'],
  },
  collection: {
    headers: [
      'Network',
      'Collection name',
      'Contract address',
      'Value',
      'Claim',
    ],
  },
  royalty: {
    headers: [
      'Network',
      'Wallet Address',
      'Percentage',
      'Collection Name',
      'Value',
      'Claim',
    ],
  },
};

export default function TransactionDetailsContent({ query }) {
  const [values, setValues] = useState([
    {
      label: 'DAO Treasury',
      value: 0,
      key: 'dao',
    },
    {
      label: 'NFT collections',
      value: 0,
      key: 'collection',
    },
    {
      label: 'Splitter',
      value: 0,
      key: 'royalty',
    },
  ]);
  const [showPrice, setShowPrice] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dao');
  const [royaltyLoading, setRoyaltyLoading] = useState(false);
  const userinfo = useSelector((state) => state.user.userinfo);
  const [royaltiesList, setRoyaltiesList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showNetworkHandler, setShowNetworkHandler] = useState(false);
  const [collection, setCollection] = useState();
  const [totalValue, setTotalValue] = useState(0);
  const [selectedDAO, setSelectedDAO] = useState(null);
  const [showDAOClaim, setShowDAOClaim] = useState(false);
  const [royaltyErrormessage, setRoyaltyErrormessage] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [paginationDAO, setPaginationDAO] = useState([]);
  const [paginationCollection, setPaginationCollection] = useState([]);
  const [paginationSplitter, setPaginationSplitter] = useState([]);
  const provider = createProvider();

  useEffect(() => {
    setSelectedTab(query?.tab);
  }, [query?.tab]);

  useEffect(() => {
    if (userinfo?.id) {
      getUserRoyaltiesInfo(1);
      getProjectList(1);
      getCollectionList(1);
    }
  }, []);

  useEffect(() => {
    if (userinfo?.id) {
      onUserRevenueGet();
    }
  }, []);

  const handleDAOPageClick = (event) => {
    getProjectList(event.selected + 1);
  };

  const handleCollectionPageClick = (event) => {
    getUserRoyaltiesInfo(event.selected + 1);
  };

  const handleSplitterPageClick = (event) => {
    setRoyaltiesList(event.selected + 1);
  };

  const onUserRevenueGet = async () => {
    await getUserRevenue(userinfo?.id)
      .then((res) => {
        if (res?.code === 0) {
          const data = [
            {
              label: 'DAO Treasury',
              value: Number(res?.dao_holding_usd).toFixed(2),
              key: 'dao',
            },
            {
              label: 'NFT collections',
              value: Number(res?.collection_holding_usd).toFixed(2),
              key: 'collection',
            },
            {
              label: 'Splitter',
              value: Number(res?.splitter_holding_token).toFixed(4),
              key: 'royalty',
            },
          ];
          setValues(data);
          setTotalValue(
            Number(res.dao_holding_usd) + Number(res.collection_holding_usd)
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDAOClaim = (data) => {
    setSelectedDAO(data);
    setShowDAOClaim(true);
  };

  async function getProjectList(page = 1) {
    let payload = {
      id: userinfo?.id,
      page: page,
      perPage: 10,
    };
    await getUserProjectListById(payload)
      .then((e) => {
        if (e.data !== null) {
          let arr = Array.from(
            { length: Math.ceil(e?.total / e?.pageSize) },
            (v, k) => k + 1
          );
          setPaginationDAO(arr);
          setProjectList(e.data);
        }
      })
      .catch(() => {});
  }

  async function getCollectionList(page = 1) {
    const payload = {
      id: userinfo?.id,
      page: page,
      limit: 10,
    };
    await getUserCollections(payload)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          let arr = Array.from(
            { length: Math.ceil(e?.total / e?.pageSize) },
            (v, k) => k + 1
          );
          setPaginationCollection(arr);
          setCollectionList(e.data);
        }
      })
      .catch(() => {});
  }

  async function getUserRoyaltiesInfo(pageNumber) {
    setRoyaltyLoading(true);
    await getRoyalties(userinfo?.id, pageNumber)
      .then((res) => {
        if (res.code === 0 && res.royalties && res.royalties.length > 0) {
          res.royalties.forEach((element) => {
            element.isLoading = false;
          });
          setRoyaltiesList(res.royalties);
          if (res.total && res.total > 0) {
            let arr = Array.from(
              { length: Math.ceil(res?.total / res?.pageSize) },
              (v, k) => k + 1
            );
            setPaginationSplitter(arr);
          }
        } else if (res?.code === 4032) {
          dispatch(logout());
          router.push('/');
        }
      })
      .catch(() => {
        setRoyaltyLoading(false);
      });
    setRoyaltyLoading(false);
  }

  const handleWithdrawModel = async (e, list) => {
    e.preventDefault();
    let networkId = await getCurrentNetworkId();
    setCollection(list);
    if (Number(list?.blockchain) === networkId) {
      setShowWithdrawModal(true);
    } else {
      setShowNetworkHandler(true);
    }
  };

  function setRoyaltyData(royalty, type) {
    let royaltyList = [...royaltiesList];
    const royaltyIndex = royaltyList.findIndex(
      (item) => item.royalty_id === royalty?.royalty_id
    );
    const royaltyLocal = { ...royalty };
    if (type === 'loadingTrue') {
      royaltyLocal.isLoading = true;
    }
    if (type === 'claimButtonDisable') {
      royaltyLocal.earnable_amount = 0;
    }
    royaltyList[royaltyIndex] = royaltyLocal;
    setRoyaltiesList(royaltyList);
  }

  async function claimRoyaltyWithtnx(data) {
    const payload = {
      royalty_uid: data.id,
      transaction_hash: data.transaction_hash,
    };
    return await claimRoyalty(payload);
  }

  async function claimRoyaltyById(royalty) {
    let networkId = await getCurrentNetworkId();
    if (Number(royalty.blockchain) === networkId) {
      setRoyaltyData(royalty, 'loadingTrue');
      const payload = {
        royalty_uid: royalty.royalty_id,
      };
      let config = {};
      let hasConfig = false;
      await claimRoyalty(payload)
        .then((res) => {
          if (res.code === 0) {
            config = res.config;
            hasConfig = true;
          } else {
            setErrorModal(true);
            setRoyaltyErrormessage(res.message);
            setRoyaltyData(royalty, 'loadingFalse');
          }
        })
        .catch(() => {
          setErrorModal(true);
        });
      if (hasConfig) {
        const result = await royaltyClaim(provider, config);
        if (result) {
          const data = {
            id: royalty.royalty_id,
            transaction_hash: result,
          };
          await claimRoyaltyWithtnx(data).then((res) => {
            if (res.function.status === 'success') {
              setRoyaltyData(royalty, 'loadingFalse');
              setRoyaltyData(royalty, 'claimButtonDisable');
              toast.success(
                `Successfully claimed for  ${royalty.project_name}`
              );
            }
            if (res.function.status === 'failed') {
              setRoyaltyData(royalty, 'loadingFalse');
              toast.error(`Failed, ${res.function.message}`);
            }
          });
        }
      } else {
        // setErrorModal(true);
        // setRoyaltyErrormessage('no config found');
      }
    } else {
      setShowNetworkHandler(true);
    }
  }

  return (
    <div className='bg-[#e2ecf0] pt-[30px] md:min-h-[100vh]'>
      {showNetworkHandler && (
        <NetworkHandlerModal
          show={showNetworkHandler}
          handleClose={() => setShowNetworkHandler(false)}
          projectNetwork={collection?.blockchain}
        />
      )}
      {showWithdrawModal && (
        <WithdrawModal
          show={showWithdrawModal}
          handleClose={() => setShowWithdrawModal(false)}
          id={collection?.id}
          network={collection?.blockchain}
          price={collection?.summary?.holding_value}
          contractAddress={collection?.contract_address}
          type={collection?.type}
          getCollectionNewWorth={getCollectionList}
        />
      )}
      {showDAOClaim && (
        <LeavingSite
          network={selectedDAO?.blockchain}
          treasuryAddress={selectedDAO?.treasury_wallet}
          show={showDAOClaim}
          handleClose={() => setShowDAOClaim(false)}
        />
      )}
      {errorModal && (
        <ErrorModal
          title={'Royalty can not claim right now.'}
          royaltyErrormessage={royaltyErrormessage}
          handleClose={() => {
            setErrorModal(false);
            setRoyaltyErrormessage('');
          }}
          show={errorModal}
        />
      )}
      <div className='w-full px-4 pb-10 md:max-w-[1200px] mx-auto'>
        <div className='bg-[#fff] rounded-[16px] p-[25px] relative'>
          <div>
            <div className='flex items-center'>
              <p className='text-[14px] text-[#727E83] font-bold'>
                Estimated Balance
              </p>{' '}
              <Image
                src={Eye}
                alt='eye'
                className='ml-2 cursor-pointer'
                onClick={() => setShowPrice(!showPrice)}
              />
            </div>
            <div className='mt-[10px]'>
              <p className='text-[12px] text-[#59686D]'>
                DAO & NFT collection amount
              </p>
              <h1 className='text-[24px]'>
                ~ ${showPrice ? totalValue.toFixed(2) : ' **.** '} USD
              </h1>
            </div>
          </div>
          <Image src={Lines} alt='Lines' className='absolute top-0 right-0' />
        </div>
        <div
          className='mt-[32px] bg-[#fff] rounded-[16px] py-[25px]'
          style={{ boxShadow: '0px 16px 32px rgba(2, 17, 24, 0.08)' }}
        >
          <Tabs
            values={values}
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
          />
          {selectedTab === 'dao' ? (
            <DAOList
              projectList={projectList}
              items={ITEMS}
              selectedTab={selectedTab}
              handleDAOClaim={handleDAOClaim}
              paginationDAO={paginationDAO}
              handleDAOPageClick={handleDAOPageClick}
            />
          ) : selectedTab === 'collection' ? (
            <CollectionList
              collectionList={collectionList}
              items={ITEMS}
              selectedTab={selectedTab}
              handleWithdrawModel={handleWithdrawModel}
              handleCollectionPageClick={handleCollectionPageClick}
              paginationCollection={paginationCollection}
            />
          ) : (
            <SplitterList
              royaltiesList={royaltiesList}
              items={ITEMS}
              selectedTab={selectedTab}
              claimRoyaltyById={claimRoyaltyById}
              handleSplitterPageClick={handleSplitterPageClick}
              paginationSplitter={paginationSplitter}
            />
          )}
        </div>
      </div>
    </div>
  );
}
