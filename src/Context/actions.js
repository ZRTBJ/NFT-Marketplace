import Config from "../config";
import { torusLogout } from "util/Torus";

const ROOT_URL = Config.API_ENDPOINT; //"https://reqres.in/api";

export async function loginUser(dispatch, loginPayload) {
  const bodyFormData = new FormData();
  bodyFormData.append("address", loginPayload.address);
  bodyFormData.append("signature", loginPayload.signature);
  const requestOptions = {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "http://127.0.0.1:3000/",
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    body: bodyFormData,
  };

  try {
    dispatch({ type: "REQUEST_LOGIN" });
    let response = await fetch(`${ROOT_URL}/auth/login`, requestOptions);
    let data = await response.json();
    if (data.token) {
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      localStorage.setItem("currentUser", JSON.stringify(data.token));
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("tokenDate", new Date());
      return data;
    }

    dispatch({ type: "LOGIN_ERROR", error: data.errors[0] });
    console.log(data.errors[0]);
    return;
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", error: error });
    console.log(error);
  }
}

export async function logout(dispatch) {
  torusLogout();
  dispatch({ type: "LOGOUT" });
  localStorage.clear();
}
