import Eth from "assets/images/eth.svg";
import Matic from "assets/images/polygon.svg";
import address from "./deploy.json";

const TESTNET = {
  5: {
    networkName: "Goerli Testnet",
    cryto: "GoerliETH",
    quickNodeURL: process.env.REACT_APP_GOERLI_QUICKNODE_URL,
    value: "eth",
    label: "ETH",
    icon: Eth,
    forwarder: process.env.REACT_APP_MINIMAL_FORWARDER_GOERLI,
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
  },
  80001: {
    networkName: "Polygon Testnet Mumbai",
    cryto: "MATIC",
    quickNodeURL: process.env.REACT_APP_MUMBAI_QUICKNODE_URL,
    value: "matic",
    label: "MATIC",
    icon: Matic,
    forwarder: process.env.REACT_APP_MINIMAL_FORWARDER_MUMBAI,
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
  },
};

let NETWORKS = process.env.NODE_ENV === "production" ? MAINNET : TESTNET;

export { NETWORKS };
