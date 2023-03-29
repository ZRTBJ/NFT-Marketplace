import Link from 'next/link';
import { getCurrentNetworkId } from 'util/MetaMask';
import { useEffect, useState } from 'react';

const WarningBar = ({ setIsWrongNetwork, IS_PRODUCTION }) => {
  const [currentNetwork, setCurrentNetwork] = useState();

  useEffect(() => {
    getNetwork();
  }, [currentNetwork]);

  const getNetwork = async () => {
    let networkValue = await getCurrentNetworkId();
    setCurrentNetwork(networkValue);
  };

  return (
    <div className='bg-red-500 text-white py-1 relative'>
      <p className='text-center'>
        {IS_PRODUCTION && currentNetwork === 1 ? (
          <>
            We are not supporting ethereum yet, please switch to different
            network
          </>
        ) : (
          <>
            You're viewing {IS_PRODUCTION ? 'Main' : 'test'} network, but your
            wallet is connected to the {IS_PRODUCTION ? 'test' : 'main'} or
            unsupported network. To use Decir, either switch to a supported
            network or go to{' '}
            {IS_PRODUCTION ? (
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
