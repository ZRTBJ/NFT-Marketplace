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
import { NETWORKS } from 'config/networks';
import { walletAddressTruncate } from 'util/WalletUtils';
import { getUserCollections } from 'services/collection/collectionService';
import WithdrawModal from 'components/Collection/WithdrawModal';
import NetworkHandlerModal from 'components/Modals/NetworkHandlerModal';
import { toast } from 'react-toastify';
import Link from 'next/link';
import LeavingSite from 'components/Project/Components/LeavingSite';
import ErrorModal from 'components/Modals/ErrorModal';
import { royaltyClaim } from '../royalty-claim';
import { createProvider } from 'util/smartcontract/provider';

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
  const [pagination, SetPagination] = useState([]);
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
  const [isLoading, setIsLoading] = useState(true);
  const [royaltyErrormessage, setRoyaltyErrormessage] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const provider = createProvider();

  useEffect(() => {
    setSelectedTab(query?.tab);
  }, [query?.tab]);

  // useEffect(() => {
  //   let total = values[0].value + values[1].value;
  //   setTotalValue(total);
  // }, [values]);

  useEffect(() => {
    if (userinfo?.id) {
      getUserRoyaltiesInfo(1);
      getProjectList();
      getCollectionList();
    }
  }, []);

  useEffect(() => {
    getProjectList();
  }, []);
  useEffect(() => {
    if (userinfo?.id) {
      onUserRevenueGet();
    }
  }, []);

  // useEffect(() => {
  //   handleSetValues();
  // }, [royaltiesList, collectionList]);

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

  async function getProjectList() {
    let payload = {
      id: userinfo?.id,
      page: 1,
      perPage: 10,
    };
    await getUserProjectListById(payload)
      .then((e) => {
        if (e.data !== null) {
          setProjectList(e.data);
        }
      })
      .catch(() => {});
  }

  async function getCollectionList() {
    const payload = {
      id: userinfo?.id,
      page: 1,
      limit: 10,
    };
    await getUserCollections(payload)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          setCollectionList(e.data);
        }
      })
      .catch(() => {});
  }

  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };

  const handleSetValues = () => {
    let total = royaltiesList?.reduce(
      (acc, net) => acc + net?.earnable_amount,
      0
    );

    let totalCollection = collectionList?.reduce(
      (acc, net) => acc + net?.summary?.holding_value_usd,
      0
    );

    let totalValues = values.map((value) => {
      if (value?.key === 'collection') {
        return {
          ...value,
          value: totalCollection,
        };
      }
      if (value?.key === 'royalty') {
        return {
          ...value,
          value: total,
        };
      }
      return value;
    });
    setValues(totalValues);
  };

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
            const page = calculatePageCount(5, res.total);
            const pageList = [];
            for (let index = 1; index <= page; index++) {
              pageList.push(index);
            }
            SetPagination(pageList);
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
      setIsLoading(true);
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
  console.log(royaltiesList);
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
          <div className='bg-[#E1ECF0] flex items-center rounded-[10px] w-[95%] md:w-[65%] mx-auto mb-4'>
            {values.map((value) => (
              <div
                key={value.key}
                className={`w-2/6 text-center m-1 rounded-[8px] cursor-pointer ${
                  value.key === selectedTab ? 'bg-[#fff]' : ''
                }`}
                onClick={() => setSelectedTab(value.key)}
              >
                <p className='font-bold text-[15px] md:text-[16px]'>
                  {value.label}
                </p>
                <p className='text-[12px] mt-[4px]'>
                  ~ {value?.key !== 'royalty' ? ' $' : ' '} {value.value}{' '}
                  {value?.key === 'royalty' ? ' Token' : ' USD'}
                </p>
              </div>
            ))}
          </div>
          {selectedTab === 'dao' ? (
            <div class='flex flex-col'>
              <div class='overflow-x-auto'>
                <div class='inline-block min-w-full py-2'>
                  <div class='overflow-hidden'>
                    <table class='min-w-full text-left text-sm font-light'>
                      <thead class='border-b font-medium border-[#B1C1C8]'>
                        <tr>
                          {ITEMS[selectedTab].headers.map((title, index) => (
                            <th
                              key={index}
                              scope='col'
                              class='px-6 py-4 text-[#727E83]'
                            >
                              {title}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {projectList.length
                          ? projectList.map((list) => (
                              <tr
                                class='border-b border-[#B1C1C8]'
                                key={list.id}
                              >
                                <td class='whitespace-nowrap px-6 py-4'>
                                  <Image
                                    src={NETWORKS?.[list?.blockchain]?.icon}
                                    alt='Eth'
                                    height={32}
                                    width={32}
                                  />
                                </td>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  {list?.name}
                                </td>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  {' '}
                                  {list?.treasury_wallet
                                    ? walletAddressTruncate(
                                        list.treasury_wallet
                                      )
                                    : '-'}
                                </td>
                                <td class='whitespace-nowrap px-6 py-4'>-</td>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  <button
                                    disabled={list?.status !== 'published'}
                                    onClick={() => handleDAOClaim(list)}
                                    className='text-[#2AD100] text-[12px] font-bold border-[#2AD100] border-[1px] rounded-[8px] h-[32px] w-[88px]'
                                  >
                                    Claim
                                  </button>
                                </td>
                              </tr>
                            ))
                          : null}
                      </tbody>
                    </table>
                    {!projectList.length ? (
                      <div className='flex items-center flex-col justify-center w-full h-[400px]'>
                        <h2 className='!text-[20px] text-center'>
                          Sorry Buddy, <br />
                          You don’t have any DAO group yet. 😢{' '}
                        </h2>
                        <p className='text-[16px] mt-1 mb-4'>
                          Let’s get start to create your DAO :{' '}
                        </p>
                        <Link href='/dao/create'>
                          <button className='contained-button-new text-[16px] w-[320px] mt-4'>
                            Create DAO
                          </button>
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : selectedTab === 'collection' ? (
            <div class='flex flex-col'>
              <div class='overflow-x-auto'>
                <div class='inline-block min-w-full py-2'>
                  <div class='overflow-hidden'>
                    <table class='min-w-full text-left text-sm font-light'>
                      <thead class='border-b font-medium border-[#B1C1C8]'>
                        <tr>
                          {ITEMS[selectedTab].headers.map((title, index) => (
                            <th
                              key={index}
                              scope='col'
                              class='px-6 py-4 text-[#727E83]'
                            >
                              {title}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {collectionList.length
                          ? collectionList.map((list, index) => (
                              <tr key={index} class='border-b border-[#B1C1C8]'>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  <Image
                                    src={NETWORKS?.[list?.blockchain]?.icon}
                                    alt='Eth'
                                    height={32}
                                    width={32}
                                  />
                                </td>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  {list?.name}
                                </td>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  {' '}
                                  {list?.contract_address
                                    ? walletAddressTruncate(
                                        list.contract_address
                                      )
                                    : '-'}
                                </td>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  ~$ {list?.summary?.holding_value_usd}
                                </td>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  <button
                                    disabled={
                                      list?.summary?.holding_value === 0
                                    }
                                    onClick={(e) =>
                                      handleWithdrawModel(e, list)
                                    }
                                    className='text-[#2AD100] text-[12px] font-bold border-[#2AD100] border-[1px] rounded-[8px] h-[32px] w-[88px]'
                                  >
                                    Claim
                                  </button>
                                </td>
                              </tr>
                            ))
                          : null}
                      </tbody>
                    </table>
                    {!collectionList.length ? (
                      <div className='flex items-center flex-col justify-center w-full h-[400px]'>
                        <h2 className='!text-[20px] text-center'>
                          Sorry Buddy, <br />
                          You don’t have any NFT Collection yet. 😢{' '}
                        </h2>
                        <p className='text-[16px] mt-1 mb-4'>
                          Let’s get start to create your collection :{' '}
                        </p>
                        <Link href='/collection/create'>
                          <button className='contained-button-new text-[16px] w-[320px] mt-4'>
                            Create collection
                          </button>
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div class='flex flex-col'>
              <div class='overflow-x-auto'>
                <div class='inline-block min-w-full py-2'>
                  <div class='overflow-hidden'>
                    <table class='min-w-full text-left text-sm font-light'>
                      <thead class='border-b font-medium border-[#B1C1C8]'>
                        <tr>
                          {ITEMS[selectedTab].headers.map((title, index) => (
                            <th
                              key={index}
                              scope='col'
                              class='px-6 py-4 text-[#727E83]'
                            >
                              {title}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {royaltiesList.length
                          ? royaltiesList.map((list, index) => (
                              <tr key={index} class='border-b border-[#B1C1C8]'>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  <Image
                                    src={NETWORKS?.[list?.blockchain]?.icon}
                                    alt='Eth'
                                    height={32}
                                    width={32}
                                  />
                                </td>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  {' '}
                                  {list?.royalty_address
                                    ? walletAddressTruncate(
                                        list.royalty_address
                                      )
                                    : '-'}
                                </td>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  {list?.royalty_percent}
                                </td>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  {list?.collection_name}
                                </td>

                                <td class='whitespace-nowrap px-6 py-4'>
                                  {list?.earnable_amount} Token
                                </td>
                                <td class='whitespace-nowrap px-6 py-4'>
                                  {list.isLoading ? (
                                    <div role='status' className=''>
                                      <svg
                                        aria-hidden='true'
                                        className=' w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-secondary-900'
                                        viewBox='0 0 100 101'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                      >
                                        <path
                                          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                          fill='currentColor'
                                        />
                                        <path
                                          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                          fill='currentFill'
                                        />
                                      </svg>
                                      <span className='sr-only'>
                                        Loading...
                                      </span>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        disabled={!list?.list?.earnable_amount}
                                        onClick={() => claimRoyaltyById(list)}
                                        className='text-[#2AD100] text-[12px] font-bold border-[#2AD100] border-[1px] rounded-[8px] h-[32px] w-[88px]'
                                      >
                                        Claim
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))
                          : null}
                      </tbody>
                    </table>
                    {!royaltiesList.length ? (
                      <div className='flex items-center flex-col justify-center w-full h-[400px]'>
                        <h2 className='!text-[20px] text-center'>
                          Sorry Buddy, <br />
                          You don’t have any Royalties yet. 😢{' '}
                        </h2>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
