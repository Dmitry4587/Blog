import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const postsSelector = (state: RootState) => state.posts.posts;
export const tagsStatusSelector = (state: RootState) => state.posts.tags.status;
export const postsStatusSelector = (state: RootState) => state.posts.posts.status;
export const commentsSelector = (state: RootState) => state.posts.comments.items;
export const commentsStatusSelector = (state: RootState) => state.posts.comments.status;
export const currentPageSelector = (state: RootState) => state.posts.posts.currentPage;
export const totalPagesSelector = (state: RootState) => state.posts.posts.totalPages;
export const tagsSelector = createSelector(
  (state: RootState) => state.posts.tags.items,
  (tags) => Array.from(new Set(tags)),
);
