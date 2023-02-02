import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import {
  getTokenGatedProject,
  createTokenGatedProject,
  updateTokenGatedProject,
} from 'services/tokenGated/tokenGatedService';
import Modal from 'components/Commons/Modal';
import Spinner from 'components/Commons/Spinner';
import SuccessModal from 'components/Modals/SuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';
import FileDragAndDrop from 'components/FormUtility/FileDragAndDrop';
import Image from 'next/image';
import deleteIcon from 'assets/images/projectCreate/ico_delete01.svg';
export default function Setting({
  show,
  handleClose,
  projectInfo,
  createMode,
  settingSaved,
}) {
  const links = [
    { title: 'linkInsta', icon: 'instagram', value: '' },
    { title: 'linkGithub', icon: 'github', value: '' },
    { title: 'linkTwitter', icon: 'twitter', value: '' },
    { title: 'linkFacebook', icon: 'facebook', value: '' },
    { title: 'customLinks1', icon: 'link', value: '' },
  ];
  const form = {
    title: '',
    headline: '',
    description: '',
    links: links,
    cover: '',
  };
  const [project, setProject] = useState(createMode ? form : projectInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [coverPhoto, setCoverPhoto] = useState({
    image: null,
    path: projectInfo?.coverUrl ? projectInfo?.coverUrl : '',
  });
  const [projectPhoto, setProjectPhoto] = useState({
    image: null,
    path: projectInfo?.photoUrl ? projectInfo?.photoUrl : '',
  });
  const [projectId, setProjectId] = useState(
    projectInfo?.id ? projectInfo?.id : ''
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onDescriptionChange = (text) => {
    let oldProject = { ...project };
    oldProject.description = text;
    setProject(oldProject);
  };
  function onSocialLinkChange(url, index) {
    let oldProject = { ...project };
    oldProject.links[index].value = url;
    setProject(oldProject);
  }
  async function coverPhotoSelect(params) {
    if (params.length > 0) {
      setCoverPhoto({
        image: params[0],
        path: URL.createObjectURL(params[0]),
      });
    }
  }
  async function projectPhotoSelect(params) {
    if (params.length > 0) {
      setProjectPhoto({
        image: params[0],
        path: URL.createObjectURL(params[0]),
      });
    }
  }
  function removeCoverPhoto() {
    setCoverPhoto({ image: null, path: '' });
  }
  function removeProjectPhoto() {
    setProjectPhoto({ image: null, path: '' });
  }
  const onSubmit = async (data) => {
    let payload = {
      title: data['title'],
      headline: data['headline'],
      description: data['description'],
      image_1: projectPhoto.image ? projectPhoto.image : null,
      cover: coverPhoto.image ? coverPhoto.image : null,
      links: JSON.stringify(project?.links),
    };
    setIsLoading(true);

    // create and then  update
    if (createMode) {
      let projectId = '';
      await createTokenGatedProject(data['title'])
        .then((res) => {
          if (res.code === 0) {
            projectId = res?.token_gate_project?.id;
            setProjectId(projectId);
          } else {
            setIsLoading(false);
            setStep(2);
            setShowErrorModal(true);
            setErrorMessage(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setStep(2);
          setShowErrorModal(true);
          setErrorMessage(err);
        });
      if (projectId !== '') {
        payload.id = projectId;
        await updateTokenGatedProject(payload)
          .then((res) => {
            if (res.code === 0) {
              setIsLoading(false);
              setStep(2);
              setShowSuccessModal(true);
            } else {
              setIsLoading(false);
              setStep(2);
              setShowErrorModal(true);
              setErrorMessage(res.message);
            }
          })
          .catch((err) => {
            setIsLoading(false);
            setStep(2);
            setShowErrorModal(true);
            setErrorMessage(err);
          });
      }
    }
    // only  update
    else {
      payload.id = projectInfo?.id;
      await updateTokenGatedProject(payload)
        .then((res) => {
          if (res.code === 0) {
            setIsLoading(false);
            setStep(2);
            setShowSuccessModal(true);
          } else {
            setIsLoading(false);
            setStep(2);
            setShowErrorModal(true);
            setErrorMessage(res.message);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          setStep(2);
          setShowErrorModal(true);
          setErrorMessage(err);
        });
    }
  };
  const onSuccess = () => {
    setShowSuccessModal(false);
    setStep(1);
    handleClose(false);
    settingSaved(projectId);
  };
  const onError = () => {
    setShowErrorModal(false);
    setErrorMessage('');
    setStep(1);
  };

  return (
    <>
      {step === 1 && (
        <>
          <Modal
            width={564}
            show={show}
            handleClose={() => handleClose()}
            showCloseIcon={true}
            overflow={'auto'}
            id='token-gated-project-setting-modal'
          >
            <form
              id='token-gated-project-setting'
              name='tokenGatedSettingForm'
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className='px-4 md:px-10  mt-5'>
                <p className='font-black text-txtblack text-[22px] mb-4'>
                  Project Settings
                </p>

                {/* photo */}
                <div className='mb-6'>
                  <div className='label-grey mb-2'>Add project photo</div>
                  {projectPhoto && projectPhoto.path.length < 1 ? (
                    <div className='w-full md:max-w-[186px]'>
                      <FileDragAndDrop
                        maxFiles={1}
                        height='160px'
                        onDrop={(e) => projectPhotoSelect(e)}
                        sizePlaceholder='1300X600'
                        maxSize={4000000}
                      />
                    </div>
                  ) : (
                    <div className='relative w-[180px] h-[180px] '>
                      <Image
                        className='coverPreview block w-[180px] h-[180px] rounded-xl object-cover'
                        src={projectPhoto.path}
                        alt="user's cover picture"
                        width={200}
                        height={230}
                        unoptimized={true}
                      />
                      <Image
                        alt='cross icon'
                        src={deleteIcon}
                        className='absolute top-0 cp right-0'
                        onClick={removeProjectPhoto}
                      />
                    </div>
                  )}
                </div>

                {/* title */}
                <div className='mb-6'>
                  <div className='txtblack text-[14px]'>Project Title</div>
                  <>
                    <input
                      className={`block w-full border h-[48px] ${
                        errors.title ? 'border-red-500' : 'border-dark-300'
                      } rounded py-3 px-4 mb-3 leading-tight ${
                        errors.title ? 'focus:border focus:border-red-500' : ''
                      }`}
                      id='title'
                      name='title'
                      type='text'
                      placeholder='Enter your project title'
                      {...register('title', {
                        required: 'Project title is required',
                      })}
                      defaultValue={project ? project?.title : ''}
                    />
                    {errors.title && (
                      <p className='text-red-500 text-xs font-medium'>
                        {errors.title.message}
                      </p>
                    )}
                  </>
                </div>

                {/* headline */}
                <div className='mb-6'>
                  <div className='txtblack text-[14px]'>Project Headline</div>
                  <>
                    <input
                      className={`block w-full border h-[48px] border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                      id='headline'
                      name='headline'
                      {...register('headline')}
                      type='text'
                      placeholder='Enter your project headline'
                      defaultValue={project ? project?.headline : ''}
                    />
                  </>
                </div>

                {/* cover */}
                <div className='mb-6'>
                  <div className='label-grey mb-2'>Add cover photo</div>
                  {coverPhoto && coverPhoto.path.length < 1 ? (
                    <FileDragAndDrop
                      maxFiles={1}
                      height='230px'
                      onDrop={(e) => coverPhotoSelect(e)}
                      sizePlaceholder='1300X600'
                      maxSize={4000000}
                    />
                  ) : (
                    <div className='relative w-full '>
                      <Image
                        className='coverPreview block w-full rounded-xl max-h-[230px] object-cover'
                        src={coverPhoto.path}
                        alt="user's cover picture"
                        width={230}
                        height={230}
                        unoptimized={true}
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                      <Image
                        alt='cross icon'
                        src={deleteIcon}
                        className='absolute top-0 cp right-0'
                        onClick={removeCoverPhoto}
                      />
                    </div>
                  )}
                </div>

                {/* description */}
                <div className='mb-6'>
                  <div className='txtblack text-[14px] '>Description</div>
                  <textarea
                    defaultValue={project ? project?.description : ''}
                    {...register('description')}
                    className='p-5 mt-1'
                    name='description'
                    id='description'
                    cols='30'
                    rows='6'
                    placeholder='Description'
                    maxLength={1000}
                  ></textarea>
                </div>

                {/* web links */}
                <div className='mb-6'>
                  <div className='txtblack text-[14px]'>Add Social Link</div>
                  {project?.links?.map((link, index) => (
                    <div
                      key={index}
                      className='inline-flex items-center w-full mb-4'
                    >
                      <i
                        className={` ${
                          link.title.startsWith('customLinks')
                            ? `fa-solid fa-${link.icon}`
                            : `fa-brands fa-${link.icon}`
                        }  text-[24px] text-primary-900  mr-2`}
                      ></i>
                      <input
                        className={`block w-full border border-divider h-[48px] text-[14px] text-textSubtle rounded  pl-3  outline-none`}
                        placeholder='https://'
                        value={link.value}
                        onChange={(event) =>
                          onSocialLinkChange(event.target.value, index)
                        }
                      />
                    </div>
                  ))}
                </div>
                <button
                  disabled={isLoading}
                  className='contained-button w-full py-2 text-center'
                >
                  {isLoading ? <Spinner forButton={true} /> : 'Save'}
                </button>
              </div>
            </form>
          </Modal>
        </>
      )}
      {step === 2 && (
        <>
          {showSuccessModal && (
            <SuccessModal
              show={showSuccessModal}
              handleClose={() => onSuccess()}
              message='Successfully Saved Token Gated Project'
              btnText='Close'
            />
          )}
          {showErrorModal && (
            <ErrorModal
              handleClose={() => onError()}
              show={showErrorModal}
              message={errorMessage}
              buttomText='Try Again'
            />
          )}
        </>
      )}
    </>
  );
}
