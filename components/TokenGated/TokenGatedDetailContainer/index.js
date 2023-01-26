import { useEffect, useRef, useState } from 'react';
import { getTokenGatedContentDetail } from 'services/tokenGated/tokenGatedService';
import { ls_GetUserToken } from 'util/ApplicationStorage';
import LeftArrow from 'assets/images/arrow-left.svg';
import Image from 'next/image';
import Critical from 'assets/images/critical.svg';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Play from 'assets/images/play.svg';
const Waveform = dynamic(() => import('../public/components/card/Waveform'), {
  ssr: false,
});

const TokenGatedContentDetailContainer = ({ query }) => {
  const [data, setData] = useState(null);
  const [asset, setAsset] = useState(null);
  const router = useRouter();
  const videoRef = useRef(null);
  const [showPlay, setShowPlay] = useState(true);

  useEffect(() => {
    if (query?.id) {
      getContentDetail();
    }
  }, [query?.id]);

  const getContentDetail = () => {
    getTokenGatedContentDetail(query?.id)
      .then((resp) => {
        if (resp.code === 0) {
          let assetUrl = `${
            resp?.token_gate_content?.consumable_data
          }&token=${ls_GetUserToken()}`;
          setData(resp?.token_gate_content);
          setAsset(assetUrl);
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

  useEffect(() => {}, [videoRef?.current]);

  console.log(videoRef?.current);
  return (
    <div
      className='relative'
      style={{
        background: `url(${`${
          asset && data?.file_type === 'image' ? asset : null
        }`})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
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
            <Image
              src={Critical}
              className='ml-auto cursor-pointer'
              alt='Report'
            />
          </div>
          {showPlay ? (
            <div
              onClick={handlePlayVideo}
              className='absolute top-[50%] left-[50%] cursor-pointer z-[99]'
            >
              <Image src={Play} alt='Play' />
            </div>
          ) : null}

          <video className='w-full h-[100vh]' autoplay ref={videoRef}>
            <source src={asset} />
            Your browser does not support the video tag.
          </video>
        </>
      ) : (
        <>
          <div className='dark-shadow-bg'>
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
            <Image
              src={Critical}
              className='ml-auto cursor-pointer'
              alt='Report'
            />
          </div>
          <>
            {data?.file_type === 'audio' ? (
              <div className='h-[calc(100vh-200px)] flex items-center'>
                <div className='w-full'>
                  <Waveform url={asset} id={data?.data} />
                </div>
              </div>
            ) : null}
          </>
        </>
      )}
    </div>
  );
};

export default TokenGatedContentDetailContainer;
