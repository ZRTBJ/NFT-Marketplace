const DEPLOYED_PROJECT_LIST = "DEPLOYED_PROJECT_LIST";

export function getAllProjectDeployData() {
  const datas = localStorage.getItem(DEPLOYED_PROJECT_LIST);
  return datas ? JSON.parse(datas) : [];
}

export function addProjectDeployData({ projectId, function_uuid, data }) {
  try {
    const newDeployObject = { projectId, function_uuid, data };
    const oldData = getAllProjectDeployData();
    const deployObject = oldData.find(
      (x) => x.projectId === projectId && x.function_uuid === function_uuid
    );
    if (deployObject) {
      deployObject.data = data;
    } else {
      oldData.push(newDeployObject);
    }
    localStorage.setItem(DEPLOYED_PROJECT_LIST, JSON.stringify(oldData));
  } catch {
    console.log("Failed to store");
  }
}
