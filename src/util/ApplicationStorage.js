const KEY_NOTIFICATION_LIST = "NOTIFICATION_LIST";
const KEY_WALLET_TYPE = "wallet";

export function getAllNotificationData() {
  const datas = localStorage.getItem(KEY_NOTIFICATION_LIST);
  return datas ? JSON.parse(datas) : [];
}

export function addNotificationData({
  projectId,
  etherscan,
  function_uuid,
  data,
}) {
  try {
    const newNotificationObject = { projectId, etherscan, function_uuid, data };
    const oldData = getAllNotificationData();
    const notificationObject = oldData.find(
      (x) => x.function_uuid === function_uuid
    );
    if (notificationObject) {
      notificationObject.etherscan = etherscan;
      notificationObject.data = data;
    } else {
      oldData.push(newNotificationObject);
    }
    localStorage.setItem(KEY_NOTIFICATION_LIST, JSON.stringify(oldData));
  } catch {
    console.log("Failed to store");
  }
}

export function getWalletType() {
  return localStorage.getItem(KEY_WALLET_TYPE);
}
