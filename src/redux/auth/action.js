import Config from "../../config/config";
import {
  ls_ClearLocalStorage,
  ls_SetUserID,
  ls_SetUserRefreshToken,
  ls_SetUserToken,
  ls_SetWalletType,
} from "util/ApplicationStorage";

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
      ls_SetUserToken(data.token);
      ls_SetUserID(data.user_id);
      ls_SetUserRefreshToken(data.refresh_token);
      ls_SetWalletType(loginPayload["wallet"]);
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
  dispatch({ type: "LOGOUT" });
  ls_ClearLocalStorage();
}
