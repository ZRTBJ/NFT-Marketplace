import Eth from "assets/images/eth.svg";
import Matic from "assets/images/polygon.svg";
import { address } from "./contractAddresses.js";

const gnosisFundTransferUrl = "https://app.safe.global";
const raribleNFTDetailsUrl =
  process.env.REACT_APP_ENV === "production"
    ? "https://rarible.com/token/"
    : "https://testnet.rarible.com/token/";
const openSeaNFTDetailsUrl =
  process.env.REACT_APP_ENV === "production"
    ? "https://opensea.io/assets/"
    : "https://testnets.opensea.io/assets";

const TESTNET = {
  5: {
    networkName: "Goerli Testnet",
    cryto: "GoerliETH",
    quickNodeURL: process.env.REACT_APP_GOERLI_QUICKNODE_URL,
    value: "eth",
    label: "ETH",
    icon: Eth,
    forwarder: address.MinimalForwarderGoerli,
    webhook: process.env.REACT_APP_WEBHOOK_URL_GOERLI,
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
  },
  80001: {
    networkName: "Polygon Testnet Mumbai",
    cryto: "MATIC",
    quickNodeURL: process.env.REACT_APP_MUMBAI_QUICKNODE_URL,
    value: "matic",
    label: "MATIC",
    icon: Matic,
    forwarder: address.MinimalForwarderMumbai,
    webhook: process.env.REACT_APP_WEBHOOK_URL_MUMBAI,
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
  },
};

const MAINNET = {
  1: {
    networkName: "Ethereum Mainnet",
    crypto: "ETH",
    quickNodeURL: process.env.REACT_APP_ETHEREUM_QUICKNODE_URL,
    value: "eth",
    label: "ETH",
    icon: Eth,
    forwarder: address.MinimalForwarderEthereum,
    webhook: process.env.REACT_APP_WEBHOOK_URL_ETHEREUM,
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
  },
  137: {
    networkName: "Polygon Mainnet",
    crypto: "MATIC",
    quickNodeURL: process.env.REACT_APP_POLYGON_QUICKNODE_URL,
    value: "matic",
    label: "MATIC",
    icon: Matic,
    forwarder: address.MinimalForwarderPolygon,
    webhook: process.env.REACT_APP_WEBHOOK_URL_POLYGON,
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
  },
};

let NETWORKS = process.env.REACT_APP_ENV === "production" ? MAINNET : TESTNET;

export { NETWORKS };
