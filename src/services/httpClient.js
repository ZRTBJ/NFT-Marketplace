import axios from "axios";
import Config from "../config";
import jwt from "jwt-decode";

const ROOT_URL = Config.API_ENDPOINT;
let token;

export async function client(method, url, body) {
  const headers = { "Content-Type": "application/json" };

  token = localStorage.getItem("currentUser");

  if (token && token.length > 0) {
    headers["token"] = token;
  }

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 403) {
        refreshToken();
      }
    }
  );
  return await axios({
    method: method,
    url: `${ROOT_URL + url}`,
    data: body,
    headers: headers,
  });
}

async function refreshToken(token) {
  const tokenDate = !!localStorage.getItem("tokenDate")
    ? new Date(localStorage.getItem("tokenDate"))
    : new Date();
  const user = jwt(token);
  const expDay = Math.floor(user.exp / 1000 / 60 / 60 / 24);
  const today = new Date();
  const diff = Math.ceil((today - tokenDate) / (1000 * 60 * 60 * 24));
  if (diff >= 18) {
    const headers = {
      "Content-Type": "multipart/form-data",
      refresh_token: token,
    };
    const bodyFormData = new FormData();
    bodyFormData.append(
      "address",
      "0xebA7aDFe2B4364B1cE9D64cCf73ba73595347968"
    );
    bodyFormData.append(
      "signature",
      "0xa7210c38b50fd949d6a1039671ffcb4485792a3473de01899d613b8d230bdcaf133b6fa0a2915be66308da2601aeb2e9bdf450444ccb82153588901b2d46d26c1b"
    );
    const response = await axios({
      method: "POST",
      url: `${ROOT_URL + "/auth/refresh"}`,
      data: bodyFormData,
      headers: headers,
    });
    debugger;
  }
}
