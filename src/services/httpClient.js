import axios from "axios";
import Config from "../config";
import jwt from "jwt-decode";

const ROOT_URL = Config.API_ENDPOINT;

export async function client(method, url, body) {
  let token = localStorage.getItem("currentUser");
  const refreshTkn = localStorage.getItem("refresh_token");

  if (refreshTkn && refreshTkn.length > 0) {
    token = await refreshToken(refreshTkn);
  }

  // headers
  const headers = { "Content-Type": "application/json" };
  if (token && token.length > 0) {
    headers["token"] = token;
  }

  return await axios({
    method: method,
    url: `${ROOT_URL + url}`,
    data: body,
    headers: headers,
  });
}

async function refreshToken(refreshTkn) {
  const user = jwt(refreshTkn);
  const tknExpDate = new Date(user.exp * 1000);
  const today = new Date();
  const diff = Math.ceil((tknExpDate - today) / (1000 * 60 * 60 * 24));

  if (diff <= 1) {
    const headers = {
      "Content-Type": "multipart/form-data",
      refresh_token: refreshTkn,
    };
    const bodyFormData = new FormData();

    const response = await axios({
      method: "POST",
      url: `${ROOT_URL + "/auth/refresh"}`,
      data: bodyFormData,
      headers: headers,
    });

    localStorage.setItem("currentUser", response.data.token);
    localStorage.setItem("user_id", response.data.user_id);
    localStorage.setItem("refresh_token", response.data["refresh_token"]);

    return response.data.token;
  }
  else{
    return localStorage.getItem("currentUser");
  }
}
