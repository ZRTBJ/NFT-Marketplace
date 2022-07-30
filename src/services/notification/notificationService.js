import { client } from "../httpClient";

export async function getUserNotifications() {
  return await client(
    "GET",
    `/user/notifications?order_by=newer&page=1&per_page=15`
  );
}

export async function markNotificationAsRead(uuid) {
  return await client("PUT", `/user/notifications/${uuid}`, { read: true });
}
