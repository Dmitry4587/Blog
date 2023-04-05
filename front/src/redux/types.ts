/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    imgId: string;
  };
  password: string;
  favComments?: IComment[];
}

export interface IComment {
  _id: string;
  user: IUser;
  text: string;
  commentLikes: number;
}

export interface IAuthUser {
  user: IUser;
  token: string;
}

export type TTags = string[];

export interface IPost {
  _id: string;
  title: string;
  text: string;
  img?: {
    url: string;
    imgId: string;
  };
  tags?: string[];
  comments?: IComment[];
  user: IUser;
  viewCount: number;
  commentsCount?: number;
  createdAt: Date;
}

export interface IPostRes {
  posts: IPost[];
  totalPages: number;
  currentPage: number;
}

export enum ItemStatus {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}
