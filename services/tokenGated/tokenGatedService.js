import { client } from '../httpClient';
import axios from 'axios';

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
    `/tokengate/${payload.id}/contents?page=${payload.page}&limit=${
      payload?.limit ? payload?.limit : 10
    }&order_by=${payload.orderBy}&file_type=${
      payload?.file_type ? payload?.file_type : ''
    }`
  );
}

export async function deleteTokenGatedContent(id, data) {
  return await client('DELETE', `/tkg-content/${id}`);
}

export async function getTokenGatedContentDetail(id) {
  return await client('GET', `/tkg-content/${id}`);
}

export async function getTokenGatedContentAsset(data) {
  return await client('GET', `${data}`);
}

export async function configMultiContent(id, data) {
  const bodyFormData = new FormData();
  bodyFormData.append('configs', data);
  return await client(
    'PUT',
    `/tkg-content/${id}/config`,
    bodyFormData,
    'formdata'
  );
}

export async function getUserAuthorization(link) {
  return await axios.get(link);
}
export async function reportTokenGatedProject(payload) {
  const bodyFormData = new FormData();
  bodyFormData.append('scam', payload.isScam);
  return await client(
    'PUT',
    `/tokengate/${payload.id}/report-scam`,
    bodyFormData,
    'formdata'
  );
}
export async function reportTokenContent(payload) {
  const bodyFormData = new FormData();
  bodyFormData.append('scam', payload.isScam);
  return await client(
    'PUT',
    `/tkg-content/${payload?.id}/report-scam`,
    bodyFormData,
    'formdata'
  );
}

export async function deleteTokenGatedProject(id) {
  return await client('DELETE', `/tkg-content/${id}`);
}
