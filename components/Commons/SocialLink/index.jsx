const SocialLink = ({ links, forTokenGated }) => {
  return (
    <div className='flex items-center gap-4'>
      {links.find((link) => link.title === 'linkFacebook') &&
        links.find((link) => link.title === 'linkFacebook').value?.length >
          0 && (
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
            <a
              href={`${
                links.find((link) => link.title === 'linkFacebook').value
              }`}
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-brands fa-facebook gradient-text'></i>
            </a>
          </div>
        )}

      {links.find((link) => link.title === 'linkInsta') &&
        links.find((link) => link.title === 'linkInsta').value?.length > 0 && (
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
            <a
              href={`${links.find((link) => link.title === 'linkInsta').value}`}
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-brands fa-instagram gradient-text'></i>
            </a>
          </div>
        )}
      {links.find((link) => link.title === 'linkTwitter') &&
        links.find((link) => link.title === 'linkTwitter').value?.length >
          0 && (
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
            <a
              href={`${
                links.find((link) => link.title === 'linkTwitter').value
              }`}
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-brands fa-twitter gradient-text'></i>
            </a>
          </div>
        )}
      {links.find((link) => link.title === 'linkGithub') &&
        links.find((link) => link.title === 'linkGithub').value?.length > 0 && (
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
            <a
              href={`${
                links.find((link) => link.title === 'linkGithub').value
              }`}
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-brands fa-github gradient-text'></i>
            </a>
          </div>
        )}
      {links.find((link) => link.title === 'customLinks1') &&
        links.find((link) => link.title === 'customLinks1').value?.length >
          0 && (
          <div className='social-icon-button cursor-pointer w-9 h-9  flex justify-center items-center rounded-md ease-in-out duration-300'>
            <a
              href={`${
                links.find((link) => link.title === 'customLinks1').value
              }`}
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-solid fa-globe gradient-text'></i>
            </a>
          </div>
        )}
    </div>
  );
};

export default SocialLink;
