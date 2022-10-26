import { ls_GetUserID, ls_GetUserToken, ls_GetWalletAddress, ls_GetWalletType } from "util/ApplicationStorage";

let user = ls_GetUserID();
let token = ls_GetUserToken();
let wallet = ls_GetWalletType();
let walletAddress = ls_GetWalletAddress();

export const initialState = {
  user: "" || user,
  token: "" || token,
  loading: false,
  errorMessage: null,
  wallet: wallet ? wallet : "",
  walletAddress: walletAddress ? walletAddress : "",
};

export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return {
        ...initialState,
        loading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...initialState,
        user: action.payload.user_id,
        token: action.payload.token,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...initialState,
        user: "",
        token: "",
      };

    case "LOGIN_ERROR":
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
