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

export async function createTokenGatedContent(data) {
  const bodyFormData = new FormData();
  for (const key in data) {
    bodyFormData.append(`${key}`, data[key]);
  }
  return await client('POST', `/tkg-content`, bodyFormData, 'formdata');
}

export async function updateTokenGatedContent(id, data) {
  const bodyFormData = new FormData();
  for (const key in data) {
    bodyFormData.append(`${key}`, data[key]);
  }
  return await client('PUT', `/tkg-content/${id}`, bodyFormData, 'formdata');
}

export async function publishTokenGatedContent(id, data) {
  const bodyFormData = new FormData();
  for (const key in data) {
    bodyFormData.append(`${key}`, data[key]);
  }
  return await client(
    'PUT',
    `/tkg-content/${id}/publish`,
    bodyFormData,
    'formdata'
  );
}

export async function getContentList(payload) {
  return await client(
    'GET',
    `/tokengate/${payload.id}/contents?page=${payload.page}&limit=10&order_by=${payload.orderBy}`
  );
}

export async function deleteTokenGatedContent(id, data) {
  return await client('DELETE', `/tkg-content/${id}`);
}
