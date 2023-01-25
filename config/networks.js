
import Eth from "assets/images/eth.svg";
import Matic from "assets/images/polygon.svg";
import Bnb from "assets/images/bnb.svg";
import { address } from "./contractAddresses.js";
import PolyScan from 'assets/images/poly-scan.png';
import EthScan from 'assets/images/eth-scan.png';

const gnosisFundTransferUrl = "https://app.safe.global";
const raribleNFTDetailsUrl =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? "https://rarible.com/token/"
    : "https://testnet.rarible.com/token/";
const openSeaNFTDetailsUrl =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? "https://opensea.io/assets/"
    : "https://testnets.opensea.io/assets";

const TESTNET = {
  5: {
    networkName: "Goerli Testnet",
    cryto: "GoerliETH",
    quickNodeURL: process.env.NEXT_PUBLIC_GOERLI_QUICKNODE_URL,
    value: "eth",
    label: "ETH",
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
  },
  97: {
    networkName: "BNB Testnet",
    cryto: "BNB",
    quickNodeURL: process.env.NEXT_PUBLIC_BNBTEST_QUICKNODE_URL,
    value: "bnb",
    label: "BNB",
    icon: Bnb,
    forwarder: address.MinimalForwarderBnbTest,
    webhook: process.env.NEXT_PUBLIC_WEBHOOK_URL_BNBTEST,
    genericProxyFacotory: address.GenericProxyFactoryBnbTest,
    masterCopyDAO: address.CreatorDAOMasterCopyBnbTest,
    masterCopyCollection: address.CreateCollectionMasterCopyBnbTest,
    masterMembershipCollection: address.CreateMembershipCollectionMasterCopyBnbTest,
    masterRoyaltySplitter: address.RoyaltySplitterMasterCopyBnbTest,
    network: 97,
    gnosis: `${gnosisFundTransferUrl}/bnb`,
    raribleNFTDetailsUrl: raribleNFTDetailsUrl,
    openSeaNFTDetailsUrl: `${openSeaNFTDetailsUrl}/BSC_TESTNET/`,
    viewContractAddressUrl: `https://testnet.bscscan.com/address/`,
    viewTxUrl: `https://testnet.bscscan.com/tx/`,
    decirTreasury: address.decirTreasuryBnbTest,
    discount: address.discountBnbTest,
  },
  80001: {
    networkName: "Polygon Testnet Mumbai",
    cryto: "MATIC",
    quickNodeURL: process.env.NEXT_PUBLIC_MUMBAI_QUICKNODE_URL,
    value: "matic",
    label: "MATIC",
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
  },
};

const MAINNET = {
  1: {
    networkName: "Ethereum Mainnet",
    crypto: "ETH",
    quickNodeURL: process.env.NEXT_PUBLIC_ETHEREUM_QUICKNODE_URL,
    value: "eth",
    label: "ETH",
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
    viewTxUrl: "https://etherscan.io/tx/",
    decirTreasury: address.decirTreasuryEthereum,
    discount: address.discountEthereum,
    scan: EthScan,
    alchamey: process.env.NEXT_PUBLIC_ETHEREUM_NFT_ALCHEMY_URL,
  },
  137: {
    networkName: "Polygon Mainnet",
    crypto: "MATIC",
    quickNodeURL: process.env.NEXT_PUBLIC_POLYGON_QUICKNODE_URL,
    value: "matic",
    label: "MATIC",
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
    viewTxUrl: "https://polygonscan.com/tx/",
    decirTreasury: address.decirTreasuryPolygon,
    discount: address.discountPolygon,
    scan: PolyScan,
    alchamey: process.env.NEXT_PUBLIC_POLYGON_NFT_ALCHEMY_URL,
  },
};

let NETWORKS = process.env.NEXT_PUBLIC_ENV === "production" ? MAINNET : TESTNET;

export { NETWORKS };
