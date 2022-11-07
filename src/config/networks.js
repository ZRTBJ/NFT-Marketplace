import Eth from "assets/images/eth.svg";
import Matic from "assets/images/polygon.svg";
import { address } from "./contractAddresses.js";

const gnosisFundTransferUrl = "https://gnosis-safe.io/app";
const raribleNFTDetailsUrl =
  process.env.REACT_APP_ENV === "production"
    ? "https://rarible.com/token"
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
    masterCopyDAO: address.CreatorDAOMasterCopy,
    createFactoryDAO: address.CreatorDAOFactory,
    masterCopyCollection: address.CreateCollectionMasterCopy,
    createFactoryCollection: address.CreateCollectionFacotory,
    masterMembershipCollection: address.CreateMembershipCollectionMasterCopy,
    createMembershipFactoryCollection:
      address.CreateMembershipCollectionFactory,
    masterRoyaltySplitter: address.RoyaltySplitterMasterCopy,
    createRoyaltySplitter: address.RoyaltySplitterFactory,
    network: 5,
    gnosis: `${gnosisFundTransferUrl}/gor/`,
    raribleNFTDetailsUrl: raribleNFTDetailsUrl,
    openSeaNFTDetailsUrl: `${openSeaNFTDetailsUrl}/goerli/`,
    viewContractAddressUrl: `https://goerli.etherscan.io/address/`,
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
    masterCopyDAO: address.CreatorDAOMasterCopyMumbai,
    createFactoryDAO: address.CreatorDAOFactoryMumbai,
    masterCopyCollection: address.CreateCollectionMasterCopyMumbai,
    createFactoryCollection: address.CreateCollectionFacotoryMumbai,
    masterMembershipCollection:
      address.CreateMembershipCollectionMasterCopyMumbai,
    createMembershipFactoryCollection:
      address.CreateMembershipCollectionFactoryMumbai,
    masterRoyaltySplitter: address.RoyaltySplitterMasterCopyMumbai,
    createRoyaltySplitter: address.RoyaltySplitterFactoryMumbai,
    network: 80001,
    gnosis: `${gnosisFundTransferUrl}/matic/`,
    raribleNFTDetailsUrl: raribleNFTDetailsUrl,
    openSeaNFTDetailsUrl: `${openSeaNFTDetailsUrl}/mumbai/`,
    viewContractAddressUrl: `https://mumbai.polygonscan.com/address/`,
  },
};

//TODO: Update as per mainnet
const MAINNET = {
  1: {
    networkName: "Ethereum Mainnet",
    crypto: "ETH",
    quickNodeURL: process.env.REACT_APP_ETHEREUM_QUICKNODE_URL,
    value: "eth",
    label: "ETH",
    icon: Eth,
    forwarder: process.env.REACT_APP_MINIMAL_FORWARDER_GOERLI,
    webhook: process.env.REACT_APP_WEBHOOK_URL_MUMBAI,
    masterCopyDAO: address.CreatorDAOMasterCopy,
    createFactoryDAO: address.CreatorDAOFactory,
    masterCopyCollection: address.CreateCollectionMasterCopy,
    createFactoryCollection: address.CreateCollectionFacotory,
    masterMembershipCollection: address.CreateMembershipCollectionMasterCopy,
    createMembershipFactoryCollection:
      address.CreateMembershipCollectionFactory,
    masterRoyaltySplitter: address.RoyaltySplitterMasterCopy,
    createRoyaltySplitter: address.RoyaltySplitterFactory,
    network: 1,
    gnosis: `${gnosisFundTransferUrl}/eth/`,
    raribleNFTDetailsUrl: raribleNFTDetailsUrl,
    openSeaNFTDetailsUrl: `${openSeaNFTDetailsUrl}/ethereum/`,
    viewContractAddressUrl: `https://etherscan.io/address/`,
  },
  137: {
    networkName: "Polygon Mainnet",
    crypto: "MATIC",
    quickNodeURL: process.env.REACT_APP_POLYGON_QUICKNODE_URL,
    value: "matic",
    label: "MATIC",
    icon: Matic,
    forwarder: process.env.REACT_APP_MINIMAL_FORWARDER_GOERLI,
    webhook: process.env.REACT_APP_WEBHOOK_URL_MUMBAI,
    masterCopyDAO: address.CreatorDAOMasterCopy,
    createFactoryDAO: address.CreatorDAOFactory,
    masterCopyCollection: address.CreateCollectionMasterCopy,
    createFactoryCollection: address.CreateCollectionFacotory,
    masterMembershipCollection: address.CreateMembershipCollectionMasterCopy,
    createMembershipFactoryCollection:
      address.CreateMembershipCollectionFactory,
    masterRoyaltySplitter: address.RoyaltySplitterMasterCopy,
    createRoyaltySplitter: address.RoyaltySplitterFactory,
    network: 137,
    gnosis: `${gnosisFundTransferUrl}/matic/`,
    raribleNFTDetailsUrl: raribleNFTDetailsUrl,
    openSeaNFTDetailsUrl: `${openSeaNFTDetailsUrl}/matic/`,
    viewContractAddressUrl: `https://polygonscan.com/address/`,
  },
};

let NETWORKS = process.env.REACT_APP_ENV === "production" ? MAINNET : TESTNET;

export { NETWORKS };
