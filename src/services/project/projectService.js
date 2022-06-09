import { client } from "../httpClient";

export async function getUserProjectListById(payload) {
  return await client(
    "GET",
    `/user/${payload.id}/project?page=${payload.page}&limit=${payload.perPage}`
  );
}
export async function getPublicProjectList(payload) {
  if (payload) {
    let limit = `${payload.limit ? `limit=${payload.limit}` : ""}`;
    let order_by = `${payload.order_by ? `order_by=${payload.order_by}` : ""}`;
    return await client("GET", `/project?${limit}${order_by}`);
  } else {
    return await client("GET", `/project`);
  }
}

export async function checkUniqueProjectName(payload) {
  const bodyFormData = new FormData();
  bodyFormData.append("project_name", payload.projectName);
  bodyFormData.append(`project_uuid`, payload.project_uuid);
  return await client("POST", `/project/validate`, bodyFormData);
}
export async function checkUniqueTokenInfo(payload) {
  const bodyFormData = new FormData();
  bodyFormData.append(`${payload.type}`, payload.data);
  bodyFormData.append(`project_uuid`, payload.project_uuid);
  return await client("POST", `/project/validate`, bodyFormData);
}

export async function getProjectCategory() {
  return await client("GET", `/meta/category`);
}

export async function createProject(payload) {
  const bodyFormData = new FormData();
  bodyFormData.append("name", payload.name);
  bodyFormData.append("org_type", payload.org_type);
  bodyFormData.append("category_id", payload.category_id);
  bodyFormData.append("voting_power", payload.voting_power);
  bodyFormData.append("voter_mode", payload.voter_mode);
  return await client("POST", `/project`, bodyFormData);
}
export async function updateProject(screen, payload) {
  if (screen === "create") {
    const bodyFormData = new FormData();
    bodyFormData.append("org_type", payload.org_type);
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
    bodyFormData.append("visibility", payload.visibility);

    return await client("PUT", `/project/${payload.id}`, bodyFormData);
  } else {
    const bodyFormData = new FormData();
    if (payload.org_type) {
      bodyFormData.append("org_type", payload.org_type);
    }
    if (payload.voting_power) {
      bodyFormData.append("voting_power", payload.voting_power);
    }
    if (payload.voter_mode) {
      bodyFormData.append("voter_mode", payload.voter_mode);
    }
    if (payload.name) {
      bodyFormData.append("name", payload.name);
    }
    if (payload.cover) {
      if (payload.cover !== null) {
        bodyFormData.append("cover", payload.cover);
      }
    }
    if (payload.photos) {
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
    }
    if (payload.overview) {
      bodyFormData.append("overview", payload.overview);
    }
    if (payload.category_id) {
      bodyFormData.append("category_id", payload.category_id);
    }
    if (payload.tags) {
      bodyFormData.append("tags", payload.tags);
    }
    if (payload.need_member !== undefined) {
      bodyFormData.append("need_member", payload.need_member);
    }
    if (payload.roles) {
      bodyFormData.append("roles", payload.roles);
    }
    if (payload.visibility) {
      bodyFormData.append("visibility", payload.visibility);
    }
    if (payload.token_name) {
      bodyFormData.append("token_name", payload.token_name);
    }
    if (payload.token_symbol) {
      bodyFormData.append("token_symbol", payload.token_symbol);
    }
    if (payload.token_amount_total) {
      bodyFormData.append("token_amount_total", payload.token_amount_total);
    }
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

export async function getPublishCost(projectId) {
  return await client("GET", `/project/${projectId}/publish/cost`);
}

export async function publishFundTransfer(projectId, payload) {
  return await client(
    "POST",
    `/project/${projectId}/publish/transfer_fund`,
    payload,
    "formdata"
  );
}

export async function publishProject(projectId) {
  return await client("POST", `/project/${projectId}/publish`, "formdata");
}

export async function getProjectListBySearch(payload) {
  return await client(
    "GET",
    `/project?order_by=${payload.order_by}&page=${payload.page}&limit=${payload.limit}&criteria=${payload.criteria}&keyword=${payload.keyword}`
  );
}

export async function projectLike(projectId, payload) {
  return await client(
    "POST",
    `/project/${projectId}/like`,
    payload,
    "formdata"
  );
}

export async function contractDeploy(projectId) {
  return await client("POST", `/project/${projectId}/contract_deploy`);
}

export async function getExternalNftList(address, type) {
  // return await client("GET", `/nft/external?eoa=${address}&&type=${type}`);
  return await client(
    "GET",
    `/nft/external?eoa=0x4265de963cdd60629d03FEE2cd3285e6d5ff6015`
  );
}

export async function tokenBreakdown(projectId, payload) {
  return await client("PUT", `/project/${projectId}/token_breakdown`, payload);
}
