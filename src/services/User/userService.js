import { client } from "../httpClient";

export async function getUserInfo(userID) {
  return await client("GET", `/user/${userID}`);
}

export async function updateUserInfo(userID, payload) {
  return await client("PUT", `/user/${userID}`, payload, "formdata");
}
export async function getUserBookmarkedProjectList(payload) {
  return await client(
    "GET",
    `/user/${payload.userID}/project/bookmark?page=${payload.page}&limit=${payload.limit}`
  );
}
