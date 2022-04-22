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
  } else {
    const bodyFormData = new FormData();
    bodyFormData.append("name", payload.name);
    if (payload.cover !== null) {
      bodyFormData.append("cover", payload.cover);
    }
    if (payload.photos !== null) {
      let photoIndex = payload.photosLengthFromResponse;
      if (photoIndex === 0) {
        photoIndex = photoIndex + 1;
        payload.photos.forEach((element, index) => {
          bodyFormData.append(`image_${photoIndex}`, element);
          photoIndex = photoIndex + 1;
        });
      } else {
        if (payload.photos.length === payload.remainingPhotosName.length) {
          for (let index = 0; index < payload.photos.length; index++) {
            const element = payload.photos[index];
            bodyFormData.append(
              `image_${payload.remainingPhotosName[index][3]}`,
              element
            );
          }
        }
      }
    }

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
export async function getProjectDetailsById(payload) {
  return await client("GET", `/project/${payload.id}`);
}
export async function deleteAssetsOfProject(payload) {
  return await client(
    "DELETE",
    `/project/${payload.projectId}/asset/${payload.assetsId}`
  );
}
export async function getProjectPollList(projectId, pageNo, pageSize) {
  return await client(
    "GET",
    `/project/${projectId}/poll?page=${pageNo}&limit=${pageSize}`
  );
}

export async function createProjectPoll(projectId, payload) {
  return await client(
    "POST",
    `/project/${projectId}/poll`,
    payload,
    "formdata"
  );
}
