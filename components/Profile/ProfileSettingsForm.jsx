import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FileDragAndDrop from 'components/FormUtility/FileDragAndDrop';
import { updateUserInfo } from 'services/User/userService';
import { useSelector } from 'react-redux';
import { setUserInfo } from 'redux/user';
import { useDispatch } from 'react-redux';
import { getUserInfo } from 'services/User/userService';
import deleteIcon from 'assets/images/projectCreate/ico_delete01.svg';
import SuccessModal from 'components/Modals/SuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';
import Image from 'next/image';
import { event } from 'nextjs-google-analytics';
import TagManager from 'react-gtm-module';

const ProfileSettingsForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [userId, setUserId] = useState(user ? user : '');
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState({ image: null, path: '' });
  const [coverPhoto, setCoverPhoto] = useState({ image: null, path: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [moreWebLink, setMoreWebLink] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (userId) {
      getUserDetails(userId);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getUserDetails(userID) {
    setIsLoading(true);
    setMoreWebLink([]);
    const response = await getUserInfo(userID);
    let userinfo;
    try {
      userinfo = response['user'];
      setValue('firstName', userinfo['first_name']);
      setValue('lastName', userinfo['last_name']);
      setValue('displayName', userinfo['display_name']);
      setValue('emailAddress', userinfo['email']);
      setValue('biography', userinfo['biography']);
      setValue('jobDescription', userinfo['job']);
      setValue('locationArea', userinfo['area']);
      if (userinfo['avatar'] && userinfo['avatar'].length > 0) {
        setProfileImage({ image: null, path: userinfo['avatar'] });
      }
      if (userinfo['cover'] && userinfo['cover'].length > 0) {
        setCoverPhoto({ image: null, path: userinfo['cover'] });
      }

      if (userinfo['web']) {
        try {
          const webs = JSON.parse(userinfo['web']);
          const webLinks = [];
          for (let link of webs) {
            if (Object.keys(link)[0].startsWith('webLink1')) {
              setValue('webLink1', Object.values(link)[0]);
            } else if (Object.keys(link)[0].startsWith('moreWebLink')) {
              webLinks.push({ title: `moreWebLink${webLinks.length + 1}` });
            }
          }
          if (webLinks.length > 0) {
            setMoreWebLink(webLinks);
          }
          setTimeout(() => {
            for (let link of webs) {
              setValue(Object.keys(link)[0], Object.values(link)[0]);
            }
          }, 500);
        } catch (ex) {
          console.log(ex);
        }
      }

      if (userinfo['social']) {
        try {
          const sociallinks = JSON.parse(userinfo['social']);
          for (let link of sociallinks) {
            setValue(Object.keys(link)[0], Object.values(link)[0]);
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    } catch {}
    dispatch(setUserInfo(userinfo));
    setIsLoading(false);
  }

  function profileImageChangeHandler(images) {
    const img = images[0];
    setProfileImage({ image: img, path: URL.createObjectURL(img) });
  }

  function addMoreWebLink() {
    const count = moreWebLink.length;
    setMoreWebLink([...moreWebLink, { title: `moreWebLink${count + 1}` }]);
  }

  function removeProfilePhoto() {
    setProfileImage({ image: null, path: '' });
  }

  function removeCoverPhoto() {
    setCoverPhoto({ image: null, path: '' });
  }

  async function coverPhotoSelect(params) {
    if (params.length > 0) {
      setCoverPhoto({ image: params[0], path: URL.createObjectURL(params[0]) });
    }
  }

  const onSubmit = (data) => {
    event('update_info', { category: 'user' });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'user',
        pageTitle: 'update_info',
      },
    });
    const social = [];
    social.push({ linkInsta: data['linkInsta'] });
    social.push({ linkReddit: data['linkReddit'] });
    social.push({ linkTwitter: data['linkTwitter'] });
    social.push({ linkFacebook: data['linkFacebook'] });

    const web = [];
    web.push({ webLink1: data['webLink1'] });
    for (let link of moreWebLink) {
      if (
        data[link.title] &&
        data[link.title].length > 0 &&
        data[link.title] != 'https://'
      ) {
        web.push({ [link.title]: data[link.title] });
      }
    }

    const request = new FormData();
    request.append('first_name', data['firstName']);
    request.append('last_name', data['lastName']);
    request.append('display_name', data['displayName']);
    request.append('email', data['email']);
    request.append('job', data['jobDescription']);
    request.append('area', data['locationArea']);
    // try {
    //   request.append(
    //     "country",
    //     document.getElementById("location-country")?.value
    //   );
    // } catch {}
    request.append('biography', data['biography']);
    if (profileImage.image) {
      request.append('avatar', profileImage.image);
    }
    if (coverPhoto) {
      request.append('cover', coverPhoto.image);
    }
    request.append('web', JSON.stringify(web));
    request.append('social', JSON.stringify(social));
    if (userId) {
      setIsLoading(true);
      updateUserInfo(userId, request)
        .then((res) => {
          if (res && res.code === 0) {
            setShowErrorModal(false);
            setShowSuccessModal(true);
            getUserDetails(userId);
          } else {
            setShowErrorModal(true);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setShowSuccessModal(false);
          setShowErrorModal(true);
        });
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      {isLoading && <div className='loading'></div>}
      {!isLoading && (
        <>
          {userId ? (
            <div
              className={`grid justify-items-center ml-4 mr-4 sm:ml-0 sm:mr-0`}
            >
              <form
                id='profile-setting'
                name='profileSettingForm'
                className='w-full max-w-2xl'
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className='txtblack'>
                  {/* photo */}
                  <div>
                    <div className='text-xl font-bold mb-4 mt-4 md:mt-0'>
                      Set your profile
                    </div>
                    <div className='label'>Profile Picture</div>
                    <div className='label-grey mb-2'>
                      Add your profile picture, you can use image like NFT or
                      real picture and let user recognize yourself
                    </div>
                    <div className='md:flex flex-wrap mb-6'>
                      {profileImage && profileImage.path.length < 1 && (
                        <div className='w-full md:max-w-[186px]'>
                          <FileDragAndDrop
                            maxFiles={4}
                            height='158px'
                            onDrop={(e) => profileImageChangeHandler(e)}
                            sizePlaceholder='Total upto 16MB'
                          />
                        </div>
                      )}
                      {profileImage && profileImage.path.length > 0 && (
                        <div className='relative  w-[180px] h-[180px] '>
                          <Image
                            alt="user's profile picture"
                            className='outlinePhoto w-[180px] h-[180px] block object-cover rounded-xl'
                            src={profileImage.path}
                            width={200}
                            height={230}
                            unoptimized={true}
                          />
                          <Image
                            alt='cross icon'
                            src={deleteIcon}
                            className='absolute top-0 cursor-pointer right-0'
                            onClick={removeProfilePhoto}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* cover */}
                  <div className='mb-6'>
                    <div className='label'>Cover Photo</div>
                    <div className='label-grey mb-2'>Add your cover photo</div>
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
                  <div className='mb-4'>
                    <div className='label'>
                      Username{' '}
                      <small className='ml-2 text-red-500 text-xs'>
                        * This field is required
                      </small>
                    </div>
                    <div className='label-grey'>
                      you can use your name or your nickname
                    </div>
                    <input
                      className={`block w-full border ${
                        errors.displayName
                          ? 'border-red-500'
                          : 'border-dark-300'
                      } rounded py-3 px-4 mb-3 leading-tight ${
                        errors.displayName
                          ? 'focus:border focus:border-red-500'
                          : ''
                      }`}
                      id='display-name'
                      name='displayName'
                      type='text'
                      placeholder='Username'
                      {...register('displayName', {
                        required: 'Username is required.',
                      })}
                      defaultValue={userinfo ? userinfo['display_name'] : ''}
                    />
                    {errors.displayName && (
                      <p className='text-red-500 text-xs font-medium'>
                        {errors.displayName.message}
                      </p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <div className='label'>Email</div>
                    <div className='label-grey'>Enter your email address</div>
                    <input
                      className={`block w-full border ${
                        errors.email ? 'border-red-500' : 'border-dark-300'
                      } rounded py-3 px-4 mb-3 leading-tight ${
                        errors.email ? 'focus:border focus:border-red-500' : ''
                      }`}
                      id='email'
                      name='email'
                      type='text'
                      placeholder='example@domain.com'
                      {...register('email', {
                        pattern:
                          /^\w+([-+.']\w+)*[\-]?@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                      })}
                      defaultValue={userinfo ? userinfo['email'] : ''}
                    />
                    {errors.email && (
                      <p className='text-red-500 text-xs font-medium'>
                        Please enter a valid email address (example:
                        example@domain.com)
                      </p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <div className='label'>Location</div>
                    <div className='label-grey'>add your location</div>
                    <input
                      className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                      id='location-area'
                      name='locationArea'
                      {...register('locationArea')}
                      type='text'
                      placeholder='Add location'
                      defaultValue={userinfo ? userinfo['area'] : ''}
                    />
                  </div>
                  <div className='mb-4'>
                    <div className='label'>Bio</div>
                    <div className='label-grey'>
                      Tell your audience who you are, so they can easily know
                      you.
                    </div>
                    <textarea
                      rows='6'
                      id='biography'
                      name='biography'
                      placeholder='Add your bio'
                      {...register('biography')}
                      className='block w-full rounded py-3 px-4 mb-3 leading-tight focus:outline-none resize-none'
                      defaultValue={userinfo ? userinfo['biography'] : ''}
                    ></textarea>
                  </div>
                  <div className='mb-4'>
                    <div className='label'>Job Description</div>
                    <div className='label-grey'>Add your designation below</div>
                    <input
                      className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                      id='job'
                      name='jobDescription'
                      {...register('jobDescription')}
                      type='text'
                      placeholder='Add job description'
                      defaultValue={userinfo ? userinfo['job'] : ''}
                    />
                  </div>
                  <div className='mb-4'>
                    <div className='label'>Social Link</div>
                    <div className='label-grey mb-2'>
                      Add your social media or link below.
                    </div>
                    <div className='inline-flex items-center w-full'>
                      <Image
                        className='cp mr-2 mb-3'
                        src={require(`assets/images/profile/social/linkInsta.png`)}
                        height={24}
                        width={24}
                        alt='social logo'
                      />
                      <input
                        className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                        id='link-insta'
                        name='linkInsta'
                        {...register('linkInsta')}
                        type='text'
                        placeholder='https://'
                      />
                    </div>
                    <div className='inline-flex items-center w-full'>
                      <Image
                        className='cp mr-2 mb-3'
                        src={require(`assets/images/profile/social/linkReddit.png`)}
                        height={24}
                        width={24}
                        alt='social logo'
                      />
                      <input
                        className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                        id='link-reddit'
                        name='linkReddit'
                        {...register('linkReddit')}
                        type='text'
                        placeholder='https://'
                        defaultValue={''}
                      />
                    </div>
                    <div className='inline-flex items-center w-full'>
                      <Image
                        className='cp mr-2 mb-3'
                        src={require(`assets/images/profile/social/linkTwitter.png`)}
                        height={24}
                        width={24}
                        alt='social logo'
                      />
                      <input
                        className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                        id='link-twitter'
                        name='linkTwitter'
                        {...register('linkTwitter')}
                        type='text'
                        placeholder='https://'
                        defaultValue={''}
                      />
                    </div>
                    <div className='inline-flex items-center w-full'>
                      <Image
                        className='cp mr-2 mb-3'
                        src={require(`assets/images/profile/social/linkFacebook.png`)}
                        height={24}
                        width={24}
                        alt='social logo'
                      />
                      <input
                        className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                        id='link-facebook'
                        name='linkFacebook'
                        {...register('linkFacebook')}
                        type='text'
                        placeholder='https://'
                        defaultValue={''}
                      />
                    </div>
                    <div className='inline-flex items-center w-full'>
                      <i
                        className='fa fa-link mr-3 mb-3'
                        aria-hidden='true'
                      ></i>
                      <input
                        className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                        id='link-web'
                        name='webLink1'
                        {...register('webLink1')}
                        type='text'
                        placeholder='https://'
                        defaultValue={''}
                      />
                    </div>
                    {moreWebLink &&
                      moreWebLink.length > 0 &&
                      moreWebLink.map((link, index) => (
                        <div
                          key={`more-link-${index}`}
                          className='inline-flex items-center w-full'
                        >
                          <i
                            className='fa fa-link mr-3 mb-3'
                            aria-hidden='true'
                          ></i>
                          <input
                            className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                            id={`more-link-web-${index + 1}`}
                            name={link.title}
                            {...register(link.title)}
                            type='text'
                            placeholder='https://'
                            defaultValue={'https://'}
                          />
                        </div>
                      ))}
                  </div>
                </div>
                <div className='flex flex-wrap mb-6'>
                  <div className='w-full  grid grid-cols-2'>
                    <div>
                      <button
                        type='button'
                        className='bg-primary-900/[0.10] text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]'
                        onClick={(e) => {
                          addMoreWebLink();
                        }}
                      >
                        <span>+ More Link</span>
                      </button>
                    </div>
                    <div className='text-right'>
                      <button className='btn contained-button w-[110px] '>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              {showSuccessModal && (
                <SuccessModal
                  handleClose={setShowSuccessModal}
                  show={showSuccessModal}
                  redirection={`/dashboard`}
                />
              )}
              {showErrorModal && (
                <ErrorModal
                  handleClose={setShowErrorModal}
                  show={showErrorModal}
                />
              )}
            </div>
          ) : (
            <div className='text-center mt-6'>
              <h1>No user found</h1>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default ProfileSettingsForm;
