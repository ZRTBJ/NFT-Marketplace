import { client } from "../httpClient";

export async function getUserInfo(userID) {
  return await client("GET", `/user/${userID}`);
}
