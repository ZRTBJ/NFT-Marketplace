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
import SuccessModal from 'components/Modals/SuccessModal';
import { getUserCollectionSalesInformation } from 'services/User/userService';
import ErrorModal from 'components/Modals/ErrorModal';
import { getMintedNftListByUserId } from 'services/nft/nftService';
import NFTListCard from 'components/Cards/NFTListCard';
import { toast } from 'react-toastify';
import Spinner from 'components/Commons/Spinner';
import NetworkHandlerModal from 'components/Modals/NetworkHandlerModal';
import Image from 'next/image';

import CreateNFTModal from 'components/Project/CreateDAOandNFT/components/CreateNFTModal.jsx';
import emptyStateCommon from 'assets/images/profile/emptyStateCommon.svg';
import Modal from 'components/Commons/Modal';
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

const nftUseCase = {
  usedFor: 'NFTs',
  text: 'Here are a few ways your project can deploy NFT',
  steps: [
    {
      title: 'Membership NFT',
      description:
        'Offer personalized experiences through token-gated NFTs. Offer membership, design rewards, and create categories-based access services',
    },
    {
      title: 'PFP',
      description:
        'PFP NFT helps your brand build and engage your online community. It is a great tool for brand identity',
    },
    {
      title: 'Digital Fashion',
      description:
        'Design the next set of virtual fashion collectibles tailored to the increasing demands of the virtual world',
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
    },
    {
      title: 'Charity',
      description:
        'Create a DAO that caters to the needs of communities around the world. Support noble courses through the power of the collective.',
    },
    {
      title: 'Invest',
      description:
        'Invest in web3 startups and in physical assets through a DAO. Forge shared prosperity through mutual benefits',
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
  const [tokenGatedProjectList, setTokenGatedProjectList] = useState(true);
  const [balanceInfo, setBalanceInfo] = useState({
    dao_nft_splitter_amount: 0,
    dao_treasury: 0,
    nft_collection_treasury: 0,
    royalties: 0,
  });

  useEffect(() => {
    if (router?.query?.createNFT === 'true') {
      setShowCreateNFT(true);
    }
  }, [router?.query]);

  useEffect(() => {
    dispatch(getUserNotification());
  }, []);

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
  const onCreateTokenGatedProject = async () => {
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
    if (!ls_GetNewUser()) {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeModal = () => {
    setShowWelcome(false);
    ls_SetNewUser(true);
  };

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
            <OnBoardingGuide />
            <div className='w-full px-4 mt-10 pb-10 md:max-w-[1100px] mx-auto'>
              <UserBasicInfo userInfo={user} sncList={sncList} />
              <BalanceInfo balanceInfo={balanceInfo} userInfo={user} />
              <button
                className='outlined-button'
                onClick={() => setShowCreateSplitter(true)}
              >
                Create
              </button>
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
                    <CreateNFTCard size='lg' />
                  ) : (
                    <CollectionTable userId={id} tableData={collectionList} />
                  )}
                </div>
                <div>
                  {projectList?.length === 0 ? (
                    <BuildDaoCard size='lg' />
                  ) : (
                    <DaoTable userId={id} tableData={projectList} />
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
              {/* minted nft end */}

              <div className='px-4 my-10'>
                <UseCase data={nftUseCase} />
              </div>
              <div className='px-4 pb-10 '>
                <UseCase data={daoUseCase} />
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
      {showCreateSplitter && (
        <CreateSplitter
          show={showCreateSplitter}
          handleClose={setShowCreateSplitter}
        />
      )}
    </>
  );
};
export default Profile;
