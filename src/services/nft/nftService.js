import { client } from "../httpClient";
export async function getNftListByProjectId(payload) {
  return await client(
    "GET",
    `/nft?project_uuid=${payload.projectId}&page=${payload.page}&limit=${payload.perPage}`
  );
}
export async function getNftListByUserId(payload) {
  return await client(
    "GET",
    `/nft?user_uid=${payload.userId}&page=${payload.page}&limit=${payload.perPage}`
  );
}
export async function saveNFT(payload) {
  return await client("POST", `/nft`, payload, "formdata");
}
export async function createMembershipNft(payload) {
  return await client("POST", `/membership-nft`, payload, "formdata");
}

export async function generateUploadkey(payload) {
  return await client("POST", `/upload/genKey`, payload, "formdata");
}

export async function generateUploadkeyGcp(payload) {
  return await client("POST", `/upload/signKey`, payload, "formdata");
}

export async function getDefinedProperties() {
  return await client("GET", `/meta/category`);
}

export async function getNftDetails(type, id) {
  console.log(type, id);
  let typeValue =
    type === "membership"
      ? "/membership-nft/"
      : type === "product"
      ? "/product-nft/"
      : "/nft/";
  return await client("GET", `${typeValue}${id}`);
}

export async function saveRightAttachedNFT(payload) {
  return await client("POST", `/ranft`, payload, "formdata");
}

export async function getRightAttachedNFT(id) {
  return await client("GET", `/ranft/${id}`);
}

export async function saveProductNFT(payload) {
  return await client("POST", `/product-nft`, payload, "formdata");
}

export async function updateProductNFT(id, payload) {
  return await client("PUT", `/product-nft/${id}`, payload, "formdata");
}
export async function updateMembershipNFT(id, payload) {
  return await client("PUT", `/membership-nft/${id}`, payload, "formdata");
}

export async function setSalesPage(
  collectionType,
  collectionId,
  payload,
  nftId
) {
  console.log(collectionId);
  return await client(
    "PUT",
    `/${collectionType}-nft/collection/${
      collectionType === "product" ? collectionId : nftId
    }/sale`,
    payload,
    "formdata"
  );
}

export async function getassetDetails(id) {
  return await client("GET", `/asset?job_id=${id}`);
}

export async function updateRoyalty(id, payload) {
  return await client("PUT", `/ranft/${id}/royalty`, payload, "formdata");
}

export async function getIdbyCode(id) {
  return await client("GET", `/ranft/invitation?invitation_code=${id}`);
}

export async function mintRANFT(id) {
  return await client("POST", `/ranft/${id}/mint`);
}
export async function mintProductOrMembershipNft(payload) {
  const url =
    payload.type === "membership" ? "/membership-nft" : "/product-nft";
  return await client(
    "POST",
    `${url}/${payload.id}/mint`,
    payload.data,
    "formdata"
  );
}
export async function getMintedNftListByUserId(payload) {
  return await client(
    "GET",
    `/user/${payload.userId}/nft?page=${payload.page}&limit=${payload.limit}`
  );
}
