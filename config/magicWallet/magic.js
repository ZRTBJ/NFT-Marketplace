export const formattedNetwork = () => {
  const network =
    typeof window !== 'undefined' && localStorage.getItem('networkChain');
  switch (network) {
    case 5:
      return {
        rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        chainId: 5,
      };
    case 80001:
      return {
        rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
        chainId: 80001,
      };
    case 97:
      return {
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        chainId: 97,
      };
    default:
      return {
        rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        chainId: 5,
      };
  }
};

// export const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
//   network: formattedNetwork(),
// });
