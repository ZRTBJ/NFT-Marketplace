import { client } from "../httpClient";

export async function getUserProjectListById(payload) {
  return await client(
    "GET",
    `/user/${payload.id}/project?page=${payload.page}&per_page=${payload.perPage}`
  );
}

export async function checkUniqueProjectName(payload) {
  const bodyFormData = new FormData();
  bodyFormData.append("project_name", payload.projectName);
  return await client("POST", `/project/validate`, bodyFormData);
}

export async function getProjectCategory() {
  return await client("GET", `/meta/category`);
}
