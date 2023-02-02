import { useEffect, useRef, useState } from 'react';
import {
  getTokenGatedContentDetail,
  getUserAuthorization,
} from 'services/tokenGated/tokenGatedService';
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
  useEffect(() => {
    if (query?.id) {
      getContentDetail();
    }
  }, [query?.id]);

  const getContentAuth = (assetUrl) => {
    getUserAuthorization(assetUrl).then((resp) => {
      if (resp.code === 4000) {
        setShowError(true);
      } else {
        setShowError(false);
      }
    });
  };

  const getContentDetail = () => {
    getTokenGatedContentDetail(query?.id)
      .then(async (resp) => {
        if (resp.code === 0) {
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
        }
      })
      .catch((err) => console.log(err));
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
    router.back();
  };
  console.log(data);
  return (
    <>
      <div
        className='relative'
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${`${
            asset && data?.file_type === 'image' ? asset : null
          }`})`,
          height: 'calc(100vh - 71px)',
          width: '100%',
          backgroundColor: data?.file_type === 'audio' ? '#303548' : '',
        }}
      >
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
            {showPlay ? (
              <div
                onClick={handlePlayVideo}
                className='absolute top-[50%] left-[50%] cursor-pointer z-[99]'
              >
                <Image src={Play} alt='Play' />
              </div>
            ) : null}

            <video
              className='w-full h-[100vh] object-cover'
              controls={!showPlay}
              ref={videoRef}
            >
              <source src={asset} />
              Your browser does not support the video tag.
            </video>
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
                  <Link href='/list?type=collection&user=true'>
                    <button className='btn bg-white text-black rounded-[4px] p-2 mt-5'>
                      Go to Collection
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {data?.file_type === 'audio' ? (
                  <div className='h-[calc(100vh-200px)] flex items-center'>
                    <div className='w-full'>
                      <Waveform url={asset} id={data?.data} />
                    </div>
                  </div>
                ) : null}
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
    </>
  );
};

export default TokenGatedContentDetailContainer;
