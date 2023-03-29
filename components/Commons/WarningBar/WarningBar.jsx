import Link from 'next/link';
import config from 'config/config';

const WarningBar = ({ setIsWrongNetwork, currentNetwork }) => {
  return (
    <div className='bg-red-500 text-white py-1 relative'>
      <p className='text-center'>
        {config?.IS_PRODUCTION && currentNetwork === 1 ? (
          <>
            We are not supporting ethereum yet, please switch to different
            network
          </>
        ) : (
          <>
            You're viewing {config?.IS_PRODUCTION ? 'Main' : 'test'} network,
            but your wallet is connected to the{' '}
            {config?.IS_PRODUCTION ? 'test' : 'main'} or unsupported network. To
            use Decir, either switch to a supported network or go to{' '}
            {config?.IS_PRODUCTION ? (
              <Link
                href={'https://testnet.decir.io/'}
                passHref
                target={'_blank'}
                className='underline'
              >
                testnet.decir.io
              </Link>
            ) : (
              <Link
                href={'https://app.decir.io/'}
                passHref
                target={'_blank'}
                className='underline'
              >
                app.decir.io
              </Link>
            )}{' '}
            .
          </>
        )}
        <i
          onClick={() => setIsWrongNetwork(false)}
          class='fa-solid fa-xmark-large text-right cursor-pointer text-sm absolute right-2 bottom-2'
        ></i>
      </p>
    </div>
  );
};

export default WarningBar;
