import { ls_GetChainID } from 'util/ApplicationStorage';
import { createSlice } from '@reduxjs/toolkit';
import { defaultNetworkId } from 'config/networks';

let chainId = ls_GetChainID();
const initialState = {
  chainId: chainId || defaultNetworkId,
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
