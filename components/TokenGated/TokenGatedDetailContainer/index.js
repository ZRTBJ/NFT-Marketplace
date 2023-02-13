import { useEffect, useRef, useState } from 'react';
import {
  getTokenGatedContentDetail,
  getUserAuthorization,
} from 'services/tokenGated/tokenGatedService';
import { getCollectionByContractAddress } from 'services/collection/collectionService';
import { ls_GetUserToken } from 'util/ApplicationStorage';
import LeftArrow from 'assets/images/arrow-left.svg';
import Image from 'next/image';
import Critical from 'assets/images/critical.svg';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Play from 'assets/images/play.svg';
import RelatedContent from './RelatedContent';
import Left from 'assets/images/arr-left.svg';
import Locked from 'assets/images/locked.svg';
import Link from 'next/link';
import ReportModal from 'components/Commons/ReportModal/ReportModal';
import ErrorModal from 'components/Modals/ErrorModal';
const Waveform = dynamic(() => import('../public/components/card/Waveform'), {
  ssr: false,
});

const TokenGatedContentDetailContainer = ({ query }) => {
  const [data, setData] = useState(null);
  const [asset, setAsset] = useState(null);
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const videoRef = useRef(null);
  const [showPlay, setShowPlay] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [alreadyReported, setAlreadyReported] = useState(
    data?.is_scam_reported
  );
  const [showOverLayLoading, setShowOverLayLoading] = useState(true);
  const [collectionId, setCollectionId] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (query?.id) {
      getContentDetail();

      return () => {
        setData(null);
        setShowError(false);
        setAsset(null);
        setCollectionId('');
        setShowErrorModal(false);
        setErrorMessage('');
      };
    }
  }, [query?.id]);

  const getContentAuth = (assetUrl) => {
    getUserAuthorization(assetUrl)
      .then((resp) => {
        setShowOverLayLoading(false);
        if (resp?.code === 4000) {
          setShowError(true);
        } else {
          setShowError(false);
        }
      })
      .catch((er) => {
        console.log(er);
        setShowOverLayLoading(false);
        setShowError(true);
      });
  };

  const getCollectionDetails = (conAddress) => {
    getCollectionByContractAddress(conAddress).then((resp) => {
      console.log(resp);
      if (resp.code === 0) {
        let id = resp.data?.[0]?.id;
        setCollectionId(id);
      }
    });
  };

  const getContentDetail = () => {
    getTokenGatedContentDetail(query?.id)
      .then(async (resp) => {
        setShowOverLayLoading(false);
        if (resp.code === 0) {
          let conAddress =
            resp?.token_gate_content?.token_gate_configs?.[0]?.collection_ct;
          if (conAddress) {
            getCollectionDetails(conAddress);
          }
          if (resp?.token_gate_content?.consumable_data) {
            setShowError(false);
            let assetUrl = `${
              resp?.token_gate_content?.consumable_data
            }?token=${ls_GetUserToken()}`;
            await getContentAuth(assetUrl);
            setAsset(assetUrl);
            setData(resp?.token_gate_content);
          } else {
            setShowError(true);
          }
        } else {
          setShowErrorModal(true);
          setErrorMessage(resp?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
        setShowOverLayLoading(false);
      });
  };

  const handlePlayVideo = () => {
    if (videoRef?.current.paused) {
      videoRef.current.play();
      setShowPlay(false);
    } else {
      videoRef.current.pause();
      setShowPlay(true);
    }
  };

  const handleBack = () => {
    router.push(`/token-gated/public/${query.projectId}`);
  };

  return (
    <>
      {showOverLayLoading && <div className='loading'></div>}
      {!showOverLayLoading && (
        <>
          <div
            className='relative'
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundImage: `url(${`${
                asset && data?.file_type === 'image' ? asset : null
              }`})`,
              height: 'calc(100vh - 71px)',
              width: '100%',
              backgroundColor: '#303548',
            }}
          >
            {data?.file_type === 'other' ? (
              <div className='bg-[#303548] h-[calc(100vh-71px)]'>
                {' '}
                <div className='dark-shadow-bg absolute w-full z-[99]'>
                  <Image
                    src={LeftArrow}
                    className='cursor-pointer'
                    onClick={handleBack}
                    alt='Go back'
                  />
                  <div className='ml-6'>
                    <h3 className='font-[28px]'>{data?.title}</h3>
                    <p className='mt-2'>{data?.description}</p>
                  </div>
                  {!alreadyReported && (
                    <>
                      <Image
                        src={Critical}
                        className='ml-auto cursor-pointer'
                        alt='Report'
                        onClick={() => setShowReportModal(true)}
                      />
                    </>
                  )}
                </div>
                {showError ? (
                  <div className='flex items-center justify-center h-[calc(100vh-140px)] bg-black bg-opacity-[0.7]'>
                    <div className='text-center text-light flex items-center flex-col'>
                      <Image src={Locked} alt='Locked' />
                      <h3 className='font-[28px] mt-4 w-3/4'>
                        YOUR TOKEN ID DIDNT MATCH WITH THIS SPECIFIC CONTENT
                      </h3>
                      {collectionId ? (
                        <Link href={`/collection/${collectionId}`}>
                          <button className='btn bg-white text-black rounded-[4px] p-2 mt-5'>
                            Go to Collection
                          </button>
                        </Link>
                      ) : (
                        <h4 className='text-lg mt-4 font-bold'>
                          PLEASE CONTACT CREATOR
                        </h4>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
                      <a href={asset} target='_blank' rel='noreferrer'>
                        <button className='contained-button text-[28px]'>
                          Get Content
                        </button>
                      </a>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                {data?.file_type === 'movie' ? (
                  <>
                    <div className='dark-shadow-bg absolute w-full z-[99]'>
                      <Image
                        src={LeftArrow}
                        className='cursor-pointer'
                        onClick={handleBack}
                        alt='Go back'
                      />
                      <div className='ml-6'>
                        <h3 className='font-[28px]'>{data?.title}</h3>
                        <p className='mt-2'>{data?.description}</p>
                      </div>
                      {!alreadyReported && (
                        <>
                          <Image
                            src={Critical}
                            className='ml-auto cursor-pointer'
                            alt='Report'
                            onClick={() => setShowReportModal(true)}
                          />
                        </>
                      )}
                    </div>
                    {showError ? (
                      <div className='flex items-center justify-center h-[calc(100vh-140px)] bg-black bg-opacity-[0.7]'>
                        <div className='text-center text-light flex items-center flex-col'>
                          <Image src={Locked} alt='Locked' />
                          <h3 className='font-[28px] mt-4 w-3/4'>
                            YOUR TOKEN ID DIDNT MATCH WITH THIS SPECIFIC CONTENT
                          </h3>
                          {collectionId ? (
                            <Link href={`/collection/${collectionId}`}>
                              <button className='btn bg-white text-black rounded-[4px] p-2 mt-5'>
                                Go to Collection
                              </button>
                            </Link>
                          ) : (
                            <h4 className='text-lg mt-4 font-bold'>
                              PLEASE CONTACT CREATOR
                            </h4>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {showPlay ? (
                          <div
                            onClick={handlePlayVideo}
                            className='absolute top-[50%] left-[50%] cursor-pointer z-[99]'
                          >
                            <Image src={Play} alt='Play' />
                          </div>
                        ) : null}

                        <video
                          className='w-full h-[100vh] object-contain md:object-cover'
                          controls={!showPlay}
                          ref={videoRef}
                        >
                          <source src={asset} />
                          Your browser does not support the video tag.
                        </video>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div
                      className={`dark-shadow-bg ${
                        showError ? 'bg-black bg-opacity-[0.7]' : ''
                      }`}
                    >
                      <Image
                        src={LeftArrow}
                        className='cursor-pointer'
                        onClick={handleBack}
                        alt='Go back'
                      />
                      <div className='ml-6'>
                        <h3 className='font-[28px]'>{data?.title}</h3>
                        <p className='mt-2'>{data?.description}</p>
                      </div>
                      {!alreadyReported && (
                        <>
                          <Image
                            src={Critical}
                            className='ml-auto cursor-pointer'
                            alt='Report'
                            onClick={() => setShowReportModal(true)}
                          />
                        </>
                      )}
                    </div>
                    {showError ? (
                      <div className='flex items-center justify-center h-[calc(100vh-140px)] bg-black bg-opacity-[0.7]'>
                        <div className='text-center text-light flex items-center flex-col'>
                          <Image src={Locked} alt='Locked' />
                          <h3 className='font-[28px] mt-4 w-3/4'>
                            YOUR TOKEN ID DIDNT MATCH WITH THIS SPECIFIC CONTENT
                          </h3>
                          {collectionId ? (
                            <Link href={`/collection/${collectionId}`}>
                              <button className='btn bg-white text-black rounded-[4px] p-2 mt-5'>
                                Go to Collection
                              </button>
                            </Link>
                          ) : (
                            <h4 className='text-lg mt-4 font-bold'>
                              PLEASE CONTACT CREATOR
                            </h4>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {data?.file_type === 'audio' ? (
                          <div className='h-[calc(100vh-200px)] flex items-center'>
                            <div className='w-full z-0'>
                              <Waveform url={asset} id={data?.data} />
                            </div>
                          </div>
                        ) : null}
                      </>
                    )}
                  </>
                )}
              </>
            )}
            <div
              data-bs-toggle='offcanvas'
              data-bs-target='#offcanvasRight'
              aria-controls='offcanvasRight'
              className='cursor-pointer absolute top-[48%] right-0 w-[56px] h-[90px] bg-[#303548] flex items-center justify-center'
            >
              <Image src={Left} alt='Show' />
            </div>
          </div>
        </>
      )}
      <RelatedContent projectId={query?.projectId} />
      {showReportModal && (
        <ReportModal
          show={showReportModal}
          handleClose={() => setShowReportModal(false)}
          usedFor='Content'
          id={data?.id}
          onReported={() => setAlreadyReported(true)}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          show={showErrorModal}
          message={errorMessage}
          buttomText='Close'
          redirection={`/dashboard`}
        />
      )}
    </>
  );
};

export default TokenGatedContentDetailContainer;
