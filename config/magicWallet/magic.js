import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';
import Config from 'config/config';

export const formattedNetwork = () => {
  if (Config?.IS_PRODUCTION) {
    return {
      rpcUrl: 'https://polygon-rpc.com/',
      chainId: 137,
    };
  } else {
    return {
      rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      chainId: 5,
    };
  }
};

const magic =
  typeof window !== 'undefined' &&
  new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
    network: formattedNetwork(),
  });
const etherMagicProvider =
  typeof window !== 'undefined' &&
  new ethers.providers.Web3Provider(magic.rpcProvider);

export { magic, etherMagicProvider };
