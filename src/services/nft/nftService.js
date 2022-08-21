import { client } from '../httpClient';
export async function getNftListByProjectId(payload) {
  return await client(
    'GET',
    `/nft?project_uuid=${payload.projectId}&page=${payload.page}&limit=${payload.perPage}`
  );
}
export async function getNftListByUserId(payload) {
  return await client(
    'GET',
    `/nft?user_uid=${payload.userId}&page=${payload.page}&limit=${payload.perPage}`
  );
}
export async function saveNFT(payload) {
  return await client('POST', `/nft`, payload, 'formdata');
}
export async function createMembershipNft(payload) {
  return await client('POST', `/membership-nft`, payload, 'formdata');
}

export async function generateUploadkey(payload) {
  return await client('POST', `/upload/genKey`, payload, 'formdata');
}

export async function getDefinedProperties() {
  return await client('GET', `/meta/category`);
}
export async function getNftDetails(id) {
  return await client('GET', `/nft/${id}`);
}

export async function saveRightAttachedNFT(payload) {
  return await client('POST', `/ranft`, payload, 'formdata');
}

export async function getRightAttachedNFT(id) {
  return await client('GET', `/ranft/${id}`);
}

export async function saveProductNFT(payload) {
  return await client('POST', `/product-nft`, payload, 'formdata');
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
    `/${collectionType}-nft/${
      collectionType === "product" ? collectionId : nftId
    }/sale`,
    payload,
    'formdata'
  );
}

export async function getassetDetails(id) {
  return await client('GET', `/asset?job_id=${id}`);
}

export async function updateRoyalty(id, payload) {
  return await client('PUT', `/ranft/${id}/royalty`, payload, 'formdata');
}
