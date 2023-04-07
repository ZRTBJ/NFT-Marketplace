import Modal from '../Modal';
import { useState } from 'react';
import { sendMessage } from 'services/User/userService';
import Spinner from 'components/Commons/Spinner';
import { toast } from 'react-toastify';

const FeatureRequest = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetState = () => {
    setIsSubmitted(false);
    setMessage('');
    setEmail('');
    setName('');
    setTitle('');
    setIsLoading(false);
    handleClose();
  };

  const handleSend = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if ((email, message)) {
      setIsLoading(true);
      let payload = {
        type: 'feature_request',
        email,
        message,
        name,
        title,
      };
      sendMessage(payload)
        .then((resp) => {
          if (resp?.code === 0) {
            toast.success(
              `Thank you for the feature request, we will review it.`
            );
          } else {
            toast.error(`Failed to send the request. Please try again!`);
          }
          resetState();
        })
        .catch((err) => {
          resetState();
          toast.error(`Failed to send the request. Please try again!`);
        });
    }
  };

  let validEmail = isSubmitted && !email;
  let validMessage = isSubmitted && !message;
  let validName = isSubmitted && !name;
  let validTitle = isSubmitted && !title;
  return (
    <Modal
      width={500}
      show={show}
      handleClose={() => handleClose()}
      showCloseIcon={true}
      gradientBg={true}
    >
      <div className={`px-[11px] md:px-[0px] text-black`}>
        <h1 className='text-[30px] md:text-[46px]'>Request a New Feature</h1>
        <div>
          <form onSubmit={handleSend}>
            <div className='p-6'>
              <div className='mb-6'>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='p-4 mb-1'
                  name='message'
                  type='email'
                  placeholder='Email'
                />
                {validEmail && (
                  <p className='text-red-400 text-sm'>Email is required</p>
                )}
              </div>
              <div className='mb-6'>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='p-4 mb-1'
                  name='message'
                  type='text'
                  placeholder='Name'
                />
                {validName && (
                  <p className='text-red-400 text-sm'>Name is required</p>
                )}
              </div>
              <div className='mb-6'>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='p-4 mb-1'
                  name='message'
                  type='text'
                  placeholder='Title'
                />
                {validTitle && (
                  <p className='text-red-400 text-sm'>Title is required</p>
                )}
              </div>
              <div className='mb-6'>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className='p-3'
                  name='message'
                  cols='30'
                  rows='6'
                  placeholder='Message'
                ></textarea>
                {validMessage && (
                  <p className='text-red-400 text-sm'>Message is required</p>
                )}
              </div>
              <button type='submit' className='contained-button-new w-full'>
                {isLoading ? <Spinner /> : <span>Send Request</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default FeatureRequest;
