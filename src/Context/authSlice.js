import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "" || user,
  token: "" || token,
  loading: false,
  errorMessage: null,
};

export const authSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    requestLogin: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.token;
      state.token = action.payload.token;
      state.loading = false;
    },
    logout: (state) => {
      state.user = "";
      state.token = "";
    },
    loginError: (state, action) => {
      state.loading = false;
      state.errorMessage = action.error;
    },
  },
});

// Action creators are generated for each case reducer function
export const { requestLogin, loginSuccess, logout, loginError } =
  authSlice.actions;

export default authSlice.reducer;
