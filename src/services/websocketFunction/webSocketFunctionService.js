import { client } from "../httpClient";

export async function getFunctionStatus(fuuid) {
  return await client("GET", `/function/${fuuid}`);
}
