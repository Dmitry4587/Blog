/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchAllPosts, fetchAllTags, fetchAllComments } from '../thunks/postThunks';
import { IComment, IPost, IPostRes, TTags, ItemStatus } from '../types';

interface IInitialState {
  posts: {
    items: IPost[];
    status: ItemStatus;
    totalPages: number;
    currentPage: number;
  };
  tags: {
    items: TTags;
    status: ItemStatus;
  };
  comments: {
    items: IComment[];
    status: ItemStatus;
  };
}

const initialState: IInitialState = {
  posts: {
    items: [],
    status: ItemStatus.LOADING,
    totalPages: 1,
    currentPage: 1,
  },
  tags: {
    items: [],
    status: ItemStatus.LOADING,
  },
  comments: {
    items: [],
    status: ItemStatus.LOADING,
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    deletePostById: (state, action) => {
      state.posts.items = state.posts.items.filter((items) => items._id !== action.payload);
    },
    setCurrentPage: (state, action) => {
      state.posts.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.posts.items = [];
        state.posts.status = ItemStatus.LOADING;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action: PayloadAction<IPostRes>) => {
        state.posts.items = action.payload.posts;
        state.posts.totalPages = action.payload.totalPages;
        state.posts.status = ItemStatus.LOADED;
      })
      .addCase(fetchAllPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = ItemStatus.ERROR;
      })
      .addCase(fetchAllTags.pending, (state) => {
        state.tags.status = ItemStatus.LOADING;
        state.tags.items = [];
      })
      .addCase(fetchAllTags.fulfilled, (state, action: PayloadAction<TTags>) => {
        state.tags.status = ItemStatus.LOADED;
        state.tags.items = action.payload;
      })
      .addCase(fetchAllTags.rejected, (state) => {
        state.tags.status = ItemStatus.ERROR;
        state.tags.items = [];
      })
      .addCase(fetchAllComments.pending, (state) => {
        state.comments.status = ItemStatus.LOADING;
        state.comments.items = [];
      })
      .addCase(fetchAllComments.fulfilled, (state, action: PayloadAction<IComment[]>) => {
        state.comments.status = ItemStatus.LOADED;
        state.comments.items = action.payload;
      })
      .addCase(fetchAllComments.rejected, (state) => {
        state.comments.status = ItemStatus.ERROR;
        state.comments.items = [];
      });
  },
});

export default postsSlice.reducer;
export const { deletePostById, setCurrentPage } = postsSlice.actions;
