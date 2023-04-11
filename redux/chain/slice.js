import { ls_GetChainID } from 'util/ApplicationStorage';
import { createSlice } from '@reduxjs/toolkit';

let chainId = ls_GetChainID();
const initialState = {
  chainId: chainId || process.env.NEXT_PUBLIC_ENV === 'production' ? 137 : 5,
};

export const chainSlice = createSlice({
  name: 'chain',
  initialState,
  reducers: {
    setChainId(state, action) {
      state.chainId = action.payload;
    },
  },
});
