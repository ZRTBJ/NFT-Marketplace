const SocialLink = ({ links, forTokenGated }) => {
  // for dao, collections
  const customLinks = links?.filter(
    (link) => link?.title?.startsWith('customLinks') && link?.value
  );

  // for dashboard
  const webLinks = links?.filter(
    (link) =>
      (link?.title?.startsWith('webLink') ||
        link?.title?.startsWith('moreWebLink')) &&
      link?.value
  );

  return (
    <div className='flex items-center flex-wrap gap-4'>
      {links?.find((link) => link.title === 'linkFacebook') &&
        links?.find((link) => link.title === 'linkFacebook').value?.length >
          0 && (
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
            <a
              href={`${
                links?.find((link) => link.title === 'linkFacebook').value
              }`}
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-brands fa-facebook gradient-text'></i>
            </a>
          </div>
        )}

      {links?.find((link) => link.title === 'linkInsta') &&
        links?.find((link) => link.title === 'linkInsta').value?.length > 0 && (
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
            <a
              href={`${
                links?.find((link) => link.title === 'linkInsta').value
              }`}
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-brands fa-instagram gradient-text'></i>
            </a>
          </div>
        )}

      {links?.find((link) => link.title === 'linkTwitter') &&
        links?.find((link) => link.title === 'linkTwitter').value?.length >
          0 && (
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
            <a
              href={`${
                links?.find((link) => link.title === 'linkTwitter').value
              }`}
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-brands fa-twitter gradient-text'></i>
            </a>
          </div>
        )}

      {links?.find((link) => link.title === 'linkGithub') &&
        links?.find((link) => link.title === 'linkGithub').value?.length >
          0 && (
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
            <a
              href={`${
                links?.find((link) => link.title === 'linkGithub').value
              }`}
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-brands fa-github gradient-text'></i>
            </a>
          </div>
        )}

      {links?.find((link) => link.title === 'linkReddit') &&
        links?.find((link) => link.title === 'linkReddit').value?.length >
          0 && (
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
            <a
              href={`${
                links?.find((link) => link.title === 'linkReddit').value
              }`}
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-brands fa-reddit gradient-text'></i>
            </a>
          </div>
        )}
      {customLinks && customLinks?.length > 0 && (
        <>
          {customLinks?.map((link, index) => (
            <div
              key={index}
              className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'
            >
              <a
                href={link?.value ? link?.value : ''}
                target='_blank'
                rel='noreferrer'
              >
                <i className='fa-solid fa-globe gradient-text'></i>
              </a>
            </div>
          ))}
        </>
      )}

      {webLinks && webLinks?.length > 0 && (
        <>
          {webLinks?.map((link, index) => (
            <div
              key={index}
              className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'
            >
              <a
                href={link?.value ? link?.value : ''}
                target='_blank'
                rel='noreferrer'
              >
                <i className='fa-solid fa-globe gradient-text'></i>
              </a>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SocialLink;
