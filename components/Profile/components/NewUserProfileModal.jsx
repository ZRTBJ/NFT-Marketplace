import Modal from 'components/Commons/Modal';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleNewUser } from 'redux/user';
import { updateUserInfo } from 'services/User/userService';

const NewUserProfileModal = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    isNewUser,
    userinfo,
    email: userEmail,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  const handleSubmitData = (e) => {
    e.preventDefault();
    const request = new FormData();
    request.append('display_name', userName);
    request.append('email', email);
    if (userName || email) {
      updateUserInfo(userinfo?.id, request)
        .then((res) => {
          dispatch(handleNewUser(false));
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    } else {
      dispatch(handleNewUser(false));
    }
  };

  return (
    <Modal
      width={400}
      show={isNewUser}
      handleClose={() => dispatch(handleNewUser(false))}
    >
      <div>
        <h3 className='text-[20px]'>
          Add your profile <span className='text-[#838383]'>(Optional)</span>
        </h3>
        <p
          className='text-[12px] text-[#838383] mt-2'
          style={{ lineHeight: '1rem' }}
        >
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </p>
        <div className='mt-4'>
          <div className='mb-2'>
            <label className='text-[14px]'>Username (optional)</label>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className='p-4 mb-1 text-[14px]'
              name='userName'
              placeholder='Username'
              type='text'
            />
          </div>
          <div className='mb-2'>
            <label className='text-[14px]'>Wallet Address</label>
            <input
              value={userinfo?.eoa}
              readOnly
              type='text'
              className='p-4 mb-1 text-[14px]'
              name='message'
              placeholder='Username'
            />
          </div>
          <div className='mb-2'>
            <label className='text-[14px]'>Email Address (optional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='p-4 mb-1 text-[14px]'
              name='email'
              type='email'
              placeholder='example@mail.com'
            />
          </div>
        </div>
        <button
          className='contained-button-new w-full mt-2'
          onClick={handleSubmitData}
        >
          {isLoading ? (
            'Loading...'
          ) : (
            <span>
              {' '}
              {/* Next <i className='fa-regular fa-arrow-right ml-1'></i>    */}
              Submit
            </span>
          )}
        </button>
      </div>
    </Modal>
  );
};

export default NewUserProfileModal;
