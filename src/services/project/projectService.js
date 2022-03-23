import { client } from "../httpClient";

export function getUserProjectListById(payload) {
  return client(
    "GET",
    `/user/${payload.id}/project?page=${payload.page}&per_page=${payload.perPage}`
  );
}
