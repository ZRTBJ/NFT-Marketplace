import Modal from '../../Modal';
import FileUploader from 'components/FileUploader';
import Template1 from 'assets/images/templates/ra-nft-1.svg';
import Template2 from 'assets/images/templates/ra-nft-2.svg';
import Template3 from 'assets/images/templates/ra-nft-3.svg';
import Template4 from 'assets/images/templates/ra-nft-4.svg';
import Template5 from 'assets/images/templates/ra-nft-5.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation } from 'swiper';
import styles from './style.module.css';
import { useState, useEffect } from 'react';
import { generateUploadkey } from 'services/nft/nftService';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Config from 'config';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationData } from 'Slice/notificationSlice';

const TEMPLATES = [
  { id: 0, image: Template1 },
  { id: 1, image: Template2 },
  { id: 2, image: Template3 },
  { id: 3, image: Template4 },
  { id: 4, image: Template5 },
];

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
    slidesPerView: 2,
    spaceBetween: 15,
  },
  1024: {
    slidesPerView: 4,
    spaceBetween: 15,
  },
  1536: {
    slidesPerView: 4,
    spaceBetween: 15,
  },
};

const CreateRightAttachedNFT = ({ handleClose, show }) => {
  const [Supply, setSupply] = useState(1);
  const [Asset, setAsset] = useState();
  const [AssetPreview, setAssetPreview] = useState('');
  const [StepReview, setStepReview] = useState(false);
  const [JobId, setJobId] = useState('');
  const projectDeploy = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );

  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const projectDeployStatus = projectDeploy.find(
      (x) => x.function_uuid === JobId
    );
    console.log(projectDeploy, JobId);
    if (projectDeployStatus && projectDeployStatus.data) {
      const data = JSON.parse(projectDeployStatus.data);
      console.log(data);
    }
  }, [projectDeploy]);

  const handleImage = (e) => {
    setAsset(e.target.files[0]);
    setAssetPreview(URL.createObjectURL(e.target.files[0]));
    if (e.target.files[0]) {
      generateKey();
    }
  };

  const generateKey = () => {
    const request = new FormData();
    request.append('project_uid', id);
    generateUploadkey(request)
      .then((resp) => handleUploadNFT(resp.key))
      .catch((err) => console.log(err));
  };

  const handleUploadNFT = (key) => {
    let headers;

    headers = {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
      key: key,
    };
    const request = new FormData();
    console.log(Asset);
    request.append('file', Asset);
    axios({
      method: 'POST',
      url: Config.FILE_SERVER_URL,
      data: request,
      headers: headers,
    })
      .then((response) => {
        console.log(response);
        setJobId(response['job_id']);
        const notificationData = {
          projectId: id,
          etherscan: '',
          function_uuid: response['job_id'],
          data: '',
        };
        dispatch(getNotificationData(notificationData));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(projectDeploy);

  return (
    <Modal width={650} show={show} handleClose={() => handleClose(false)}>
      <h3 className='text-[28px] font-black mb-5'>Upload Right attached NFT</h3>
      <FileUploader
        name='nft-asset'
        label={StepReview ? 'Images' : 'Upload Assets'}
        handleImage={handleImage}
        preview={AssetPreview}
      />
      {!StepReview && (
        <>
          <p className='text-[16px] font-bold'>Use Template</p>
          <div className='flex items-center overflow-x-auto mt-4'>
            <Swiper breakpoints={settings} className={styles.createSwiper}>
              <div>
                {TEMPLATES.map((template) => (
                  <SwiperSlide key={template.id} className={styles.daoCard}>
                    <img
                      src={template.image}
                      key={template.id}
                      alt='Template'
                      className='mr-4 w-[158px] h-[158px] rounded-[12px] object-cover'
                    />
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>
          </div>
        </>
      )}
      <div>
        <label
          htmlFor={'ra-nft-supply'}
          class='text-[14px] text-[#303548] font-bold outline-none mb-2'
        >
          Supply
        </label>
        {StepReview ? (
          <p className='text-[12px] text-[#303548]'>{Supply}</p>
        ) : (
          <input
            id={'ra-nft-supply'}
            type='number'
            value={Supply}
            onChange={(e) => setSupply(e.target.value)}
            class='w-full bg-secondary rounded-[6px] text-[12px] px-[10px] py-[14px] text-text-base'
          />
        )}
      </div>
      {StepReview ? (
        <button
          onClick={() => setStepReview(true)}
          className='bg-[#9A5AFF] text-[#fff] text-[14px] font-black w-full mt-6 rounded-[4px] py-2'
        >
          Submit
        </button>
      ) : (
        <button
          onClick={() => setStepReview(true)}
          className='bg-[#9A5AFF] text-[#fff] text-[14px] font-black w-full mt-6 rounded-[4px] py-2'
        >
          Next
        </button>
      )}
    </Modal>
  );
};

export default CreateRightAttachedNFT;
