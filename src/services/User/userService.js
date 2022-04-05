import { client } from "../httpClient";

export async function getUserInfo(userID) {
  return await client("GET", `/user/${userID}`);
}

export async function updateUserInfo(userID, payload) {
  return await client("PUT", `/user/${userID}`, payload, "formdata");
}
