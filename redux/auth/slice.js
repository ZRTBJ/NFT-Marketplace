import {
  ls_GetUserID,
  ls_GetUserToken,
  ls_GetWalletAddress,
  ls_GetWalletType,
} from 'util/ApplicationStorage';
import { createSlice } from '@reduxjs/toolkit';

let user = ls_GetUserID();
let token = ls_GetUserToken();
let wallet = ls_GetWalletType();
let walletAddress = ls_GetWalletAddress();

const initialState = {
  user: '' || user,
  token: '' || token,
  loading: false,
  errorMessage: null,
  wallet: wallet ? wallet : '',
  walletAddress: walletAddress ? walletAddress : '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loadingLogin(state, action) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.data.user_id;
      state.token = action.payload.data.token;
      state.walletAddress = action.payload.walletAddress;
    },
    loginError(state, action) {
      state.loading = false;
      state.errorMessage = action.message;
    },
    logginOut(state, action) {
      state.user = '';
      state.token = '';
    },
  },
});
