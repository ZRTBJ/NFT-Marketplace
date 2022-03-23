import axios from "axios";
import Config from "../config";

const ROOT_URL = Config.API_ENDPOINT;

export async function client(method, url, body) {
  const headers = { "Content-Type": "application/json" };

  const token = localStorage.getItem("currentUser");
  if (token && token.length > 0) {
    headers["token"] = token;
  }

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status == 403) {
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

const refreshToken = () => {
  // gets new access token
  alert("refreshToken");
};
