import { client } from "../httpClient";

export async function getUserProjectListById(payload) {
  return await client(
    "GET",
    `/user/${payload.id}/project?page=${payload?.page}&limit=${payload?.perPage}`
  );
}
export async function getPublicProjectList(payload) {
  if (payload) {
    const limit = `${payload.limit ? `limit=${payload.limit}` : ""}`;
    const page = `${payload.page ? `page=${payload.page}&` : ""}`;
    const order_by = `${
      payload.order_by ? `order_by=${payload.order_by}&` : ""
    }`;
    const keyword = `${payload.keyword ? `keyword=${payload.keyword}&` : ""}`;
    return await client("GET", `/project?${keyword}${order_by}${page}${limit}`);
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
  if (payload) {
    bodyFormData.append("name", payload.name);
    bodyFormData.append("category_id", payload.category_id);
  }

  return await client("POST", `/project`, payload ? bodyFormData : null);
}
export async function updateProject(payload) {
  const bodyFormData = new FormData();
  //  logo
  if (payload.logo !== null) {
    bodyFormData.append("cover", payload.logo);
  }
  if (payload.name) {
    bodyFormData.append("name", payload.name);
  }

  // if (payload.daoSymbol) {
  //   bodyFormData.append("dao_symbol", payload.daoSymbol);
  // }

  bodyFormData.append("treasury_wallet", payload.daoWallet);

  if (payload.overview) {
    bodyFormData.append("overview", payload.overview);
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
  if (payload.webLinks) {
    bodyFormData.append("urls", payload.webLinks);
  }
  if (payload.category_id) {
    bodyFormData.append("category_id", payload.category_id);
  }
  if (payload.blockchainCategory) {
    bodyFormData.append("blockchain", payload.blockchainCategory);
  }

  // if (payload.tags) {
  //   bodyFormData.append("tags", payload.tags);
  // }
  // if (payload.roles) {
  //   bodyFormData.append("roles", payload.roles);
  // }
  // if (payload.visibility) {
  //   bodyFormData.append("visibility", payload.visibility);
  // }
  // if (payload.token_name) {
  //   bodyFormData.append("token_name", payload.token_name);
  // }
  // if (payload.token_symbol) {
  //   bodyFormData.append("token_symbol", payload.token_symbol);
  // }
  // if (payload.token_amount_total) {
  //   bodyFormData.append("token_amount_total", payload.token_amount_total);
  // }
  return await client("PUT", `/project/${payload.id}`, bodyFormData);
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

export async function fundTransfer(payload) {
  return await client("POST", `/fund-transfer`, payload, "json", "web3");
}

export async function publishProject(projectId, payload) {
  console.log(payload);
  let request = payload
    ? client("POST", `/project/${projectId}/publish`, payload, "formdata")
    : client("POST", `/project/${projectId}/publish`, "formdata");
  return await request;
}

export async function addressGnosisSetup(addresses) {
  return await client("POST", `/project/gnosisSetup`, addresses, "formdata");
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
export async function projectBookmark(projectId, payload) {
  return await client(
    "POST",
    `/project/${projectId}/bookmark`,
    payload,
    "formdata"
  );
}

export async function contractDeploy(projectId) {
  return await client("POST", `/project/${projectId}/contract_deploy`);
}

export async function getExternalNftList(address, type) {
  return await client("GET", `/nft/external?eoa=${address}&&type=${type}`);
  // return await client(
  //   "GET",
  //   `/nft/external?eoa=0x4265de963cdd60629d03FEE2cd3285e6d5ff6015`
  // );
}

export async function mockCreateProject() {
  return await client("POST", `/project`);
}
export async function tokenBreakdown(projectId, payload) {
  return await client("PUT", `/project/${projectId}/token_breakdown`, payload);
}

export async function getBalance(pid) {
  return await client("GET", `/project/${pid}/balance`);
}
export async function transferFundApi(payload) {
  return await client(
    "PUT",
    `/project/${payload.projectId}/withdrawFund`,
    payload
  );
}
