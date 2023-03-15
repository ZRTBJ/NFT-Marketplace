/**
 * This file handle all local storage common storages
 * All function here must start with 'ls_' word to understand as 'localStorage'
 */
const KEY_USER_TOKEN = 'currentUser';
const KEY_USER_REFRESH_TOKEN = 'refresh_token';
const KEY_USER_ID = 'user_id';
const KEY_NOTIFICATION_LIST = 'NOTIFICATION_LIST';
const KEY_WALLET_TYPE = 'wallet';
const KEY_WALLET_ADDRESS = 'walletAddress';
const KEY_NETWORK_CHAIN = 'networkChain';
const NEW_USER = 'newUser';
const GAS_PRICE = 'gasPrice';

//---------- User
export function ls_GetUserToken() {
  return typeof window !== 'undefined' && localStorage?.getItem(KEY_USER_TOKEN);
}

export function ls_SetUserToken(token) {
  typeof window !== 'undefined' && localStorage?.setItem(KEY_USER_TOKEN, token);
}

export function ls_GetUserRefreshToken() {
  return (
    typeof window !== 'undefined' &&
    localStorage?.getItem(KEY_USER_REFRESH_TOKEN)
  );
}

export function ls_SetUserRefreshToken(token) {
  typeof window !== 'undefined' &&
    localStorage.setItem(KEY_USER_REFRESH_TOKEN, token);
}

export function ls_GetUserID() {
  return typeof window !== 'undefined' && localStorage?.getItem(KEY_USER_ID);
}

export function ls_SetUserID(uid) {
  typeof window !== 'undefined' && localStorage?.setItem(KEY_USER_ID, uid);
}

export function ls_SetLatestGasPrice(data) {
  typeof window !== 'undefined' && localStorage.setItem(GAS_PRICE, data);
}

export function ls_GetLatestGasPrice() {
  typeof window !== 'undefined' && localStorage.getItem(GAS_PRICE);
}

//------ Blockchain
export function ls_GetChainID() {
  let chainId;
  if (typeof window !== 'undefined') {
    chainId = localStorage?.getItem(KEY_NETWORK_CHAIN);
  }

  return chainId ? Number(chainId) : 0;
}

export function ls_SetChainID(chainId) {
  typeof window !== 'undefined' &&
    localStorage?.setItem(KEY_NETWORK_CHAIN, chainId);
}

export function ls_GetWalletType() {
  return (
    typeof window !== 'undefined' && localStorage?.getItem(KEY_WALLET_TYPE)
  );
}

export function ls_SetWalletType(walletType) {
  return (
    typeof window !== 'undefined' &&
    localStorage?.setItem(KEY_WALLET_TYPE, walletType)
  );
}

export function ls_GetWalletAddress() {
  return (
    typeof window !== 'undefined' && localStorage?.getItem(KEY_WALLET_ADDRESS)
  );
}

export function ls_SetNewUser(value) {
  return (
    typeof window !== 'undefined' && localStorage?.setItem(NEW_USER, value)
  );
}

export function ls_GetNewUser() {
  return typeof window !== 'undefined' && localStorage?.getItem(NEW_USER);
}

export function ls_SetWalletAddress(address) {
  typeof window !== 'undefined' &&
    localStorage?.setItem(KEY_WALLET_ADDRESS, address);
}

//--------- Notification

export function ls_GetAllNotificationData() {
  const datas =
    typeof window !== 'undefined' &&
    localStorage.getItem(KEY_NOTIFICATION_LIST);
  return datas ? JSON.parse(datas) : [];
}

export function ls_AddNotificationData({
  projectId,
  etherscan,
  function_uuid,
  data,
}) {
  try {
    const newNotificationObject = { projectId, etherscan, function_uuid, data };
    const oldData = ls_GetAllNotificationData();
    const notificationObject = oldData.find(
      (x) => x.function_uuid === function_uuid
    );
    if (notificationObject) {
      notificationObject.etherscan = etherscan;
      notificationObject.data = data;
    } else {
      oldData.push(newNotificationObject);
    }
    typeof window !== 'undefined' &&
      localStorage.setItem(KEY_NOTIFICATION_LIST, JSON.stringify(oldData));
  } catch {
    console.log('Failed to store');
  }
}

//---------- Other
export function ls_ClearLocalStorage() {
  localStorage.clear();
}
