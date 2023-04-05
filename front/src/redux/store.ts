import { configureStore } from '@reduxjs/toolkit';
import posts from './slices/posts';
import auth from './slices/auth';

const store = configureStore({
  reducer: { posts, auth },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
