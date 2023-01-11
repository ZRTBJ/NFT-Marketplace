import React from 'react';
import Image from 'next/image';

const SettingContent = ({
  content,
  handleFieldChange,
  handleMediaFile,
  reviewScreen = false,
}) => {
  let mediaType = content?.media?.file?.type?.split('/')[0]?.toLowerCase();
  return (
    <div className='mt-6'>
      <p className='mb-2 text-[14px]'>Media</p>
      <div
        className={`flex justify-center items-center max-w-full w-40 h-40'
    }`}
      >
        <label
          htmlFor={`dropzone-file`}
          className={`flex flex-col justify-center items-center w-full  ${
            mediaType === 'video' || mediaType === 'movie' ? '' : 'h-40'
          } ${
            content?.media?.file ? '' : 'bg-white-filled-form'
          } rounded-xl  cursor-pointer`}
        >
          <div className='flex flex-col justify-center items-center pt-5 pb-6 relative'>
            {content?.media?.file ? (
              <>
                {mediaType === 'image' && (
                  <Image
                    unoptimized
                    src={content.media.path}
                    alt='nft'
                    height={40}
                    width={40}
                    className='rounded-xl  max-w-full w-40 h-40 object-cover'
                  />
                )}
                {mediaType === 'audio' && (
                  <>
                    <audio
                      ref={audioRef}
                      src={content?.media.path}
                      controls
                      autoPlay={false}
                      className='ml-[8rem]'
                    />
                  </>
                )}
                {mediaType === 'video' || mediaType === 'movie' ? (
                  <>
                    <video width='650' height='400' controls>
                      <source src={content?.media?.path} type='video/mp4' />
                    </video>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <svg
                  width='39'
                  height='39'
                  viewBox='0 0 39 39'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    opacity='0.4'
                    d='M27.8167 38.5097H11.4644C5.0695 38.5097 0.773438 34.0245 0.773438 27.3479V11.9373C0.773438 5.2606 5.0695 0.77356 11.4644 0.77356H27.8186C34.2135 0.77356 38.5095 5.2606 38.5095 11.9373V27.3479C38.5095 34.0245 34.2135 38.5097 27.8167 38.5097Z'
                    fill='#9499AE'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M18.2168 13.368C18.2168 15.9529 16.113 18.0567 13.5281 18.0567C10.9413 18.0567 8.83938 15.9529 8.83938 13.368C8.83938 10.783 10.9413 8.67737 13.5281 8.67737C16.113 8.67737 18.2168 10.783 18.2168 13.368ZM33.6045 23.5805C34.0441 24.0069 34.3592 24.4937 34.5667 25.0126C35.195 26.5824 34.8686 28.4692 34.1969 30.0239C33.4007 31.8749 31.8761 33.273 29.9554 33.8843C29.1025 34.1579 28.2082 34.2749 27.3157 34.2749H11.5024C9.92882 34.2749 8.53636 33.9089 7.39484 33.2221C6.67974 32.7919 6.55332 31.8013 7.08352 31.156C7.97031 30.0805 8.84579 29.0013 9.72882 27.9126C11.4118 25.8296 12.5458 25.2258 13.8062 25.756C14.3175 25.9748 14.8307 26.305 15.359 26.6522C16.7666 27.5843 18.7232 28.8635 21.3006 27.4749C23.0623 26.5115 24.085 24.8631 24.9751 23.4283L24.9931 23.3994C25.053 23.3033 25.1124 23.2073 25.1716 23.1116C25.4743 22.6226 25.7724 22.1409 26.1101 21.6975C26.5289 21.1484 28.0837 19.4314 30.0931 20.6541C31.3743 21.4239 32.4516 22.4654 33.6045 23.5805Z'
                    fill='#9499AE'
                  />
                </svg>
                <p className='text-xs mt-2 text-color-ass-8'>Add Assets from</p>
                <p className='text-xs text-primary-900'>Computer</p>
              </>
            )}
          </div>

          <input
            id={`dropzone-file`}
            type='file'
            className='hidden'
            accept='audio/*, image/*, video/*'
            disabled={reviewScreen}
            onChange={handleMediaFile}
          />
        </label>
      </div>
      <div className='mt-6'>
        <div className='flex items-center mb-2'>
          <div className='txtblack text-[14px]'>Name</div>
        </div>
        <>
          <input
            id='title'
            name='title'
            className={`debounceInput`}
            value={content.title}
            placeholder='Title for the Content'
            disabled={reviewScreen}
            onChange={handleFieldChange}
          />
        </>
      </div>
      <div className='mt-6'>
        <div className='txtblack text-[14px] mb-2'>Description</div>
        <textarea
          id='description'
          name='description'
          cols='30'
          rows='6'
          className={`p-4`}
          value={content.description}
          disabled={reviewScreen}
          onChange={handleFieldChange}
          placeholder='Description for the Content'
        ></textarea>
      </div>
      <div className='mt-6 flex py-3'>
        <p className='text-txtblack text-[18px] font-black'>18+</p>
        <div className='flex-1 px-3'>
          <p className='-mt-1'>Sensitive Content</p>
          <small className='text-textSubtle'>
            Defined properties on your NFT
          </small>
        </div>
        <div className='flex flex-wrap items-center'>
          <label
            htmlFor={`isExplicit`}
            className='inline-flex relative items-center cursor-pointer ml-auto'
          >
            <input
              type='checkbox'
              id={`isExplicit`}
              name='isExplicit'
              disabled={reviewScreen}
              checked={content?.isExplicit}
              className='sr-only peer outline-none'
              onChange={handleFieldChange}
            />
            <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-900"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingContent;
