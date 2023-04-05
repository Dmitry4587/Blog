import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { IComment, IPost, TTags, IPostRes } from '../types';
import handleServerError from '../../utils/handleServerError';

export const fetchAllPosts = createAsyncThunk(
  'posts/fetchAllPosts',
  async ({
    tag = '',
    postsFilter = '',
    userId = '',
    title = '',
    currentPage,
  }: {
    tag?: string;
    title?: string;
    postsFilter?: string;
    userId?: string;
    currentPage: number;
  }) => {
    const { data } = await axios<IPostRes>(
      `/posts?sort=${postsFilter}&tag=${tag}&user=${userId}&limit=3&page=${currentPage}&title=${title}`,
    );
    return data;
  },
);

export const fetchAllComments = createAsyncThunk('posts/fetchAllComments', async (tag?: string) => {
  const { data } = await axios<IComment[]>(`/comments?tag=${tag || ''}`);
  return data;
});

export const fetchAllTags = createAsyncThunk('posts/fetchAllTags', async (tag?: string) => {
  const { data } = await axios<TTags>(`/tags?tag=${tag || ''}`);
  return data;
});

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios<IPost>(`/posts/${id}`);
      return data;
    } catch (e) {
      const err = handleServerError(e);
      return rejectWithValue(err);
    }
  },
);
