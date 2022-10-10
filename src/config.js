const BASE_URL = process.env.REACT_APP_API_ENDPOINT;
const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;
const WEB_SOKET = process.env.REACT_APP_WEB_SOKET;
const RPC_URL = process.env.REACT_APP_RPC_URL;
const FILE_SERVER_URL = process.env.REACT_APP_FILE_SERVER_ENDPOINT;
const Config = {
  API_ENDPOINT: BASE_URL,
  CHAIN_ID: CHAIN_ID,
  WEB_SOKET: WEB_SOKET,
  RPC_URL: RPC_URL,
  FILE_SERVER_URL: FILE_SERVER_URL,
};

export default Config;
