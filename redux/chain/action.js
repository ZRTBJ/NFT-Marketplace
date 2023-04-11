import { chainSlice } from './slice';

const { setChainId } = chainSlice.actions;

export const setChain = (id) => async (dispatch) => {
  dispatch(setChainId(id));
};
