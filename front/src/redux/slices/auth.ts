/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ItemStatus, IUser, IAuthUser } from '../types';

interface IInitialState {
  data: IUser | null;
  status: ItemStatus;
}

const initialState: IInitialState = {
  data: null,
  status: ItemStatus.LOADING,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith('User/pending'),
        (state) => {
          state.status = ItemStatus.LOADING;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('User/fulfilled'),
        (state, action: PayloadAction<IAuthUser>) => {
          state.status = ItemStatus.LOADED;
          state.data = action.payload.user;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('User/rejected'),
        (state) => {
          state.status = ItemStatus.ERROR;
          state.data = null;
        },
      );
  },
});

export default authSlice.reducer;
export const { setAuth } = authSlice.actions;
