import Config from '../../config/config';
import {
  ls_ClearLocalStorage,
  ls_SetUserID,
  ls_SetUserRefreshToken,
  ls_SetUserToken,
  ls_SetWalletType,
} from 'util/ApplicationStorage';
import { authSlice } from './slice';
import { persistor } from '../../pages/_app';

const { loadingLogin, loginSuccess, loginError, logginOut } = authSlice.actions;

const ROOT_URL = Config.API_ENDPOINT;

export const loginUser = (loginPayload) => async (dispatch) => {
  dispatch(loadingLogin());
  try {
    const bodyFormData = new FormData();
    bodyFormData.append('address', loginPayload.address);
    bodyFormData.append('signature', loginPayload.signature);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': 'http://127.0.0.1:3000/',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: bodyFormData,
    };
    let response = await fetch(`${ROOT_URL}/auth/login`, requestOptions);
    let data = await response.json();
    if (data?.token) {
      dispatch(loginSuccess({ data, walletAddress: loginPayload.address }));
      ls_SetUserToken(data.token);
      ls_SetUserID(data.user_id);
      ls_SetUserRefreshToken(data.refresh_token);
      ls_SetWalletType(loginPayload['wallet']);
      return data;
    } else {
      dispatch(loginError(data.errors[0]));
    }
  } catch (err) {
    dispatch(loginError(err));
    console.log(err);
  }
};

export const logout = () => async (dispatch) => {
  dispatch(logginOut());
  ls_ClearLocalStorage();
  persistor.pause();
  persistor.flush().then(() => {
    return persistor.purge();
  });
};
