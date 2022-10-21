import axios from "axios";
import Config from "../config/config";
// import jwt from "jwt-decode";

const ROOT_URL = Config.API_ENDPOINT;

export async function client(method, url, body, contentType) {
  let token;
  const refreshTkn = localStorage.getItem("refresh_token");

  if (refreshTkn && refreshTkn.length > 0) {
    token = await refreshToken();
  }

  // headers
  let headers;

  if (contentType === "formdata") {
    headers = { "Content-Type": "multipart/form-data" };
  } else {
    headers = { "Content-Type": "application/json" };
  }
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

async function refreshToken() {
  const refreshTkn = localStorage.getItem("refresh_token");
  let token = localStorage.getItem("currentUser");
  if (refreshTkn) {
    // const user = jwt(refreshTkn);
    // const tknExpDate = new Date(user.exp * 1000);
    // const today = new Date();
    // const diff = (tknExpDate - today) / (1000 * 60 * 60 * 24);
    // if (diff <= 6.96) {
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

    localStorage.setItem("currentUser", response.token);
    localStorage.setItem("user_id", response.user_id);
    localStorage.setItem("refresh_token", response["refresh_token"]);

    token = response.token;
    // }
  }
  return token;
}

async function tokenExpired() {
  await refreshToken();
}

axios.interceptors.response.use(
  (response) => {
    if (response?.data?.code === 4031 || response?.data?.code === 4032) {
      tokenExpired();
    }
    return response.data;
  },
  (error) => {
    if (error?.data?.code === 4031 || error?.data?.code === 4032) {
      tokenExpired();
    }
    return error.response.data;
  }
);
