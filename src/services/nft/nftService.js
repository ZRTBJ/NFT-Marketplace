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

export async function generateUploadkey(payload) {
  return await client('POST', `/upload/genKey`, payload, 'formdata');
}

export async function getDefinedProperties() {
  return await client('GET', `/meta/category`);
}
export async function getNftDetails(id) {
  return await client('GET', `/nft/${id}`);
}
