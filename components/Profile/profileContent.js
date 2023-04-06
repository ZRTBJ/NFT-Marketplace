/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';
import { useSelector, useDispatch } from 'react-redux';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './style.module.css';
import { Navigation } from 'swiper';
import { getUserProjectListById } from 'services/project/projectService';
import { getUserInfo, getUserRevenue } from 'services/User/userService';
import { getUserNotification } from 'redux/user/action';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getUserCollectionSalesInformation } from 'services/User/userService';
import { getMintedNftListByUserId } from 'services/nft/nftService';
import NFTListCard from 'components/Cards/NFTListCard';
import { toast } from 'react-toastify';
import Spinner from 'components/Commons/Spinner';
import NetworkHandlerModal from 'components/Modals/NetworkHandlerModal';
import Image from 'next/image';

import CreateNFTModal from 'components/Project/CreateDAOandNFT/components/CreateNFTModal.jsx';
import emptyStateCommon from 'assets/images/profile/emptyStateCommon.svg';
import Modal from 'components/Commons/Modal';
import charity from 'assets/images/profile/charity.png';
import dao from 'assets/images/profile/dao.png';
import fashion from 'assets/images/profile/fashion.png';
import invest from 'assets/images/profile/invest.png';
import membership from 'assets/images/profile/membership.png';
import pfp from 'assets/images/profile/pfp.png';

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
import CollectionTable from './components/CollectionTable';
import DaoTable from './components/DaoTable';
import UseCase from 'components/LandingPage/components/UseCase';
import WelcomeModal from 'components/Commons/WelcomeModal/WelcomeModal';
import { ls_SetNewUser, ls_GetNewUser } from 'util/ApplicationStorage';
import TagManager from 'react-gtm-module';
import CreateSplitter from './components/CreateSplitter';
import SplitterBanner from 'components/LandingPage/components/SplitterBanner';
import { getSplitterList } from 'services/collection/collectionService';
import ReactPaginate from 'react-paginate';
import SplitterTable from './components/SplitterTable';
import { NETWORKS } from 'config/networks';
import { getCurrentNetworkId } from 'util/MetaMask';
import NetworkSwitchModal from 'components/Commons/NetworkSwitchModal/NetworkSwitchModal';
import { el } from 'date-fns/locale';

const nftUseCase = {
  usedFor: 'NFTs',
  text: 'Here are a few ways your project can deploy NFT',
  steps: [
    {
      title: 'Membership NFT',
      description:
        'Offer personalized experiences through token-gated NFTs. Offer membership, design rewards, and create categories-based access services',
      img: membership,
      url: 'https://decir.io/decir-users-to-web3-asset-owners/',
    },
    {
      title: 'PFP',
      description:
        'PFP NFT helps your brand to build and engage your online community. It is a great tool for brand identity',
      img: pfp,
      url: 'https://decir.io/what-are-pfp-nfts-used-for/',
    },
    {
      title: 'Digital Fashion',
      description:
        'Design the next set of virtual fashion collectibles tailored to the increasing demands of the virtual world',
      img: fashion,
      url: 'https://decir.io/introduction-of-nft-in-digital-fashion/',
    },
  ],
};
const daoUseCase = {
  usedFor: 'a DAO',
  text: 'DAOs can be made to serve specific purposes. What’s yours?',
  steps: [
    {
      title: 'Build',
      description:
        'Build web3 projects to create diverse income streams for your members through the power of the DAO',
      img: dao,
      url: 'https://decir.io/decir-no-code-dao-tool/',
    },
    {
      title: 'Charity',
      description:
        'Create a DAO that caters to the needs of communities around the world. Support noble courses through the power of the collective.',
      img: charity,
      url: 'https://decir.io/decir-token-gated-dao-communities/',
    },
    {
      title: 'Invest',
      description:
        'Invest in web3 startups and in physical assets through a DAO. Forge shared prosperity through mutual benefits',
      img: invest,
      url: 'https://decir.io/decir-for-web3-project-fundraising/',
    },
  ],
};

const Profile = ({ id }) => {
  const dispatch = useDispatch();

  SwiperCore.use([Autoplay]);
  const router = useRouter();

  // User general data start
  const [user, setUser] = useState({});

  const [daoLoading, setDaoLoading] = useState(true);
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [nftLoading, setNftLoading] = useState(true);
  const [tokenGatedLoading, setTokenGatedLoading] = useState(true);
  const [royaltyEarned, setRoyaltyEarned] = useState({});
  const [sncList, setsncList] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
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

  const [daoNetwork, setDAONetwork] = useState('');

  // Royalties End

  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);
  const [showCreateSplitter, setShowCreateSplitter] = useState(false);
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
  const [mintedNftList, setMintedNftList] = useState([]);
  const [ShowCreateNFT, setShowCreateNFT] = useState(false);
  const [showOverlayLoading, setShowOverlayLoading] = useState(false);
  const [tokenGatedProjectList, setTokenGatedProjectList] = useState([]);
  const [balanceInfo, setBalanceInfo] = useState({
    dao_nft_splitter_amount: 0,
    dao_treasury: 0,
    nft_collection_treasury: 0,
    royalties: 0,
  });

  // splitter start
  const [pagination, setPagination] = useState([]);
  const [splitterPage, setSplitterPage] = useState(1);
  const [splitterList, setSplitterList] = useState([]);
  const [isSplitterLoading, setIsSplitterLoading] = useState(true);
  const [isEditSplitter, setIsEditSplitter] = useState(null);
  const [switchNetwork, setSwitchNetwork] = useState(false);

  useEffect(() => {
    userInfo();
  }, [id]);
  useEffect(() => {
    setUser(user);
    setWalletAddress(user?.eao);
  }, [user]);
  useEffect(() => {
    if (id) {
      onUserRevenueGet();
    }
  }, [id]);
  useEffect(() => {
    getProjectList();
    getCollectionList();
  }, [id]);

  useEffect(() => {
    getNftList();
  }, [id]);
  useEffect(() => {
    OnGetTokenGatedProjectList();
  }, [id]);
  useEffect(() => {
    if (!ls_GetNewUser()) {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, []);
  useEffect(() => {
    if (id) {
      onGetSplitterList();
    }
  }, [splitterPage, id]);
  useEffect(() => {
    if (router?.query?.createNFT === 'true') {
      setShowCreateNFT(true);
    }
  }, [router?.query]);
  useEffect(() => {
    dispatch(getUserNotification());
  }, [id]);

  // function start
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
  async function getProjectList() {
    let payload = {
      id: id,
      page: 1,
      perPage: 5,
    };
    await getUserProjectListById(payload)
      .then((e) => {
        if (e.data !== null) {
          setProjectList(e.data);
        } else {
          setIsLoading(false);
          setProjectList([]);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setDaoLoading(false);
      });
    setDaoLoading(false);
  }
  async function getCollectionList() {
    const payload = {
      id: id,
      page: 1,
      limit: 5,
      order_by: 'newer',
    };
    await getUserCollectionSalesInformation(payload)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          setCollectionList(e.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setCollectionList([]);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setCollectionLoading(false);
      });
    setCollectionLoading(false);
  }
  async function getNftList() {
    const payload = {
      userId: id,
      page: 1,
      limit: 10,
    };
    await getMintedNftListByUserId(payload)
      .then((e) => {
        if (e?.code === 0 && e?.data !== null) {
          setMintedNftList(e.data);
          setIsLoading(false);
          setNftLoading(false);
        } else {
          setIsLoading(false);
          setNftLoading(false);
          setMintedNftList([]);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setNftLoading(false);
      });
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
          setTokenGatedProjectList([]);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setTokenGatedLoading(false);
      });
    setTokenGatedLoading(false);
  }
  const onCreateTokenGatedProject = async () => {
    let currentNetwork = await getCurrentNetworkId();
    if (NETWORKS?.[currentNetwork]) {
      setSwitchNetwork(false);
      event('create_token_gate_project', { category: 'token_gate' });
      TagManager.dataLayer({
        dataLayer: {
          event: 'click_event',
          category: 'token_gate',
          pageTitle: 'create_token_gate_project',
        },
      });
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
    } else {
      setSwitchNetwork(true);
    }
  };
  const onUserRevenueGet = async () => {
    await getUserRevenue(id)
      .then((res) => {
        if (res?.code === 0) {
          const data = {
            nft_collection_treasury: Number(res?.collection_holding_usd),
            dao_treasury: Number(res?.dao_holding_usd),
            royalties: Number(res?.splitter_holding_token),
            dao_nft_splitter_amount:
              Number(res?.collection_holding_usd) +
              Number(res?.dao_holding_usd),
          };
          setBalanceInfo(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onGetSplitterList = async () => {
    setIsSplitterLoading(true);
    await getSplitterList(splitterPage)
      .then((res) => {
        setIsSplitterLoading(false);
        if (res?.total && res?.total > 0) {
          setSplitterList(res?.splitters);
          const page = calculatePageCount(5, res?.total);
          const pageList = [];
          for (let index = 1; index <= page; index++) {
            pageList.push(index);
          }
          setPagination(pageList);
        } else {
          setSplitterList([]);
        }
      })
      .catch((res) => {
        setIsSplitterLoading(false);
      });
  };
  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };
  const handlePageClick = (event) => {
    setSplitterPage(event.selected + 1);
  };
  const handleWelcomeModal = () => {
    setShowWelcome(false);
    ls_SetNewUser(true);
  };
  const onSplitterModalClose = async () => {
    if (showCreateSplitter) {
      setShowCreateSplitter(false);
    } else if (isEditSplitter) setIsEditSplitter(false);
    await onGetSplitterList();
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
      onUserRevenueGet();
    }
  }, []);
  useEffect(() => {
    if (id) {
      getProjectList();
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      getCollectionList();
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      getNftList();
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      OnGetTokenGatedProjectList();
    }
  }, [id]);
  useEffect(() => {
    if (!ls_GetNewUser()) {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, []);
  useEffect(() => {
    if (id) {
      onGetSplitterList();
    }
  }, [splitterPage]);
  useEffect(() => {
    if (router?.query?.createNFT === 'true') {
      setShowCreateNFT(true);
    }
  }, [router?.query]);
  useEffect(() => {
    dispatch(getUserNotification());
  }, []);

  return (
    <>
      <div className='bg-color-gray-light-300'>
        {!id && (
          <LandingPage
            userId={id}
            setShowCreateSplitter={setShowCreateSplitter}
          />
        )}
        {id && (
          <>
            <OnBoardingGuide setSwitchNetwork={setSwitchNetwork} />
            <div className='w-full px-4 mt-10 pb-10 md:max-w-[1100px] mx-auto'>
              <UserBasicInfo userInfo={user} sncList={sncList} />
              <BalanceInfo balanceInfo={balanceInfo} userInfo={user} />
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
                            href={`/list?type=tokenGated&user=true`}
                            className='contained-button rounded ml-auto mt-2'
                          >
                            View All
                          </Link>
                        </div>
                        <Swiper className={styles.createSwiper}>
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
                      <>
                        <TokenGatedBannerCard />
                      </>
                    )}
                  </>
                )}
              </div>
              {/* token gated end */}

              {/* collection and dao start */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  {collectionList?.length === 0 ? (
                    <CreateNFTCard
                      size='lg'
                      setSwitchNetwork={setSwitchNetwork}
                    />
                  ) : (
                    <CollectionTable
                      userId={id}
                      tableData={collectionList}
                      setSwitchNetwork={setSwitchNetwork}
                    />
                  )}
                </div>
                <div>
                  {projectList?.length === 0 ? (
                    <BuildDaoCard
                      size='lg'
                      setSwitchNetwork={setSwitchNetwork}
                    />
                  ) : (
                    <DaoTable
                      userId={id}
                      tableData={projectList}
                      setSwitchNetwork={setSwitchNetwork}
                    />
                  )}
                </div>
              </div>
              {/* collection and dao end */}

              {/* minted NFT start */}
              <div className='mt-[50px]'>
                <div className='mb-5 flex  flex-wrap'>
                  <div className='text-[24px] text-txtblack font-black'>
                    Minted NFT
                  </div>
                  <Link
                    href={`/list?type=nft&user=true`}
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
                      <Swiper id='nft' className={styles.createSwiper}>
                        <div>
                          {mintedNftList.map((nft, index) => (
                            <div key={index}>
                              <SwiperSlide
                                key={index}
                                className={styles.nftCard}
                              >
                                <NFTListCard
                                  nft={nft}
                                  key={index}
                                ></NFTListCard>
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
              {/* minted nft end */}

              <div className='px-4 my-10'>
                <UseCase data={nftUseCase} />
              </div>
              <div className='px-4 my-10 '>
                <UseCase data={daoUseCase} />
              </div>
              {/* splitter start */}
              <div className='px-4 pb-10'>
                {splitterList?.length === 0 ? (
                  <SplitterBanner
                    setSwitchNetwork={setSwitchNetwork}
                    setShowCreateSplitter={setShowCreateSplitter}
                  />
                ) : (
                  <div>
                    <SplitterTable
                      setSwitchNetwork={setSwitchNetwork}
                      data={splitterList}
                      isLoading={isSplitterLoading}
                      setIsEditSplitter={setIsEditSplitter}
                      setShowCreateSplitter={setShowCreateSplitter}
                    ></SplitterTable>
                    {pagination.length > 0 && (
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
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {ShowCreateNFT && (
        <CreateNFTModal
          show={ShowCreateNFT}
          handleClose={() => setShowCreateNFT(false)}
        />
      )}
      <NewUserProfileModal />
      {showNetworkHandler && (
        <NetworkHandlerModal
          show={showNetworkHandler}
          handleClose={() => setShowNetworkHandler(false)}
          projectNetwork={daoNetwork}
        />
      )}
      {showOverlayLoading && <div className='loading'></div>}
      {showWelcome && (
        <WelcomeModal show={showWelcome} handleClose={handleWelcomeModal} />
      )}
      {(showCreateSplitter || isEditSplitter) && (
        <CreateSplitter
          show={showCreateSplitter || isEditSplitter}
          handleClose={() => onSplitterModalClose()}
          splitterId={isEditSplitter}
          onGetSplitterList={onGetSplitterList}
        />
      )}
      {switchNetwork && (
        <NetworkSwitchModal
          show={switchNetwork}
          handleClose={() => setSwitchNetwork(false)}
        />
      )}
    </>
  );
};
export default Profile;
