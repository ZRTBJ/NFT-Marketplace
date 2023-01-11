import { client } from '../httpClient';

export async function createTokenGatedProject(title) {
  const bodyFormData = new FormData();
  bodyFormData.append('title', title);
  return await client('POST', `/tokengate`, bodyFormData, 'formdata');
}
export async function getTokenGatedProject(id) {
  return await client('GET', `/tokengate/${id}`);
}

export async function getTokenGatedProjectList(payload) {
  return await client(
    'GET',
    `/tokengate?page=${payload.page}&limit=${payload.limit}`
  );
}
export async function updateTokenGatedProject(payload) {
  const bodyFormData = new FormData();
  for (const key in payload) {
    bodyFormData.append(`${key}`, payload[key]);
  }
  return await client(
    'PUT',
    `/tokengate/${payload.id}`,
    bodyFormData,
    'formdata'
  );
}
