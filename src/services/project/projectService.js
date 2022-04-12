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

export async function createProject(payload) {
  const bodyFormData = new FormData();
  bodyFormData.append("name", payload.name);
  bodyFormData.append("category_id", payload.category_id);
  bodyFormData.append("voting_power", payload.voting_power);
  bodyFormData.append("voter_mode", payload.voter_mode);
  return await client("POST", `/project`, bodyFormData);
}
export async function updateProject(screen, payload) {
  if (screen === "create") {
    const bodyFormData = new FormData();
    bodyFormData.append("voting_power", payload.voting_power);
    bodyFormData.append("voter_mode", payload.voter_mode);
    bodyFormData.append("name", payload.name);
    bodyFormData.append("cover", payload.cover);
    payload.photos.forEach((element, index) => {
      bodyFormData.append(`image_${index + 1}`, element);
    });
    bodyFormData.append("overview", payload.overview);
    bodyFormData.append("category_id", payload.category_id);
    bodyFormData.append("tags", payload.tags);
    bodyFormData.append("need_member", payload.need_member);
    bodyFormData.append("roles", payload.roles);

    return await client("PUT", `/project/${payload.id}`, bodyFormData);
  }
}

export async function getMemberProjectList(payload) {
  return await client("GET", `/project`);
}
