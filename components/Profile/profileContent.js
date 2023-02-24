/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import DefaultProjectLogo from 'assets/images/profile/defaultProjectLogo.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';
import { useSelector, useDispatch } from 'react-redux';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import DAOCard from 'components/Cards/DAOCard';
import styles from './style.module.css';
import { Navigation } from 'swiper';
import { getUserProjectListById } from 'services/project/projectService';
import {
  getUserInfo,
  getRoyalties,
  claimRoyalty,
} from 'services/User/userService';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SuccessModal from 'components/Modals/SuccessModal';
import { getUserCollections } from 'services/collection/collectionService';
import thumbIcon from 'assets/images/cover-default.svg';
import ErrorModal from 'components/Modals/ErrorModal';
import { walletAddressTruncate } from 'util/WalletUtils';
import { getMintedNftListByUserId } from 'services/nft/nftService';
import NFTListCard from 'components/Cards/NFTListCard';
import { royaltyClaim } from './royalty-claim';
import { createProvider } from 'util/smartcontract/provider';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import Spinner from 'components/Commons/Spinner';
import { NETWORKS } from 'config/networks';
import { ls_GetUserID } from 'util/ApplicationStorage';
import { getCurrentNetworkId } from 'util/MetaMask';
import NetworkHandlerModal from 'components/Modals/NetworkHandlerModal';
import Image from 'next/image';
import tokenGatedCreateIcon from 'assets/images/token-gated/createIcon.svg';
import nftSvg from 'assets/images/profile/nftSvg.svg';
import daoCreate from 'assets/images/profile/daoCreate.svg';
import CreateNFTModal from 'components/Project/CreateDAOandNFT/components/CreateNFTModal.jsx';
import emptyStateCommon from 'assets/images/profile/emptyStateCommon.svg';
import emptyStateRoyalty from 'assets/images/profile/emptyStateRoyalty.png';
import curvVector from 'assets/images/profile/curv1.png';
import Modal from 'components/Commons/Modal';
import CollectionCard from 'components/Cards/CollectionCard';
import { logout } from 'redux/auth';
import {
  createTokenGatedProject,
  getTokenGatedProjectList,
} from 'services/tokenGated/tokenGatedService';
import TokenGatedProjectCard from 'components/Cards/TokenGatedProjectCard';
import { event } from 'nextjs-google-analytics';
import NewUserProfileModal from './components/NewUserProfileModal';
import LandingPage from 'components/LandingPage/LandingPage';
import OnBoardingGuide from 'components/LandingPage/components/OnBoardingGuide';
import UserBasicInfo from './components/UserBasicInfo';
import BalanceInfo from './components/BalanceInfo';
import TokenGatedBannerCard from 'components/LandingPage/components/TokenGatedBannerCard';
import CreateNFTCard from 'components/LandingPage/components/CreateNFTCard';
import BuildDaoCard from 'components/LandingPage/components/BuildDaoCard';
const Profile = ({ id }) => {
  const dispatch = useDispatch();
  const provider = createProvider();
  SwiperCore.use([Autoplay]);
  const router = useRouter();

  // User general data start
  const [user, setUser] = useState({});

  const [royaltyLoading, setRoyaltyLoading] = useState(true);
  const [daoLoading, setDaoLoading] = useState(true);
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [nftLoading, setNftLoading] = useState(true);
  const [tokenGatedLoading, setTokenGatedLoading] = useState(true);
  const [royaltyEarned, setRoyaltyEarned] = useState({});
  const [sncList, setsncList] = useState([]);
  const socialLinks = [
    { title: 'linkInsta', icon: 'instagram', value: '' },
    { title: 'linkReddit', icon: 'reddit', value: '' },
    { title: 'linkTwitter', icon: 'twitter', value: '' },
    { title: 'linkFacebook', icon: 'facebook', value: '' },
    { title: 'webLink1', icon: 'link', value: '' },
  ];
  const [showNetworkHandler, setShowNetworkHandler] = useState(false);

  const [projectList, setProjectList] = useState([]);
  // project List End
  // Collection start
  const [collectionList, setCollectionList] = useState([]);
  // collection end
  // Royalties start

  const [royaltiesList, setRoyaltiesList] = useState([]);
  const [errorModal, setErrorModal] = useState(false);
  const [totalRoyality, setTotalRoyality] = useState(0);
  const [royaltyErrormessage, setRoyaltyErrormessage] = useState('');
  const [daoNetwork, setDAONetwork] = useState('');

  // Royalties End

  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const settings = {
    320: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 15,
    },
    1536: {
      slidesPerView: 5,
      spaceBetween: 15,
    },
  };

  const daosettings = {
    320: {
      slidesPerView: 2,
      spaceBetween: 100,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 100,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 100,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 100,
    },
    1536: {
      slidesPerView: 5,
      spaceBetween: 100,
    },
  };

  const [mintedNftList, setMintedNftList] = useState([]);
  const [nftErrorModalMessage, setNftErrorModalMessage] = useState('');
  const [nftErrorModal, setNftErrorModal] = useState(false);

  const [pagination, SetPagination] = useState([]);
  const [isActive, setIsactive] = useState(1);

  const [ShowCreateNFT, setShowCreateNFT] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [showOverlayLoading, setShowOverlayLoading] = useState(false);
  const [tokenGatedProjectList, setTokenGatedProjectList] = useState(true);
  const [balanceInfo, setBalanceInfo] = useState({
    dao_nft_splitter_amount: '0.00 USD',
    wallet_value: '0.00 USD',
    eoa: '0x317aec3033568ce240f069279c09754fb925b041',
    dao_treasury: '0.00 USD',
    nft_collection_treasury: '0.00 USD',
    royalties: 'N/A',
  });

  useEffect(() => {
    if (router?.query?.createNFT === 'true') {
      setShowCreateNFT(true);
    }
  }, [router?.query]);

  // function start
  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };

  async function userInfo() {
    await getUserInfo(id)
      .then((response) => {
        setUser(response?.user);
        setRoyaltyEarned(response?.royalty_earned);
        setWalletAddress(response?.user.eao);
        if (response?.user['web']) {
          try {
            const webs = JSON.parse(response.user['web']);
            const weblist = [...webs].map((e) => ({
              title: Object.keys(e)[0],
              url: Object.values(e)[0],
              value: Object.values(e)[0],
            }));
            const sociallinks = JSON.parse(response.user['social']);
            const sncs = [...sociallinks].map((e) => ({
              title: Object.keys(e)[0],
              url: Object.values(e)[0],
              value: Object.values(e)[0],
            }));
            setsncList(sncs.concat(weblist));
          } catch {
            setsncList([]);
          }
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  async function getUserRoyaltiesInfo(pageNumber) {
    setRoyaltyLoading(true);
    await getRoyalties(id, pageNumber)
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
  async function getProjectList() {
    let payload = {
      id: id,
      page: 1,
      perPage: 10,
    };
    await getUserProjectListById(payload)
      .then((e) => {
        if (e.data !== null) {
          setProjectList(e.data);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setDaoLoading(false);
      });
    setDaoLoading(false);
  }
  const handlePageClick = (event) => {
    setIsactive(event.selected + 1);
  };

  async function calculateTotalRoyalties() {
    const sum = royaltiesList
      .map((item) => item.earnable_amount)
      .reduce((prev, curr) => prev + curr, 0);
    setTotalRoyality(sum);
  }
  async function getCollectionList() {
    const payload = {
      id: id,
      page: 1,
      limit: 10,
    };
    await getUserCollections(payload)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          setCollectionList(e.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setCollectionLoading(false);
      });
    setCollectionLoading(false);
  }
  const truncateArray = (members) => {
    let slicedItems = members.slice(0, 3);
    return { slicedItems, restSize: members.length - slicedItems.length };
  };
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById('copied-message');
    copyEl.classList.toggle('hidden');
    setTimeout(() => {
      copyEl.classList.toggle('hidden');
    }, 2000);
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
    setDAONetwork(royalty.blockchain);
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
            setIsLoading(false);
            setErrorModal(true);
            setRoyaltyErrormessage(res.message);
            setRoyaltyData(royalty, 'loadingFalse');
          }
        })
        .catch(() => {
          setIsLoading(false);
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
        setErrorModal(true);
        setRoyaltyErrormessage('no config found');
      }
    } else {
      setShowNetworkHandler(true);
    }
  }
  async function getNftList() {
    const payload = {
      userId: id,
      page: 1,
      limit: 10,
    };
    await getMintedNftListByUserId(payload)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          e.data.forEach((element) => {
            element.loading = false;
          });

          setMintedNftList(e.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setNftLoading(false);
      });
    setNftLoading(false);
  }
  async function OnGetTokenGatedProjectList() {
    const payload = {
      userId: id,
      page: 1,
      limit: 10,
    };
    await getTokenGatedProjectList(payload)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          setTokenGatedProjectList(e.data);
          setIsLoading(false);
          setTokenGatedLoading(false);
        } else {
          setIsLoading(false);
          setTokenGatedLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setTokenGatedLoading(false);
      });
    setTokenGatedLoading(false);
  }

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
  const onCreateTokenGatedProject = async () => {
    event('create_token_gate_project', { category: 'token_gate' });
    setShowOverlayLoading(true);
    let title = `Unnamed Project ${new Date().toISOString()}`;
    await createTokenGatedProject(title)
      .then((res) => {
        setShowOverlayLoading(false);
        if (res.code === 0) {
          router.push(`/token-gated/${res?.token_gate_project?.id}`);
        } else {
          toast.error(`Failed, ${res?.message}`);
        }
      })
      .catch((err) => {
        console.log(err);
        setShowOverlayLoading(false);
      });
  };

  useEffect(() => {
    userInfo();
  }, [id]);
  useEffect(() => {
    setUser(user);
    setWalletAddress(user?.eao);
  }, [user]);
  useEffect(() => {
    if (id) {
      getUserRoyaltiesInfo(1);
    }
  }, []);
  useEffect(() => {
    getProjectList();
  }, [id]);
  useEffect(() => {
    getCollectionList();
  }, []);
  useEffect(() => {
    getNftList();
  }, [id]);
  useEffect(() => {
    OnGetTokenGatedProjectList();
  }, [id]);

  useEffect(() => {
    calculateTotalRoyalties();
  }, [royaltiesList]);
  useEffect(() => {
    getUserRoyaltiesInfo(isActive);
  }, [isActive]);

  return (
    <div className='bg-color-gray-light-300'>
      <>
        {!id && <LandingPage userId={id} />}
        {id && (
          <>
            <OnBoardingGuide />
            <div className='w-full px-4 my-10 md:max-w-[1100px] mx-auto'>
              <UserBasicInfo userInfo={user} sncList={sncList} />
              <BalanceInfo balanceInfo={balanceInfo} />

              {/* token gated start */}
              <div className='my-20'>
                {tokenGatedLoading ? (
                  <div className='text-center'>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    {tokenGatedProjectList.length > 0 ? (
                      <>
                        <div className='mb-5 flex  flex-wrap'>
                          <div className='flex flex-wrap items-center gap-4'>
                            <p className='text-[24px] text-txtblack font-black'>
                              Your Token Gated Project
                            </p>
                            <button
                              onClick={() => onCreateTokenGatedProject()}
                              className=' gradient-text-deep-pueple font-black border w-[160px] text-center h-[40px] rounded-lg border-secondary-900'
                            >
                              <i className=' mr-2 fa-solid fa-plus'></i>
                              Create New
                            </button>
                          </div>
                          <Link
                            href={`/list/?type=tokenGated&user=true`}
                            className='contained-button rounded ml-auto mt-2'
                          >
                            View All
                          </Link>
                        </div>
                        <Swiper
                          breakpoints={settings}
                          navigation={false}
                          modules={[Navigation]}
                          className={styles.createSwiper}
                        >
                          <div>
                            {tokenGatedProjectList.map(
                              (tokenGatedProject, index) => (
                                <div key={tokenGatedProject.id}>
                                  <SwiperSlide
                                    key={tokenGatedProject.id}
                                    className={styles.nftCard}
                                  >
                                    <TokenGatedProjectCard
                                      key={index}
                                      tokenGatedProject={tokenGatedProject}
                                    ></TokenGatedProjectCard>
                                  </SwiperSlide>
                                </div>
                              )
                            )}
                          </div>
                        </Swiper>
                      </>
                    ) : (
                      <TokenGatedBannerCard />
                    )}
                  </>
                )}
              </div>
              {/* token gated end */}

              {/* collection and dao start */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <CreateNFTCard size='lg' />
                </div>
                <div>
                  <BuildDaoCard size='lg' />
                </div>
              </div>
              {/* collection and dao end */}
            </div>
            <div className='container mx-auto'>
              <div className='mx-3 my-6 grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 '>
                <div
                  onClick={() => setShowCreateNFT(true)}
                  className=' cursor-pointer  p-3  rounded min-h-[72px] bg-primary-900/[0.10] border border-primary-900'
                >
                  <Image
                    src={nftSvg}
                    className='mb-1 min-h-[24px] w-[24px]'
                    width={24}
                    height={24}
                    alt=''
                  />
                  <span className='text-primary-900 font-black'>
                    Create New NFT
                  </span>
                </div>
                <div
                  onClick={() => router.push('/dao/create')}
                  className=' cursor-pointer min-h-[72px] p-3   rounded  bg-secondary-900/[0.10] border border-secondary-900'
                >
                  <Image
                    src={daoCreate}
                    className='mb-1 h-[24px] w-[24px]'
                    width={24}
                    height={24}
                    alt=''
                  />
                  <span className='text-secondary-900 font-black'>
                    Create New Dao
                  </span>
                </div>
                <div
                  onClick={() => onCreateTokenGatedProject()}
                  className=' cursor-pointer min-h-[72px] p-3   rounded  bg-danger-1/[0.10] border border-danger-1'
                >
                  <Image
                    src={tokenGatedCreateIcon}
                    className='mb-1 h-[24px] w-[24px]'
                    width={24}
                    height={24}
                    alt=''
                  />
                  <span className='text-danger-1 font-black'>
                    Create Token Gated Project
                  </span>
                </div>
              </div>
              {/* Royalties Table */}
              <div className=' mt-[20px] mx-3 mb-[36px] pt-[30px]  px-4  pb-[35px] bg-white-shade-900 rounded-xl'>
                <div className='flex  items-center mb-[24px]'>
                  <div className='text-[24px] text-txtblack font-black'>
                    Royalties
                  </div>
                  {/* <div className="ml-auto  text-[18px]">
                  <span className="text-txtblack mr-2 hidden  md:inline-block">
                    Total Royalties:
                  </span>
                  <span className="text-txtblack font-black">
                    {royaltiesList?.length > 0 ? totalRoyality : `0`}
                  </span>
                </div> */}
                </div>
                {/* table for desktop */}
                {royaltyLoading ? (
                  <div className='text-center'>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    {/* dekstop tabel */}
                    <div className='hidden md:block'>
                      {royaltiesList?.length > 0 ? (
                        <div>
                          <div className='overflow-x-auto relative mt-[54px]'>
                            <table className='w-full text-left'>
                              <thead>
                                <tr className='text-textSubtle text-[12px] '>
                                  <th scope='col' className='px-5'>
                                    Icon
                                  </th>
                                  <th scope='col' className='px-5'>
                                    DAO Name
                                  </th>
                                  <th scope='col' className='px-5'>
                                    Collection Name
                                  </th>
                                  <th scope='col' className='px-5'>
                                    Percentage
                                  </th>
                                  <th scope='col' className='px-5'>
                                    Role
                                  </th>
                                  <th scope='col' className='px-5'>
                                    Earnable Token
                                  </th>
                                  <th scope='col' className='px-5'>
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {royaltiesList.map((r, index) => (
                                  <tr
                                    key={r.royalty_id}
                                    className={`${
                                      index < royaltiesList.length - 1
                                        ? 'border-b'
                                        : ''
                                    } text-left text-txtblack text-[14px]`}
                                  >
                                    <td className='py-4 px-5'>
                                      <Image
                                        src={
                                          NETWORKS[Number(r.blockchain)]?.icon
                                        }
                                        className='h-[30px] w-[30px]  rounded-full'
                                        alt={DefaultProjectLogo}
                                        width={30}
                                        height={30}
                                      />
                                    </td>
                                    <td className='py-4 px-5 font-black '>
                                      <Link
                                        href={`/dao/${r.project_id}`}
                                        className='!no-underline'
                                      >
                                        {r.project_name}
                                      </Link>
                                    </td>
                                    <td className='py-4 px-5 font-black '>
                                      <Link
                                        href={`/collection/${r.collection_id}`}
                                        className='!no-underline'
                                      >
                                        {r.collection_name}
                                      </Link>
                                    </td>
                                    <td className='py-4 px-5'>
                                      {r.royalty_percent}%
                                    </td>
                                    <td
                                      className={`py-4 px-5  ${
                                        r.is_owner
                                          ? 'text-info-1'
                                          : ' text-success-1'
                                      }`}
                                    >
                                      {r.is_owner ? 'Owner' : 'Member'}
                                    </td>
                                    <td className='py-4 px-5'>
                                      {r.earnable_amount}
                                    </td>
                                    <td className='py-4 px-5'>
                                      {r.isLoading ? (
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
                                          {r.earnable_amount > 0 && (
                                            <button
                                              onClick={() =>
                                                claimRoyaltyById(r)
                                              }
                                              className='bg-primary-900/[.20] h-[32px] w-[57px] rounded text-primary-900'
                                            >
                                              Claim
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className='text-center'>
                          <Image
                            src={emptyStateRoyalty}
                            className='h-[249px] w-[373px] m-auto object-cover'
                            alt=''
                            width={373}
                            height={249}
                          />
                          <p className='text-subtitle font-bold'>
                            You don't have any Royalty yet
                          </p>
                        </div>
                      )}
                    </div>
                    {/* table for mobile */}
                    <div className='md:hidden'>
                      {royaltiesList?.length > 0 ? (
                        <div>
                          {royaltiesList.map((r, index) => (
                            <div
                              key={r.royalty_id}
                              className={`my-8 py-7  ${
                                index < royaltiesList.length - 1
                                  ? 'border-b'
                                  : ''
                              }`}
                            >
                              <div className={`flex   items-center mb-8 `}>
                                <div className={'flex  items-center'}>
                                  <Image
                                    src={NETWORKS[Number(r.blockchain)]?.icon}
                                    className='h-[34px] w-[34px] object-cover rounded-full'
                                    alt={DefaultProjectLogo}
                                    width={34}
                                    height={34}
                                  />
                                  <div className='mx-4 font-black '>
                                    <Link
                                      href={`/dao/${r.project_id}`}
                                      className='!no-underline'
                                    >
                                      {r.project_name}
                                    </Link>
                                  </div>
                                </div>
                                <div className='ml-auto'>
                                  {r.isLoading ? (
                                    <div role='status' className='mr-10'>
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
                                      {r.earnable_amount > 0 && (
                                        <button
                                          onClick={() => claimRoyaltyById(r)}
                                          className='bg-primary-900/[.20] h-[32px] w-[57px] rounded text-primary-900'
                                        >
                                          Claim
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className='flex justify-between items-center'>
                                <div>
                                  <div>Percentage</div>
                                  <div className='text-center'>
                                    {r.royalty_percent}%
                                  </div>
                                </div>
                                <div>
                                  <div>Role</div>
                                  <div
                                    className={`text-centre ${
                                      r.is_owner
                                        ? 'text-info-1'
                                        : ' text-success-1'
                                    }`}
                                  >
                                    {r.is_owner ? 'Owner' : 'Member'}
                                  </div>
                                </div>
                                <div>
                                  <div>Earnable Token</div>
                                  <div className='text-center'>
                                    {r.earnable_amount}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className='text-center '>
                          <Image
                            src={emptyStateRoyalty}
                            className='h-[210px] w-[315px] m-auto'
                            alt=''
                            height={210}
                            width={35}
                          />
                          <p className='text-subtitle font-bold'>
                            You don't have any Royalty yet
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {pagination.length > 0 && (
                  <>
                    <ReactPaginate
                      className='flex flex-wrap md:space-x-10 space-x-3 justify-center items-center my-6'
                      pageClassName='px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7 !text-txtblack '
                      breakLabel='...'
                      nextLabel='>'
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      pageCount={pagination.length}
                      previousLabel='<'
                      renderOnZeroPageCount={null}
                      activeClassName='text-primary-900 bg-primary-900 !no-underline'
                      activeLinkClassName='!text-txtblack !no-underline'
                    />
                  </>
                )}
              </div>

              {/* Dao */}
              <div className='mb-[50px]'>
                <div className='mb-5 flex px-4 flex-wrap'>
                  <div className='text-[24px] text-txtblack font-black'>
                    Your DAO
                  </div>
                  <Link
                    href={`/list/?type=dao&user=${id}`}
                    className='contained-button rounded ml-auto'
                  >
                    View All
                  </Link>
                </div>
                {daoLoading ? (
                  <div className='text-center'>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    {projectList?.length > 0 ? (
                      <Swiper
                        breakpoints={daosettings}
                        navigation={false}
                        modules={[Navigation]}
                        className={styles.createSwiper}
                      >
                        <div>
                          {projectList.map((item) => (
                            <div key={item.id}>
                              <SwiperSlide
                                key={item.id}
                                className={styles.daoCard}
                              >
                                <DAOCard item={item} key={item.id} />
                              </SwiperSlide>
                            </div>
                          ))}
                        </div>
                      </Swiper>
                    ) : (
                      <div className='text-center mt-6'>
                        <Image
                          src={emptyStateCommon}
                          className='h-[210px] w-[315px] m-auto'
                          alt=''
                          width={315}
                          height={210}
                        />
                        <p className='text-subtitle font-bold'>
                          You have no DAO Created
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              {/* collection */}
              <div className='mb-[50px]'>
                <div className='mb-5 flex px-4 flex-wrap'>
                  <div className='text-[24px] text-txtblack font-black'>
                    Your Collection
                  </div>
                  <Link
                    href={`/list/?type=collection&user=true`}
                    className='contained-button rounded ml-auto'
                  >
                    View All
                  </Link>
                </div>
                {collectionLoading ? (
                  <div className='text-center'>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    {collectionList.length > 0 ? (
                      <Swiper
                        breakpoints={settings}
                        navigation={false}
                        modules={[Navigation]}
                        className={styles.createSwiper}
                      >
                        <div>
                          {collectionList.map((collection, index) => (
                            <div key={collection.id}>
                              <SwiperSlide
                                key={collection.id}
                                className={styles.nftCard}
                              >
                                <CollectionCard
                                  key={index}
                                  collection={collection}
                                ></CollectionCard>
                              </SwiperSlide>
                            </div>
                          ))}
                        </div>
                      </Swiper>
                    ) : (
                      <div className='text-center mt-6 text-textSubtle'>
                        <Image
                          src={emptyStateCommon}
                          className='h-[210px] w-[315px] m-auto'
                          alt=''
                          width={315}
                          height={210}
                        />
                        <p className='text-subtitle font-bold'>
                          You have no Collection Created
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              {/* Nft */}
              <div className='mb-[50px]'>
                <div className='mb-5 flex px-4 flex-wrap'>
                  <div className='text-[24px] text-txtblack font-black'>
                    Minted NFT
                  </div>
                  <Link
                    href={`/list/?type=nft&user=${id}`}
                    className='contained-button rounded ml-auto'
                  >
                    View All
                  </Link>
                </div>

                {nftLoading ? (
                  <div className='text-center'>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    {mintedNftList.length > 0 ? (
                      <Swiper
                        breakpoints={settings}
                        navigation={false}
                        modules={[Navigation]}
                        className={styles.createSwiper}
                      >
                        <div>
                          {mintedNftList.map((nft) => (
                            <SwiperSlide
                              className={styles.nftCard}
                              key={`${nft.id}-${nft.token_id}`}
                            >
                              <NFTListCard nft={nft} />
                            </SwiperSlide>
                          ))}
                        </div>
                      </Swiper>
                    ) : (
                      <div className='text-center mt-6 text-textSubtle'>
                        <Image
                          src={emptyStateCommon}
                          className='h-[210px] w-[315px] m-auto'
                          alt=''
                          height={210}
                          width={315}
                        />
                        <p className='text-subtitle font-bold'>
                          You have no NFT minted
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </>
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          message='Successfully claimed royalty'
          subMessage=''
          buttonText='Close'
          redirection={`/dashboard`}
          showCloseIcon={true}
          handleClose={() => setShowSuccessModal(false)}
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
      {nftErrorModal && (
        <ErrorModal
          message={nftErrorModalMessage}
          buttonText={'Close'}
          handleClose={() => {
            setNftErrorModal(false);
            setNftErrorModalMessage('');
          }}
          show={nftErrorModal}
        />
      )}
      {ShowCreateNFT && (
        <CreateNFTModal
          show={ShowCreateNFT}
          handleClose={() => setShowCreateNFT(false)}
        />
      )}
      <NewUserProfileModal />
      {profileModal && (
        <Modal
          width={320}
          show={profileModal}
          handleClose={() => setProfileModal(false)}
          showCloseIcon={true}
        >
          <div className=' w-full h-full max-w-[270px] max-h-[270px]'>
            <Image
              onClick={() => setProfileModal(true)}
              src={user?.avatar === '' ? DefaultProfilePicture : user?.avatar}
              className='rounded-lg mt-[40px]  w-full h-full max-w-[270px] max-h-[270px] mx-auto block object-cover  cursor-pointer'
              alt={'profile'}
              height={270}
              width={270}
            />
          </div>
        </Modal>
      )}
      {showNetworkHandler && (
        <NetworkHandlerModal
          show={showNetworkHandler}
          handleClose={() => setShowNetworkHandler(false)}
          projectNetwork={daoNetwork}
        />
      )}
      {showOverlayLoading && <div className='loading'></div>}
    </div>
  );
};
export default Profile;
