import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';
import Config from 'config/config';

export const formattedMainnetNetwork = () => {
  const network =
    typeof window !== 'undefined' && localStorage.getItem('networkChain');
  switch (Number(network)) {
    case 137:
      return {
        rpcUrl: 'https://polygon-rpc.com/',
        chainId: 137,
      };
    case 1:
      return {
        rpcUrl: 'https://mainnet.infura.io/v3/',
        chainId: 1,
      };
    default:
      return {
        rpcUrl: 'https://polygon-rpc.com/',
        chainId: 137,
      };
  }
};

export const formattedTestnetNetwork = () => {
  const network =
    typeof window !== 'undefined' && localStorage.getItem('networkChain');

  switch (Number(network)) {
    case 80001:
      return {
        rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
        chainId: 80001,
      };
    case 5:
      return {
        rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        chainId: 5,
      };
    default:
      return {
        rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        chainId: 5,
      };
  }
};

const magic =
  typeof window !== 'undefined' &&
  new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
    network: Config?.IS_PRODUCTION
      ? formattedMainnetNetwork()
      : formattedTestnetNetwork(),
  });
const etherMagicProvider =
  typeof window !== 'undefined' &&
  new ethers.providers.Web3Provider(magic.rpcProvider);

export { magic, etherMagicProvider };
