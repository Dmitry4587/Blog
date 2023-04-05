import { RootState } from '../store';

export const userSelector = (state: RootState) => state.auth.data;
export const userStatusSelector = (state: RootState) => state.auth.status;
