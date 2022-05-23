const KEY_DEPLOYED_PROJECT_LIST = "DEPLOYED_PROJECT_LIST";
const KEY_WALLET_TYPE = "wallet";

export function getAllProjectDeployData() {
  const datas = localStorage.getItem(KEY_DEPLOYED_PROJECT_LIST);
  return datas ? JSON.parse(datas) : [];
}

export function addProjectDeployData({
  projectId,
  etherscan,
  function_uuid,
  data,
}) {
  try {
    const newDeployObject = { projectId, etherscan, function_uuid, data };
    const oldData = getAllProjectDeployData();
    const deployObject = oldData.find((x) => x.function_uuid === function_uuid);
    if (deployObject) {
      deployObject.etherscan = etherscan;
      deployObject.data = data;
    } else {
      oldData.push(newDeployObject);
    }
    localStorage.setItem(KEY_DEPLOYED_PROJECT_LIST, JSON.stringify(oldData));
  } catch {
    console.log("Failed to store");
  }
}

export function getWalletType() {
  return localStorage.getItem(KEY_WALLET_TYPE);
}
