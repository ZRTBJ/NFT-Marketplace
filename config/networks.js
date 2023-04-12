import Eth from 'assets/images/eth.svg';
import Matic from 'assets/images/polygon.svg';
import Bnb from 'assets/images/bnb.svg';
import { address } from './contractAddresses.js';
import PolyScan from 'assets/images/poly-scan.png';
import EthScan from 'assets/images/eth-scan.png';

const gnosisFundTransferUrl = 'https://app.safe.global';

const raribleNFTDetailsUrl =
  process.env.NEXT_PUBLIC_ENV === 'production'
    ? 'https://rarible.com/token/'
    : 'https://testnet.rarible.com/token/';
const openSeaNFTDetailsUrl =
  process.env.NEXT_PUBLIC_ENV === 'production'
    ? 'https://opensea.io/assets/'
    : 'https://testnets.opensea.io/assets';

export const defaultNetworkId =
  process.env.NEXT_PUBLIC_ENV === 'production' ? 137 : 5;

const TESTNET = {
  5: {
    networkName: 'Goerli',
    cryto: 'GoerliETH',
    quickNodeURL: process.env.NEXT_PUBLIC_GOERLI_QUICKNODE_URL,
    value: 'eth',
    label: 'ETH',
    icon: Eth,
    forwarder: address.MinimalForwarderGoerli,
    webhook: process.env.NEXT_PUBLIC_WEBHOOK_URL_GOERLI,
    genericProxyFacotory: address.GenericProxyFactoryGoerli,
    masterCopyDAO: address.CreatorDAOMasterCopy,
    masterCopyCollection: address.CreateCollectionMasterCopy,
    masterMembershipCollection: address.CreateMembershipCollectionMasterCopy,
    masterRoyaltySplitter: address.RoyaltySplitterMasterCopy,
    network: 5,
    gnosis: `${gnosisFundTransferUrl}/gor`,
    raribleNFTDetailsUrl: raribleNFTDetailsUrl,
    openSeaNFTDetailsUrl: `${openSeaNFTDetailsUrl}/goerli/`,
    viewContractAddressUrl: `https://goerli.etherscan.io/address/`,
    viewTxUrl: `https://goerli.etherscan.io/tx/`,
    decirTreasury: address.decirTreasuryGoerli,
    discount: address.discountGoerli,
    scan: EthScan,
    alchamey: process.env.NEXT_PUBLIC_GOERLI_NFT_ALCHEMY_URL,
    scanApi: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_GOELRI_SCAN}`,
    priceApi: `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.NEXT_PUBLIC_GOELRI_SCAN}`,
    config: {
      chainId: '0x5',
      rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
      chainName: 'Goerli Test Network',
      nativeCurrency: {
        name: 'GoerliETH',
        symbol: 'GoerliETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://goerli.etherscan.io/'],
    },
  },
  97: {
    networkName: 'BSC Testnet',
    cryto: 'BNB',
    quickNodeURL: process.env.NEXT_PUBLIC_BNBTEST_QUICKNODE_URL,
    value: 'bnb',
    label: 'BNB',
    icon: Bnb,
    forwarder: address.MinimalForwarderBnbTest,
    webhook: process.env.NEXT_PUBLIC_WEBHOOK_URL_BNBTEST,
    genericProxyFacotory: address.GenericProxyFactoryBnbTest,
    masterCopyDAO: address.CreatorDAOMasterCopyBnbTest,
    masterCopyCollection: address.CreateCollectionMasterCopyBnbTest,
    masterMembershipCollection:
      address.CreateMembershipCollectionMasterCopyBnbTest,
    masterRoyaltySplitter: address.RoyaltySplitterMasterCopyBnbTest,
    network: 97,
    gnosis: `${gnosisFundTransferUrl}/bnb`,
    raribleNFTDetailsUrl: raribleNFTDetailsUrl,
    openSeaNFTDetailsUrl: `${openSeaNFTDetailsUrl}/BSC_TESTNET/`,
    viewContractAddressUrl: `https://testnet.bscscan.com/address/`,
    viewTxUrl: `https://testnet.bscscan.com/tx/`,
    decirTreasury: address.decirTreasuryBnbTest,
    discount: address.discountBnbTest,
    scanApi: `https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_BNB_TESTNET_SCAN}`,
    priceApi: `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${process.env.NEXT_PUBLIC_BNB_TESTNET_SCAN}`,
    config: {
      chainId: '0x61',
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
      chainName: 'BSC Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      blockExplorerUrls: ['https://testnet.bscscan.com'],
    },
  },
  80001: {
    networkName: 'Polygon Mumbai',
    cryto: 'MATIC',
    quickNodeURL: process.env.NEXT_PUBLIC_MUMBAI_QUICKNODE_URL,
    value: 'matic',
    label: 'MATIC',
    icon: Matic,
    forwarder: address.MinimalForwarderMumbai,
    webhook: process.env.NEXT_PUBLIC_WEBHOOK_URL_MUMBAI,
    genericProxyFacotory: address.GenericProxyFactoryMumbai,
    masterCopyDAO: address.CreatorDAOMasterCopyMumbai,
    masterCopyCollection: address.CreateCollectionMasterCopyMumbai,
    masterMembershipCollection:
      address.CreateMembershipCollectionMasterCopyMumbai,
    masterRoyaltySplitter: address.RoyaltySplitterMasterCopyMumbai,
    network: 80001,
    gnosis: `${gnosisFundTransferUrl}/matic`,
    raribleNFTDetailsUrl: raribleNFTDetailsUrl,
    openSeaNFTDetailsUrl: `${openSeaNFTDetailsUrl}/mumbai/`,
    viewContractAddressUrl: `https://mumbai.polygonscan.com/address/`,
    viewTxUrl: `https://mumbai.polygonscan.com/tx/`,
    decirTreasury: address.decirTreasuryMumbai,
    discount: address.discountMumbai,
    scan: PolyScan,
    alchamey: process.env.NEXT_PUBLIC_MUMBAI_NFT_ALCHEMY_URL,
    scanApi: `https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_MUMBAI_SCAN}`,
    priceApi: `https://api.polygonscan.com/api?module=stats&action=ethprice&apikey=${process.env.NEXT_PUBLIC_MUMBAI_SCAN}`,
    config: {
      chainId: '0x13881',
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
      chainName: 'Mumbai Testnet Polygon',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    },
  },
};

const MAINNET = {
  137: {
    networkName: 'Polygon Mainnet',
    crypto: 'MATIC',
    quickNodeURL: process.env.NEXT_PUBLIC_POLYGON_QUICKNODE_URL,
    value: 'matic',
    label: 'MATIC',
    icon: Matic,
    forwarder: address.MinimalForwarderPolygon,
    webhook: process.env.NEXT_PUBLIC_WEBHOOK_URL_POLYGON,
    genericProxyFacotory: address.GenericProxyFactoryPolygon,
    masterCopyDAO: address.CreatorDAOMasterCopyPolygon,
    masterCopyCollection: address.CreateCollectionMasterCopyPolygon,
    masterMembershipCollection:
      address.CreateMembershipCollectionMasterCopyPolygon,
    masterRoyaltySplitter: address.RoyaltySplitterMasterCopyPolygon,
    network: 137,
    gnosis: `${gnosisFundTransferUrl}/matic`,
    raribleNFTDetailsUrl: raribleNFTDetailsUrl,
    openSeaNFTDetailsUrl: `${openSeaNFTDetailsUrl}/matic/`,
    viewContractAddressUrl: `https://polygonscan.com/address/`,
    viewTxUrl: 'https://polygonscan.com/tx/',
    decirTreasury: address.decirTreasuryPolygon,
    discount: address.discountPolygon,
    scan: PolyScan,
    alchamey: process.env.NEXT_PUBLIC_POLYGON_NFT_ALCHEMY_URL,
    scanApi: `https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_POLYGON_SCAN}`,
    priceApi: `https://api.polygonscan.com/api?module=stats&action=ethprice&apikey=${process.env.NEXT_PUBLIC_MUMBAI_SCAN}`,
    config: {
      chainId: '0x89',
      rpcUrls: ['https://polygon-rpc.com/'],
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      blockExplorerUrls: ['https://polygonscan.com/'],
    },
  },
  1: {
    networkName: 'Ethereum Mainnet',
    crypto: 'ETH',
    quickNodeURL: process.env.NEXT_PUBLIC_ETHEREUM_QUICKNODE_URL,
    value: 'eth',
    label: 'ETH',
    icon: Eth,
    forwarder: address.MinimalForwarderEthereum,
    webhook: process.env.NEXT_PUBLIC_WEBHOOK_URL_ETHEREUM,
    genericProxyFacotory: address.GenericProxyFactoryEthereum,
    masterCopyDAO: address.CreatorDAOMasterCopyEthereum,
    masterCopyCollection: address.CreateCollectionMasterCopyEthereum,
    masterMembershipCollection:
      address.CreateMembershipCollectionMasterCopyEthereum,
    masterRoyaltySplitter: address.RoyaltySplitterMasterCopyEthereum,
    network: 1,
    gnosis: `${gnosisFundTransferUrl}/eth`,
    raribleNFTDetailsUrl: raribleNFTDetailsUrl,
    openSeaNFTDetailsUrl: `${openSeaNFTDetailsUrl}/ethereum/`,
    viewContractAddressUrl: `https://etherscan.io/address/`,
    viewTxUrl: 'https://etherscan.io/tx/',
    decirTreasury: address.decirTreasuryEthereum,
    discount: address.discountEthereum,
    scan: EthScan,
    alchamey: process.env.NEXT_PUBLIC_ETHEREUM_NFT_ALCHEMY_URL,
    scanApi: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_ETHEREUM_SCAN}`,
    priceApi: `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.NEXT_PUBLIC_GOELRI_SCAN}`,
    config: {
      chainId: '0x1',
      rpcUrls: ['https://mainnet.infura.io/v3/'],
      chainName: 'Ethereum Mainnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://etherscan.io'],
    },
  },
  56: {
    networkName: 'Binance Smart Chain',
    cryto: 'BNB',
    quickNodeURL: process.env.NEXT_PUBLIC_BNB_QUICKNODE_URL,
    value: 'bnb',
    label: 'BNB',
    icon: Bnb,
    forwarder: address.MinimalForwarderBnb,
    webhook: process.env.NEXT_PUBLIC_WEBHOOK_URL_BNB,
    genericProxyFacotory: address.GenericProxyFactoryBnb,
    masterCopyDAO: address.CreatorDAOMasterCopyBnb,
    masterCopyCollection: address.CreateCollectionMasterCopyBnb,
    masterMembershipCollection: address.CreateMembershipCollectionMasterCopyBnb,
    masterRoyaltySplitter: address.RoyaltySplitterMasterCopyBnb,
    network: 56,
    gnosis: `${gnosisFundTransferUrl}/bnb`,
    raribleNFTDetailsUrl: raribleNFTDetailsUrl,
    openSeaNFTDetailsUrl: `${openSeaNFTDetailsUrl}/BSC/`,
    viewContractAddressUrl: `https://bscscan.com/address/`,
    viewTxUrl: `https://bscscan.com/tx/`,
    decirTreasury: address.decirTreasuryBnb,
    discount: address.discountBnb,
    scanApi: `https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_BNB_SCAN}`,
    priceApi: `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${process.env.NEXT_PUBLIC_BNB_TESTNET_SCAN}`,
    config: {
      chainId: '0x38',
      rpcUrls: ['https://bsc-dataseed1.defibit.io'],
      chainName: 'Binance Smart Chain',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      blockExplorerUrls: ['https://bscscan.com'],
    },
  },
};

let NETWORKS = process.env.NEXT_PUBLIC_ENV === 'production' ? MAINNET : TESTNET;

export { NETWORKS };
