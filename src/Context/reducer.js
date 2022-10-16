let user = localStorage && localStorage.getItem("user_id");
let token = localStorage && localStorage.getItem("currentUser");
let wallet = localStorage && localStorage.getItem("wallet");
let walletAddress = localStorage && localStorage.getItem("walletAddress");

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
